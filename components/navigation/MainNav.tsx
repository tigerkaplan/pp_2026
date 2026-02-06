// components/navigation/MainNav.tsx
import { NavLinks } from "./NavLinks";

type MainNavProps = {
  onNavigate?: () => void;
};

export const MainNav = ({ onNavigate }: MainNavProps) => {
  return (
    <nav className="flex h-full flex-col">
      <div className="mt-4 flex-1">
        <NavLinks onNavigate={onNavigate} />
      </div>
    </nav>
  );
};
