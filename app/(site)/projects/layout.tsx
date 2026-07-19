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

    </>
  );
}
