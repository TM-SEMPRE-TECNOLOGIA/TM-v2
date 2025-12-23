# Repository Guidelines

## Project Structure & Module Organization
- `main.tsx` boots the React app and mounts `App.tsx`.
- `components/` holds feature components; `components/ui/` contains reusable UI primitives.
- `lib/` stores shared utilities, types, and app state (`store.ts`, `types.ts`, `utils.ts`).
- `hooks/` contains custom React hooks (for example `hooks/use-toast.ts`).
- `styles/` contains global styles (`styles/globals.css`).
- `attached_assets/` contains image and text assets used by the UI.

## Build, Test, and Development Commands
- `npm install` installs dependencies from `package-lock.json`.
- `npm run dev` starts the Vite dev server for local development.
- `npm run build` runs TypeScript type-checking and produces a production build.
- `npm run preview` serves the built app locally for verification.

## Coding Style & Naming Conventions
- Use TypeScript + React function components with hooks.
- Follow the existing formatting: 2-space indentation, single quotes, and no semicolons.
- Name components in `PascalCase` (`components/WorkOrders.tsx`) and hooks in `camelCase` prefixed with `use` (`hooks/use-toast.ts`).
- Keep shared UI pieces in `components/ui/` rather than duplicating styles.

## Testing Guidelines
- No automated test runner is configured yet (no `test` script or `tests/` directory).
- If adding tests, keep them close to the feature (`Component.test.tsx`) or create a `tests/` folder and document the choice in the PR.

## Commit & Pull Request Guidelines
- Recent commits use short, imperative, sentence-case messages without prefixes (e.g., “Improve file upload loading animation visibility and reliability”).
- Keep commits focused on a single change.
- PRs should include a concise summary, key UI changes (with screenshots or short clips when applicable), and any follow-up tasks.

## Configuration & Assets
- App configuration is standard Vite + TypeScript (`vite.config.ts`, `tsconfig.json`).
- Add new static assets to `attached_assets/` and reference them via relative paths.
