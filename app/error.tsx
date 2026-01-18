"use client";

import { TriangleAlert } from "lucide-react";

export default function Error({
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <TriangleAlert className="h-10 w-10 mb-4 text-neutral-500" />

            <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
            <p className="text-neutral-500 mb-6">
                An unexpected error has occurred.
            </p>

            <button
                onClick={reset}
                className="rounded-md border px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
                Try again
            </button>
        </div>
    );
}
