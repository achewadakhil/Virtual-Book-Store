export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-24">

      <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
        Discover Your Next
        <span className="text-indigo-400"> Favorite Book</span>
      </h1>

      <p className="mt-6 text-lg text-gray-400 max-w-2xl">
        Browse through a wide collection of books across multiple genres.
        Fast delivery, secure payments, and a smooth reading experience.
      </p>

      <button className="mt-8 bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl text-lg font-medium transition hover:scale-105">
        Explore Books
      </button>

      <div className="mt-20 grid md:grid-cols-3 gap-8 w-full max-w-6xl">

        <div className="p-8 bg-gray-900 rounded-2xl border border-gray-800 hover:border-indigo-500 transition">
          <h3 className="text-xl font-semibold text-indigo-400">
            Wide Collection
          </h3>
          <p className="mt-4 text-gray-400">
            Thousands of books from fiction to academic materials.
          </p>
        </div>

        <div className="p-8 bg-gray-900 rounded-2xl border border-gray-800 hover:border-indigo-500 transition">
          <h3 className="text-xl font-semibold text-indigo-400">
            Fast Delivery
          </h3>
          <p className="mt-4 text-gray-400">
            Quick and reliable shipping at your convenience.
          </p>
        </div>

        <div className="p-8 bg-gray-900 rounded-2xl border border-gray-800 hover:border-indigo-500 transition">
          <h3 className="text-xl font-semibold text-indigo-400">
            Secure Payments
          </h3>
          <p className="mt-4 text-gray-400">
            Safe transactions with encrypted payment methods.
          </p>
        </div>

      </div>

    </section>
  );
}