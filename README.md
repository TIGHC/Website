<p align="center">
  <img src="assets/logo.png" width="300" alt="The Intiface Game Haptics Controller (TIGHC)">
</p>

# TIGHC Website

> **18+ only.** This is the website for TIGHC, software that connects to and
> controls adult haptic/sex toy devices. Intended for use only by adults aged
> 18 or older.

**Version 1.13.4** — see [CHANGELOG.md](CHANGELOG.md) for release history.

Source for [tighc.stuxie.dev](https://tighc.stuxie.dev), the landing site
for [TIGHC](https://github.com/TIGHC/Engine) (The Intiface Game Haptics
Controller). Plain HTML/CSS/JS, served directly from this repo via GitHub
Pages - no build step.

Website: https://tighc.stuxie.dev  
Repository: https://github.com/TIGHC/Website

## Structure

```
index.html                 # landing page - what TIGHC is, features, how it works, get started
404.html                    # custom error page, served automatically by GitHub Pages
favicon.ico                 # site-root copy browsers fall back to regardless of <link rel="icon">
engine.html                 # install/usage docs for the Engine (GUI, profiles, devices, settings)
profiles.html                # game profiles, fetched live from TIGHC Profiles via the GitHub API
profiles.js                  # fetches profiles.html's content from github.com/TIGHC/Profiles
changelogs.html               # tabbed changelog viewer (Engine / Profiles / Website)
changelogs.js                 # fetches and renders CHANGELOG.md from each repo for changelogs.html
changelog.html                # redirect alias for /changelogs (singular -> plural)
releases.html                  # TIGHC Engine releases, fetched live from the GitHub Releases API
releases.js                    # fetches and renders TIGHC/Engine's GitHub releases for releases.html
style.css                      # shared styles across all pages
script.js                      # 18+ notice, mobile nav toggle, and the light/dark theme toggle
versions.js                    # fetches VERSION.md from each repo on load and populates version badges site-wide

legal/index.html               # "Boring Legal Stuff" hub, linking to legal/*.html
legal/privacy.html, terms.html, cookies.html, imprint.html, disclaimer.html, opt-out.html

guides/index.html               # setup guides hub, linking to guides/*.html
guides/windows.html, macos.html, linux.html   # platform-specific setup guides
guides/install.html            # deploying a copy of this site (see Deploying below)
guides/developer.html          # running this site locally (see Local preview below)
guides/steam.html               # adding TIGHC to Steam + applying the library artwork

steam.html                      # Steam library artwork landing page
assets/steam.html               # redirects to the latest TIGHC_Steam_Assets.zip

assets/icon.png, logo.png, author.png, favicon.ico   # copied from the main TIGHC repo's assets/
assets/fontawesome/             # Font Awesome Free (vendored, self-hosted - see its own LICENSE.txt)

tests/                          # node:test unit tests for changelogs.js/profiles.js/releases.js/versions.js
.github/workflows/ci.yml        # runs `node --test` and html-validate on every push/PR

dev-config.js                   # written by dev-server.py at startup - gitignored, never deployed
dev-server.py                   # local dev server shared by dev-server.sh/.bat (see Local preview below)
dev-server.sh                   # Unix wrapper for dev-server.py
dev-server.bat                  # Windows wrapper for dev-server.py

CHANGELOG.md / VERSION.md       # release history + current version (semver)
CONTRIBUTING.md                 # how to contribute a change
LICENSE.md                      # license text
commit.sh / commit.bat          # commit + tag a release, reading the version from VERSION.md
.gitignore
CNAME                           # custom domain (tighc.stuxie.dev) for GitHub Pages
```

## Theming

Every page defaults to a dark theme, respects the visitor's OS-level
`prefers-color-scheme: light` setting automatically, and has a light/dark
toggle button in the header (the sun/moon icon) that overrides either one -
the choice is stored in `localStorage` (`tighc-theme`) and re-applied by a
small inline script at the very top of each page's `<head>`, before
`style.css` loads, so there's no flash of the wrong theme on repeat visits.
All themeable colors are CSS custom properties defined once in `style.css`'s
`:root` block (dark values) with light overrides under both a
`prefers-color-scheme: light` media query and `:root[data-theme="light"]` -
adding a new color anywhere on the site should go through one of these
variables rather than a hardcoded hex/rgba value, so both themes stay in
sync automatically.

Icons site-wide are [Font Awesome Free](https://fontawesome.com), vendored
locally under `assets/fontawesome/` (solid + brands styles only) rather than
loaded from a CDN - this site's [privacy policy](legal/privacy.html) commits
to only ever contacting `api.github.com`/`raw.githubusercontent.com`, and a
third-party font CDN would be a new, undisclosed request. See
`assets/fontawesome/LICENSE.txt` for Font Awesome's own license terms.

`profiles.html` doesn't hardcode the game list - it calls the GitHub
Contents API to list folders in
[TIGHC Profiles](https://github.com/TIGHC/Profiles), then fetches
each folder's `profile.json` from `raw.githubusercontent.com` to render its
bindings. Adding a profile there shows up here automatically, no edits
needed on this side.

## Local preview

See [/guides/developer](https://tighc.stuxie.dev/guides/developer) to run
the site locally.

## Deploying

GitHub Pages is configured to serve from this repo's root on `main` - just
push. The `CNAME` file points the custom domain at GitHub Pages; don't
remove it unless the domain setup is changing too. See
[/guides/install](https://tighc.stuxie.dev/guides/install) for
self-hosting elsewhere.

## Testing

The parsing/formatting logic in `changelogs.js`, `profiles.js`, `releases.js`,
and `versions.js` (changelog Markdown parsing, profile binding/label
formatting and sorting, release-notes formatting and asset labeling/sorting,
version-string handling) has unit tests under `tests/`, using Node's
built-in test runner - no extra dependencies required:

```
node --test
```

CI (`.github/workflows/ci.yml`) runs these tests and validates the
top-level HTML pages with [html-validate](https://html-validate.org/) on
every push and pull request.

## Versioning and contact

Follows [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`),
independently of the main TIGHC engine's own version - see
[CHANGELOG.md](CHANGELOG.md) for what changed in each release. Questions,
issues, or contributions: https://github.com/TIGHC/Website

## License

See [LICENSE.md](LICENSE.md).

---

*Written & Maintained by <img src="https://global.media.stuxie.dev/icon.png" height="14" alt="StuxieDev" valign="middle"> [StuxieDev](https://stuxie.dev).*

*[A StuxieDev Project](https://projects.stuxie.dev)*
