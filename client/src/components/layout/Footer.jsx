import Container from "../ui/Container";

export default function Footer() {
  return (
    <footer className="border-t border-white/70 bg-white/70 backdrop-blur">
      <Container className="flex flex-col gap-1 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Virtual Book Store</p>
        <p>Browse, order, and manage books with a clean end-to-end experience.</p>
      </Container>
    </footer>
  );
}
