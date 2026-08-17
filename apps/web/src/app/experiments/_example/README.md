# _example — reference template

Copy this whole folder to start a real experiment: drop the underscore, pick a real
slug (`experiments/nz-baby-names-2024/`), fill in every section below, delete this
line. Add the corresponding entry to `apps/web/src/lib/experiments.ts` and to
`INDEX.md` at the repo root once it ships (alive or dead — list it either way).

## Pitch

One or two sentences. What's the question, and why might the answer be weird, funny,
or surprising? If you can't state this in two sentences, the experiment isn't scoped
yet.

## Data source

Name the exact dataset and where it comes from (Stats NZ table ID, Hansard XML feed,
a specific API endpoint). Link to it. Never describe a source you haven't actually
pulled data from — if you're planning to use a source but haven't confirmed it has
the data you need, say that explicitly instead of asserting it.

## Verdict

**alive** or **dead** — and why. A dead experiment is not a failure to hide; it's a
recorded attempt. "The data doesn't actually support this angle" or "the effect size
was too small to be interesting" are complete, honest verdicts. Never overstate a
weak result to make the experiment look more alive than it is.

## What it looks like

One screenshot or a one-line description of what the page shows, so someone scanning
`INDEX.md` doesn't have to open the route to know what they'll find.
