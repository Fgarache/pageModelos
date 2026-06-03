# Copilot Instructions - pageModelos

## Stack and commands

- React 18 + Vite 5 + TypeScript.
- `npm run dev`: local development server.
- `npm run build`: TypeScript check + production build (`tsc && vite build`).
- `npm run preview`: preview production build.
- No test or lint scripts are currently configured.

## Architecture map

- Router and app shell live in [src/App.tsx](../src/App.tsx).
- Root route redirects to `HOME_REDIRECT_PATH` from [src/homeconfig.ts](../src/homeconfig.ts).
- Main pages are in [src/pages](../src/pages): `HomePage`, `ModelosPage`, `ModeloDetail`, `ToursPage`, `RifasPage`, and `toursLocations/TourLocationPage`.
- Shared UI is in [src/components](../src/components).
- Styling is in plain CSS files under [src/styles](../src/styles) plus [src/index.css](../src/index.css) and [src/App.css](../src/App.css).

## Conventions to follow

- Prefer TypeScript (`.ts`/`.tsx`) for new code.
- Keep component and style pairing consistent:
  - component in `src/components/Name.tsx`
  - style in `src/styles/Name.css`
- Use functional components and React hooks.
- Keep config/data centralized instead of hardcoding in components:
  - Home content: [src/data/homeData.ts](../src/data/homeData.ts)
  - Metadata helpers: [src/data/metadata.ts](../src/data/metadata.ts)
  - Firebase data normalization/access: [src/data.ts](../src/data.ts)

## Data and integration notes

- Firebase config is in [src/firebase.config.ts](../src/firebase.config.ts) and uses Vite env vars.
- Required env var: `VITE_FIREBASE_DB_URL`.
- Runtime data loading and normalization logic is concentrated in [src/data.ts](../src/data.ts). Reuse existing normalizers before adding new fetch transforms.

## Important pitfalls

- This project does **not** use CSS Modules; do not introduce `.module.css` unless requested.
- There is one mixed file: [src/components/TinderCards.jsx](../src/components/TinderCards.jsx). Keep compatibility when refactoring nearby code.
- TypeScript is strict (`noUnusedLocals`, `noUnusedParameters` in [tsconfig.json](../tsconfig.json)); remove unused imports/variables.
- Route `/:user` in [src/App.tsx](../src/App.tsx) expects a user alias used by `ModeloDetail`, not an ID.

## Existing docs to link instead of duplicating

- Firebase data behavior and read rules: [READMEfirebase.md](../READMEfirebase.md)
- Deployment steps (Vercel + env vars): [DEPLOYMENT_VERCEL.md](../DEPLOYMENT_VERCEL.md)
