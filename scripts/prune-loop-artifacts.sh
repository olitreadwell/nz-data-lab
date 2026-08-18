#!/bin/bash
# Prune the microsite loop's own merged worktrees, branches, and stale agent
# processes. Safe by construction: only ever touches feat/microsite-loop-*
# (never fix/*, which is the quality loop's active lane, and never main).
# A worktree is removed only when its branch is fully merged into
# origin/main and the worktree has no uncommitted changes. Everything else
# is reported and left alone, so a stalled agent's in-progress work is never
# destroyed. Run it once per loop iteration, before the session wraps up.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO"

git fetch origin main --quiet 2>/dev/null || true

echo "== prune: merged microsite-loop worktrees, branches, stale agents =="

# Drop bookkeeping for worktrees whose directories were already deleted.
git worktree prune

pruned=0
skipped=0

# Pair each worktree path with its checked-out branch. Detached worktrees
# have no branch line and are not ours, so they are skipped by the case.
while IFS=$'\t' read -r path branch; do
  case "$branch" in
    feat/microsite-loop-*)
      if [ -n "$(git -C "$path" status --porcelain 2>/dev/null)" ]; then
        echo "skip (dirty, may hold a stalled agent's work): $path ($branch)"
        skipped=$((skipped + 1))
        continue
      fi
      if ! git merge-base --is-ancestor "$branch" origin/main 2>/dev/null; then
        echo "skip (not merged): $path ($branch)"
        skipped=$((skipped + 1))
        continue
      fi
      # Kill stale agent processes with files open in this worktree before
      # removing it. lsof +D is recursive, so a process whose cwd is any
      # subdirectory of the worktree is caught.
      pids="$(lsof +D "$path" 2>/dev/null | awk 'NR>1 {print $2}' | sort -u)"
      if [ -n "$pids" ]; then
        echo "killing stale agents in $path: $(echo $pids | tr '\n' ' ')"
        kill $pids 2>/dev/null || true
        sleep 1
        kill -9 $pids 2>/dev/null || true
      fi
      if git worktree remove "$path" 2>/dev/null && git branch -d "$branch" >/dev/null 2>&1; then
        echo "pruned: $path ($branch)"
        pruned=$((pruned + 1))
      else
        echo "skip (remove failed): $path ($branch)"
        skipped=$((skipped + 1))
      fi
      ;;
  esac
done < <(git worktree list --porcelain | awk '/^worktree /{path=$2} /^branch /{gsub("refs/heads/", "", $2); print path "\t" $2}')

# Merged loop branches that no longer have a worktree (e.g. one pruned by
# hand). git branch -d refuses anything not fully merged, so this is safe.
while read -r branch; do
  if git branch -d "$branch" >/dev/null 2>&1; then
    echo "pruned branch: $branch"
    pruned=$((pruned + 1))
  else
    echo "skip branch (not merged or in use): $branch"
    skipped=$((skipped + 1))
  fi
done < <(git branch --merged origin/main | sed 's/^[*+ ]*//' | grep '^feat/microsite-loop-' || true)

echo "== prune done: $pruned removed, $skipped skipped =="
