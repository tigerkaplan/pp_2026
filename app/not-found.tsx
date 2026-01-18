import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";

export const metadata: Metadata = {
    title: "404 – Page not found",
    description: "The page you are looking for could not be found.",
    robots: { index: false, follow: true },
};

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <SearchX className="h-10 w-10 mb-4 text-neutral-500" />

            <h1 className="text-3xl font-semibold mb-2">Page not found</h1>
            <p className="text-neutral-500 mb-6">
                The page you are looking for does not exist.
            </p>

            <Link
                href="/"
                className="rounded-md border px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
                Go back home
            </Link>
        </div>
    );
}
