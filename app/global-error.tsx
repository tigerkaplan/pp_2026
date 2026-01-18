// app/global-error.tsx
"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
                <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-4 px-6">
                    <h1 className="text-3xl font-semibold">
                        Application error
                    </h1>

                    <p className="text-neutral-600 dark:text-neutral-300">
                        Please refresh the page.
                    </p>

                    <button
                        onClick={reset}
                        className="rounded-md border px-4 py-2 text-sm"
                    >
                        Reload
                    </button>
                </main>
            </body>
        </html>
    );
}
