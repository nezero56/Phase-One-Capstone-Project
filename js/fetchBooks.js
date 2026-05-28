// js/fetchBooks.js

export async function fetchBooks(query) {
    if (!query) return [];

    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12`;

    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();

        return data.docs.slice(0, 12).map(book => ({
            id: book.key.replace("/works/", ""),
            title: book.title,
            author: book.author_name ? book.author_name[0] : "Unknown Author",
            image: book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : "https://via.placeholder.com/150x200?text=No+Cover",
            genre: book.subject ? book.subject[0] : "General",
            rating: (3.5 + Math.random() * 1.5).toFixed(1)
        }));
        
    } catch (error) {
        console.error("Error fetching books:", error);
        return [];
    }
}
