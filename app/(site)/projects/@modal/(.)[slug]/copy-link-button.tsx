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
            prompt("Copy this link:", absolute || url);
        }
    };

    return (
        <button
            type="button"
            onClick={copy}
            aria-label="Copy link"
            title="Copy link"
            className={[
                "rounded-md px-3 py-2 text-sm font-medium transition",
                "border border-[rgb(var(--color-modal-border))]",
                "!text-[rgb(var(--color-modal-fg))]",
                "!bg-[rgb(var(--color-surface)/0.18)]",
                "hover:!bg-[rgb(var(--color-surface)/0.3)]",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[rgb(var(--color-focus))]",
            ].join(" ")}
        >
            {copied ? "Copied" : "Copy link"}
        </button>
    );
}
