# Changelog

All notable changes to this project are documented here. Versioning follows
[Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`), independent
of the main [TIGHC](https://github.com/TIGHC/Engine) engine's own version.

## [1.3.0] - 2026-09-10

### Added
- **Releases page (`/releases`)** - lists every TIGHC Engine release, fetched
  live from the GitHub Releases API, with per-platform download links
  (Windows/Linux/macOS) and rendered release notes. Linked from the nav on
  every page. `releases.js` handles both the current asset naming
  (`TIGHC-<platform>-vX.Y.Z`) and the pre-v5.0.0 naming that included a
  gui/cli target segment, so old releases still render sensible labels.

### Changed
- Removed remaining `cli.py` mentions from `index.html`/`engine.html`/
  `legal/privacy.html`, and added macOS to the platform lists on the landing
  page and Engine page, matching Engine v5.0.0 (which dropped the CLI and
  added macOS release builds).

## [1.2.10] - 2026-09-09

### Fixed
- v1.2.9's `html-validate@11` pin needs Node ^22.22.0 or >=24.8.0, but the
  `html-validate` job's `setup-node` step was still on Node 20, so the CLI
  crashed with `fs.globSync is not a function` before it could even run.
  Bumped that step to Node 22.

## [1.2.9] - 2026-09-09

### Fixed
- `html-validate` was run unpinned in CI, so an upstream release silently
  started enforcing rules this repo never met (`<button>` missing
  `type="button"`, the JS-populated footer version link having no
  accessible name if the version fetch fails, and an inline `style=""` on
  the engine/profiles hero). Fixed all three and pinned the CI step to
  `html-validate@11` so a future release can't do this again.

## [1.2.8] - 2026-09-09

### Fixed
- Footer version label (`Website vX.X.X`) on all 9 pages was plain text; now links to `/changelogs`, matching the linked-version-badge pattern used on SecretGen, Kittens, and AutoScroll

## [1.2.7] - 2026-09-09

### Changed
- Legal pages' shared `contact@stuxie.dev` address split by purpose: `legal@stuxie.dev` for legal/privacy/copyright questions and licensing/reuse requests, `hello@stuxie.dev` for general questions, accessibility feedback, and security reports — matching the convention used across other StuxieDev/Stux.Group sites

## [1.2.6] - 2026-09-08

### Added
- Every local asset reference (`assets/logo.png`, `assets/icon.png`, `assets/favicon.ico` — `og:image`/`twitter:image` meta tags, favicon links, and inline `<img>` logos/icons across all 11 pages) now carries a `?v=1.2.6` cache-busting query string, so browser/CDN caches invalidate whenever a release changes one of these files instead of serving a stale copy indefinitely

### Changed
- `CONTRIBUTING.md`'s release checklist now notes that this project has no build step to interpolate the version automatically — the `?v=` query strings are hardcoded and must be bumped by hand across all 11 pages on any release that changes `assets/logo.png`, `assets/icon.png`, or `assets/favicon.ico`

## [1.2.5] - 2026-09-08

### Changed
- `CHANGELOG.md` entries now carry a date next to each version (`## [x.y.z] - YYYY-MM-DD`), backfilled from each release's git tag (and `git log -S` lookups for the ten early untagged releases), matching the Automater project's changelog format
- `README.md` gained a `## License` section and a "Built & Maintained by StuxieDev" footer line at the bottom, matching Automater's layout

## [1.2.4] - 2026-09-01

### Added
- **`INSTALL.md`** — deployment guide covering GitHub Pages (production)
  and self-hosting on any other static host, matching the pattern used by
  Stuxs.Tools/Downl.one.

### Changed
- **`CONTRIBUTING.md`'s "Getting set up"** — now points to
  [DEV_GUIDE.md](DEV_GUIDE.md) instead of duplicating its instructions.
- **`README.md`/`CONTRIBUTING.md`'s "Deploying"** — now cross-reference
  [INSTALL.md](INSTALL.md) for self-hosting elsewhere.

## [1.2.3] - 2026-09-01

### Added
- **`DEV_GUIDE.md`** — a dedicated local-development guide (requirements,
  sibling-repo checkout layout, dev server flags, verification steps,
  troubleshooting), matching the pattern used by Stuxs.Tools/Downl.one.
  The README's "Local preview" section now just points to it instead of
  duplicating the content.

## [1.2.2] - 2026-09-01

### Fixed
- **Mojibake in `commit.sh`/`commit.bat`/`dev-server.sh`/`dev-server.bat`
  console output** — an em dash in the log/echo messages rendered as
  garbled bytes (e.g. `ÔÇö`) on the default Windows console codepage.
  Replaced with plain ASCII dashes.

## [1.2.1] - 2026-09-01

### Added
- **Terms and Ethics disclaimer on the age gate** — every page's 18+ notice
  now states "By continuing, you agree to our Terms and Ethics of Use",
  linking to [/legal/terms](/legal/terms).

## [1.2.0] - 2026-09-01

### Added
- **"Boring Legal Stuff" hub** (`/legal`) — links to six new pages: Privacy
  Policy, Terms and Ethics, Cookies Policy, Imprint, Disclaimer, and
  Opt-Out Preferences (`/legal/privacy`, `/legal/terms`, etc.), each
  written for TIGHC specifically (the site's actual data flows, the
  Engine's local-only storage, hardware-safety and consent-focused ethics
  guidance, and the lack of a published code license). Linked from every
  page's footer.
- **OpenGraph and Twitter Card metadata** on every page — title,
  description, canonical URL, and a shared preview image — so links shared
  elsewhere show a proper preview instead of a bare URL.
- **`dev-server.py`/`.sh`/`.bat`** — a local dev server with DEV_MODE forced
  on by default: `profiles.js`/`changelogs.js`/`versions.js` load Engine/
  Profiles/Website content from the sibling checkouts next to this one
  instead of GitHub, so local edits to those repos show up here without
  pushing first. `--no-dev-mode` falls back to live GitHub content.

### Fixed
- **`commit.sh`/`commit.bat` staleness** — they hardcoded the version and
  commit message per release, so a forgotten update would tag the wrong
  version or skip tagging entirely. Both now read the version from
  `VERSION.md` dynamically, skip committing if nothing's staged, and skip
  tagging if the tag already exists.

## [1.1.6] - 2026-08-30

### Added
- **`commit.bat`/`commit.sh`** — pre-written commit+tag scripts, rewritten
  with each commit's exact message/tag before being run.

## [1.1.5] - 2026-08-30

### Added
- **`CONTRIBUTING.md`** — local preview steps, deploy notes, and the
  versioning convention for PRs.

## [1.1.4] - 2026-08-30

### Changed
- **`version.txt` renamed to `VERSION.md`** across all TIGHC repos —
  `versions.js` now fetches `VERSION.md` from each repo's raw GitHub content.

## [1.1.3] - 2026-08-30

### Added
- **Engine page** (`/engine`) — new page covering installation, all GUI tabs,
  profiles/bindings/priority, and Linux/Steam Deck setup. Linked from the nav
  on all pages.

## [1.1.2] - 2026-08-30

### Fixed
- **Footer version label** — the footer now shows "Website vX.X.X" instead of
  just "vX.X.X" to distinguish it from the Engine version.

### Changed
- **Repo moved to TIGHC org** — all URLs updated from `StuxieDev/TIGHC-Website`
  to `TIGHC/Website`.

## [1.1.1] - 2026-08-30

### Changed
- Updated static fallback version badges to v3.8.0 (Engine) and v1.3.0 (Profiles).

## [1.1.0] - 2026-08-30

### Added
- **Mobile & tablet support** — hamburger nav menu, responsive layouts at 760px
  and 1000px breakpoints, touch-friendly tap targets, and horizontal scroll on
  changelog tabs for narrow screens.
- **Live version badges** via `versions.js` — fetches `version.txt` from each
  repo on page load and populates version numbers site-wide (hero badges,
  profiles page, changelogs tab labels, footer) rather than having them hardcoded.
- **`version.txt`** — single source of truth for the website's own version number,
  consumed by `versions.js` and displayed in the footer.

### Changed
- Hero badges on index and profiles pages now update live from GitHub.
- Changelogs tab buttons show inline version numbers after fetching.
- Footer shows live website version on all pages.
- Feature grid collapses to 2 columns at tablet width (1000px) before going
  single-column at mobile (760px).

## [1.0.9] - 2026-08-27

### Added
- **Changelogs page** (`/changelogs`) — fetches and renders the CHANGELOG.md
  from all three repos (Engine, Profiles, Website) live from GitHub, with
  tab switching, colour-coded section labels, and inline markdown formatting.
- `/changelog` redirects to `/changelogs` via meta-refresh and JS.
- "Changelogs" added to the nav on all pages.

## [1.0.8] - 2026-08-27

### Changed
- Profiles page hero text updated to describe the new unified binding model
  (no more continuous/pulse distinction) and cites profiles v1.2.0.
- Meta description updated to remove continuous/pulse wording.
- `profiles.js` now fetches `profile.json` instead of `keybinds.json`, and
  renders a single "Bindings:" list per card rather than separate
  "Continuous:" / "Pulse:" rows (which were always empty since mode was
  removed in profiles v1.2.0).

## [1.0.7] - 2026-08-27

### Changed
- Version badges updated: engine v3.5.0 → v3.7.0, profiles v1.2.0 badge added.
- "Continuous & pulse bindings" feature card replaced with "Hold-until-release
  bindings" — the engine now uses a single unified binding model (TIGHC 3.6.0
  / 3.7.0); the old continuous/pulse distinction no longer exists.
- "Randomized intensity bands" card removes the "(and pulse duration)" copy
  since duration is no longer a configurable field.
- Game profiles section: "keybinds and ranges" → `profile.json` (TIGHC 3.7.0).

## [1.0.6] - 2026-08-27

### Changed
- Version badge updated to v3.5.0.
- "Per-game profiles" feature card notes exact/substring window-title matching
  and case-sensitivity (added in TIGHC 3.4.0).
- "Continuous & pulse bindings" feature card notes that releasing a key
  mid-pulse cancels it immediately (added in TIGHC 3.5.0).

## [1.0.5] - 2026-08-25

### Changed
- **Navbar GitHub button (`.nav-gh`) is now a primary/filled button** -
  was an outline "ghost" style (border only, no fill); now uses the same
  accent fill as `.btn-accent` (`var(--accent)` background, white text),
  at the smaller nav padding/radius.

## [1.0.4] - 2026-08-25

### Changed
- **Internal links no longer include `.html`** - `index.html` and
  `profiles.html` linked to each other as `profiles.html` /
  `index.html#anchor`; switched to root-relative extensionless paths
  (`/profiles`, `/`, `/#anchor`) since GitHub Pages serves both
  `/profiles` and `/` without requiring the file extension.

## [1.0.3] - 2026-08-25

### Fixed
- **Profiles page listed `assets/` as a broken profile card** -
  `profiles.js` fetched `TIGHC-Profiles`' directory listing and treated
  every folder as a profile, so the submodule's own `assets/` folder
  (icon/logo images) showed up as a card with "Couldn't load this
  profile's keybinds.json." `dirs` now excludes `assets` by name, mirroring
  the same non-profile-folder skip the main TIGHC engine's
  `load_profiles()` does.

## [1.0.2] - 2026-08-25

### Fixed
- `assets/icon.png`, `favicon.ico`, and `logo.png` had an opaque dark
  (`#1E1E1E`) rounded-rect fill baked in instead of a transparent
  background, showing a visible box against the site's `#14141a` page
  background. Replaced with transparent versions (copied from the main
  TIGHC repo after fixing them there via a color-to-alpha un-blend).

## [1.0.1] - 2026-08-25

### Fixed
- `README.md` had been written as UTF-16LE (every character followed by a
  null byte) instead of UTF-8, which would have rendered as garbled
  mojibake on GitHub - every other file in the repo (`index.html`,
  `style.css`, `script.js`, `profiles.html`, `profiles.js`, `CNAME`) was
  already correct UTF-8, so this was isolated to the one file. Rewritten as
  plain UTF-8 with the same content.

### Added
- Author credit: a "By StuxieDev" link in both pages' footers, plus an
  "Author" section (name + GitHub avatar at `assets/author.png`) in
  `README.md`, matching the same addition in the main TIGHC repo and
  TIGHC-Profiles.

## [1.0.0] - 2026-08-25

Initial release: the `tighc.stuxie.dev` landing site (`index.html`) and a
live game-profiles page (`profiles.html`, fetched from TIGHC-Profiles via
the GitHub API), served as a plain HTML/CSS/JS static site via GitHub
Pages with no build step.
