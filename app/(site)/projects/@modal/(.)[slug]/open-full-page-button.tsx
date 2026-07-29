"use client";

export default function OpenFullPageButton({ url }: { url: string }) {
  return (
    <button
      type="button"
      onClick={() => window.location.assign(url)}
      className={[
        "rounded-md px-3 py-2 text-sm font-medium transition",
        "border !border-[rgb(var(--color-modal-border))]",
        "!text-[rgb(var(--color-modal-fg))]",
        "!bg-[rgb(var(--color-surface)/0.18)]",
        "hover:!bg-[rgb(var(--color-surface)/0.3)]",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[rgb(var(--color-focus))]",
      ].join(" ")}
    >
      View full case study
    </button>
  );
}
