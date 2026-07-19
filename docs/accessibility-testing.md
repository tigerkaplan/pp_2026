# Accessibility testing

## Accessibility target

The portfolio is being developed with WCAG 2.2 Level AA as the target. Full compliance is not claimed because the required manual, assistive-technology, browser, contrast, and production-content evidence is not yet complete.

## Automated testing

Jest, React Testing Library, `@testing-library/user-event`, and `jest-axe` cover the skip link, route navigation and current-page state, mobile drawer open state and focus handling, project-dialog semantics and focus handling, full-page project link, theme preference and control state, and representative open/closed component states.

Tests use semantic queries and user-level keyboard interaction. No axe rules are disabled. Automated accessibility tests can detect only a subset of accessibility issues and do not establish full WCAG compliance.

## Manual keyboard checklist

- Reach and activate the skip link; confirm focus reaches the main content.
- Traverse the primary navigation in a logical order and confirm the current page is announced.
- Open the mobile menu; test Tab, Shift+Tab, Escape, route selection, focus containment, and focus restoration.
- Open a project preview; test Tab, Shift+Tab, Escape, backdrop dismissal, scrolling, full-page navigation, and focus restoration.
- Operate the theme control and confirm its name and state remain accurate.
- Confirm every interactive element has a visible focus indicator in both themes.
- Confirm there are no keyboard traps or unreachable controls.

## Manual visual checklist

- Test browser zoom at 200%.
- Test reflow at approximately 320 CSS pixels without two-dimensional scrolling.
- Verify light- and dark-theme text and UI-component contrast.
- Verify focus-indicator contrast against adjacent colours.
- Apply WCAG text-spacing overrides and check clipping or overlap.
- Test long English and Turkish labels and content.
- Test the drawer and project dialog at a small viewport height.
- Enable reduced-motion preference and confirm non-essential motion is removed.

## Known limitations

- No screen-reader, voice-control, forced-colours, or mobile assistive-technology pass was completed.
- Contrast values require measurement against final colours and content.
- Browser zoom, text spacing, 320-pixel reflow, Turkish copy, touch-target spacing, and small-height behaviour require manual verification.
- Route interception and exact opener focus restoration require browser-level verification.
- Dependency installation and the automated suite were blocked in this environment during this phase.
