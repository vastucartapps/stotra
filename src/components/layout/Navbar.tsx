"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { NETWORK_LINKS } from "@/data/ecosystem";
import { DEITIES } from "@/data/deities";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Deities", href: "/deity", hasDropdown: true },
  { label: "Today", href: "/today" },
  { label: "By Day", href: "/day" },
  { label: "Festivals", href: "/festival" },
  { label: "Bhagavad Gita", href: "/gita" },
  { label: "Vrat Katha", href: "/vrat-katha" },
  { label: "All Stotras", href: "/stotra" },
];

const ECOSYSTEM_NAV = [
  { label: "VastuCart", href: NETWORK_LINKS.home },
  { label: "Store", href: NETWORK_LINKS.store },
  { label: "Kundali", href: NETWORK_LINKS.kundali },
  { label: "Panchang", href: NETWORK_LINKS.panchang },
  { label: "Horoscope", href: NETWORK_LINKS.horoscope },
  { label: "Tarot", href: NETWORK_LINKS.tarot },
  { label: "Blog", href: NETWORK_LINKS.blog },
  { label: "Muhurta", href: NETWORK_LINKS.muhurta },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDeityDropdownOpen, setIsDeityDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* ── Row 1: Ecosystem Bar ── */}
      <div className="bg-brand text-text-on-dark">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 text-xs">
            <div className="hidden md:flex items-center gap-1">
              <span className="text-white/60 mr-1">Explore:</span>
              {ECOSYSTEM_NAV.map((link, i) => (
                <span key={link.label} className="flex items-center">
                  {i > 0 && <span className="text-white/30 mx-1">|</span>}
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </span>
              ))}
            </div>
            <div className="md:hidden text-white/60 text-xs">
              VastuCart Ecosystem
            </div>
            <a
              href={NETWORK_LINKS.store}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors duration-200 text-white/90 hover:text-white"
            >
              <span className="text-gold-light">&#9733;</span>
              <span>Visit Store</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Row 2: Main Navigation ── */}
      <div className="glass border-b border-border/60">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300">
                <Image
                  src="/VastuCartFav.png"
                  alt="VastuCart"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-brand leading-tight tracking-tight">
                  Stotra
                </span>
                <span className="text-[10px] text-text-muted leading-tight tracking-wider uppercase">
                  by VastuCart
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() =>
                    link.hasDropdown && setIsDeityDropdownOpen(true)
                  }
                  onMouseLeave={() =>
                    link.hasDropdown && setIsDeityDropdownOpen(false)
                  }
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "brand-underline px-4 py-2 text-sm font-medium text-text hover:text-brand transition-colors duration-200 flex items-center gap-1"
                    )}
                  >
                    {link.label}
                    {link.hasDropdown && (
                      <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
                    )}
                  </Link>

                  {/* Deity Dropdown */}
                  {link.hasDropdown && isDeityDropdownOpen && (
                    <div className="absolute top-full left-0 pt-1 z-50">
                      <div className="bg-white rounded-xl shadow-elevated border border-border-light p-3 min-w-[280px] grid grid-cols-2 gap-0.5 animate-slide-down">
                        {DEITIES.map((deity) => (
                          <Link
                            key={deity.id}
                            href={`/deity/${deity.slug}`}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-text hover:bg-cream-mid hover:text-brand transition-colors duration-150"
                          >
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: deity.color }}
                            />
                            <span>{deity.name}</span>
                            <span className="text-text-muted text-xs ml-auto">
                              {deity.nameHi}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right: Search + Mobile Toggle */}
            <div className="flex items-center gap-2">
              <Link
                href="/search"
                className="p-2.5 rounded-lg text-text-light hover:text-brand hover:bg-cream-mid transition-colors duration-200"
                aria-label="Search stotras"
              >
                <Search className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-lg text-text-light hover:text-brand hover:bg-cream-mid transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-border shadow-elevated animate-slide-down">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-text hover:bg-cream-mid hover:text-brand transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {/* Ecosystem Links Mobile */}
            <div className="mt-4 pt-4 border-t border-border-light">
              <p className="px-4 text-xs text-text-muted uppercase tracking-wider mb-2">
                Explore VastuCart
              </p>
              <div className="grid grid-cols-2 gap-1">
                {ECOSYSTEM_NAV.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs text-text-light hover:bg-cream-mid hover:text-brand transition-colors duration-150"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
