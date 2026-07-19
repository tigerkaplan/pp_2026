// app/providers.tsx
"use client";

import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultSetting="system">
      {children}
    </ThemeProvider>
  );
}
