import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { MainNav } from "@/components/navigation/MainNav";
import { ThemeToggle } from "@/components/providers/ThemeToggle";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-neutral-100"
        suppressHydrationWarning
      >
        <Providers>
          <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Mobile header */}
            <header className="lg:hidden sticky top-0 z-50 border-b bg-white/80 dark:bg-neutral-950/80 backdrop-blur">
              <div className="px-4 py-3">
                <MainNav />
              </div>
            </header>

            {/* Desktop sidebar */}
            <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 xl:w-80 2xl:w-96 border-r bg-white/80 dark:bg-neutral-950/80 backdrop-blur">
              <div className="flex h-full w-full flex-col px-4 py-6">
                <MainNav />
              </div>
            </aside>

            <main className="flex-1 min-w-0">
              {/* Top bar */}
              <div className="w-full border-b bg-white/70 dark:bg-neutral-950/70 backdrop-blur">
                <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <Breadcrumbs />
                  </div>

                  <div className="shrink-0">
                    <ThemeToggle />
                  </div>
                </div>
              </div>

              {/* Page content */}
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
