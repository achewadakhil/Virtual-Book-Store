import { useEffect, useState } from "react";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const userId = 2; 

  useEffect(() => {
    async function fetchCart() {
        try {
        const response = await fetch(
            `http://localhost:8080/cart/${userId}`
        );
        const data = await response.json();

        setCartItems(data.items);  
        // console.log(data);


        } catch (error) {
        console.error("Error fetching cart:", error);
        }
    }

    fetchCart();
    }, []);

  
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.book.price * item.quantity,
    0
  );

  return (
    <div className="px-10 py-20">
      <h1 className="text-4xl font-bold text-indigo-400 mb-10">
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-400">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-gray-900 border border-gray-800 rounded-xl flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-indigo-300">
                  {item.book.title}
                </h2>
                <p className="text-gray-400 mt-1">
                  Quantity: {item.quantity}
                </p>
                <p className="text-gray-400">
                  Price: ₹{item.book.price}
                </p>
              </div>

              <div className="text-lg font-bold text-indigo-400">
                ₹{item.book.price * item.quantity}
              </div>
            </div>
          ))}

          <div className="mt-10 text-right">
            <h2 className="text-2xl font-bold text-indigo-400">
              Total: ₹{totalAmount}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}