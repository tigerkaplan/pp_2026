import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl space-y-6">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[rgb(var(--color-fg-muted))]">404</p>
      <h1 className="text-4xl font-semibold tracking-tight text-[rgb(var(--color-fg))] sm:text-5xl">Page not found</h1>
      <p className="text-base leading-7 text-[rgb(var(--color-fg-muted))] sm:text-lg">The requested page is unavailable or is not currently published as portfolio evidence.</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/" className="inline-flex min-h-11 items-center rounded-md border border-[rgb(var(--color-border))] px-4 py-2 text-sm font-medium text-[rgb(var(--color-fg))] transition hover:bg-[rgb(var(--color-surface-weak))]">Return home</Link>
        <Link href="/projects" className="inline-flex min-h-11 items-center rounded-md border border-[rgb(var(--color-border))] px-4 py-2 text-sm font-medium text-[rgb(var(--color-fg))] transition hover:bg-[rgb(var(--color-surface-weak))]">View published projects</Link>
      </div>
    </div>
  );
}
