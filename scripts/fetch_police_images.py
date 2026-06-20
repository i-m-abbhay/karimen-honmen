#!/usr/bin/env python3
"""Download police hand signal reference images from official Japanese police sites."""

import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / "assets" / "images" / "police-signals"
DEST.mkdir(parents=True, exist_ok=True)

# Saga Prefectural Police + Ehime Prefectural Police (official traffic education)
FILES = {
    "horizontal-arms.jpg": "https://www.police.pref.saga.jp/var/rev0/0009/9764/1127593448.JPG",
    "vertical-arms.jpg": "https://www.police.pref.saga.jp/var/rev0/0009/9765/1127595223.JPG",
    "horizontal-diagram.gif": "http://www.police.pref.ehime.jp/kotsukikaku/teshingo/image2.gif",
}

def main():
    for name, url in FILES.items():
        out = DEST / name
        if out.exists() and out.stat().st_size > 0:
            print(f"skip {name}")
            continue
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                out.write_bytes(resp.read())
            print(f"ok {name} ({out.stat().st_size} bytes)")
        except Exception as e:
            print(f"fail {name}: {e}")

if __name__ == "__main__":
    main()
