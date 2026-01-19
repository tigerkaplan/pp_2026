"use client";

import { useState } from "react";

export default function CopyLinkButton({ url }: { url: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        const absolute =
            (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "") + url;

        try {
            await navigator.clipboard.writeText(absolute || url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            // fallback
            const text = absolute || url;
            prompt("Copy this link:", text);
        }
    };

    return (
        <button
            onClick={copy}
            className="rounded-md border px-2 py-1 text-sm hover:bg-muted"
            aria-label="Copy link"
            title="Copy link"
        >
            {copied ? "Copied" : "Copy link"}
        </button>
    );
}
