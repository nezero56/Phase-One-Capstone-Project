import { toggleFavorite, isFavorite } from './favorites.js';

const books = [
  { id: 'l1', title: 'Injangwe za Sano',      author: 'mmalecki',  image: 'images/Injyangwe.jpg',       genre: 'Fiction',   rating: '4.3' },
  { id: 'l2', title: 'Mpyisi na Bakame',       author: 'Sonia',     image: 'images/bakame.jpg',          genre: 'Sci-Fi',    rating: '4.7' },
  { id: 'l3', title: 'Maguru Atanga Amaguru',  author: 'Nelly son', image: 'images/maguru.jpg',          genre: 'Self-Help', rating: '4.8' },
  { id: 'l4', title: 'Nyiramaterefone',        author: 'Ton curry', image: 'images/Nyiramaterefone.jpg', genre: 'Mystery',   rating: '4.5' },
  { id: 'l5', title: 'Bobo na Saduha',         author: 'Kamanzi',   image: 'images/Bobo na saduha.jpg',  genre: 'Adventure', rating: '4.2' },
  { id: 'l6', title: 'Cubiri',                 author: 'Uwase',     image: 'images/Cubiri.jpg',          genre: 'Folklore',  rating: '4.6' },
  { id: 'l7', title: 'Habari',                 author: 'Rukundo',   image: 'images/Habari.jpg',          genre: 'Drama',     rating: '4.1' },
  { id: 'l8', title: 'Mukiza',                 author: 'Mugabo',    image: 'images/mukiza.jpg',          genre: 'Fiction',   rating: '4.4' },
];

function renderLibrary(list) {
  const grid = document.getElementById('library-grid');
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = `<p class="col-span-full text-center text-gray-500 py-12">No books found. Try a different search!</p>`;
    return;
  }

  grid.innerHTML = list.map(book => {
    const fav = isFavorite(book.id);
    return `
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition flex flex-col">
        <div class="h-48 relative">
          <img src="${book.image}" alt="${book.title}" class="w-full h-full object-cover">
          <span class="absolute top-3 right-3 bg-white/80 text-gray-700 text-xs px-2 py-1 rounded font-semibold">${book.genre}</span>
        </div>
        <div class="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-gray-800 dark:text-white line-clamp-1">${book.title}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">${book.author}</p>
          </div>
          <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm">
            <span><i class="fa-solid fa-star text-amber-400 mr-1"></i>${book.rating}</span>
            <button data-id="${book.id}" class="fav-btn font-medium transition ${fav ? 'text-red-500 hover:text-red-700' : 'text-indigo-600 hover:text-indigo-800'}">
              <i class="${fav ? 'fa-solid' : 'fa-regular'} fa-heart mr-1"></i>${fav ? 'Saved' : 'Favorite'}
            </button>
          </div>
        </div>
      </div>`;
  }).join('');

  grid.querySelectorAll('.fav-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      toggleFavorite(list.find(b => b.id === btn.dataset.id));
      renderLibrary(list);
    })
  );
}

document.addEventListener('DOMContentLoaded', () => {
  renderLibrary(books);
  document.getElementById('library-search')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    renderLibrary(q ? books.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.genre.toLowerCase().includes(q)
    ) : books);
  });
});
