# GitHub Copilot Instructions

You are working in a Next.js 15 monorepo (pnpm + Turborepo).

## Key patterns

- Components: `packages/ui` using shadcn/ui (forwardRef, cn(), CVA, Radix)
- App: `apps/web` using Next.js App Router
- Styling: Tailwind CSS 4, no inline styles
- Testing: Vitest + jest-axe + Storybook
- Design: Follow `docs/references/ui-design-brain-components.md`

## Rules

- Mobile-first (375px → 768px → 1440px)
- Accessible-first (WCAG AA, semantic HTML, ARIA, keyboard nav)
- 80% test coverage threshold
- Conventional commits (no Co-Authored-By)
- Single quotes, 2-space indent, 100 char lines
