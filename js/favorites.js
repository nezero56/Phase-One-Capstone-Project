// js/favorites.js
// JS module exporting add/remove favorites functions
//  Persistence with localStorage

const STORAGE_KEY = "book_explorer_favorites";

// Exercise 2.4: Read from localStorage
export function getFavorites() {
    const favs = localStorage.getItem(STORAGE_KEY);
    return favs ? JSON.parse(favs) : [];
}

export function isFavorite(bookId) {
    return getFavorites().some(book => book.id === bookId);
}

//  Toggle add/remove favorite
export function toggleFavorite(book) {
    let favs = getFavorites();
    if (isFavorite(book.id)) {
        favs = favs.filter(item => item.id !== book.id);
    } else {
        favs.push(book);
    }
    //  Persist to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

//  Render favorites page with hardcoded + saved books
export function initFavoritesPage() {
    const grid = document.getElementById('favorites-grid');
    const emptyState = document.getElementById('empty-state');
    if (!grid) return;

    function render() {
        const books = getFavorites();
        grid.innerHTML = '';

        if (books.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');

        // DOM events — click to remove
        books.forEach(book => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300 flex flex-col';
            card.innerHTML = `
                <div class="h-48 bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center relative">
                    <img src="${book.image}" alt="${book.title}" class="w-full h-full object-cover">
                    <span class="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded font-semibold">
                        ${book.genre || 'General'}
                    </span>
                </div>
                <div class="p-5 flex-grow flex flex-col justify-between">
                    <div>
                        <h3 class="text-lg font-bold text-gray-800 line-clamp-1">${book.title}</h3>
                        <p class="text-sm text-gray-500 mt-1 truncate">${book.author}</p>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-sm text-gray-600">
                        <span><i class="fa-solid fa-star text-amber-400 mr-1"></i> ${book.rating || '4.0'}</span>
                        <button class="remove-btn text-red-500 hover:text-red-700 font-medium transition">
                            <i class="fa-solid fa-heart-crack mr-1"></i> Remove
                        </button>
                    </div>
                </div>`;

            //  DOM click event to remove from favorites
            card.querySelector('.remove-btn').addEventListener('click', () => {
                toggleFavorite(book);
                render();
            });

            grid.appendChild(card);
        });
    }

    render();
}
