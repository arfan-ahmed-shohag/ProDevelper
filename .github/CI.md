# Pull request CI

The project uses Next.js 16.4.3, TypeScript, ESLint 9, Tailwind CSS 4, and
pnpm 12.16.1 (declared in `package.json`). CI uses Node.js 24, matching the
local runtime's major version and satisfying Next.js's Node >=20.9 requirement.
All actions are pinned to reviewed release commit SHAs. The pnpm setup action
supports pnpm 12 and reads its version from `package.json`.

## Workflows and required checks

| File | Workflow | Required status check | Behavior |
| --- | --- | --- | --- |
| `workflows/build-check.yml` | Build Check | `build-check` | Frozen pnpm install, then the existing `pnpm run build` production build. |
| `workflows/lint-check.yml` | Lint Check | `lint-check` | Frozen pnpm install, then the existing `pnpm run lint`, without fixing or formatting. |
| `workflows/merge-conflict-check.yml` | Merge Conflict Check | `merge-conflict-check` | GitHub mergeability API check against the current `main`, with bounded retries and a commit status on each PR head. |

Build and lint use read-only tokens, do not persist checkout credentials, and
cache the pnpm dependency store using the lockfile. Each workflow has a timeout.
New commits cancel obsolete build/lint runs for the same PR. No deployment,
publication, branch updates, or conflict resolution takes place.

All three workflows handle PRs opened, reopened, updated with new commits, or
edited while targeting `main`. GitHub's `edited` event covers retargeting a PR
to `main`, but also fires on title/description edits. Those edits deliberately
rerun the checks: skipping a required job can count as success. Drafts are also
checked, so becoming ready for review needs no duplicate run. Build and lint
have no `push` trigger, avoiding duplicate branch and PR builds.

## Conflicts, base updates, and security

GitHub may not run ordinary `pull_request` workflows when a PR has conflicts.
The conflict workflow uses `pull_request_target` and never checks out or runs
PR code. Its only executed script is embedded in the trusted workflow. It does
not read PR titles, bodies, branch names, artifacts, or dependency scripts as
executable input. It requests only `contents: read`, `pull-requests: read`, and
`statuses: write`; the write permission is needed solely to report the required
status on PR head commits, not to change code, branches, PRs, or rulesets.

A `pull_request_target` run's native check is associated with the base commit,
not reliably with the PR head. The explicit `merge-conflict-check` commit status
ensures the required check is available on the PR, including fork PRs.

Every push to `main` reevaluates all open PRs targeting `main` and updates their
head statuses. PR-triggered runs also scan all open PRs. One concurrency group
serializes these writers without cancelling an active run; because every run
checks all open PRs, replacing an older pending run cannot lose another PR's
evaluation. At most four PRs are polled concurrently. Previous results are
marked pending first. A result must reference the latest `main` SHA, and the PR
head/base are rechecked before publishing. API failures or persistently unknown
mergeability fail closed with an error status, never a passing result. A PR's
individual status is independent of conflicts in another PR; the workflow's
aggregate job fails if any PR cannot be merged or verified.

Base changes do not reliably emit PR `synchronize` events. Build/lint therefore
rely on the strict up-to-date rule below: updating the PR with `main` creates a
new PR head and reruns those checks. The API check detects textual merge
conflicts; it does not replace build/lint, reviews, or branch freshness rules.

## Manually configure Protect Main Branch

1. Review, commit, and push these local changes using your normal PR process.
   The trusted conflict workflow must be present on the base/default branch
   before `pull_request_target` can use it. Bootstrap the workflow definitions
   before making their new checks required; otherwise the bootstrap PR can
   wait for a check that cannot run yet.
2. Let all three checks run on a PR targeting `main`. The conflict check also
   runs on the push that installs its workflow on `main`. GitHub's check picker
   may not list new names until they have reported a result within the last
   seven days.
3. Go to **Settings > Rules > Rulesets > Protect Main Branch**. Confirm that
   its target includes `main` and enable **Require status checks to pass**.
4. Add exactly `build-check`, `lint-check`, and `merge-conflict-check`.
   Where GitHub offers an expected source, select **GitHub Actions**. Use the
   individual check names, not the title-cased workflow names.
5. Enable **Require branches to be up to date before merging** under the
   required-status-check rule, then save your changes. When `main` advances,
   update the PR branch through your normal process and wait for fresh checks.
   A conflicting PR may show build/lint as pending until its conflicts are
   resolved; the conflict status reports the reason.

These workflows do not configure a merge queue. If one is enabled later,
add `merge_group` support and validate the required checks for that setup.
Organization policies or fork workflow approval requirements can still delay
runs; no additional PAT or repository secret is required by these workflows.

## Local validation and manual commit

Run `pnpm install --frozen-lockfile`, `pnpm run lint`, and `pnpm run build`.
The existing `next/font/google` configuration downloads Geist fonts at build
time, so the production build needs access to Google Fonts. It self-hosts those
fonts at runtime. Do not replace the real build with a mocked/offline build.

Validate all three YAML files with `actionlint` when available. Actual GitHub
event dispatch, fork permissions, concurrency, and Ruleset enforcement must be
verified on GitHub after you publish the reviewed changes yourself.

For manual staging and committing, from this repository:

```sh
git diff --check
git add .github/workflows/build-check.yml .github/workflows/lint-check.yml .github/workflows/merge-conflict-check.yml .github/CI.md
git diff --cached
git commit -m "Add separate PR build, lint, and merge conflict checks"
```

Then push your intended working branch with `git push -u origin YOUR_BRANCH`.
Replace `YOUR_BRANCH` with the branch you intend to submit through your normal
PR process; no branch has been created or switched by this implementation.

References:

- [GitHub workflow event behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- [GitHub mergeability API](https://docs.github.com/en/rest/pulls/pulls#get-a-pull-request)
- [GitHub commit statuses](https://docs.github.com/en/rest/commits/statuses)
- [GitHub available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#require-status-checks-to-pass-before-merging)
