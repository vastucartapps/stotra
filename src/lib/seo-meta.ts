import type { Metadata } from "next";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://stotra.vastucart.in";

export const SITE_NAME = "Stotra by VastuCart";
export const SITE_LOCALE = "en_IN";
export const TWITTER_HANDLE = "@vastucart";
export const DEFAULT_OG_IMAGE = `${APP_URL}/og-default.jpg`;

type OgType = "website" | "article";

interface SiteOgInput {
  path: string;
  title: string;
  description: string;
  type?: OgType;
  image?: string;
  imageAlt?: string;
}

export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) path = "/" + path;
  return `${APP_URL}${path}`;
}

export function siteOpenGraph(input: SiteOgInput): NonNullable<Metadata["openGraph"]> {
  const url = absoluteUrl(input.path);
  const image = input.image || DEFAULT_OG_IMAGE;
  return {
    type: input.type || "website",
    url,
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    title: input.title,
    description: input.description,
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: input.imageAlt || input.title,
      },
    ],
  };
}

export function siteTwitter(input: SiteOgInput): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    title: input.title,
    description: input.description,
    images: [input.image || DEFAULT_OG_IMAGE],
  };
}
