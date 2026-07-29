# TODO

## Current priority
- [x] Add and validate the GitHub Actions workflow.
- [x] Commit the YAML and project control files.
- [x] Push the accessibility improvements branch.
- [x] Run the Frontend Quality workflow.
- [x] Confirm the Linux production build.
- [x] Record the successful GitHub Actions result.
- [ ] Resolve the local Windows .next/types EPERM problem separately.

## Lint warnings
- [ ] unused `_fill` in ProjectCard.test.tsx
- [ ] unused `_priority` in ProjectCard.test.tsx
- [ ] test mock uses `<img>` instead of `next/image`
- [ ] test mock image accessibility warning
- [ ] unused `error` parameter in global-error.tsx
- [ ] unused eslint-disable directive in block-navigation.js

## Manual accessibility verification
- [x] Address missing project-image handling in the Projects experience.
- [ ] Re-run the manual Projects visual review after the image fallback fix.
- [ ] Re-test the Projects modal soft-navigation flow in a real browser after the routing fix.
- [ ] Keyboard-only navigation review (M-01 to M-04) — see docs/accessibility-testing.md
- [ ] Mobile drawer review in a real browser (M-05 to M-07) — see docs/accessibility-testing.md
- [ ] Project modal review in a real browser (M-08 to M-10) — see docs/accessibility-testing.md
- [ ] Zoom and reflow review (M-12 to M-13) — see docs/accessibility-testing.md
- [ ] Text-spacing review (M-14) — see docs/accessibility-testing.md
- [ ] Contrast review (M-17 to M-20) — see docs/accessibility-testing.md
- [ ] Reduced-motion review (M-15) — see docs/accessibility-testing.md
- [ ] Touch-target review (M-21) — see docs/accessibility-testing.md
- [ ] Screen-reader review (M-25) — see docs/accessibility-testing.md
- [ ] Heading and landmark review (M-22) — see docs/accessibility-testing.md
- [ ] Accessible-name review (M-23) — see docs/accessibility-testing.md
- [ ] Realistic long English-content review (M-24) — see docs/accessibility-testing.md

## Future route-based frontend work
- [ ] Complete Home page
- [ ] Complete About page
- [ ] Complete Experience page
- [ ] Complete Projects content
- [ ] Complete project-detail content
- [ ] Decide whether Blog remains in scope
- [ ] Complete Contact page
- [ ] Add SEO structured data
- [ ] Complete responsive review

## Deferred work
- [ ] Playwright
- [ ] backend development
- [ ] ASP.NET Core
- [ ] SQL Server
- [ ] database development
- [ ] Twig
- [ ] XML
- [ ] XPath
- [ ] SOAP

Do not include Turkish localisation or accordion work.
