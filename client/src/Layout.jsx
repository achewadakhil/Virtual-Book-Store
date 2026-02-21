import { Outlet } from "react-router-dom";
import Navbar from "./components/NavBar";


export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <Outlet />
    </div>
  );
}