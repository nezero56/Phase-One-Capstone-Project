import { fetchBooks } from './fetchBooks.js';
import { toggleFavorite, isFavorite } from './favorites.js';

// Local storage array cache to keep track of books currently rendered on screen
let currentBooksCache = [];

// DOM Elements references mapped directly from index.html
const bookGrid = document.getElementById('book-grid');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const gridTitle = document.getElementById('grid-title');


function renderBookCard(book) {
    const favorited = isFavorite(book.id);
    
    return `
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300 flex flex-col">
            <div class="h-48 bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center relative">
                <img src="${book.image}" alt="${book.title}" class="w-full h-full object-cover">
                <span class="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded font-semibold max-w-[120px] truncate">
                    ${book.genre}
                </span>
            </div>
            <div class="p-5 flex-grow flex flex-col justify-between">
                <div>
                    <h3 class="text-lg font-bold text-gray-800 line-clamp-1">${book.title}</h3>
                    <p class="text-sm text-gray-500 mt-1 truncate">${book.author}</p>
                </div>
                <div class="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-sm text-gray-600">
                    <span><i class="fa-solid fa-star text-amber-400 mr-1"></i> ${book.rating}</span>
                    <span data-id="${book.id}" class="fav-btn font-medium cursor-pointer transition ${
                        favorited ? 'text-red-500 hover:text-red-700' : 'text-indigo-600 hover:text-indigo-800'
                    }">
                        <i class="${favorited ? 'fa-solid' : 'fa-regular'} fa-heart mr-1"></i>
                        ${favorited ? 'Saved' : 'Favorite'}
                    </span>
                </div>
            </div>
        </div>
    `;
}

function displayBooks(books) {
    if (!bookGrid) return;
// No Results Found Fallback feedback loop
    if (books.length === 0) {
        bookGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fa-solid fa-circle-question text-4xl text-gray-400 mb-3"></i>
                <p class="text-gray-500 text-lg">No books found matching that title. Try again!</p>
            </div>`;
        return;
    }

    // Inject compiled cards mapping sequence
    bookGrid.innerHTML = books.map(book => renderBookCard(book)).join('');
    setupCardEventListeners();
}


 
function setupCardEventListeners() {
    const favButtons = document.querySelectorAll('.fav-btn');
    
    favButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const bookId = e.currentTarget.getAttribute('data-id');
            // Find the object details matching the clicked card inside our runtime cache
            const clickedBook = currentBooksCache.find(book => book.id === bookId);
            
            if (clickedBook) {
                toggleFavorite(clickedBook);
                // Re-render the grid elements to dynamically visually swap structural toggle heart states
                displayBooks(currentBooksCache);
            }
        });
    });
}


function showLoadingSpinner(message) {
    if (!bookGrid) return;
    bookGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
            <i class="fa-solid fa-spinner fa-spin text-4xl text-indigo-600 mb-4"></i>
            <p class="text-gray-500">${message}</p>
        </div>`;
}


async function init() {
    showLoadingSpinner("Fetching curated children's classics...");

    try {
      
        currentBooksCache = await fetchBooks("childrens classics");
        displayBooks(currentBooksCache);
    } catch (error) {
        if (bookGrid) {
            bookGrid.innerHTML = `<p class="col-span-full text-center text-red-500">Failed to connect to the library database. Please reload.</p>`;
        }
    }

    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            
            if (!searchTerm) return;

            showLoadingSpinner(`Searching records for "${searchTerm}"...`);
            if (gridTitle) gridTitle.textContent = `Search Results for "${searchTerm}"`;

            try {
                currentBooksCache = await fetchBooks(searchTerm);
                displayBooks(currentBooksCache);
            } catch (error) {
                if (bookGrid) {
                    bookGrid.innerHTML = `<p class="col-span-full text-center text-red-500">Error processing request.</p>`;
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', init);