import type { Metadata } from "next";
import "./globals.css";
// Components
import { MainNav } from "@/components/navigation/MainNav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="min-h-screen flex flex-col lg:flex-row">
          {/* Mobile/Tablet Top Nav */}
          <header className="lg:hidden sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
            <div className="px-4 py-3">
              <MainNav />
            </div>
          </header>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 xl:w-80 2xl:w-96 border-r bg-background/80 backdrop-blur">
            <div className="flex h-full w-full flex-col px-4 py-6">
              <MainNav />
            </div>
          </aside>


          {/* Content */}
          <main className="flex-1 min-w-0">
            {/* Optional page top bar */}
            <div className="w-full border-b">
              <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-4">
                {/* header content */}
              </div>
            </div>

            <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
          </main>


          {/* <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-20 xl:w-24 2xl:w-32 border bg-background/80 backdrop-blur items-center justify-center">
  <div className="flex h-full w-full items-center justify-center px-2 py-6">
    <div className="-rotate-90 whitespace-nowrap">
      <MainNav />
    </div>
  </div>
</aside> */}

        </div>
      </body>
    </html>
  );
}

