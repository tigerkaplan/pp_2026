// components/seo/Metadata.ts
import type { Metadata } from "next";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";

type BuildMetaArgs = {
  title: string;
  description: string;
  path?: string; // e.g. "/projects"
  ogImagePath?: string; // e.g. "/og/default.png"
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path = "/",
  ogImagePath = "/og/default.png",
  noIndex = false,
}: BuildMetaArgs): Metadata {
  const siteUrl = getSiteUrl();
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(ogImagePath);

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
