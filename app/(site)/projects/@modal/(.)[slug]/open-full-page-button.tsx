"use client";

export default function OpenFullPageButton({ url }: { url: string }) {
  return (
    <button
      onClick={() => window.location.assign(url)}
      className="rounded-md border px-2 py-1 text-sm hover:bg-muted"
    >
      View full case study
    </button>
  );
}
