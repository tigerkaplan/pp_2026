"use client";

import { useRouter } from "next/navigation";

export default function BackToProjectsButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={[
        "text-sm font-medium transition",
        "text-[rgb(var(--color-modal-fg-muted))]",
        "hover:text-[rgb(var(--color-modal-fg))]",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[rgb(var(--color-nav-active))]/40",
      ].join(" ")}
    >
      ← Back to projects
    </button>
  );
}
