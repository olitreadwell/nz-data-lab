Generate production-grade UI using real component patterns and best practices from 60+ documented interface components. Ensures modern, minimal, SaaS-quality output grounded in design system conventions rather than generic AI patterns.

Read the full component reference at `docs/references/ui-design-brain-components.md` and the skill instructions at `docs/references/ui-design-brain-skill.md` before generating any UI code.

## Workflow

1. **Identify components** — Read the user's request, determine which UI components are needed, reference the component docs
2. **Apply best practices** — Follow each component's specific rules for layout, interaction, typography, spacing, states
3. **Choose design direction** — Creative/Portfolio, Apple Minimal, Modern SaaS, Enterprise, or Data Dashboard
4. **Generate code** — React + Tailwind CSS, 8px grid, CSS variables, semantic HTML, ARIA, mobile-first (375/768/1440px)

## Design Principles

1. **Restraint over decoration** — fewer elements, highly refined, whitespace is a feature
2. **Typography carries hierarchy** — distinctive display fonts with clean body fonts, weight contrast
3. **One strong color moment** — neutral palette first, then one confident accent
4. **Spacing is structure** — 8px grid, tighter gaps group, generous gaps separate
5. **Accessibility is non-negotiable** — WCAG AA contrast, focus indicators, semantic HTML, keyboard nav

## Anti-Patterns — Never Do These

- Rainbow badges, modal inside modal, disabled submit with no explanation
- Spinner for predictable layouts (use skeletons), "Click here" links
- Hamburger on desktop, auto-advancing carousels, placeholder-only fields
- Equal-weight buttons, tiny text (<12px)

## This Project

- Components live in `packages/ui` following shadcn/ui patterns (forwardRef, cn(), CVA, Radix)
- Theme system uses CSS variables — same components, different design directions
- Every component needs: stories + unit test + axe a11y test

$ARGUMENTS
