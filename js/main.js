// js/main.js

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const bookGrid = document.getElementById("book-grid");

    // Perform search and render cards
    async function handleSearch() {
        const query = searchInput.value.trim();
        if (!query) return;

        bookGrid.innerHTML = `<p class="col-span-full text-center text-gray-500">Searching for "${query}"...</p>`;

        const books = await searchBooks(query);
        renderBooks(books);
    }

    // Render book array to DOM
    function renderBooks(books) {
        bookGrid.innerHTML = ""; // Clear existing grid

        if (books.length === 0) {
            bookGrid.innerHTML = `<p class="col-span-full text-center text-gray-500">No books found. Try another search!</p>`;
            return;
        }

        books.forEach(book => {
            const isFav = isFavorite(book.id);
            const card = document.createElement("div");
            card.className = "bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between";

            card.innerHTML = `
                <div>
                    <img src="${book.coverId}" alt="${book.title}" class="w-full h-48 object-cover rounded-md mb-4 bg-gray-200">
                    <h3 class="font-bold text-lg text-gray-800 line-clamp-2">${book.title}</h3>
                    <p class="text-sm text-gray-600 mb-4">${book.author}</p>
                </div>
                <button class="fav-btn w-full py-2 px-4 rounded transition font-medium ${
                    isFav ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }">
                    ${isFav ? " Remove Favorite" : "Add to Favorites"}
                </button>
            `;

            // Event listener for the individual Favorite button
            const favBtn = card.querySelector(".fav-btn");
            favBtn.addEventListener("click", () => {
                toggleFavorite(book);
                // Re-render this specific button's state dynamically
                const nowFav = isFavorite(book.id);
                favBtn.textContent = nowFav ? "Remove Favorite" : " Add to Favorites";
                favBtn.className = `fav-btn w-full py-2 px-4 rounded transition font-medium ${
                    nowFav ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`;
            });

            bookGrid.appendChild(card);
        });
    }

    // Event Listeners for Search Actions
    searchBtn.addEventListener("click", handleSearch);
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSearch();
    });
});
