import { useEffect, useState } from "react";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch("http://localhost:8080/books");
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }

    fetchBooks();
  }, []);

  async function addToCart(bookId) {
    try {
      const userId = 2; 
      const quantity = quantities[bookId] || 1;

      await fetch(
        `http://localhost:8080/cart/addBook?user_id=${userId}&book_id=${bookId}&quantity=${quantity}`,
        {
          method: "POST",
        }
      );

      alert("Book added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }

  return (
    <div className="px-10 py-20">
      <h1 className="text-4xl font-bold text-indigo-400 mb-10">
        Books Page
      </h1>

      {books.length === 0 ? (
        <p className="text-gray-400">No books available.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="p-6 bg-gray-900 border border-gray-800 rounded-xl"
            >
              <h2 className="text-xl font-semibold text-indigo-300">
                {book.title}
              </h2>

              <p className="text-gray-400 mt-2">
                Author: {book.author}
              </p>

              <p className="text-gray-400 mt-1">
                Price: ₹{book.price}
              </p>

           
              <div className="mt-4 flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  value={quantities[book.id] || 1}
                  onChange={(e) =>
                    setQuantities({
                      ...quantities,
                      [book.id]: parseInt(e.target.value),
                    })
                  }
                  className="w-16 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-center"
                />

                <button
                  onClick={() => addToCart(book.id)}
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}