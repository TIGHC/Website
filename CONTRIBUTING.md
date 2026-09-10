<p align="center">
  <img src="assets/logo.png" width="300" alt="The Intiface Game Haptics Controller (TIGHC)">
</p>

# Contributing to the TIGHC Website

Issues and pull requests are welcome at
[github.com/TIGHC/Website](https://github.com/TIGHC/Website).

## Getting set up

No build tooling required - plain HTML/CSS/JS. See the [README](README.md)
for the file structure and [DEV_GUIDE.md](DEV_GUIDE.md) to preview locally.

## Making a change

- Keep pages consistent with `style.css` - avoid inline styles or one-off
  CSS unless there's a good reason.
- If you add a page, link it from the nav and footer on every existing page
  (see how `index.html` and the others do it), including the
  `/legal` "Boring Legal Stuff" footer link.
- `profiles.js`, `changelogs.js`, and `versions.js` fetch live content from
  the [TIGHC/Profiles](https://github.com/TIGHC/Profiles) and
  [TIGHC/Engine](https://github.com/TIGHC/Engine) repos at runtime - test
  changes to them with `./dev-server.sh`/`dev-server.bat` (not `file://`),
  since `fetch` needs an HTTP origin.
- Check a narrow viewport if you touch layout (the site is responsive down
  to mobile widths). There's no light theme to check - the site is dark-only.
- Any new page needs OpenGraph/Twitter meta tags and a `<link rel="canonical">`
  in its `<head>` - copy the pattern from an existing page.

## Versioning

Bump [`VERSION.md`](VERSION.md) and add a matching entry to
[`CHANGELOG.md`](CHANGELOG.md) in the same PR, following
[Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`),
independent of the main Engine's own version.

**Every first-party static asset reference carries a `?v=X.Y.Z`
cache-busting query string, always set to the current `VERSION.md`** -
`assets/logo.png`, `assets/icon.png`, `assets/favicon.ico`, `style.css`,
and every first-party script tag (`script.js`, `dev-config.js`,
`versions.js`, and whichever of `profiles.js`/`changelogs.js`/`releases.js`
that page loads). Since this site has no build step to interpolate that
automatically, and `VERSION.md` gets bumped on every release regardless
(see above), **every release must hand-bump every `?v=` string to match the
new `VERSION.md`, across all 12 pages** - `index.html`, `engine.html`,
`changelogs.html`, `profiles.html`, `releases.html`, `legal.html`, and
everything under `legal/` (`cookies.html`, `disclaimer.html`, `imprint.html`,
`opt-out.html`, `privacy.html`, `terms.html`), roughly a dozen references
each (meta `og:image`/`twitter:image` tags, favicon `<link>`s, inline
`<img>` logos/icons, the `style.css` `<link>`, and every `<script src>`).
Forgetting this doesn't break anything visibly at release time - it just
means visitors keep seeing old CSS/JS/images until their cache happens to
expire on its own. Font Awesome's own CSS/font files under
`assets/fontawesome/` are the one exception - they're versioned to Font
Awesome's own release (`?v=6.7.2` currently), bumped only when that vendored
copy itself is upgraded, not on every site release.

## Deploying

Merges to `main` publish automatically via GitHub Pages - no separate deploy
step. Don't remove the `CNAME` file unless the custom domain setup is
changing too. See [INSTALL.md](INSTALL.md) for self-hosting elsewhere.

## Reporting a bug

Open an issue with the page, browser, and what looked wrong (a screenshot
helps).
