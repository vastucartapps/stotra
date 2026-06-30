import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sapi.vastucart.in",
      },
      {
        protocol: "https",
        hostname: "store.vastucart.in",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/about-translations",
        destination: "/editorial-process",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://adservice.google.com https://adservice.google.co.in https://*.google.com https://*.googleadservices.com https://*.google https://tpc.googlesyndication.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://sapi.vastucart.in https://store.vastucart.in https://stotra.vastucart.in https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://*.google.com https://*.googleadservices.com https://*.google; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://adservice.google.com https://adservice.google.co.in https://*.google.com https://*.googleadservices.com https://*.google https://stats.g.doubleclick.net https://*.google-analytics.com; frame-src 'self' https://googleads.g.doubleclick.net https://*.doubleclick.net https://tpc.googlesyndication.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://www.google.com https://*.google.com https://*.google https://googleadservices.com https://*.googleadservices.com; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
