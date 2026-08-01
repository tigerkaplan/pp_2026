# Project and skill content

Project content is stored as JSON in `content/projects`. The TypeScript registry validates each registered file and adapts it to the stable project shape used by cards, Preview modals, standalone pages, metadata, Open Graph images, sitemap entries and static routes.

To add a project:

1. Copy `content/templates/project.template.json`.
2. Rename the file to match the project slug.
3. Fill only verified content.
4. Add `skillIds` from the approved skill catalogue.
5. Add media and meaningful alt text.
6. Import and register the JSON file in `content/projects/projects.index.ts`.
7. Run the content tests, full tests and production build.

Templates are examples only. They must never be imported by a runtime registry.

Skills use the approved groups in `content/skills/skills.groups.json` and the statuses `applied`, `practical-evidence` or `developing-knowledge`. Evidence relationships are declared once through project `skillIds`; they are not duplicated in skill records. Keep `skills.json` empty until public claims have verified evidence.
