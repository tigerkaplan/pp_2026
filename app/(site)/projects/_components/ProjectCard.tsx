import Image from "next/image";
import Link from "next/link";
import type { Project } from "../_types/project"; // Project shape (types + links + images + features)

/* =============================================================================
  FILE OVERVIEW: ProjectCard.tsx
  ------------------------------------------------------------------------------
  This file implements a "project card system" with two variants:

  1) Featured Card
     - Hero-style cover (taller image)
     - Text overlays on image
     - Intended for "top projects" section

  2) Default Card
     - Split layout (image left, content right on md+)
     - Optimized for dense grids (consistent heights)

  KEY UX RULES (IMPORTANT)
  - Clicking the card body opens a modal (via intercepting route)
  - CTA buttons (Live/GitHub/Details) must NOT be inside the card Link
    to avoid nested anchors and accidental modal opens.

  KEY VISUAL RULES (IMPORTANT)
  - Card height consistency is achieved by:
    • Fixed cover heights (heightClass)
    • Fixed number of highlights (max)
    • Text clamping (line-clamp)
============================================================================= */

/* =============================================================================
  COVER COMPONENT
  ------------------------------------------------------------------------------
  PURPOSE
  The cover is the "visual anchor" of the card and usually controls:
  - The card’s perceived size/weight in a grid
  - Readability of text over images
  - How the design behaves when images are missing

  WHEN TO EDIT THIS COMPONENT
  - Card feels too tall/short: adjust `heightClass` values passed from parent
  - Text hard to read on images: adjust `overlayClass`
  - Too many tags cluttering: adjust `tagMax` logic
============================================================================= */
function Cover({
  img,
  title,
  year,
  role,
  tags,
  isFeatured,

  /* Layout tokens (passed from ProjectCard variant)
     - heightClass is the PRIMARY size control (image section height)
     - overlayClass is the PRIMARY readability control (gradient overlay strength) */
  heightClass,
  overlayClass,

  /* Featured-only option:
     - showSummaryOnImage = true puts summary in the cover overlay,
       which increases cover content height/visual density */
  showSummaryOnImage,

  summary,

  /* Performance:
     - priority = true is useful for above-the-fold featured cards
     - sizes helps Next/Image choose correct responsive image */
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
  /* ---------------------------------------------------------------------------
     TAG DENSITY CONTROL
     - Featured cards can show more tags because they have more visual space.
     - Default cards should be minimal so the card stays clean in a grid.

     If you want "reference-style" small labels, keep tagMax low.
  --------------------------------------------------------------------------- */
  const tagMax = isFeatured ? 2 : 1;
  const tagShown = (tags ?? []).slice(0, tagMax);
  const tagRemaining = (tags ?? []).length - tagShown.length;

  return (
    /* -------------------------------------------------------------------------
       COVER WRAPPER (SIZE DRIVER)
       - `relative` enables absolute overlays (gradient, tags, text)
       - `heightClass` determines the image section height
       - bg-neutral-900 provides a consistent base under images
    ------------------------------------------------------------------------- */
    <div className={`relative w-full ${heightClass} bg-neutral-900`}>
      {/* -----------------------------------------------------------------------
         IMAGE OR FALLBACK
         - If `img` exists: render optimized Next/Image with fill + object-cover
         - If missing: render a stable gradient background + icon
           This avoids layout breakage and preserves grid alignment.
      ----------------------------------------------------------------------- */}
      {img ? (
        <Image
          src={img}
          alt={title} // Accessibility + SEO: always describe the image
          fill
          className="object-cover" // Fills container without distortion
          sizes={sizes} // Responsive image hint to prevent downloading oversized images
          priority={priority} // Preload featured images for faster LCP
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-neutral-900 via-neutral-700 to-neutral-500">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Placeholder icon:
               - visually neutral
               - keeps empty-image states consistent */}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-10 w-10 text-white/70"
            />
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------------
         GRADIENT OVERLAY (READABILITY LAYER)
         - Featured overlay is stronger (text sits on image)
         - Default overlay is lighter (just subtle contrast)
      ----------------------------------------------------------------------- */}
      <div className={`absolute inset-0 ${overlayClass}`} />

      {/* -----------------------------------------------------------------------
         TAGS (TOP-RIGHT)
         - Micro labels used like "reference design"
         - Kept small & blurred so they read but don’t dominate the image
         - "+N" shows there are more tags without expanding the card height
      ----------------------------------------------------------------------- */}
      {tagShown.length ? (
        <div className="absolute right-4 top-4 flex flex-wrap gap-2">
          {tagShown.map((t) => (
            <span
              key={t}
              className="rounded-full bg-black/70 px-2 py-1 text-[11px] font-medium text-white"

            >
              {t}
            </span>
          ))}
          {tagRemaining > 0 ? (
            <span className="rounded-full bg-neutral-900 px-2.5 py-1 text-[11px] font-medium text-neutral-100 ring-1 ring-white/15"
>
              +{tagRemaining}
            </span>
          ) : null}
        </div>
      ) : null}

      {/* -----------------------------------------------------------------------
         TEXT OVERLAY (BOTTOM)
         - Always shows year + role (meta)
         - Always shows title
         - Optionally shows summary (featured only)
         WHY: default cards already show summary in the content column
      ----------------------------------------------------------------------- */}
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <div className="text-xs text-white/75">
          {year} • {role}
        </div>

        {/* Typography hierarchy:
           - Featured: bigger title for hero emphasis
           - Default: compact title for dense grid */}
        <h3
          className={
            isFeatured ? "mt-1 text-2xl font-semibold" : "mt-1 text-base font-semibold"
          }
        >
          {title}
        </h3>

        {/* Summary on image:
           - increases visual density
           - controlled via showSummaryOnImage to keep default cards uniform */}
        {showSummaryOnImage ? (
          <p className="mt-2 max-w-prose text-sm text-white/85 line-clamp-2">
            {summary}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* =============================================================================
  CTA ROW COMPONENT
  ------------------------------------------------------------------------------
  PURPOSE
  - Provides explicit actions without triggering modal navigation:
    • Live (external)
    • GitHub (external)
    • Details (internal modal via route)

  IMPORTANT STRUCTURE RULE
  - CTA row must be OUTSIDE the main <Link> wrapping the card body.
    Otherwise you get:
    - invalid nested anchors
    - accidental modal opens when clicking external links
============================================================================= */
function Ctas({
  href,
  links,
  shownBadges,
  remainingBadges,
  featuredStyle,
}: {
  href: string;
  links: Project["links"];
  shownBadges: string[];
  remainingBadges: number;
  featuredStyle?: boolean;
}) {
  return (
    <div className={featuredStyle ? "px-6 py-4" : "border-t border-neutral-200 px-6 py-3"}>
      <div className="flex flex-wrap items-center gap-3">
        {links?.live ? (
          <a
            href={links.live}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-md bg-orange-500 px-4 py-2 text-sm text-white whitespace-nowrap"
          >
            Live →
          </a>
        ) : null}

        {links?.github ? (
          <a
            href={links.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm whitespace-nowrap"
          >
            GitHub
          </a>
        ) : null}

        <Link
          href={href}
          scroll={false}
          className={
            featuredStyle
              ? "inline-flex items-center rounded-md border border-white/30 bg-white/10 px-4 py-2 text-sm text-white whitespace-nowrap"
              : "inline-flex items-center rounded-md border px-4 py-2 text-sm whitespace-nowrap"
          }
        >
          Details →
        </Link>
      </div>

      {shownBadges.length ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {shownBadges.map((t) => (
            <span
              key={t}
              className="rounded-full bg-neutral-900/70 px-2.5 py-1 text-[11px] text-neutral-100 ring-1 ring-white/12"
            >
              {t}
            </span>
          ))}
          {remainingBadges > 0 ? (
            <span className="rounded-full bg-neutral-900/60 px-2.5 py-1 text-[11px] text-neutral-300 ring-1 ring-white/10">
              +{remainingBadges}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}


/* =============================================================================
  PROJECT CARD (MAIN)
  ------------------------------------------------------------------------------
  RESPONSIBILITIES
  - Chooses variant layout (featured vs default)
  - Determines which list to show (features preferred, fallback to stack)
  - Limits item counts to keep consistent heights across a grid
  - Connects card clicks to modal navigation via intercepting route

  CARD SIZE CONTROLS (WHERE TO EDIT)
  - Featured cover height:   heightClass="h-56 sm:h-64"
  - Default cover height:    heightClass="h-44 md:h-[200px]"
  - Default split width:     md:grid-cols-[260px,1fr]
  - Content density:         max = 4 (featured) or 2 (default)
============================================================================= */
export default function ProjectCard({
  project,
  variant = "default",
}: {
  project: Project;
  variant?: "default" | "featured";
}) {
  /* Variant selection:
     - Keep as a simple boolean to avoid branching complexity */
  const isFeatured = variant === "featured";

  /* This route is used by intercepting modal + full page fallback */
  const href = `/projects/${project.slug}`;

  /* Data sources:
     - image cover: use images[0] if available
     - highlight list: prefer explicit 'features', else use 'stack' */
  const img = project.images?.[0];
  const list = project.features?.length ? project.features : project.stack;

  /* Height stability strategy:
     - fixed item counts keep cards aligned in a grid
     - featured can show more because it’s larger */
  const max = isFeatured ? 4 : 2;
  const shown = (list ?? []).slice(0, max);
  const remaining = (list ?? []).length - shown.length;

  /* Single-language UI label (multi-language removed by design choice) */
  const label = "Highlights";

  /* ============================ FEATURED CARD ============================ */
  if (isFeatured) {
    return (
      <article className="overflow-hidden rounded-2xl border shadow-lg">
        {/* Card body click → opens modal (intercepting route) */}
        <Link href={href} scroll={false} className="block">
          <Cover
            img={img}
            title={project.title}
            year={project.year}
            role={project.role}
            tags={project.tags ?? []}
            isFeatured
            heightClass="h-56 sm:h-64" // Featured: taller hero cover (224px/256px)
            overlayClass="bg-linear-to-t from-black/75 via-black/30 to-black/10" // Strong overlay for readability
            showSummaryOnImage // Featured shows summary on cover
            summary={project.summary}
            priority // Featured likely above-the-fold: preload image
            sizes="100vw"
          />
        </Link>

        {/* CTA row outside Link: external links won't trigger modal */}
        <Ctas
          href={href}
          links={project.links}
          shownBadges={shown}
          remainingBadges={remaining}
          featuredStyle
        />
      </article>
    );
  }

  /* ============================ DEFAULT CARD ============================ */
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm">
      {/* Card body click → opens modal */}
      <Link href={href} scroll={false} className="block">
        {/* Default layout:
           - Mobile: stacked (image top, content below)
           - md+: split columns, fixed image width = 260px */}
        <div className="grid grid-cols-1 md:grid-cols-[260px,1fr]">
          <Cover
            img={img}
            title={project.title}
            year={project.year}
            role={project.role}
            tags={project.tags ?? []}
            isFeatured={false}
            heightClass="h-44 md:h-[200px]" // Default: compact cover for dense grids
            overlayClass="bg-linear-to-t from-black/25 to-transparent" // Light overlay
            summary={project.summary}
            sizes="(min-width: 768px) 260px, 100vw" // Prevents oversized image downloads
          />

          {/* Content column:
             - h-40 helps maintain row alignment in grids
             - line-clamp prevents unexpected growth from long text */}
          <div className="flex h-40 flex-col p-1">
            <p className="text-sm text-neutral-600 line-clamp-2">{project.summary}</p>

            {shown.length ? (
              <div className="mt-3 flex-1">
                {/* Section label: keep consistent across cards */}
                <div className="text-xs font-semibold">{label}</div>

                {/* Highlights list:
                   - limited count keeps card height stable
                   - line-clamp-1 keeps each line single-row */}
                <ul className="mt-2 space-y-1.5 text-sm">
                  {shown.map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-500" />
                      <span className="line-clamp-1">{t}</span>
                    </li>
                  ))}
                </ul>

                {/* "+N more" indicates there’s additional content without expanding card height */}
                {remaining > 0 && (
                  <div className="mt-1.5 text-xs text-neutral-500">+{remaining} more</div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </Link>

      {/* CTA row outside Link (critical structural rule) */}
      <Ctas
        href={href}
        links={project.links}
        shownBadges={shown}
        remainingBadges={remaining}
      />
    </article>
  );
}
