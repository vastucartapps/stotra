"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Invalid password");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image
            src="/VastuCartFav.png"
            alt="VastuCart"
            width={48}
            height={48}
            className="mx-auto mb-4 rounded-xl"
          />
          <h1 className="font-serif text-2xl font-bold text-brand">Admin Panel</h1>
          <p className="text-sm text-text-muted mt-1">Stotra by VastuCart</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-border-light shadow-card">
          <label className="block text-sm font-medium text-text mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-brand focus:ring-2 focus:ring-brand/10 outline-none text-text mb-4"
            placeholder="Enter admin password"
            required
          />
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white font-medium py-3 rounded-lg hover:bg-brand-light transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
