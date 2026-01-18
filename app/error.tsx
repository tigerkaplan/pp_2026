// app/error.tsx
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
            <h1 className="text-3xl font-semibold">
                Something went wrong
            </h1>

            <p className="text-neutral-600 dark:text-neutral-300">
                Please try again.
            </p>

            <button
                onClick={reset}
                className="rounded-md border px-4 py-2 text-sm"
            >
                Try again
            </button>
        </main>
    );
}
