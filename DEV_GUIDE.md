# TIGHC Website — Local Development Guide

For deploying, see [README.md](README.md#deploying) instead — this document
is only about running the site on your own machine to work on it.

---

## Requirements

- **Python 3** (any recent version — only the standard library is used)
- Git, to clone the repo

No build tooling, no dependencies to install — this is a plain HTML/CSS/JS
site.

## 1. Clone alongside the sibling repos

`dev-server.py` reads Engine/Profiles content from sibling checkouts next to
this one, so local edits show up here without pushing first:

```bash
git clone https://github.com/TIGHC/Engine.git
git clone https://github.com/TIGHC/Profiles.git
git clone https://github.com/TIGHC/Website.git
cd Website
```

```
Projects/
  Engine/
  Profiles/
  Website/   <- run dev-server.py from here
```

Only cloning `Website` still works — `versions.js`/`changelogs.js`/
`profiles.js` just fall back to fetching from GitHub for anything that
doesn't have a local sibling.

## 2. Run the dev server

```bash
./dev-server.sh [port]        # macOS/Linux
dev-server.bat [port]         # Windows
```

Defaults to port 8000. This serves the site the way GitHub Pages does and
forces dev mode on by default, which writes `dev-config.js` (gitignored,
never deployed) so `profiles.js`/`changelogs.js`/`versions.js` load
Engine/Profiles/Website content from `../Engine` and `../Profiles` instead
of GitHub, and reveals an amber "Development Mode" banner at the top of
every page (same treatment as Stuxs.Tools) so it's never ambiguous whether
you're looking at the local build or the live site.

- `--no-dev-mode` — fetch from GitHub instead, matching production, to test
  production behavior locally

Prefer a plain static server with no dev-mode behavior? `python -m
http.server 8000` works too — version/changelog/profile content will just
always come from GitHub, same as production.

## 3. Verify it's working

- Visit `http://127.0.0.1:8000` — you should see the amber "Development
  Mode" banner across the top of the page, and the same info as a console
  log: `[TIGHC dev mode] Engine/Profiles/Website content is loaded from
  local sibling checkouts, not GitHub.`
- Visit `/engine.html` — the version badge should match your local
  `../Engine/VERSION.md`, not whatever's currently on GitHub
- Visit `/profiles.html` — should list the folders in your local
  `../Profiles` checkout

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "Python 3 is required to run dev-server.py" | Install Python 3, make sure `python3` (or `python`) is on `PATH` |
| Engine/Profiles content 404s or falls back to GitHub | `../Engine` or `../Profiles` isn't checked out next to `Website/` — the server logs a note at startup naming which one's missing |
| Version badges don't match your local Engine/Profiles/Website checkouts | Make sure `dev-config.js` exists (dev mode is on) and hard-refresh — `versions.js` fetches `VERSION.md` fresh each load, no caching involved |
| `dev-server.bat` fails with "The system cannot find the batch label specified" | The `.bat` file has LF-only line endings instead of CRLF (breaks `cmd.exe`'s `GOTO`/label parser) — re-save it with CRLF, e.g. `unix2dos dev-server.bat`, or re-clone |
