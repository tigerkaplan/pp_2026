import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "The development approach and evidence boundaries behind Personal Portfolio 2026.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl space-y-10">
      <header className="max-w-3xl space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight text-[rgb(var(--color-fg))] sm:text-5xl">About</h1>
        <p className="text-base leading-7 text-[rgb(var(--color-fg-muted))] sm:text-lg">
          I am a front-end developer building a portfolio around clear project communication, reusable content structures and accessible interaction patterns.
        </p>
      </header>
      <section className="space-y-3" aria-labelledby="approach-heading">
        <h2 id="approach-heading" className="text-2xl font-semibold text-[rgb(var(--color-fg))]">Development approach</h2>
        <p className="text-[rgb(var(--color-fg-muted))]">Project Cards, previews and full case studies are supplied from validated records so that the same information can support browsing, routes, metadata and discovery without duplicating it across the interface.</p>
      </section>
      <section className="space-y-3" aria-labelledby="evidence-heading">
        <h2 id="evidence-heading" className="text-2xl font-semibold text-[rgb(var(--color-fg))]">Evidence-led presentation</h2>
        <p className="text-[rgb(var(--color-fg-muted))]">The portfolio distinguishes implemented work from developing knowledge. It keeps unavailable links and unapproved media out of public actions, and records limitations alongside implementation details where evidence is incomplete.</p>
      </section>
      <section className="space-y-3" aria-labelledby="current-focus-heading">
        <h2 id="current-focus-heading" className="text-2xl font-semibold text-[rgb(var(--color-fg))]">Current focus</h2>
        <p className="text-[rgb(var(--color-fg-muted))]">Current work concentrates on responsive presentation, keyboard-aware interactions, structured content and documented automated checks. Manual accessibility and evidence-media review remain clearly identified where they are still pending.</p>
        <Link href="/skills" className="inline-flex min-h-11 items-center text-sm font-medium text-[rgb(var(--color-fg))] underline underline-offset-4">View skills and evidence levels</Link>
      </section>
    </div>
  );
}
