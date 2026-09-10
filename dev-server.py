#!/usr/bin/env python3
"""TIGHC Website — local dev server.

Serves this folder the way GitHub Pages does. DEV_MODE is forced on by
default: it writes dev-config.js (gitignored, never deployed) so
profiles.js/changelogs.js/versions.js fetch Engine/Profiles/Website content
from the sibling checkouts next to this one (../Engine, ../Profiles) instead
of GitHub - so local edits to those repos' CHANGELOG.md/VERSION.md/profiles
show up here without pushing first - and reveals the `#dev-banner` element
every page already carries (hidden by default), same env-banner treatment
as Stuxs.Tools. Pass --no-dev-mode to fetch from GitHub instead, matching
production (the banner then stays hidden, since dev-config.js is never
written).
"""
import http.server
import json
import os
import socketserver
import sys

WEB_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(WEB_DIR)
SIBLINGS = {
    "engine": os.path.join(PARENT_DIR, "Engine"),
    "profiles": os.path.join(PARENT_DIR, "Profiles"),
    "website": WEB_DIR,
}


def parse_args(argv):
    port = 8000
    dev_mode = True
    for a in argv:
        if a == "--no-dev-mode":
            dev_mode = False
        elif a.isdigit():
            port = int(a)
        else:
            print("Unknown option: %s" % a, file=sys.stderr)
            sys.exit(1)
    return port, dev_mode


def write_dev_config(dev_mode, port):
    path = os.path.join(WEB_DIR, "dev-config.js")
    if not dev_mode:
        if os.path.exists(path):
            os.remove(path)
        return
    lines = [
        "// Written by dev-server.py at startup - gitignored, never deployed.",
        "window.TIGHC_DEV = {",
        "  repos: {",
        "    engine: '/dev-sibling/engine',",
        "    profiles: '/dev-sibling/profiles',",
        "    website: '/dev-sibling/website'",
        "  },",
        "  profilesApi: '/dev-api/profiles-contents',",
        "  port: %d" % port,
        "};",
        "(function () {",
        "  var banner = document.getElementById('dev-banner');",
        "  var detail = document.getElementById('dev-banner-detail');",
        "  if (detail) {",
        "    detail.textContent = 'TIGHC Website running on :' + window.TIGHC_DEV.port +",
        "      ' \\u2014 Engine/Profiles content served from local sibling checkouts, not GitHub.';",
        "  }",
        "  if (banner) banner.hidden = false;",
        "})();",
        "console.log('[TIGHC dev mode] Engine/Profiles/Website content is loaded from local sibling checkouts, not GitHub.');",
    ]
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")


class DevHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WEB_DIR, **kwargs)

    def translate_path(self, path):
        path = path.split("?", 1)[0].split("#", 1)[0]
        for key, real_dir in SIBLINGS.items():
            prefix = "/dev-sibling/" + key
            if path == prefix or path.startswith(prefix + "/"):
                rest = path[len(prefix):].lstrip("/")
                return os.path.join(real_dir, *rest.split("/")) if rest else real_dir
        return super().translate_path(path)

    def do_GET(self):
        if self.path.split("?", 1)[0] == "/dev-api/profiles-contents":
            return self.serve_profiles_contents()
        return super().do_GET()

    def serve_profiles_contents(self):
        profiles_dir = SIBLINGS["profiles"]
        entries = []
        if os.path.isdir(profiles_dir):
            for name in sorted(os.listdir(profiles_dir)):
                full = os.path.join(profiles_dir, name)
                if os.path.isdir(full) and not name.startswith(".") and name != "assets":
                    entries.append({"type": "dir", "name": name})
        body = json.dumps(entries).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


def main():
    port, dev_mode = parse_args(sys.argv[1:])
    write_dev_config(dev_mode, port)

    print("TIGHC Website running at http://127.0.0.1:%d" % port)
    if dev_mode:
        print("DEV_MODE forced on for this run - Engine/Profiles/Website content is served")
        print("from %s instead of GitHub." % PARENT_DIR)
        print("Pass --no-dev-mode to fetch from GitHub instead, matching production.")
        for key in ("engine", "profiles"):
            if not os.path.isdir(SIBLINGS[key]):
                print("Note: %s not found next to Website/ - %s content will 404 locally." % (SIBLINGS[key], key))
    else:
        print("DEV_MODE off for this run - Engine/Profiles/Website content is fetched live from GitHub, same as production.")

    with socketserver.TCPServer(("127.0.0.1", port), DevHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
