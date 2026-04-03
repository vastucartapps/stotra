import type { Metadata } from "next";
import { Lora, Open_Sans, Noto_Sans_Devanagari } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stotra.vastucart.in";

export const metadata: Metadata = {
  title: {
    default: "Stotra - Sacred Hindu Prayers & Hymns | VastuCart",
    template: "%s | Stotra by VastuCart",
  },
  description:
    "Explore a comprehensive collection of Hindu stotras, chalisa, and sacred hymns in Sanskrit and Hindi with transliteration, meaning, and free PDF downloads. Organized by deity, day, and festival.",
  keywords: [
    "stotra",
    "hindu prayers",
    "chalisa",
    "sanskrit hymns",
    "hanuman chalisa",
    "vishnu sahasranama",
    "devotional prayers",
    "stotram",
    "hindu mantras",
    "sacred texts",
    "hindi stotra",
    "prayer download",
  ],
  metadataBase: new URL(APP_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: APP_URL,
    siteName: "Stotra by VastuCart",
    title: "Stotra - Sacred Hindu Prayers & Hymns | VastuCart",
    description:
      "Complete collection of Hindu stotras, chalisa, and sacred hymns with transliteration, meaning, and free PDF downloads.",
    images: [
      {
        url: `${APP_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "Stotra by VastuCart - Sacred Hindu Prayers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@vastucart",
    title: "Stotra - Sacred Hindu Prayers & Hymns | VastuCart",
    description:
      "Complete collection of Hindu stotras, chalisa, and sacred hymns with transliteration, meaning, and free PDF downloads.",
    images: [`${APP_URL}/og-default.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
      { url: "/apple-touch-icon-180.png", sizes: "180x180" },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#013F47",
    "theme-color": "#013F47",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${APP_URL}/#organization`,
      name: "VastuCart",
      url: "https://vastucart.in",
      logo: {
        "@type": "ImageObject",
        url: `${APP_URL}/VastuCartLogo_1024.png`,
      },
      sameAs: [
        "https://www.facebook.com/vastucartindia",
        "https://www.instagram.com/vastucart/",
        "https://in.pinterest.com/vastucart/",
        "https://www.threads.com/@vastucart",
        "https://x.com/vastucart",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${APP_URL}/#website`,
      url: APP_URL,
      name: "Stotra by VastuCart",
      description:
        "Comprehensive collection of Hindu stotras, chalisa, and sacred hymns",
      publisher: { "@id": `${APP_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${APP_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${openSans.variable} ${notoDevanagari.variable} h-full`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-cream pattern-zodiac">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
