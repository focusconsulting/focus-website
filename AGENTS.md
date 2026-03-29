# Agents

## Stack

- Astro with Tailwind CSS and optional React support.
- Tailwind CSS v4 is configured through Vite.
- React support is enabled, but the current site is Astro-first.

## Page Authoring

- Default: output static HTML pages (`.astro` files) with Tailwind styling.
- Interactive pages that need client-side state or event handling should use React components.
- Content-heavy static pages (e.g. blogs) may use Markdown (`.md`) files.
- If it's unclear which approach to use for a given page, ask before proceeding.

## Repo Conventions

- Pages live in `src/pages/`.
- Compose page sections in components under `src/components/page-sections/<page-folder>/`.
- Shared reusable components under `src/components/shared/`.
- Shared site chrome lives in `src/layouts`.
- Shared styles and utility classes live in `src/styles/global.css`; prefer reusing them over adding repeated one-off styling.
- Prefer Astro/HTML solutions for static or lightly interactive UI patterns before introducing React.
- Preserve the existing brand system, typography choices, and spacing patterns unless the task explicitly changes them.
- For small amounts of section-specific content, inline local data in the component is acceptable. Introduce shared data files only when content is reused or clearly benefits from separation.
