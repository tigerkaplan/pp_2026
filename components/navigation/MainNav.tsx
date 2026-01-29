import { NavLinks } from "./NavLinks";

export const MainNav = () => {
  return (
    <nav className="flex h-full flex-col">
      <div className="flex items-center justify-end">
      </div>

      <div className="mt-4 flex-1">
        <NavLinks />
      </div>
    </nav>
  );
};
