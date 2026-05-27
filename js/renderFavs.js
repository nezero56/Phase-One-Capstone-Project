// js/renderFavs.js
import { getFavorites, toggleFavorite } from './favorites.js';

document.addEventListener("DOMContentLoaded", () => {
    const favoritesGrid = document.getElementById("favorites-grid");

    function displayFavorites() {
        const favoriteBooks = getFavorites();
        favoritesGrid.innerHTML = "";

        if (favoriteBooks.length === 0) {
            favoritesGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-xl text-gray-500 mb-4">Your reading shelf is empty!</p>
                    <a href="explore.html" class="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                        Discover Books
                    </a>
                </div>`;
            return;
        }

        favoriteBooks.forEach(book => {
            const card = document.createElement("div");
            card.className = "bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between";
            card.innerHTML = `
                <div>
                    <img src="${book.image}" alt="${book.title}" class="w-full h-48 object-cover rounded-md mb-4 bg-gray-200">
                    <h3 class="font-bold text-lg text-gray-800 line-clamp-2">${book.title}</h3>
                    <p class="text-sm text-gray-600 mb-4">${book.author}</p>
                </div>
                <button class="remove-btn w-full py-2 px-4 rounded bg-red-100 text-red-600 hover:bg-red-200 transition font-medium">
                    Remove from Shelf
                </button>`;

            card.querySelector(".remove-btn").addEventListener("click", () => {
                toggleFavorite(book);
                displayFavorites();
            });

            favoritesGrid.appendChild(card);
        });
    }

    displayFavorites();
});
