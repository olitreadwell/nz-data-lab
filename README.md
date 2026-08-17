# nz-data-lab

[https://olitreadwell.github.io/nz-data-lab](https://olitreadwell.github.io/nz-data-lab)

Small experiments digging through New Zealand public data (Stats NZ, Hansard
transcripts, and whatever else turns up something weird, funny, or surprising).

Three things this repo is for, at once:

1. **Explore NZ public data** for the interesting stuff — not a polished analytics
   platform, a pile of scrappy experiments. Many small attempts beat one big one; dead
   experiments stay listed, not deleted.
2. **Practice directing Claude (Sonnet) to orchestrate a cheaper model (Haiku)** for the
   mechanical parts of building each experiment — scaffolding, boilerplate tests,
   repetitive fills. See `apps/web/src/app/experiments/_example/ORCHESTRATION.md` for
   the template that records how that split went for each experiment.
3. **Turn what worked into tutorials** other people can actually follow. See
   `TUTORIALS.md` and the `_example/TUTORIAL.md` template.

Never a fabricated data source, a fabricated stat, or a "this worked" claim that isn't
backed by a real run.

## Stack

- **Framework:** Next.js 16, React 19.2, TypeScript
- **Styling:** hybrid Tailwind CSS 4 + SCSS (component identity/variants) reading from
  one CSS-variable token system, plus shadcn/ui (Base UI primitives, base-nova style)
  for interactive components — see `packages/ui/components.json`
- **Testing:** Vitest + Testing Library + jest-axe (unit/a11y), Playwright +
  `@axe-core/playwright` (e2e/a11y)
- **Components:** Storybook
- **Monorepo:** Turborepo, npm workspaces
- **Optional, per-experiment:** gsap, three, `@react-three/fiber` + `drei` +
  `postprocessing`, leva — installed in `apps/web` but only worth reaching for on
  experiments that actually need animation or 3D. Don't import them into an experiment
  that doesn't need them.

## Quick start

```bash
npm install
npm run dev
```

Homepage at http://localhost:3000, Storybook at http://localhost:6006.

## Experiments

The deployed site is a single page: the current experiment (the Sheep Index) lives
directly on the home page (`apps/web/src/app/page.tsx`), with its data module in
`apps/web/src/lib/sheep-data.ts` and its chart in `apps/web/src/components/SheepChart.tsx`.
Each experiment's writeup (pitch, data source, verdict, orchestration notes) lives in
`docs/experiments/<slug>/`.

Start a new experiment by copying `apps/web/src/app/experiments/_example/` (an
underscore-prefixed folder — not routed by Next.js, so it's a template, not a live
page). When one ships, add its section to the home page and a line to `INDEX.md` at the
repo root. If it's tutorial-worthy, add a line to `TUTORIALS.md` too.

## Node version

`.nvmrc` is the single source of truth. `mise` and `asdf` read it automatically.

```bash
nvm use   # or: mise install / asdf install nodejs
```

## Package manager

npm. The lockfile (`package-lock.json`) is committed.

## Scripts

| Script                  | Description                                |
| ----------------------- | ------------------------------------------ |
| `npm run dev`           | Start all dev servers                      |
| `npm run build`         | Build all packages and apps                |
| `npm run lint`          | ESLint all packages                        |
| `npm run format`        | Prettier format all files                  |
| `npm run type-check`    | TypeScript check                           |
| `npm test`              | Run unit tests                             |
| `npm run test:coverage` | Tests with coverage report (60% threshold) |
| `npm run test:e2e`      | Playwright E2E tests                       |
| `npm run test:a11y`     | Accessibility tests                        |
| `npm run storybook`     | Storybook dev server                       |

## Git hooks

`pre-commit` runs `lint-staged` — Prettier formats every staged file, ESLint autofixes
the JS/TS ones. The commit succeeds unless ESLint hits an unfixable **error** (warnings
don't block).

Bypass when you need to:

```bash
git commit --no-verify
```

CI lint, unit tests, and e2e are advisory (`continue-on-error: true`). Only
**type-check + build + CodeQL** can fail a PR check.

## Deploying

The site deploys to GitHub Pages from `main` via
`.github/workflows/deploy_github_pages.yml`. The app builds as a static export
(`output: 'export'` in `apps/web/next.config.ts`), so GitHub Pages serves it
with no server.

- The workflow runs on push to `main`, manual dispatch, and a daily schedule
  (the sheep-index experiment is a build-time snapshot, so the scheduled
  redeploy keeps its Stats NZ numbers fresh).
- The Pages base path (`/nz-data-lab`) is injected as `NEXT_PUBLIC_BASE_PATH`
  by the workflow; it stays empty for local dev and Vercel builds.
- Static export means no API routes and no dynamic rendering. The
  `/api/health` route was removed for this reason; the sheep index fetches
  Stats NZ data at build time instead of on each request, falling back to a
  committed snapshot when the API blocks the build runner. Add a
  `STATS_NZ_SUBSCRIPTION_KEY` repo secret to make the daily refresh hit the
  live API from CI.
- One-time setup: in the repo's Settings → Pages, set Source to "GitHub
  Actions" so the workflow's `actions/deploy-pages` step is allowed to publish.

The Vercel workflows (`.github/workflows/deploy_preview.yml`,
`deploy_preproduction.yml`, `deploy_production.yml`) remain available for
server-rendered previews and production deploys.

## Optional integrations

Inherited from the base template — not currently used by nz-data-lab, but available on
integration branches if a future experiment needs auth, a database, a CMS, or
transactional email:

```bash
git merge origin/integration/prisma
git merge origin/integration/kinde-auth
```

See [docs/integrations/README.md](docs/integrations/README.md) for the full list.

## Docs

- [Getting started](docs/getting-started.md)
- [AI prompts](docs/ai-prompts.md)
- [Integrations](docs/integrations/README.md)
- [Contributing](CONTRIBUTING.md)
- [Experiment index](INDEX.md)
- [Tutorials](TUTORIALS.md)
