import Link from "next/link";
import type { Project } from "../_types/project";
import { hasRealProjectAsset, ProjectMedia } from "./ProjectMedia";
import {
  ProjectActionOverflow,
  type ProjectOverflowAction,
} from "./ProjectActionOverflow";
import { TechnologyTags } from "./TechnologyTags";

/* =============================================================================
  ProjectCard.tsx (Token-based, Tailwind v4)
============================================================================= */

/* ---------------------------------------------
  SIZE TOKENS
---------------------------------------------- */
const coverFeaturedH = "h-56 sm:h-64";
const coverDefaultH = "h-48 sm:h-52";

/* ---------------------------------------------
  Shared style helpers
---------------------------------------------- */
const cardShell =
  "group isolate rounded-2xl border border-[rgb(var(--color-card-border))] bg-[rgb(var(--color-card-surface))] shadow-[0_12px_40px_-28px_rgba(0,0,0,0.55)] backdrop-blur focus-within:border-[rgb(var(--color-focus))] focus-within:ring-2 focus-within:ring-[rgb(var(--color-focus))]";

const cardHover =
  "transition hover:border-[rgb(var(--color-card-border))] hover:bg-[rgb(var(--color-card-surface-hover))] hover:shadow-[0_16px_50px_-30px_rgba(0,0,0,0.65)]";

const subtleBorder = "border-t border-[rgb(var(--color-card-border))]";

const chipPrimary =
  "whitespace-nowrap rounded-full bg-[rgb(var(--color-nav-active))] px-2.5 py-1 text-xs font-medium text-[rgb(var(--color-nav-active-fg))] ring-1 ring-[rgb(var(--color-border))] backdrop-blur sm:text-sm";

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
  const primaryTag = tags[0];
  const hasRealImage = hasRealProjectAsset(img);

  return (
    <div data-project-header>
      <div
      className={[
        "relative w-full overflow-hidden rounded-t-2xl",
        heightClass,
        // fallback surface
        "bg-[rgb(var(--color-surface-strong))]",
      ].join(" ")}
      data-project-media
    >
      <div className="absolute inset-0">
        <ProjectMedia
          src={img}
          title={title}
          className="object-cover"
          priority={priority}
          sizes={sizes}
        />
      </div>

      {primaryTag && (
        <div className="absolute right-4 top-4">
          <span className={chipPrimary}>{primaryTag}</span>
        </div>
      )}

      {hasRealImage && (
        <>
          <div className={`absolute inset-0 ${overlayClass}`} />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="text-sm leading-5 text-white/80">
          {year} • {role}
        </div>

        <h3
          className={
            isFeatured
              ? "mt-1 text-2xl font-semibold leading-tight text-white sm:text-3xl"
              : "mt-1 text-xl font-semibold leading-tight text-white lg:text-2xl"
          }
        >
          {title}
        </h3>

        {showSummaryOnImage && (
          <p className="mt-2 text-sm leading-6 text-white/85 line-clamp-2 sm:text-base">
            {summary}
          </p>
        )}
          </div>
          </>
        )}
      </div>

      {!hasRealImage && (
        <div className="p-5" data-project-title-content>
          <div className="text-sm leading-5 text-[rgb(var(--color-fg-muted))]">
            {year} {"\u2022"} {role}
          </div>
          <h3
            className={
              isFeatured
                ? "mt-1 text-2xl font-semibold leading-tight text-[rgb(var(--color-fg))] sm:text-3xl"
                : "mt-1 text-xl font-semibold leading-tight text-[rgb(var(--color-fg))] lg:text-2xl"
            }
          >
            {title}
          </h3>
          {showSummaryOnImage && (
            <p className="mt-2 text-sm leading-6 text-[rgb(var(--color-fg-muted))] line-clamp-2 sm:text-base">
              {summary}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* =============================================================================
  CTA Row (slightly darker than card)
============================================================================= */
function Ctas({
  href,
  title,
  links,
  technologies,
  featuredStyle,
}: {
  href: string;
  title: string;
  links: Project["links"];
  technologies: string[];
  featuredStyle?: boolean;
}) {
  const actions: Array<
    ProjectOverflowAction & { intercepted?: boolean }
  > = [
    ...(links?.live
      ? [{ label: "Live", href: links.live, external: true }]
      : []),
    ...(links?.github
      ? [{ label: "GitHub", href: links.github, external: true }]
      : []),
    {
      label: "Preview",
      href,
      ariaLabel: `Preview ${title}`,
      intercepted: true,
    },
    {
      label: "View full project",
      href,
      ariaLabel: `View full project: ${title}`,
    },
  ];
  const compactVisibleActions = actions.slice(0, 3);
  const compactHiddenActions = actions.slice(3);
  const actionClass =
    "inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-md border border-[rgb(var(--color-card-border))] bg-[rgb(var(--color-surface-weak)/0.55)] px-2 py-2 text-sm font-medium leading-5 text-[rgb(var(--color-fg))] hover:bg-[rgb(var(--color-surface-weak)/0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-focus))]";

  const renderAction = (
    action: ProjectOverflowAction & { intercepted?: boolean },
  ) =>
    action.intercepted ? (
      <Link
        key={action.label}
        href={action.href}
        scroll={false}
        aria-label={action.ariaLabel}
        className={actionClass}
      >
        {action.label}
      </Link>
    ) : (
      <a
        key={action.label}
        href={action.href}
        aria-label={action.ariaLabel}
        target={action.external ? "_blank" : undefined}
        rel={action.external ? "noreferrer" : undefined}
        className={actionClass}
      >
        {action.label}
      </a>
    );

  return (
    <div
      className={[
        featuredStyle ? "px-3 py-4 sm:px-4" : `px-3 py-4 sm:px-4 ${subtleBorder}`,
        "relative flex min-h-[7.25rem] flex-col gap-2 rounded-b-2xl",
        "bg-[rgb(var(--color-card-surface))] transition",
        "group-hover:bg-[rgb(var(--color-card-surface-hover))]",
      ].join(" ")}
      data-project-footer
    >
      <div
        className="@container min-h-11"
        data-project-actions
      >
        {compactHiddenActions.length > 0 ? (
          <>
            <div
              className="hidden min-h-11 items-center gap-1.5 @[21rem]:flex @[21rem]:flex-nowrap"
              data-project-actions-wide
            >
              {actions.map(renderAction)}
            </div>
            <div
              className="flex min-h-11 flex-nowrap items-center gap-1.5 @[21rem]:hidden"
              data-project-actions-compact
            >
              {compactVisibleActions.map(renderAction)}
              <ProjectActionOverflow actions={compactHiddenActions} />
            </div>
          </>
        ) : (
          <div
            className="flex min-h-11 flex-nowrap items-center gap-1.5"
            data-project-actions-direct
          >
            {actions.map(renderAction)}
          </div>
        )}
      </div>

      <TechnologyTags technologies={technologies} />
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

  const shown = list.slice(0, isFeatured ? 4 : 2);
  const remaining = list.length - shown.length;

  const label = "Highlights";
  if (isFeatured) {
    return (
      <article className={["flex h-full flex-col", cardShell, cardHover].join(" ")}>
        <div className="flex flex-1 flex-col" data-project-card-body>
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
        </div>

        <Ctas
          href={href}
          title={project.title}
          links={project.links}
          technologies={project.stack ?? []}
          featuredStyle
        />
      </article>
    );
  }

  return (
    <article className={["flex h-full flex-col", cardShell, cardHover].join(" ")}>
      <div className="flex flex-1 flex-col" data-project-card-body>
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
          sizes="(min-width:1200px) 33vw, (min-width:768px) 50vw, 100vw"
        />

          <div
            className="flex flex-col gap-3 px-5 pb-5 pt-3"
            data-project-content
          >
            <p className="text-base leading-6 text-[rgb(var(--color-fg-muted))] lg:text-[17px]">
              {project.summary}
            </p>

            <div>
              <div className="text-sm font-semibold text-[rgb(var(--color-fg))]">
                {label}
              </div>
            </div>

            <ul
              className={[
                "space-y-1.5 text-sm leading-5 sm:text-base sm:leading-6",
                "text-[rgb(var(--color-fg-muted))]",
              ].join(" ")}
            >
              {shown.map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[rgb(var(--color-nav-active))]" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            {remaining > 0 && (
              <div className="text-sm text-[rgb(var(--color-fg-muted))] opacity-80">
                +{remaining} more
              </div>
            )}
        </div>
      </div>

      <Ctas
        href={href}
        title={project.title}
        links={project.links}
        technologies={project.stack ?? []}
      />
    </article>
  );
}
