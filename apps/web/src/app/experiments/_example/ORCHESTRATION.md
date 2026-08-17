# _example — orchestration log template

Goal #2 of nz-data-lab: practice directing a strong model (Sonnet) to hand off the
mechanical parts of an experiment to a cheaper model (Haiku). Fill this in for every
real experiment — it's the record of what that split actually looked like, kept honest
by pasting real prompts and real output, not summarizing them.

## Spec given to Haiku

Paste the actual prompt handed to the cheap model — the data shape, the component to
scaffold, the test file to stub. A good spec is tight enough that "obviously wrong" is
mechanically checkable (build fails, test fails, lint fails) rather than a judgment
call.

```
<paste the real prompt here>
```

## What came back

Paste (or link to the commit/diff of) what the cheap model actually produced. Don't
summarize it into "it worked" — show the output so a future reader can judge the spec
quality themselves.

## What needed fixing

Be specific and honest: wrong data shape, missed an edge case, subtle a11y miss, styling
that didn't match the token system. If nothing needed fixing, say that — it's a useful
data point on how tight the spec was.

## Verdict on the split

Was this a good candidate for cheap-model work, or did it actually need the strong model
throughout? This is the part worth feeding back into
`~/.claude/skills/production-landing-page/SKILL.md`'s model-routing table if it reveals
something the table doesn't already cover.
