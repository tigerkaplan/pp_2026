// lib/seo.ts
export function getSiteUrl() {
    const url =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.SITE_URL ||
        "http://localhost:3000";
    return url.replace(/\/$/, "");
}

export function absoluteUrl(path: string) {
    const base = getSiteUrl();
    if (!path.startsWith("/")) path = `/${path}`;
    return `${base}${path}`;
}
