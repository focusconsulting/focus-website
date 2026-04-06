# Focus Website

Marketing site for Focus, built with Astro and Tailwind CSS v4. The current site is Astro-first, with React available when a page genuinely needs client-side state or interactivity.

## Stack

- Astro 6
- Tailwind CSS v4 via `@tailwindcss/vite`
- Optional React support through `@astrojs/react`
- Node.js `>=22.12.0`

## Commands

All commands run from the repo root:

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the local Astro dev server |
| `npm run build` | Build the site into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run astro -- --help` | Show Astro CLI help |

## Project Structure

```text
/
├── public/
├── src/
│   ├── components/
│   │   └── page-sections/
│   │   └── shared/
│   ├── layouts/
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── AGENTS.md
├── astro.config.mjs
├── CLAUDE.md
├── package.json
└── tsconfig.json
```

## Architecture Notes

- Pages live in `src/pages/`.
- Compose page sections in components under `src/components/page-sections/<page-folder>/`.
- Shared reusable components under `src/components/shared/`.
- Shared site chrome lives in `src/layouts`.
- Shared styles and utility classes live in `src/styles/global.css`; prefer reusing them over adding repeated one-off styling.
- Google Fonts are loaded in `src/layouts/Layout.astro`.
- React is enabled in the project config, but the current homepage is built with `.astro` HTML first components.

## Working Guidelines

- Prefer `.astro` components for static sections and content-driven layouts.
- Add React only when interactivity or client-side state actually requires it.
- Use Markdown (`.md`) for content-heavy static pages such as blogs, long-form resources, or editorial content.
- Keep layout and brand decisions consistent with the existing theme classes in `src/styles/global.css`.
- Static assets (images, favicons) live in `public/`.
- When editing page sections, keep changes localized to the relevant section component where possible.
- Section-specific content is inlined in the component; no separate data or content directories exist yet.
