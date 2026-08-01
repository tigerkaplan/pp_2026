"use client";

import { useEffect, useRef, useState } from "react";
import { TechnologyOverflow } from "./TechnologyOverflow";

const chip =
  "whitespace-nowrap rounded-full bg-[rgb(var(--color-surface-weak)/0.78)] px-2.5 py-1 text-xs font-medium text-[rgb(var(--color-fg))] ring-1 ring-[rgb(var(--color-border))] backdrop-blur sm:text-sm";
const visibleChip = `${chip} shrink-0`;

const rowGap = 8;

function getVisibleCount({
  availableWidth,
  technologyWidths,
  overflowWidths,
}: {
  availableWidth: number;
  technologyWidths: number[];
  overflowWidths: number[];
}) {
  const technologyCount = technologyWidths.length;

  for (let visibleCount = technologyCount; visibleCount >= 0; visibleCount -= 1) {
    const hiddenCount = technologyCount - visibleCount;
    const itemCount = visibleCount + (hiddenCount > 0 ? 1 : 0);
    const usedWidth =
      technologyWidths.slice(0, visibleCount).reduce((total, width) => total + width, 0) +
      (hiddenCount > 0
        ? overflowWidths[hiddenCount - 1] ?? Number.POSITIVE_INFINITY
        : 0) +
      Math.max(0, itemCount - 1) * rowGap;

    if (usedWidth <= availableWidth) return visibleCount;
  }

  return 0;
}

export function TechnologyTags({ technologies }: { technologies: string[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState(0);
  const [technologyWidths, setTechnologyWidths] = useState<number[]>([]);
  const [overflowWidths, setOverflowWidths] = useState<number[]>([]);

  useEffect(() => {
    const updateMeasurements = () => {
      setAvailableWidth(rowRef.current?.getBoundingClientRect().width ?? 0);
      setTechnologyWidths(
        technologies.map(
          (_, index) =>
            measurementRef.current?.querySelector<HTMLElement>(
              `[data-technology-measurement="${index}"]`,
            )?.getBoundingClientRect().width ?? 0,
        ),
      );
      setOverflowWidths(
        technologies.map(
          (_, index) =>
            measurementRef.current?.querySelector<HTMLElement>(
              `[data-overflow-measurement="${index + 1}"]`,
            )?.getBoundingClientRect().width ?? 0,
        ),
      );
    };

    updateMeasurements();
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateMeasurements);
    if (rowRef.current) observer?.observe(rowRef.current);
    window.addEventListener("resize", updateMeasurements);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateMeasurements);
    };
  }, [technologies]);

  const measurementsReady =
    availableWidth > 0 &&
    technologyWidths.length === technologies.length &&
    overflowWidths.length === technologies.length;
  const visibleCount = measurementsReady
    ? getVisibleCount({ availableWidth, technologyWidths, overflowWidths })
    : technologies.length;
  const hiddenTechnologies = technologies.slice(visibleCount);

  return (
    <>
      <div
        ref={rowRef}
        className="flex min-w-0 flex-nowrap items-center gap-2"
        data-project-technologies
      >
        {technologies.slice(0, visibleCount).map((technology) => (
          <span key={technology} className={visibleChip}>
            {technology}
          </span>
        ))}
        <TechnologyOverflow technologies={hiddenTechnologies} />
      </div>

      <div
        ref={measurementRef}
        aria-hidden="true"
        className="pointer-events-none absolute invisible flex gap-2 whitespace-nowrap"
        data-technology-measurements
      >
        {technologies.map((technology, index) => (
          <span
            key={technology}
            className={chip}
            data-technology-measurement={index}
          >
            {technology}
          </span>
        ))}
        {technologies.map((_, index) => (
          <span
            key={index}
            className={chip}
            data-overflow-measurement={index + 1}
          >
            +{index + 1}
          </span>
        ))}
      </div>
    </>
  );
}
