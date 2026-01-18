"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <html>
            <body className="min-h-screen flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-2xl font-semibold mb-2">
                    A critical error occurred
                </h1>

                <p className="text-neutral-500 mb-6">
                    Please refresh the page or try again later.
                </p>

                <button
                    onClick={reset}
                    className="rounded-md border px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                    Reload application
                </button>
            </body>
        </html>
    );
}
