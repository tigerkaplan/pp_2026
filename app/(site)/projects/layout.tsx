// app/(site)/projects/layout.tsx
import type { ReactNode } from "react";

export default function ProjectsLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <>
      {/* Main route content */}
      {children}

      {/* Parallel route slot (should receive @modal) */}
      {modal}

      {/* Debug marker: confirms this layout is active AND modal slot is being rendered */}
      <div className="fixed bottom-12 right-3 z-9999 rounded bg-blue-600 px-2 py-1 text-xs text-white">
        modal slot rendered
      </div>
    </>
  );
}
