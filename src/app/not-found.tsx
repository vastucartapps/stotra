import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center">
      <h1 className="font-serif text-6xl font-bold text-brand mb-4">404</h1>
      <p className="text-xl text-text-light mb-8">Page not found</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-brand text-white font-medium px-6 py-3 rounded-xl hover:bg-brand-light transition-colors"
      >
        &larr; Back to Home
      </Link>
    </div>
  );
}
