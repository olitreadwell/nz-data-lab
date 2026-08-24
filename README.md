# nz-data-lab

Small experiments digging through New Zealand public data for the funny and the
surprising.

## Live now

- **The sheep index**: New Zealand's national flock has nearly halved since
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
