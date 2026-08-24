# nz-data-lab

Small experiments digging through New Zealand public data for the funny and the
surprising. This is the public site repo: only published experiments live here,
one at a time. The working repo (`nz-data-lab-private`) holds everything else.

## Live now

- **The sheep index** — New Zealand's national flock has nearly halved since
  1994, from 49.5 million sheep to 23.3 million. Data from the Stats NZ
  Aotearoa Data Explorer, fetched at deploy time.

## Stack

- Next.js 16, React 19.2, TypeScript
- Tailwind CSS 4 + SCSS hybrid, shadcn/ui (Base UI primitives)
- Vitest + Testing Library + jest-axe (unit/a11y), Playwright + `@axe-core/playwright`
- Monorepo: Turborepo, npm workspaces

## Quick start

```bash
npm install
npm run dev
```

## Publishing an experiment

Work happens in `nz-data-lab-private`. When an experiment ships:

1. Copy the experiment's files into this repo.
2. Add its slug to `apps/web/src/lib/published-microsites.ts`.
3. Add its headline stat to `apps/web/src/app/page.tsx` if it earns one.
4. Commit, push, and Vercel deploys.

Never commit secrets here. Env vars live in Vercel, not in the repo.
