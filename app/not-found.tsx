import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 – Page not found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center gap-4 px-6">
      <p className="text-sm text-[rgb(var(--color-fg-muted))]">404</p>

      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>

      <p className="text-[rgb(var(--color-fg-muted))]">
        The page you’re looking for doesn’t exist or may have moved.
      </p>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-md border border-[rgb(var(--color-border))] px-4 py-2 text-sm"
        >
          Go home
        </Link>
        <Link
          href="/projects"
          className="rounded-md border border-[rgb(var(--color-border))] px-4 py-2 text-sm"
        >
          View projects
        </Link>
      </div>
    </main>
  );
}
