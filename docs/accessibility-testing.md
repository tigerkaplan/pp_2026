# Accessibility testing

## Accessibility target

The portfolio is being developed with WCAG 2.2 Level AA as the target. Full compliance is not claimed because the required manual, assistive-technology, browser, contrast, and production-content evidence is not yet complete.

## Automated testing

Jest, React Testing Library, `@testing-library/user-event`, and `jest-axe` cover the skip link, route navigation and current-page state, mobile drawer open state and focus handling, project-dialog semantics and focus handling, full-page project link, theme preference and control state, and representative open/closed component states.

Tests use semantic queries and user-level keyboard interaction. No axe rules are disabled. Automated accessibility tests can detect only a subset of accessibility issues and do not establish full WCAG compliance.

## Current implementation snapshot

Static inspection confirms the following implementation points are present in the current frontend:

- A skip link is implemented and targets the main content landmark.
- The mobile navigation drawer uses dialog semantics, modal behaviour, and a focus-management hook.
- The project modal uses dialog semantics, modal behaviour, and Escape handling.
- The theme toggle is implemented as a keyboard-operable button.
- Global focus-visible styling and a reduced-motion media query are present.

No confirmed accessibility defects were identified during static inspection of the current implementation.

## Structured manual WCAG 2.2 Level AA checklist

All entries below are pending manual verification and should remain `NOT TESTED` until a real browser pass is completed.

### Keyboard and focus

| Test ID | WCAG area | Page or component | Preconditions | Test steps | Expected result | Actual result | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M-01 | 2.1.1 Keyboard, 2.4.3 Focus Order | All pages | App running locally in Chrome or Edge at a desktop viewport | Start at the top of the page and press Tab and Shift+Tab repeatedly. | Focus reaches all interactive elements in a logical order with no traps or skipped controls. | Not recorded yet | NOT TESTED | Manual observation | Use the home page first. |
| M-02 | 2.4.1 Bypass Blocks | All pages | Page contains enough content to require scrolling | Press Tab from the top of the page until the skip link appears. Activate it. | Focus moves to the main content region and the browser viewport shifts to the main content. | Not recorded yet | NOT TESTED | Manual observation | Confirm the target exists and is reachable. |
| M-03 | 2.4.3 Focus Order | Navigation and content pages | App open at desktop width | Navigate through header links, theme toggle, and main content links using only the keyboard. | Focus order matches the visual reading order and remains predictable. | Not recorded yet | NOT TESTED | Manual observation | Include route-based pages. |
| M-04 | 2.4.7 Focus Visible | Interactive controls | App open in light and dark themes | Tab to links, buttons, and the theme toggle. | Each interactive control shows a visible focus indicator that is clearly distinguishable. | Not recorded yet | NOT TESTED | Manual observation | Pay attention to the focus ring against adjacent colours. |

### Mobile drawer and project modal

| Test ID | WCAG area | Page or component | Preconditions | Test steps | Expected result | Actual result | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M-05 | 2.1.2 No Keyboard Trap, 2.4.3 Focus Order | Mobile navigation drawer | Browser width set to approximately 390 px | Open the drawer, then press Tab and Shift+Tab repeatedly. | Focus remains inside the drawer while open and cannot be lost to background content. | Not recorded yet | NOT TESTED | Manual observation | Confirm both the close button and nav links are reachable. |
| M-06 | 2.1.2 No Keyboard Trap | Mobile navigation drawer | Drawer open | Press Escape while the drawer is open. | The drawer closes and focus returns to the invoking control. | Not recorded yet | NOT TESTED | Manual observation | Confirm the drawer does not remain open. |
| M-07 | 2.4.3 Focus Order | Mobile navigation drawer | Drawer opened from a route page | Close the drawer via the close button, a navigation link, or Escape. | Focus is restored to the element that opened the drawer. | Not recorded yet | NOT TESTED | Manual observation | Confirm restoration on both close methods. |
| M-08 | 2.1.2 No Keyboard Trap, 2.4.3 Focus Order | Project modal | Open a project detail modal from the projects route | Press Tab and Shift+Tab repeatedly inside the modal. | Focus stays within the modal while it is open and reaches the close button and interactive controls. | Not recorded yet | NOT TESTED | Manual observation | Use the modal opened from the projects section. |
| M-09 | 2.1.2 No Keyboard Trap | Project modal | Modal open | Press Escape while the modal is open. | The modal closes and the previous page state is restored. | Not recorded yet | NOT TESTED | Manual observation | Confirm the modal closes reliably. |
| M-10 | 2.4.3 Focus Order | Project modal | Modal opened from a route | Close the modal and return to the previous page. | Focus returns to the element that opened the modal. | Not recorded yet | NOT TESTED | Manual observation | Include both browser back and close-button flows if available. |
| M-11 | 2.1.1 Keyboard, 4.1.2 Name, Role, Value | Theme toggle | App open in desktop viewport | Use Tab to reach the theme toggle and press Space or Enter. | The control is keyboard operable and announces its current state clearly. | Not recorded yet | NOT TESTED | Manual observation | Verify both light and dark states. |

### Zoom, reflow, spacing, and motion

| Test ID | WCAG area | Page or component | Preconditions | Test steps | Expected result | Actual result | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M-12 | 1.4.10 Reflow | All pages | Browser zoom set to 200% in Chrome or Edge | Zoom to 200% and continue navigating the page. | Content reflows without losing information or introducing two-dimensional scrolling. | Not recorded yet | NOT TESTED | Manual observation | Check both the nav and content areas. |
| M-13 | 1.4.10 Reflow | All pages | Browser responsive mode or narrow viewport | Resize to approximately 320 CSS pixels wide and review the page. | The layout reflows without clipping, overlap, or horizontal scrolling. | Not recorded yet | NOT TESTED | Manual observation | Focus on the project pages and drawer. |
| M-14 | 1.4.12 Text Spacing | All pages | Enable WCAG text-spacing overrides in the browser or OS | Increase line height, letter spacing, word spacing, and paragraph spacing. | Text remains readable without overlap, clipping, or content loss. | Not recorded yet | NOT TESTED | Manual observation | Include long paragraphs and navigation text. |
| M-15 | 2.2.2 Pause, Stop, Hide | All pages | Reduced-motion preference enabled in the OS or browser | Reload the page and interact with the UI. | Non-essential motion is reduced or removed. | Not recorded yet | NOT TESTED | Manual observation | Confirm motion does not block understanding. |
| M-16 | 2.1.1 Keyboard, 1.4.10 Reflow | Small viewport-height pages | Browser height reduced to a small value | Open the drawer and modal at a short viewport height. | Controls remain reachable and content remains usable without clipping. | Not recorded yet | NOT TESTED | Manual observation | Include the drawer and modal in a compact window. |

### Contrast and colour independence

| Test ID | WCAG area | Page or component | Preconditions | Test steps | Expected result | Actual result | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M-17 | 1.4.3 Contrast (Minimum) | Light theme | App open in light theme | Inspect text, controls, focus indicators, and borders against their backgrounds. | Text and controls meet the minimum contrast target for normal-sized text and UI components. | Not recorded yet | NOT TESTED | Manual observation and contrast measurement | Measure against the final colours used in the deployed UI. |
| M-18 | 1.4.3 Contrast (Minimum) | Dark theme | App open in dark theme | Inspect text, controls, focus indicators, and borders against their backgrounds. | Text and controls remain readable and meet the minimum contrast target. | Not recorded yet | NOT TESTED | Manual observation and contrast measurement | Repeat for both theme states. |
| M-19 | 2.4.7 Focus Visible, 1.4.11 Non-text Contrast | Focus indicators | App open in both themes | Tab to key controls and compare the focus ring with surrounding colours. | The focus indicator is visually distinct and sufficiently contrasted. | Not recorded yet | NOT TESTED | Manual observation | Include the skip link and drawer close button. |
| M-20 | 1.4.3 Contrast, 1.4.11 Non-text Contrast | Forced-colours mode | Windows high-contrast mode enabled or browser forced-colours mode engaged | Reload the page and inspect the UI. | Essential content, states, and focus indicators remain perceivable without relying on colour alone. | Not recorded yet | NOT TESTED | Manual observation | This is a separate check from standard contrast. |

### Semantics and assistive technology

| Test ID | WCAG area | Page or component | Preconditions | Test steps | Expected result | Actual result | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M-21 | 2.5.5 Target Size | Interactive controls | App open on a touch-capable device or emulator | Review the size of links, buttons, and the theme toggle. | Touch targets are large enough to be used comfortably without accidental activation. | Not recorded yet | NOT TESTED | Manual observation | Include the hamburger button and drawer close button. |
| M-22 | 2.4.6 Headings and Labels, 1.3.1 Info and Relationships | Long English content pages | Open a page with realistic long-form content | Review heading order and landmark structure while navigating the page. | Headings form a logical hierarchy and landmarks are clearly distinct. | Not recorded yet | NOT TESTED | Manual observation | Include route-based project and content pages. |
| M-23 | 2.4.6 Headings and Labels, 4.1.2 Name, Role, Value | Controls and links | App open on relevant pages | Inspect the accessible names of links, buttons, and controls. | Names are meaningful and match the visible UI. | Not recorded yet | NOT TESTED | Manual observation | Verify form-like controls and icon-only buttons. |
| M-24 | 1.3.1 Info and Relationships, 2.4.6 Headings and Labels | Realistic English content | Open a page containing longer text blocks and route navigation | Review the page structure and content flow. | Content remains understandable, well structured, and readable at realistic lengths. | Not recorded yet | NOT TESTED | Manual observation | This should represent typical portfolio content. |
| M-25 | 4.1.2 Name, Role, Value, 1.3.1 Info and Relationships | Screen-reader review | Windows machine with Edge and Narrator, or equivalent assistive technology available | Navigate the page using a screen reader and review headings, landmarks, dialogs, and control names. | The screen reader announces the structure and control names clearly. | Not recorded yet | NOT TESTED | Manual observation | Record any unexpected announcements. |

## Recommended Manual Test Order

1. Keyboard and focus (M-01 to M-04) — Open the local app in Chrome or Edge at http://localhost:3000, then use Tab and Shift+Tab on the page to verify focus order and visible focus.
2. Mobile navigation drawer (M-05 to M-07) — Resize the browser to about 390 px wide, open the drawer, and test Tab, Shift+Tab, Escape, and focus return.
3. Project modal (M-08 to M-10) — Open a project detail modal from the projects section and test focus containment, Escape dismissal, and focus restoration.
4. Zoom and reflow (M-12 to M-13) — In Chrome or Edge, zoom to 200% and resize to about 320 CSS px wide to confirm reflow without horizontal scrolling.
5. Text spacing (M-14) — Apply WCAG text-spacing overrides and inspect for clipping, overlap, or content loss.
6. Contrast (M-17 to M-20) — Review light theme, dark theme, focus indicator contrast, and forced-colours behaviour.
7. Reduced motion (M-15) — Enable reduced-motion preference in the operating system or browser and reload the app.
8. Forced colours (M-20) — Turn on Windows high contrast or browser forced-colours mode and review the interface.
9. Touch targets (M-21) — Review the size of interactive controls on a touch-capable device or emulator.
10. Screen-reader review (M-25) — Use Edge with Narrator or another available screen reader and review the page structure and control names.

## Local application preparation

Run the current Next.js application locally with:

```bash
npm run dev
```

Expected local URL: http://localhost:3000

Do not claim browser-based manual results until the local app has been opened and the checks above have been performed.

## Project image follow-up

- Missing project images were discovered during manual browser preparation for the Projects routes.
- The Projects visual and accessibility review was temporarily blocked until the broken-image failure was addressed.
- The fix implemented a semantic placeholder for projects that do not currently have a real local image asset, so the card and detail view no longer produce broken-image requests or 404s.
- Real project assets remain pending if the portfolio content is later updated with approved screenshots.
- The manual Projects review must be repeated after the fix in a real browser.

## Project modal routing follow-up

- A manual browser test confirmed that soft navigation from /projects did not open the intercepted modal preview and instead resolved directly to the full project route.
- Direct navigation to /projects/[slug] remains expected to render the full project-detail page.
- The modal preview link on the Projects cards has been clarified so the preview interaction uses the project route while the full-page details link remains separate.
- The modal manual test remains RETEST REQUIRED until the user confirms the behavior in a real browser.

## Known limitations

- No screen-reader, voice-control, forced-colours, or mobile assistive-technology pass has been completed yet.
- Contrast values require measurement against the final colours and content.
- Browser zoom, text spacing, 320-pixel reflow, touch-target spacing, and small-height behaviour are still pending manual verification.
- Exact opener focus restoration requires browser-level verification.
