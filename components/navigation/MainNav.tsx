// components/navigation/MainNav.tsx
import { NavLinks } from "./NavLinks";

type MainNavProps = {
  onNavigate?: () => void;
  desktop?: boolean;
};

export const MainNav = ({ onNavigate, desktop = false }: MainNavProps) => {
  return (
    <nav
      aria-label="Primary navigation"
      className="flex h-full min-h-0 flex-col"
      data-navigation-mode={desktop ? "desktop" : "default"}
    >
      <div
        className={
          desktop
            ? "min-h-0 flex-1 overflow-y-auto px-1 py-6"
            : "mt-4 flex-1"
        }
        data-desktop-navigation-scroll={desktop ? "" : undefined}
      >
        <NavLinks onNavigate={onNavigate} />
      </div>
    </nav>
  );
};
