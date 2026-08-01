import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Verified public contact information and source access for Personal Portfolio 2026.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight text-[rgb(var(--color-fg))] sm:text-5xl">Contact</h1>
        <p className="text-base leading-7 text-[rgb(var(--color-fg-muted))] sm:text-lg">The verified public route for this portfolio is its GitHub repository. Additional contact details will only be published when an authoritative public source is available.</p>
      </header>
      <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface)/0.18)] p-5" aria-labelledby="source-heading">
        <h2 id="source-heading" className="text-xl font-semibold text-[rgb(var(--color-fg))]">Portfolio source</h2>
        <p className="mt-2 text-[rgb(var(--color-fg-muted))]">View the repository that supports the Personal Portfolio project record.</p>
        <a href="https://github.com/tigerkaplan/pp_2026" target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center rounded-md border border-[rgb(var(--color-border))] px-4 py-2 text-sm font-medium text-[rgb(var(--color-fg))] transition hover:bg-[rgb(var(--color-surface-weak))]">Open the portfolio repository on GitHub</a>
      </section>
    </div>
  );
}
