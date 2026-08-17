# Experiment index

One line per experiment, alive or dead — every attempt stays listed, nothing gets
deleted when it doesn't work out. Add a row when `apps/web/src/app/experiments/<slug>/`
ships and its entry lands in `apps/web/src/lib/experiments.ts`. Keep this file and that
registry in sync; this is the human-readable mirror of it.

Format: `- [slug](apps/web/src/app/experiments/<slug>) — status — one-line pitch`

- [sheep-index](apps/web/src/app/experiments/sheep-index) — alive — New Zealand's sheep flock has nearly halved since 1994 (49.5m -> 23.3m), shown live from the Stats NZ Aotearoa Data Explorer.
