import type { Metadata } from "next";
import { Lora, Noto_Sans_Devanagari } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";
import Script from "next/script";

const lora = Lora({
  variable: "--font-lora",
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
  title: { default: "Stotra - Sacred Hindu Prayers & Hymns | VastuCart", template: "%s | Stotra by VastuCart" },
  description: "Explore a comprehensive collection of Hindu stotras, chalisa, and sacred hymns in Sanskrit and Hindi.",
  metadataBase: new URL(APP_URL),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lora.variable} ${notoDevanagari.variable} h-full`}>
      <head>
        <link rel="preload" href="/VastuCartLogo.png" as="image" />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-0S0YXDH1XC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-0S0YXDH1XC');`}
        </Script>
        <Script
          id="adsense-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1411902986257886"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-cream pattern-zodiac google-anno-skip">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}