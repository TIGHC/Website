# Changelog

All notable changes to this project are documented here. Versioning follows
[Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`), independent
of the main [TIGHC](https://github.com/TIGHC/Engine) engine's own version.

## [1.9.2] - 2026-09-10

### Changed
- **Footer's "A StuxieDev Project" link is now underlined only on hover**
  (was always underlined) - `.footer-note a` had its own hardcoded
  `text-decoration: underline`, overriding the site-wide convention (every
  other link, via the base `a`/`a:hover` rules, is underlined only on
  hover). Matches the same fix just made in Engine's GUI About tab.

## [1.9.1] - 2026-09-10

### Fixed
- **`assets/logo.png`'s tagline was a slightly different shade of purple
  than the icon and "TIGHC" wordmark** - v1.9.0's re-render used the font
  rasterizer's anti-aliased blend rather than the icon's exact solid fill
  color. Re-rendered the tagline in that exact color (`#7C5CFF`) and
  switched from Segoe UI Semibold to true Segoe UI Bold, so it now reads as
  one consistent color and weight with the rest of the lockup, just bolder
  than the surrounding elements as intended. New size 600x126 (was
  582x126).

## [1.9.0] - 2026-09-10

### Changed
- **`assets/logo.png`'s tagline re-rendered as bold vector text** instead of
  the old low-res raster crop - the previous alpha/color fix (v1.7.0) made
  it full-opacity but it was still thin and small next to the "TIGHC"
  wordmark, so it read as an afterthought rather than part of the lockup.
  The tagline is now rendered fresh at a larger size in Segoe UI Semibold
  (matching the site's font stack), supersampled and downsampled for crisp
  edges; the icon and "TIGHC" wordmark pixels are untouched. New size
  582x126 (was 455x126) - all consuming CSS/Markdown sizes the logo by
  height or a fixed width with the other dimension left auto, so nothing
  else needed to change.
- **Vendored Font Awesome bumped from 6.7.2 to 7.3.1**, the actual latest
  release - the earlier downgrade to 6.7.2 was based on a misdiagnosed
  rendering issue that turned out to be a false alarm in browser tooling,
  not a real FA7 defect.

### Fixed
- **Dev-mode banner stayed visible even when `hidden`** - `.env-banner`'s
  `display: flex` (specificity 0,1,0) tied with the browser's native
  `[hidden] { display: none }` UA rule at equal specificity, and the
  site's stylesheet loading after the UA stylesheet won the cascade tie.
  Added `.env-banner[hidden] { display: none; }` (0,2,0) to make the
  override unambiguous. Verified both directions (`--no-dev-mode` on and
  off) against a live local server after a hard reload.

## [1.8.0] - 2026-09-10

### Added
- **Visible "Development Mode" banner**, matching Stuxs.Tools' `env-banner`
  treatment exactly (amber bar, same class names, same layout) - previously
  `DEV_MODE` only logged to the browser/terminal console, with no on-page
  signal that you weren't looking at the live site. Every page now carries
  a `#dev-banner` element, hidden by default; `dev-server.py`'s
  `write_dev_config()` reveals it and fills in the detail text (port +
  what's being served from local sibling checkouts) only when `dev-config.js`
  is written, i.e. only when `DEV_MODE` is actually on. `--no-dev-mode`
  removes `dev-config.js` entirely, so the banner stays hidden and the page
  matches production exactly - verified both ways against a live local
  server. `DEV_GUIDE.md` updated to mention it.

## [1.7.0] - 2026-09-10

### Added
- **Releases page now notes the CLI's discontinuation** - a line under the
  hero explaining the headless CLI was dropped in Engine v5.0.0 and no
  longer ships, so the `(CLI)`-labeled assets on older releases don't read
  as a currently-supported option.
- **Footer disclaimer now has a second line, "A StuxieDev Project"**,
  linking to `https://projects.stuxie.dev`, styled the same muted way as
  the "Unaffiliated with..." line above it.

### Changed
- **"Written & Maintained by StuxieDev" moved to the last link** in the
  footer's "More" column (after "Boring Legal Stuff", was second of
  three).
- **`assets/logo.png`'s tagline read as a lighter, washed-out purple** next
  to the bold "TIGHC" wordmark and the icon - not a different hue, just
  much lower average opacity from anti-aliasing at its small font size.
  Boosted its alpha (~3x, capped at 255) and normalized every
  non-transparent pixel to the same purple used everywhere else.
- Bumped every page's `?v=` cache-busting query string to `1.7.0`.

## [1.6.1] - 2026-09-10

### Changed
- **Reverted the footer's "A StuxieDev Project" wording from v1.6.0** - the
  avatar icon belongs specifically with "Written & Maintained by [icon]
  StuxieDev", not "A [icon] StuxieDev Project". The footer link now reads
  "Written & Maintained by StuxieDev", avatar between "by" and
  "StuxieDev", still linking to `https://projects.stuxie.dev`.
- Bumped every page's `?v=` cache-busting query string to `1.6.1`.

## [1.6.0] - 2026-09-10

### Changed
- **New icon: a controller silhouette with pulse waves, replacing the
  bullseye/target rings.** The old mark read as archery or aim-assist, not
  as a haptics controller - the new one shows the actual mechanism (game
  input becomes vibration) instead. `assets/icon.png` and `favicon.ico`
  regenerated from the new mark (same purple, no gradients); `assets/
  logo.png`'s icon half swapped in, wordmark and tagline pixels unchanged.
  Proposed and approved via a side-by-side review artifact before
  touching any repo, including a check that the design still reads
  clearly at 16px (the earlier attempt kept a D-pad/button detail that
  washed out below 32px).
- **Footer author link now reads "A StuxieDev Project"** (was "By
  StuxieDev"), with the actual GitHub avatar image in place of a generic
  person icon, linking to `https://projects.stuxie.dev` instead of
  `https://stuxie.dev`.
- Bumped every page's `?v=` cache-busting query string to `1.6.0`.

## [1.5.4] - 2026-09-10

### Fixed
- **Theme toggle floated in the middle of the header on mobile** -
  `.header-inner` is a flex row with `justify-content: space-between`
  across `.brand`, `.site-nav`, `.theme-toggle`, and `.nav-toggle`; once
  the mobile breakpoint hides `.site-nav` (`display: none` removes it from
  the flex flow), the remaining three visible items - brand, theme toggle,
  hamburger - get evenly distributed, stranding the theme toggle dead
  center instead of next to the hamburger. Fixed by wrapping the theme
  toggle and hamburger in a `.header-controls` div, so `.header-inner`
  always resolves to exactly `brand | nav | controls` regardless of which
  of those three are visible. Verified with `getBoundingClientRect()` -
  toggle and hamburger now sit adjacent at the right edge.
- **The nav didn't collapse to the hamburger menu until 760px**, but the
  full desktop nav (8 links, the GitHub pill, and the theme toggle) needs
  ~850px to lay out on one line - between roughly 760-870px it was still
  shown, visibly squeezed and wrapping mid-item ("Get started" splitting
  across two lines). Split the nav-collapse rules out of the general
  "Mobile" breakpoint into their own `@media (max-width: 900px)` block, so
  the switch to the hamburger happens before the squeeze, not after.

### Changed
- **Author link now points to `https://stuxie.dev`** instead of
  `https://github.com/StuxieDev` - the "By StuxieDev" footer link on all
  12 pages, and `README.md`'s footer link. The GitHub avatar image
  (`github.com/StuxieDev.png`) is unaffected - that's still the only place
  to fetch it from.

## [1.5.3] - 2026-09-10

### Fixed
- **`assets/logo.png`/`icon.png`/`favicon.ico` still had a visible dark
  speckled fringe around every letter/ring** (reported against
  `raw.githubusercontent.com/TIGHC/Engine/.../logo.png`, which is byte-for-
  byte the same file as this repo's copy) - v1.4.1's and v1.5.2's fixes
  only thresholded out very-low-alpha pixels, which caught the faint haze
  extending to the canvas edges but missed a second, separate shadow layer
  sitting right at the shape edges with real, visible opacity. Confirmed
  with a 3x-scaled before/after comparison. Fixed properly this time: any
  pixel with alpha > 0 whose RGB is dark-and-not-purple is zeroed,
  regardless of its alpha level. `favicon.ico` regenerated from the
  recleaned source. Bumped every page's `?v=` cache-busting query string
  to `1.5.3`.

## [1.5.2] - 2026-09-10

### Fixed
- **`assets/icon.png`/`favicon.ico` had the same baked-in low-alpha haze as
  `logo.png` did before v1.3.2** - never actually fixed for these two,
  since that pass only touched `logo.png`. Visible as a soft grey box/halo
  around the icon, most noticeable on the light theme's near-white
  backgrounds (the header, in particular). Same fix applied: thresholded
  out any pixel with alpha <= 20. `favicon.ico` regenerated from the
  cleaned source at its original size set (16/32/48/64/128/256). Bumped
  every page's `?v=` cache-busting query string to `1.5.2` so the fix
  actually reaches visitors' browsers (a Cloudflare/CDN layer in front of
  the site, if any, would need its own cache purged separately - this repo
  has no visibility into or control over that).

## [1.5.1] - 2026-09-10

### Fixed
- **Hero tagline wrapped to two lines** on desktop-width viewports -
  `.hero-tagline`'s `max-width` (640px) was narrower than the text actually
  needed (~712px), forcing an unnecessary wrap despite plenty of room in the
  1080px container. Widened to 760px so it renders on one line.

## [1.5.0] - 2026-09-10

### Added
- **Cache-busting extended to every first-party static asset** - `style.css`
  and every first-party `<script src>` (`script.js`, `dev-config.js`,
  `versions.js`, `profiles.js`/`changelogs.js`/`releases.js`) now carry a
  `?v=X.Y.Z` query string tied to `VERSION.md`, matching the treatment
  `assets/logo.png`/`assets/icon.png`/`assets/favicon.ico` already had.
  Previously a CSS/JS change could leave visitors on stale cached code
  indefinitely, with no release-time signal that anything was wrong.
  `CONTRIBUTING.md`'s versioned-asset rule is updated to match: every
  release now hand-bumps every `?v=` string to the new `VERSION.md` across
  all 12 pages, not just when the three original asset files change.

## [1.4.1] - 2026-09-10

### Changed
- Shrunk the header logo in `README.md`/`CONTRIBUTING.md` from
  `width="500"` to `width="300"`.

## [1.4.0] - 2026-09-10

### Added
- **Light/dark theme support** - every page now respects the visitor's OS
  `prefers-color-scheme`, plus a manual toggle button (sun/moon icon) in the
  header that overrides it, persisted in `localStorage` and applied by an
  inline `<head>` script before `style.css` loads (no flash of the wrong
  theme). All themeable colors moved into CSS custom properties in
  `style.css`'s `:root` with a light-palette override block, replacing every
  previously hardcoded hex/rgba color (header/mobile-nav backgrounds, the
  age-gate scrim, `code` styling, the hero glow, and all changelog/release
  status-label colors).
- **Font Awesome Free, vendored locally** under `assets/fontawesome/`
  (solid + brands styles, no CDN - see the Theming section of
  [README.md](README.md) for why) - used for the header's GitHub link, the
  new theme-toggle icon, and every footer link.
- **Footer version badges** - the footer now shows `Engine vX.Y.Z`,
  `Profiles vX.Y.Z`, and `Website vX.Y.Z` together (previously only the
  Website version was shown, and only as an easy-to-miss link label).

### Changed
- **Footer reorganized** into a brand column plus two labeled link groups
  ("Project": Engine repo, Website repo, Profiles repo, Releases,
  Changelogs; "More": Issues & contact, By StuxieDev, Boring Legal Stuff),
  each link now icon-prefixed. Previously all links sat in one flat,
  ungrouped row, and the "Changelog" link's own label was overwritten by
  `versions.js` to show a version number instead - it's now a plain
  "Changelogs" link, with the version shown separately as static text.
  Added a "Website repo" link, and renamed the plain "GitHub" link to
  "Engine repo" now that there's more than one repo linked from here.
- **`index.html`'s "Get started" and "Game profiles" sections** no longer
  mention git submodules or `--recurse-submodules` (Engine dropped the
  `profiles/` submodule back in v3.9.1 - profiles are downloaded
  automatically on first launch instead) and no longer tell readers to
  `cd TIGHC` after cloning (the repo is named `Engine`, so `git clone`
  creates an `Engine/` directory, not `TIGHC/`). Also dropped a stray
  `python cli.py` mention now that Engine v5.0.0 removed the CLI.
- **"TIGHC-Profiles" renamed to "TIGHC Profiles"** (no hyphen) everywhere
  it's used as a display name across this site's pages, matching the
  correct project name.

## [1.3.2] - 2026-09-10

### Changed
- **Header brand link now shows the full logo** (icon + "TIGHC" wordmark +
  tagline) instead of just the small icon plus a plain-text "TIGHC" span -
  `.brand-icon` replaced with `.brand-logo` across all 12 pages.

### Fixed
- `assets/logo.png` had a large baked-in low-alpha haze (both near-black and
  near-white, likely leftover shadow/glow layers from the original export)
  extending all the way to the canvas edges - invisible on a white
  background, but visible as a dark smudge/box around the logo in the
  header (which sits on a dark background) and as ~175px of dead space on
  the right of the 640x160 canvas. Thresholded out any pixel with alpha
  <= 20 and cropped to the actual content, producing a clean 461x132 image
  with a true transparent background - same fix as the Engine repo, same
  file byte-for-byte. Per [CONTRIBUTING.md](CONTRIBUTING.md)'s versioned-
  asset rule, bumped every page's `?v=` query string from `1.2.6` to
  `1.3.2` to bust caches on the changed file.

## [1.3.1] - 2026-09-10

### Fixed
- `README.md` still had the old `## Author` block (avatar image + name)
  right under the intro, left over from before that was replaced with the
  standard "Built & Maintained by StuxieDev" footer line - Engine's
  `README.md` already had this cleaned up, this one was missed. Removed the
  duplicate block; the footer at the bottom already covers it.

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
