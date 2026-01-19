export default function Loading() {
    return (
        <div className="space-y-4">
            <div className="h-8 w-2/3 rounded bg-neutral-800/60 animate-pulse" />
            <div className="h-4 w-full rounded bg-neutral-800/60 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-neutral-800/60 animate-pulse" />
            <div className="h-64 w-full rounded-2xl bg-neutral-800/60 animate-pulse" />
        </div>
    );
}
