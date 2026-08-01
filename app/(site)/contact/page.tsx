import type { Metadata } from "next";
import ContactMessageForm from "./ContactMessageForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send a message or view the verified public source for Personal Portfolio 2026.",
};

export default function ContactPage() {
  const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID?.trim() ?? "";

  return (
    <div className="max-w-3xl space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight text-[rgb(var(--color-fg))] sm:text-5xl">Contact</h1>
        <p className="text-base leading-7 text-[rgb(var(--color-fg-muted))] sm:text-lg">Send a message about a project, professional opportunity or potential collaboration.</p>
      </header>
      <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface)/0.18)] p-5 sm:p-6" aria-labelledby="message-heading">
        <div className="mb-6 space-y-2">
          <h2 id="message-heading" className="text-2xl font-semibold text-[rgb(var(--color-fg))]">Send a message</h2>
          <p className="text-[rgb(var(--color-fg-muted))]">Fields marked with an asterisk are required.</p>
        </div>
        <ContactMessageForm formId={formId} />
      </section>
      <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface)/0.18)] p-5" aria-labelledby="source-heading">
        <h2 id="source-heading" className="text-xl font-semibold text-[rgb(var(--color-fg))]">Portfolio source</h2>
        <p className="mt-2 text-[rgb(var(--color-fg-muted))]">You can also explore the portfolio source code and development approach on GitHub.</p>
        <a href="https://github.com/tigerkaplan/pp_2026" target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center rounded-md border border-[rgb(var(--color-border))] px-4 py-2 text-sm font-medium text-[rgb(var(--color-fg))] transition hover:bg-[rgb(var(--color-surface-weak))]">View the portfolio on GitHub</a>
      </section>
    </div>
  );
}
