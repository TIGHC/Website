#!/usr/bin/env python3
"""Write the Discord component embed into the <head> of every public page.

Run from anywhere: python scripts/build-embeds.py   (add --check to only verify)
Each page gets a <script id="discord:component-embed" type="application/json"> block, built from the
page's own <title>, meta description and canonical URL (the home page has a hand-written one). Discord
shows it as the link preview; the Open Graph tags stay as the fallback. The 404 page and the redirect
stubs (changelog.html, assets/steam.html) get none. A page whose embed would be over Discord's
3,000-byte limit gets an HTML comment instead.
https://docs.discord.com/developers/link-previews/component-embeds

Copyright (c) StuxieDev. All Rights Reserved.
"""
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE_URL = "https://" + (ROOT / "CNAME").read_text(encoding="utf-8").strip()
SITE_NAME = "TIGHC"
SITE_COLOUR = 0x7C5CFF  # --accent in style.css
MAX_BYTES = 3000
SKIP = {"404.html", "changelog.html", "assets/steam.html"}
TAG_RE = re.compile(r'<script id="discord:component-embed" type="application/json">.*?</script>\n|<!-- discord:component-embed left out[^>]*-->\n', re.S)


def md(s):
    """Escape Discord markdown so data shows as plain text."""
    # A function, not a template string, so the backslash and the character are both kept literally.
    s = re.sub(r"([" + chr(92)*2 + r"*_~`|" + chr(92)+"["+chr(92)+"]])", lambda m: chr(92) + m.group(1), s)
    return re.sub(r"^([#>-])", lambda m: chr(92) + m.group(1), s, flags=re.M)


def text(markdown):
    return {"type": 10, "content": markdown}


def buttons(links):
    return {"type": 1, "components": [{"type": 2, "style": 5, "label": label[:80], "url": url} for label, url in links]}


def section(markdown):
    return {"type": 9, "components": [text(markdown)],
            "accessory": {"type": 11, "media": {"url": BASE_URL + "/assets/icon.png"}}}


def site_label():
    return "-# [%s](%s/)\n" % (SITE_NAME, BASE_URL)


def embed(components):
    payload = {"component": {"type": 17, "accent_color": SITE_COLOUR, "components": components}}
    return json.dumps(payload, separators=(",", ":"), ensure_ascii=False).replace("</", "<\/")


def page_embed(title, desc, url):
    return embed([
        section(site_label() + "## [" + md(title) + "](" + url + ")\n" + md(desc)),
        buttons([("Open", url), ("Releases", BASE_URL + "/releases")]),
    ])


def home_embed():
    return embed([
        section("# [%s](%s/)\n**The Intiface Game Haptics Controller**\n%s" % (SITE_NAME, BASE_URL, md(
            "Links your keyboard and mouse input to a Buttplug/Intiface haptic toy while you game. "
            "Per-game profiles, per-motor targeting and a full GUI. Open source, for Windows and Linux/Steam Deck."))),
        {"type": 14},
        text("-# 18+ software. Free and open source."),
        buttons([("Download", BASE_URL + "/releases"), ("Install guides", BASE_URL + "/guides"),
                 ("Profiles", BASE_URL + "/profiles")]),
    ])


def tag_for(rel, src):
    if rel == "index.html":
        json_text = home_embed()
    else:
        title = re.search(r"<title>(.*?)</title>", src, re.S)
        desc = re.search(r'<meta name="description" content="(.*?)">', src, re.S)
        url = re.search(r'<link rel="canonical" href="(.*?)">', src)
        if not (title and desc and url):
            raise SystemExit("%s: needs <title>, meta description and canonical link" % rel)
        name = re.sub(r"\s+[\u2014|-]\s+" + SITE_NAME + r"$", "", html.unescape(title.group(1)).strip())
        json_text = page_embed(name, html.unescape(desc.group(1)), html.unescape(url.group(1)))
    if len(json_text.encode("utf-8")) > MAX_BYTES:
        return "<!-- discord:component-embed left out: over %d bytes -->\n" % MAX_BYTES
    return '<script id="discord:component-embed" type="application/json">%s</script>\n' % json_text


def pages():
    for p in sorted(ROOT.rglob("*.html")):
        rel = p.relative_to(ROOT).as_posix()
        if rel in SKIP or rel.startswith(("assets/fontawesome/", "node_modules/")):
            continue
        yield rel, p


def build(check=False):
    stale = []
    for rel, p in pages():
        src = p.read_text(encoding="utf-8")
        body = TAG_RE.sub("", src)
        marker = '<link rel="canonical"'
        if marker not in body:
            raise SystemExit("%s: no canonical link to insert before" % rel)
        out = body.replace(marker, tag_for(rel, body) + marker, 1)
        if out != src:
            stale.append(rel)
            if not check:
                p.write_text(out, encoding="utf-8", newline="")
    return stale


if __name__ == "__main__":
    check = "--check" in sys.argv
    changed = build(check)
    if check and changed:
        print("Out of date (run python scripts/build-embeds.py): " + ", ".join(changed))
        sys.exit(1)
    print(("Up to date." if check else "Updated %d page(s)." % len(changed)))
