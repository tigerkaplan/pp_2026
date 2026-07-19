export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only fixed left-4 top-4 z-[2000] rounded-md bg-[rgb(var(--color-bg))] px-4 py-3 text-[rgb(var(--color-fg))] ring-2 ring-[rgb(var(--color-focus))] focus:not-sr-only"
    >
      Skip to main content
    </a>
  );
}
