//  Storage 
const STORAGE_KEY = 'kbe_favs';
const getFavs = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
const isFav = id => getFavs().some(b => b.id === id);
function toggleFav(book) {
  const favs = getFavs();
  const idx = favs.findIndex(b => b.id === book.id);
  idx === -1 ? favs.push(book) : favs.splice(idx, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

// API
async function fetchBooks(query) {
  const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12`);
  const data = await res.json();
  return data.docs.slice(0, 8).map(b => ({
    id: b.key.replace('/works/', ''),
    title: b.title,
    author: b.author_name?.[0] ?? 'Unknown',
    image: b.cover_i ? `https://covers.openlibrary.org/b/id/${b.cover_i}-L.jpg` : `https://picsum.photos/seed/${b.key}/400/600`,
    genre: b.subject?.[0] ?? 'General',
    rating: (3.5 + Math.random() * 1.5).toFixed(1)
  }));
}

// Card
function bookCard(book) {
  const fav = isFav(book.id);
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
}

function renderGrid(grid, books, onToggle) {
  if (!books.length) {
    grid.innerHTML = `<p class="col-span-full text-center text-gray-500 py-12">No books found. Try a different search!</p>`;
    return;
  }
  grid.innerHTML = books.map(bookCard).join('');
  grid.querySelectorAll('.fav-btn').forEach(btn =>
    btn.addEventListener('click', () => { toggleFav(books.find(b => b.id === btn.dataset.id)); onToggle(); })
  );
}

//  Pages 
async function initSearch(defaultQuery) {
  const grid = document.getElementById('book-grid');
  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');
  const title = document.getElementById('grid-title');
  if (!grid) return;

  let cache = [];
  const load = async q => {
    grid.innerHTML = `<div class="col-span-full text-center py-12"><i class="fa-solid fa-spinner fa-spin text-4xl text-indigo-600"></i></div>`;
    cache = await fetchBooks(q);
    if (title) title.textContent = q === defaultQuery ? 'Popular Books' : `Results for "${q}"`;
    renderGrid(grid, cache, () => renderGrid(grid, cache, () => {}));
  };

  await load(defaultQuery);
  form?.addEventListener('submit', e => { e.preventDefault(); input.value.trim() && load(input.value.trim()); });
}

function initFavorites() {
  const grid = document.getElementById('favorites-grid');
  const empty = document.getElementById('empty-state');
  if (!grid) return;

  const render = () => {
    const favs = getFavs();
    if (!favs.length) { empty?.classList.remove('hidden'); grid.innerHTML = ''; return; }
    empty?.classList.add('hidden');
    grid.innerHTML = favs.map(b => `
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition flex flex-col">
        <div class="h-48 relative">
          <img src="${b.image}" alt="${b.title}" class="w-full h-full object-cover">
          <span class="absolute top-3 right-3 bg-white/80 text-gray-700 text-xs px-2 py-1 rounded font-semibold">${b.genre ?? 'General'}</span>
        </div>
        <div class="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-gray-800 dark:text-white line-clamp-1">${b.title}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">${b.author}</p>
          </div>
          <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm">
            <span><i class="fa-solid fa-star text-amber-400 mr-1"></i>${b.rating ?? '4.0'}</span>
            <button data-id="${b.id}" class="remove-btn text-red-500 hover:text-red-700 font-medium transition">
              <i class="fa-solid fa-heart-crack mr-1"></i>Remove
            </button>
          </div>
        </div>
      </div>`).join('');
    grid.querySelectorAll('.remove-btn').forEach(btn =>
      btn.addEventListener('click', () => { toggleFav(favs.find(b => b.id === btn.dataset.id)); render(); })
    );
  };
  render();
}

function initLibrary() {
  const grid = document.getElementById('library-grid');
  const input = document.getElementById('library-search');
  if (!grid) return;

  const books = [
    { id: 'l1', title: 'Injangwe za Sano',      author: 'mmalecki',  image: 'images/Injyangwe.jpg',       genre: 'Fiction',  rating: '4.3' },
    { id: 'l2', title: 'Mpyisi na Bakame',       author: 'Sonia',     image: 'images/bakame.jpg',          genre: 'Sci-Fi',   rating: '4.7' },
    { id: 'l3', title: 'Maguru Atanga Amaguru',  author: 'Nelly son', image: 'images/maguru.jpg',          genre: 'Self-Help',rating: '4.8' },
    { id: 'l4', title: 'Nyiramaterefone',        author: 'Ton curry', image: 'images/Nyiramaterefone.jpg', genre: 'Mystery',  rating: '4.5' },
    { id: 'l5', title: 'Bobo na Saduha',         author: 'Kamanzi',   image: 'images/Bobo na saduha.jpg',  genre: 'Adventure',rating: '4.2' },
    { id: 'l6', title: 'Cubiri',                 author: 'Uwase',     image: 'images/Cubiri.jpg',          genre: 'Folklore', rating: '4.6' },
    { id: 'l7', title: 'Habari',                 author: 'Rukundo',   image: 'images/Habari.jpg',          genre: 'Drama',    rating: '4.1' },
    { id: 'l8', title: 'Mukiza',                 author: 'Mugabo',    image: 'images/mukiza.jpg',          genre: 'Fiction',  rating: '4.4' },
  ];

  const show = list => renderGrid(grid, list, () => show(list));
  show(books);
  input?.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    show(q ? books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.genre.toLowerCase().includes(q)) : books);
  });
}

//  Theme
function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const html = document.documentElement;
  if (localStorage.getItem('theme') === 'dark') html.classList.add('dark');
  const updateIcon = () => btn && (btn.innerHTML = html.classList.contains('dark')
    ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>');
  btn?.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    updateIcon();
  });
  updateIcon();
}

//  Mobile menu 
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  document.getElementById('hamburger')?.addEventListener('click', () =>
    document.getElementById('mobile-menu')?.classList.toggle('hidden')
  );
  initSearch('childrens classics');
  initFavorites();
  initLibrary();
});
