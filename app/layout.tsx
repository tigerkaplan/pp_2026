// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

import { MainNav } from "@/components/navigation/MainNav";
import ThemeToggle from "@/components/providers/ThemeToggle";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import MobileNavDrawer from "@/components/navigation/MobileNavDrawer";
import SkipLink from "@/components/accessibility/SkipLink";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen bg-[rgb(var(--color-bg))] text-[rgb(var(--color-fg))]"
        suppressHydrationWarning
      >
        <SkipLink />
        <Providers>
          <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Desktop sidebar */}
            <aside
              className="
                hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 xl:w-80 2xl:w-96
                border-r border-[rgb(var(--color-border))]
                bg-[rgb(var(--color-topbar-bg)/0.75)]
                backdrop-blur
                supports-[backdrop-filter]:bg-[rgb(var(--color-topbar-bg)/0.6)]
              "
            >
              <div className="flex h-full w-full flex-col px-4 py-6">
                <MainNav />
              </div>
            </aside>

            <main id="main-content" tabIndex={-1} className="flex-1 min-w-0 outline-none">
              {/* Top bar */}
              <div
                className="
                  sticky top-0 z-50 w-full border-b
                  border-[rgb(var(--color-border))]
                  bg-[rgb(var(--color-topbar-bg)/0.75)]
                  backdrop-blur
                  supports-[backdrop-filter]:bg-[rgb(var(--color-topbar-bg)/0.6)]
                "
              >
                <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex items-center gap-2">
                    {/* Hamburger (mobile only) */}
                    <MobileNavDrawer />

                    {/* Breadcrumbs */}
                    <div className="min-w-0">
                      <Breadcrumbs />
                    </div>
                  </div>

                  {/* Theme toggle */}
                  <div className="shrink-0">
                    <ThemeToggle />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
