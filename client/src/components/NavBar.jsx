import { Link } from "react-router-dom";
import { User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-6 bg-gray-950 text-gray-100 border-b border-gray-800">
      
      <Link
        to="/"
        className="text-2xl font-bold tracking-wide text-indigo-400"
      >
        Bookly
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/books" className="hover:text-indigo-400 transition">
          Books
        </Link>

        <Link to="/cart" className="hover:text-indigo-400 transition">
          Cart
        </Link>

        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-full transition">
          <User size={18} />
          Login
        </button>
      </div>
    </nav>
  );
}