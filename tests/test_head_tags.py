"""Checks every page's <head> for the Discord component embed and the favicon tags, and that
scripts/build-embeds.py has been run. Embeds follow Discord's rules: one root Container, no nested
Containers, only allowed component types, at most 40 components, link buttons with only allowed keys,
and 3,000 bytes at most. https://docs.discord.com/developers/link-previews/component-embeds

Run with: python -m unittest discover -s tests -p "test_*.py"
"""
import importlib.util
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("build_embeds", ROOT / "scripts" / "build-embeds.py")
be = importlib.util.module_from_spec(spec)
spec.loader.exec_module(be)

TAG = re.compile(r'<script id="discord:component-embed" type="application/json">(.*?)</script>', re.S)
HTML = [p for p in sorted(ROOT.rglob("*.html")) if "fontawesome" not in p.parts]


def flatten(c):
    out = [c]
    for child in c.get("components", []) + ([c["accessory"]] if "accessory" in c else []):
        out += flatten(child)
    return out


class EmbedTests(unittest.TestCase):
    def test_every_page_with_an_embed_is_valid(self):
        embedded = 0
        for p in HTML:
            m = TAG.search(p.read_text(encoding="utf-8"))
            if not m:
                continue
            embedded += 1
            raw = m.group(1)
            self.assertLessEqual(len(raw.encode("utf-8")), 3000, p.name)
            self.assertEqual(raw.count("</"), 0, "</ must be escaped: " + p.name)
            payload = json.loads(raw)
            self.assertEqual(list(payload), ["component"])
            root = payload["component"]
            self.assertEqual(root["type"], 17)
            allc = flatten(root)
            self.assertLessEqual(len(allc), 40)
            for c in allc:
                self.assertIn(c["type"], [1, 2, 9, 10, 11, 12, 14, 17])
                if c["type"] == 17:
                    self.assertIs(c, root, "no nested Containers")
                if c["type"] == 2:
                    self.assertEqual(c["style"], 5)
                    self.assertLessEqual(set(c), {"id", "type", "url", "style", "label", "emoji", "disabled"})
                    self.assertRegex(c["url"], r"^https?://")
                if c["type"] == 10:
                    self.assertNotIn("$1", c["content"])
        self.assertGreaterEqual(embedded, 20)

    def test_error_and_redirect_pages_have_none(self):
        for rel in be.SKIP:
            self.assertNotIn("discord:component-embed", (ROOT / rel).read_text(encoding="utf-8"), rel)

    def test_embeds_are_up_to_date(self):
        self.assertEqual(be.build(check=True), [], "run python scripts/build-embeds.py")

    def test_markdown_in_data_is_escaped(self):
        B = chr(92)
        self.assertEqual(be.md("**b** [x](y) a_b ~~s~~ `c` ||p|| " + B), "{0}*{0}*b{0}*{0}* {0}[x{0}](y) a{0}_b {0}~{0}~s{0}~{0}~ {0}`c{0}` {0}|{0}|p{0}|{0}| {0}{0}".format(B))
        self.assertEqual(be.md("# h\n- l\n> q\nmid # - >"), "{0}# h\n{0}- l\n{0}> q\nmid # - >".format(B))

    def test_script_cant_be_closed_early(self):
        j = be.page_embed("</script><b>x", "d", "https://example.com/x")
        self.assertNotIn("</", j)
        self.assertIn("<\/script>", j)

    def test_over_the_limit_is_left_out(self):
        self.assertIn("left out", be.tag_for("x.html", '<title>T</title><meta name="description" content="%s"><link rel="canonical" href="https://example.com/">' % ("long " * 800)))


class FaviconTests(unittest.TestCase):
    def test_root_files_exist(self):
        for f in ["favicon.ico", "apple-touch-icon.png", "site.webmanifest"]:
            self.assertTrue((ROOT / f).is_file(), f)
        m = json.loads((ROOT / "site.webmanifest").read_text(encoding="utf-8"))
        self.assertEqual(m["start_url"], "/")
        self.assertEqual(m["display"], "browser")
        self.assertEqual({i["sizes"] for i in m["icons"]}, {"192x192", "512x512"})
        self.assertTrue(any(i.get("purpose") == "maskable" for i in m["icons"]))
        for i in m["icons"]:
            self.assertTrue((ROOT / i["src"].lstrip("/")).is_file())

    def test_every_head_has_the_tags(self):
        for p in HTML:
            s = p.read_text(encoding="utf-8")
            for needle in ['href="/favicon.ico" sizes="48x48"', 'sizes="512x512" href="/assets/icon-512.png"',
                           'rel="apple-touch-icon" href="/apple-touch-icon.png"', 'rel="manifest" href="/site.webmanifest"']:
                self.assertIn(needle, s, p.name)


if __name__ == "__main__":
    unittest.main()
