import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Container from "../ui/Container";

export default function AppLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.15),transparent_28%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_22%)]" />
      <Navbar />
      <main className="pb-14 pt-8 sm:pt-10">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  );
}
