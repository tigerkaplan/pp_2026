"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-4 px-6">
          <h1 className="text-3xl font-semibold">Application error</h1>

          <p className="text-neutral-700">Please refresh the page.</p>

          <button
            type="button"
            onClick={reset}
            className="w-fit rounded-md border border-neutral-700 px-4 py-2 text-sm"
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
