import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { isSafeProjectMediaPath } from "@/lib/project-media-path";

export function hasRealProjectAsset(src?: string) {
  if (!src || !isSafeProjectMediaPath(src)) return false;

  const publicRoot = path.resolve(process.cwd(), "public");
  const publicPath = path.resolve(publicRoot, src.slice(1));
  return publicPath.startsWith(`${publicRoot}${path.sep}`) && existsSync(publicPath);
}

export function ProjectMedia({
  src,
  title,
  alt = "",
  className,
  priority = false,
  sizes,
}: {
  src?: string;
  title: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const hasRealImage = hasRealProjectAsset(src);

  if (!hasRealImage) {
    return (
      <div
        aria-hidden="true"
        className={[
          "flex h-full w-full items-center justify-center",
          "bg-[rgb(var(--color-surface-strong))]",
          className,
        ].join(" ")}
      >
        <div className="max-w-[16rem] rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg)/0.72)] px-4 py-5 text-center backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--color-fg-muted))]">
            Preview unavailable
          </p>
          <p className="mt-2 text-sm text-[rgb(var(--color-fg))]">{title}</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src as string}
      alt={alt}
      fill
      className={className ?? "object-cover"}
      priority={priority}
      sizes={sizes}
    />
  );
}
