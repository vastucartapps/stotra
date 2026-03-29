"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center">
      <h1 className="font-serif text-5xl font-bold text-brand mb-4">Something went wrong</h1>
      <p className="text-lg text-text-light mb-8">An unexpected error occurred. Please try again.</p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="bg-brand text-white font-medium px-6 py-3 rounded-xl hover:bg-brand-light transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="bg-white border border-border text-text font-medium px-6 py-3 rounded-xl hover:border-brand/30 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
