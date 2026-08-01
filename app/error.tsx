"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center gap-4 px-6">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>

      <p className="text-[rgb(var(--color-fg-muted))]">Please try again.</p>

      <button
        type="button"
        onClick={reset}
        className="w-fit rounded-md border border-[rgb(var(--color-border))] px-4 py-2 text-sm"
      >
        Try again
      </button>
    </main>
  );
}
