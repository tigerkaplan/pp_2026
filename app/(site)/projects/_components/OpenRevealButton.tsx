"use client";

export default function OpenRevealButton({ href }: { href: string }) {
    return (
        <button
            type="button"
            onClick={() => {
                // When the modal is open, the URL is already `/projects/[slug]`.
                // Browsers may ignore navigation to the same URL,
                // so we append a query parameter to force a full page reload.
                const url = href.includes("?") ? `${href}&full=1` : `${href}?full=1`;
                window.location.href = url;
            }}
            className="rounded-md border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white"
        >
            View full case study
        </button>
    );
}
