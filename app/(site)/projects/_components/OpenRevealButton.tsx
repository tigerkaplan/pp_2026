"use client";

export default function OpenRevealButton({ href }: { href: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        // force full page navigation
        const url = href.includes("?") ? `${href}&full=1` : `${href}?full=1`;
        window.location.href = url;
      }}
      className={[
        "rounded-md px-3 py-2 text-sm font-medium transition",
        "border border-[rgb(var(--color-modal-border))]",
        "text-[rgb(var(--color-modal-fg))]",
        "bg-rgb(var(--color-surface)/0.18)",
        "hover:bg-[rgb(var(--color-surface)/0.3)]",
        "hover:text-[rgb(var(--color-modal-fg))]",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[rgb(var(--color-nav-active))]/40",
      ].join(" ")}
    >
      View full case study
    </button>
  );
}
