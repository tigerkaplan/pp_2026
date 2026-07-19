# Decisions Log

## 2026-07-19 | DEC-001
- Decision: The portfolio is English-only.
- Reason: The current scope is a frontend-only English portfolio experience.
- Status: Accepted

## 2026-07-19 | DEC-002
- Decision: The root document language remains `lang="en"`.
- Reason: The site should preserve its default English language semantics.
- Status: Accepted

## 2026-07-19 | DEC-003
- Decision: Standard route-based pages and navigation are used.
- Reason: The current architecture is route-based and fits the portfolio structure.
- Status: Accepted

## 2026-07-19 | DEC-004
- Decision: No accordion landing page will be used.
- Reason: The current scope excludes accordion-based landing-page patterns.
- Status: Accepted

## 2026-07-19 | DEC-005
- Decision: No accordion-based content architecture will be used.
- Reason: The current scope remains focused on standard route content.
- Status: Accepted

## 2026-07-19 | DEC-006
- Decision: No expandable-card navigation will be used.
- Reason: The current scope avoids additional interaction patterns beyond the modal preview.
- Status: Accepted

## 2026-07-19 | DEC-007
- Decision: The project modal is an optional preview only.
- Reason: Project pages remain independently route-accessible and crawlable.
- Status: Accepted

## 2026-07-19 | DEC-008
- Decision: Project pages remain independently route-accessible and crawlable.
- Reason: The modal preview should not replace the canonical project routes.
- Status: Accepted

## 2026-07-19 | DEC-009
- Decision: YAML is used for GitHub Actions frontend-quality validation.
- Reason: CI should validate lint, typecheck, tests and the production build on supported runners.
- Status: Accepted

## 2026-07-19 | DEC-010
- Decision: Twig, XML, XPath and SOAP are excluded from the current scope.
- Reason: The task remains focused on frontend accessibility and testing.
- Status: Accepted

## 2026-07-19 | DEC-011
- Decision: Backend, ASP.NET Core, SQL Server and database work are deferred.
- Reason: The current phase is frontend-only.
- Status: Accepted

## 2026-07-19 | DEC-012
- Decision: Playwright is deferred until the frontend/Jest baseline is stable.
- Reason: The current scope uses Jest-based frontend testing and accessibility coverage.
- Status: Accepted

## 2026-07-19 | DEC-013
- Decision: Local Windows build evidence and GitHub Actions/Linux build evidence must be recorded separately.
- Reason: The current local build failure appears environment-specific and needs independent CI confirmation.
- Status: Accepted
