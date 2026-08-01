export function isSafeProjectMediaPath(value: string): boolean {
  if (!/^\/(?!\/)/.test(value) || value.includes("\\")) return false;
  return !value.split("/").some((segment) => segment === "." || segment === "..");
}
