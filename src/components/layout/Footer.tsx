import Link from "next/link";
import Image from "next/image";
import { ECOSYSTEM_SITES, SOCIAL_LINKS } from "@/data/ecosystem";

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "By Deity", href: "/deity" },
  { label: "By Day", href: "/day" },
  { label: "By Festival", href: "/festival" },
  { label: "By Purpose", href: "/purpose" },
  { label: "Today's Stotras", href: "/today" },
  { label: "All Stotras", href: "/stotra" },
  { label: "Search", href: "/search" },
];

const POPULAR_LINKS = [
  { label: "Hanuman Chalisa", href: "/stotra/hanuman-chalisa" },
  { label: "Vishnu Sahasranama", href: "/stotra/vishnu-sahasranama" },
  { label: "Ganesh Atharvashirsha", href: "/stotra/ganesh-atharvashirsha" },
  { label: "Shiv Tandav Stotram", href: "/stotra/shiv-tandav-stotram" },
  { label: "Lalita Sahasranama", href: "/stotra/lalita-sahasranama" },
  { label: "Aditya Hridayam", href: "/stotra/aditya-hridayam" },
  { label: "Ramraksha Stotra", href: "/stotra/ramraksha-stotra" },
  { label: "Durga Kavach", href: "/stotra/durga-kavach" },
];

const ABOUT_LINKS = [
  { label: "About VastuCart", href: "https://vastucart.in", external: true },
  { label: "VastuCart Store", href: "https://store.vastucart.in", external: true },
  { label: "Blog", href: "https://blog.vastucart.in", external: true },
  { label: "Editorial Process", href: "/editorial-process" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export function Footer() {
  return (
    <footer className="mt-auto">
      {/* ── Ecosystem Strip ── */}
      <div className="bg-cream-dark border-t border-border">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10">
          <h3 className="text-center font-serif text-lg font-semibold text-brand mb-2">
            VastuCart Spiritual Ecosystem
          </h3>
          <p className="text-center text-sm text-text-muted mb-8 max-w-xl mx-auto">
            Your trusted destination for authentic spiritual services, tools, and products
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {ECOSYSTEM_SITES.map((site) => (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-white rounded-xl p-4 border border-border-light hover:border-brand/30 hover:shadow-card transition-all duration-300"
              >
                <p className="font-semibold text-sm text-brand group-hover:text-brand-light transition-colors">
                  {site.name}
                </p>
                <p className="text-xs text-text-muted mt-1 line-clamp-2">
                  {site.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div className="gradient-brand text-text-on-dark">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-9 h-9 overflow-hidden rounded-lg bg-white/10">
                  <Image
                    src="/VastuCartFav.png"
                    alt="VastuCart"
                    fill
                    className="object-contain p-0.5"
                  />
                </div>
                <div>
                  <span className="font-serif text-lg font-bold text-white">
                    Stotra
                  </span>
                  <span className="block text-[10px] text-white/50 tracking-wider uppercase">
                    by VastuCart
                  </span>
                </div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-5">
                A comprehensive collection of sacred Hindu prayers, stotras, and
                hymns in Sanskrit and Hindi with transliteration, meaning, and
                free PDF downloads.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-2">
                {Object.entries(SOCIAL_LINKS).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                    aria-label={platform}
                  >
                    <SocialIcon platform={platform} />
                  </a>
                ))}
              </div>
            </div>

            {/* Explore Links */}
            <div>
              <h4 className="font-serif text-sm font-semibold text-white mb-4 tracking-wide uppercase">
                Explore
              </h4>
              <ul className="space-y-2.5">
                {EXPLORE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/65 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Stotras */}
            <div>
              <h4 className="font-serif text-sm font-semibold text-white mb-4 tracking-wide uppercase">
                Popular Stotras
              </h4>
              <ul className="space-y-2.5">
                {POPULAR_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/65 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About */}
            <div>
              <h4 className="font-serif text-sm font-semibold text-white mb-4 tracking-wide uppercase">
                About
              </h4>
              <ul className="space-y-2.5">
                {ABOUT_LINKS.map((link) =>
                  link.external ? (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/65 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/65 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-white/50">
                &copy; {new Date().getFullYear()} VastuCart. All rights
                reserved.
              </p>
              <p className="text-xs text-white/40">
                Made with devotion in India
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ platform }: { platform: string }) {
  const iconClass = "w-4 h-4 fill-current text-white/70";
  switch (platform) {
    case "facebook":
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "twitter":
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "pinterest":
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      );
    case "threads":
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.34-.779-.963-1.4-1.785-1.816-.523 2.648-1.594 4.336-3.07 5.039-.91.434-1.97.494-2.991.169-1.108-.353-2.019-1.146-2.505-2.169-.839-1.768-.248-4.168 1.4-5.691 1.072-0.99 2.464-1.54 3.823-1.545l.055.001c1.062.018 1.99.337 2.768.95.37-.804.572-1.725.596-2.747l2.118.039c-.033 1.32-.335 2.498-.876 3.513.21.205.403.429.573.672.808 1.156 1.096 2.601.837 4.191-.378 2.319-1.718 4.186-3.881 5.397-1.73.969-3.82 1.396-5.929 1.374l-.035.001zm-.96-8.476c-.855.084-1.645.448-2.224.995-.994.938-1.382 2.28-.966 3.156.256.539.793.929 1.474 1.145.595.19 1.204.155 1.72-.095.91-.441 1.654-1.62 2.12-3.382-.566-.271-1.206-.444-1.934-.506l-.19-.013z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    default:
      return null;
  }
}
