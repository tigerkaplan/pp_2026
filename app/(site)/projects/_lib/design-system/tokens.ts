/* =============================================================================
  DESIGN SYSTEM TOKENS
  ------------------------------------------------------------------------------
  Purpose:
  - Centralize visual decisions
  - Avoid magic Tailwind strings spread across components
  - Allow safe refactors without touching component logic
============================================================================= */

export const DS = {
  /* ---------------------------------------------------------------------------
    COVER HEIGHTS
    - These control the perceived size of cards in the grid
    - Change here → ALL cards update consistently
  --------------------------------------------------------------------------- */
  cover: {
    featured: "h-56 sm:h-64",      // Hero cards (top section)
    default: "h-44 md:h-[200px]",  // Grid cards
  },

  /* ---------------------------------------------------------------------------
    CONTENT DENSITY
    - Limits how many items appear to keep card heights aligned
  --------------------------------------------------------------------------- */
  maxItems: {
    featured: 4,
    default: 2,
  },

  /* ---------------------------------------------------------------------------
    GRID / LAYOUT
    - Used by default card split layout
  --------------------------------------------------------------------------- */
  layout: {
    split: "md:grid-cols-[260px,1fr]",
  },

  /* ---------------------------------------------------------------------------
    TAG / CHIP STYLES
    - Optimized for readability on images
    - Used for:
      • Cover tags
      • CTA badges
  --------------------------------------------------------------------------- */
  tag: {
    primary:
      "bg-black/70 text-white ring-1 ring-white/15 backdrop-blur",

    secondary:
      "bg-black/50 text-white/80 ring-1 ring-white/10 backdrop-blur",
  },

  /* ---------------------------------------------------------------------------
    TEXT TOKENS (OPTIONAL BUT RECOMMENDED)
  --------------------------------------------------------------------------- */
  text: {
    titleFeatured: "text-2xl font-semibold",
    titleDefault: "text-base font-semibold",
    metaOnImage: "text-xs text-white/75",
  },

  /* ---------------------------------------------------------------------------
    CTA ROW
  --------------------------------------------------------------------------- */
  cta: {
    rowFeatured: "px-6 py-5",
    rowDefault: "border-t border-neutral-200 px-6 py-4",
  },
} as const;
