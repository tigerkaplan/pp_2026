"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE = [
  "a[href]", "button:not([disabled])", "input:not([disabled])",
  "select:not([disabled])", "textarea:not([disabled])", "[tabindex]:not([tabindex='-1'])",
].join(",");

function setOutsideInert(dialog: HTMLElement) {
  const changed: Array<{ element: HTMLElement; wasInert: boolean }> = [];
  let branch: HTMLElement | null = dialog;
  while (branch?.parentElement && branch.parentElement !== document.body) {
    for (const sibling of Array.from(branch.parentElement.children)) {
      if (sibling !== branch && sibling instanceof HTMLElement) {
        changed.push({ element: sibling, wasInert: sibling.inert });
        sibling.inert = true;
      }
    }
    branch = branch.parentElement;
  }
  return () => changed.forEach(({ element, wasInert }) => { element.inert = wasInert; });
}

export function useDialogFocus(
  open: boolean,
  dialogRef: RefObject<HTMLElement | null>,
  initialFocusRef?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const restoreInert = setOutsideInert(dialog);
    const focusables = () => Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE))
      .filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");
    (initialFocusRef?.current ?? focusables()[0] ?? dialog).focus();

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusables();
      if (!items.length) { event.preventDefault(); dialog.focus(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener("keydown", trapFocus);
    return () => {
      document.removeEventListener("keydown", trapFocus);
      restoreInert();
      if (opener?.isConnected) opener.focus();
    };
  }, [open, dialogRef, initialFocusRef]);
}
