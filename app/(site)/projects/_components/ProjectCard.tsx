import Image from "next/image";
import Link from "next/link";
import type { Project } from "../_types/project";

/* =============================================================================
  ProjectCard.tsx (Token-based, Tailwind v4)
============================================================================= */

/* ---------------------------------------------
  SIZE TOKENS
---------------------------------------------- */
const splitCols = "md:grid-cols-[260px,1fr]";
const coverFeaturedH = "h-56 sm:h-64";
const coverDefaultH = "h-44 md:h-[200px]";

const slotLabel = "h-4";
const slotList = "h-[3.25rem]";
const slotMore = "h-4";

/* ---------------------------------------------
  Shared style helpers
---------------------------------------------- */
const cardShell =
  "overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[color-mix(in_oklab,var(--card)_70%,transparent)] shadow-[0_12px_40px_-28px_rgba(0,0,0,0.55)] backdrop-blur";

const cardHover =
  "transition hover:shadow-[0_16px_50px_-30px_rgba(0,0,0,0.65)]";

const subtleBorder = "border-t border-[var(--hairline)]";

const chip =
  "rounded-full bg-[var(--chip)] px-2.5 py-1 text-[11px] font-medium text-[var(--chip-text)] ring-1 ring-[var(--hairline)] backdrop-blur";

const chipPrimary =
  "rounded-full bg-[color-mix(in_oklab,var(--accent)_22%,transparent)] px-2.5 py-1 text-[11px] font-medium text-[var(--text)] ring-1 ring-[color-mix(in_oklab,var(--accent)_40%,transparent)] backdrop-blur";

/* =============================================================================
  Cover
============================================================================= */
function Cover({
  img,
  title,
  year,
  role,
  tags,
  isFeatured,
  heightClass,
  overlayClass,
  showSummaryOnImage,
  summary,
  priority,
  sizes,
}: {
  img?: string;
  title: string;
  year: number;
  role: string;
  tags: string[];
  isFeatured: boolean;
  heightClass: string;
  overlayClass: string;
  showSummaryOnImage?: boolean;
  summary: string;
  priority?: boolean;
  sizes: string;
}) {
  const tagMax = isFeatured ? 2 : 1;
  const shownTags = tags.slice(0, tagMax);
  const remainingTags = tags.length - shownTags.length;

  return (
    <div
      className={[
        "relative w-full",
        heightClass,
        // fallback surface
        "bg-[color-mix(in_oklab,var(--card)_85%,black_15%)]",
      ].join(" ")}
    >
      {img ? (
        <Image
          src={img}
          alt={title}
          fill
          className="object-cover"
          sizes={sizes}
          priority={priority}
        />
      ) : null}

      <div className={`absolute inset-0 ${overlayClass}`} />

      {shownTags.length > 0 && (
        <div className="absolute right-4 top-4 flex gap-2">
          {shownTags.map((t, i) => (
            <span key={t} className={i === 0 ? chipPrimary : chip}>
              {t}
            </span>
          ))}
          {remainingTags > 0 && <span className={chip}>+{remainingTags}</span>}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="text-xs text-white/75">
          {year} • {role}
        </div>

        <h3
          className={
            isFeatured
              ? "mt-1 text-2xl font-semibold text-white"
              : "mt-1 text-base font-semibold text-white"
          }
        >
          {title}
        </h3>

        {showSummaryOnImage && (
          <p className="mt-2 text-sm text-white/85 line-clamp-2">
            {summary}
          </p>
        )}
      </div>
    </div>
  );
}

/* =============================================================================
  CTA Row (slightly darker than card)
============================================================================= */
function Ctas({
  href,
  links,
  badges,
  badgesRemaining,
  featuredStyle,
}: {
  href: string;
  links: Project["links"];
  badges: string[];
  badgesRemaining: number;
  featuredStyle?: boolean;
}) {
  return (
    <div
      className={[
        featuredStyle ? "px-6 py-5" : `px-6 py-4 ${subtleBorder}`,

        // ✅ CTA footer is slightly darker than card body
        "bg-[color-mix(in_oklab,var(--card)_78%,black_22%)]",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-center gap-3">
        {links?.live && (
          <a
            href={links.live}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-[var(--btn)] px-4 py-2 text-sm font-medium text-[var(--btn-text)] hover:bg-[var(--accent-hover)]"
          >
            Live →
          </a>
        )}

        {links?.github && (
          <a
            href={links.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-[var(--hairline)] bg-[color-mix(in_oklab,var(--card)_55%,transparent)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:bg-[color-mix(in_oklab,var(--card-alt)_35%,transparent)]"
          >
            GitHub
          </a>
        )}

        <Link
          href={href}
          scroll={false}
          className="rounded-md border border-[var(--hairline)] bg-[color-mix(in_oklab,var(--card)_55%,transparent)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:bg-[color-mix(in_oklab,var(--card-alt)_35%,transparent)]"
        >
          Details →
        </Link>
      </div>

      {badges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {badges.map((b) => (
            <span key={b} className={chip}>
              {b}
            </span>
          ))}
          {badgesRemaining > 0 && (
            <span className={chip}>+{badgesRemaining}</span>
          )}
        </div>
      )}
    </div>
  );
}

/* =============================================================================
  MAIN
============================================================================= */
export default function ProjectCard({
  project,
  variant = "default",
}: {
  project: Project;
  variant?: "default" | "featured";
}) {
  const isFeatured = variant === "featured";
  const href = `/projects/${project.slug}`;

  const img = project.images?.[0];
  const list = project.features?.length
    ? project.features
    : project.stack ?? [];

  const max = isFeatured ? 4 : 2;
  const shown = list.slice(0, max);
  const remaining = list.length - shown.length;

  const label = "Highlights";

  if (isFeatured) {
    return (
      <article className={[cardShell, cardHover].join(" ")}>
        <Link href={href} scroll={false}>
          <Cover
            img={img}
            title={project.title}
            year={project.year}
            role={project.role}
            tags={project.tags ?? []}
            isFeatured
            heightClass={coverFeaturedH}
            overlayClass="bg-[linear-gradient(to_top,rgba(0,0,0,0.75),rgba(0,0,0,0.28),rgba(0,0,0,0.10))]"
            showSummaryOnImage
            summary={project.summary}
            priority
            sizes="100vw"
          />
        </Link>

        <Ctas
          href={href}
          links={project.links}
          badges={shown}
          badgesRemaining={remaining}
          featuredStyle
        />
      </article>
    );
  }

  return (
    <article className={["flex h-full flex-col", cardShell, cardHover].join(" ")}>
      <Link href={href} scroll={false}>
        <div className={`grid grid-cols-1 ${splitCols}`}>
          <Cover
            img={img}
            title={project.title}
            year={project.year}
            role={project.role}
            tags={project.tags ?? []}
            isFeatured={false}
            heightClass={coverDefaultH}
            overlayClass="bg-[linear-gradient(to_top,rgba(0,0,0,0.35),rgba(0,0,0,0))]"
            summary={project.summary}
            sizes="(min-width:768px) 260px, 100vw"
          />

          <div className="flex h-40 flex-col p-3">
            <p className="h-14 text-sm text-[var(--text-muted)] line-clamp-2">
              {project.summary}
            </p>

            <div className={`mt-2 ${slotLabel}`}>
              <div className="text-xs font-semibold text-[var(--text)]">
                {label}
              </div>
            </div>

            <ul
              className={[
                "mt-2 space-y-1.5 text-sm",
                "text-[var(--text-muted)]",
                slotList,
              ].join(" ")}
            >
              {shown.map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  <span className="line-clamp-1">{t}</span>
                </li>
              ))}
            </ul>

            <div className={`mt-1 text-xs text-[var(--text-faint)] ${slotMore}`}>
              {remaining > 0 ? `+${remaining} more` : "\u00A0"}
            </div>
          </div>
        </div>
      </Link>

      <Ctas
        href={href}
        links={project.links}
        badges={shown}
        badgesRemaining={remaining}
      />
    </article>
  );
}
