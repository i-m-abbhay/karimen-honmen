#!/usr/bin/env python3
"""Download images from karimen-honmen.com and build sign metadata."""

import json
import os
import re
import urllib.parse
import urllib.request
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
BASE = "https://karimen-honmen.com"
HTML_PATH = ROOT / "traffic-signs-source.html"

CHAPTER_IMAGES = {
    "safety-zone": [
        ("/images/shiji11.jpg", "Safety Zone Sign"),
        ("/images/p16.jpg", "When passing through a safety zone"),
    ],
    "horn-usage": [
        ("/images/kisei43m.jpg", "Honk sign"),
        ("/images/kisei44m.jpg", "Horn-required area sign"),
    ],
    "no-space-parking": [
        ("/images/kisei20.jpg", "Parking space requirement sign"),
    ],
    "priority-intersections": [
        ("/images/shiji05.jpg", "Priority road sign"),
        ("/images/p27_01.jpg", "Centerline extending into intersection", True),
        ("/images/p27_02.jpg", "Priority by direction of travel", True),
    ],
}


def download(path: str) -> str:
    """Download image to assets folder; return local relative path."""
    clean = path.lstrip("/")
    local = ASSETS / clean.replace("/", os.sep)
    local.parent.mkdir(parents=True, exist_ok=True)
    if local.exists() and local.stat().st_size > 0:
        return f"assets/{clean}"
    url = f"{BASE}/{clean}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            local.write_bytes(resp.read())
        print(f"  OK {clean}")
    except Exception as e:
        print(f"  FAIL {clean}: {e}")
    return f"assets/{clean}"


def parse_traffic_signs(html: str) -> dict:
    """Parse sign categories from traffic signs page HTML."""
    categories = []

    # Split by h2 section headers
    sections = re.split(r'<h2[^>]*class="[^"]*text-lg[^"]*"[^>]*>', html)
    headers = re.findall(r'<h2[^>]*class="[^"]*text-lg[^"]*"[^>]*>([^<]+)</h2>', html)

    for header, section in zip(headers, sections[1:]):
        header = unescape(header.strip())
        signs = []

        # Each sign: img + h3 title + optional description in table/p
        # Pattern used on site: flex/grid cards with img, h3, p or table row
        items = re.findall(
            r'<img[^>]*src="(/hyoushiki/[^"]+)"[^>]*(?:alt="([^"]*)")?[^>]*>'
            r'[\s\S]*?<h3[^>]*>([^<]+)</h3>'
            r'[\s\S]*?(?:<p[^>]*>([^<]*)</p>|<td[^>]*>([^<]+)</td>)?',
            section,
        )
        if not items:
            # alternate: h3 then img
            items = re.findall(
                r'<h3[^>]*>([^<]+)</h3>\s*<img[^>]*src="(/hyoushiki/[^"]+)"',
                section,
            )
            items = [(p, "", t, "", "") for t, p in items]

        for match in items:
            if len(match) == 5:
                src, alt, title, desc1, desc2 = match
            else:
                continue
            title = unescape(title.strip())
            desc = unescape((desc1 or desc2 or "").strip())
            signs.append({"src": src, "alt": alt or title, "title": title, "desc": desc})

        if not signs:
            # table format: img in first td, text in second
            rows = re.findall(
                r'<tr[^>]*>\s*<td[^>]*>\s*<img[^>]*src="(/hyoushiki/[^"]+)"[^>]*>'
                r'[\s\S]*?</td>\s*<td[^>]*>([\s\S]*?)</td>',
                section,
            )
            for src, cell in rows:
                text = re.sub(r"<[^>]+>", " ", cell)
                text = unescape(re.sub(r"\s+", " ", text).strip())
                # title often in strong or first sentence
                title_m = re.search(r"<strong[^>]*>([^<]+)</strong>", cell)
                title = unescape(title_m.group(1).strip()) if title_m else text[:60]
                signs.append({"src": src, "alt": title, "title": title, "desc": text})

        if signs:
            categories.append({"name": header, "signs": signs})

    return categories


def parse_traffic_signs_v2(html: str) -> dict:
    """Fallback: pair each hyoushiki image with nearest h3."""
    categories = []
    current = None

    # Find all elements in order
    tokens = re.findall(
        r'<h2[^>]*class="[^"]*text-lg[^"]*"[^>]*>([^<]+)</h2>|'
        r'<h3[^>]*>([^<]+)</h3>|'
        r'<img[^>]*src="(/hyoushiki/[^"]+)"[^>]*>',
        html,
    )

    signs = []
    for h2, h3, img in tokens:
        if h2:
            if current and signs:
                categories.append({"name": current, "signs": signs})
            current = unescape(h2.strip())
            signs = []
        elif h3:
            pending_title = unescape(h3.strip())
        elif img:
            title = locals().get("pending_title", img.split("/")[-1])
            signs.append({"src": img, "alt": title, "title": title, "desc": ""})
            pending_title = None

    if current and signs:
        categories.append({"name": current, "signs": signs})

    return categories


def main():
    ASSETS.mkdir(parents=True, exist_ok=True)

    # Download chapter-specific images
    chapter_assets = {}
    for chapter, images in CHAPTER_IMAGES.items():
        chapter_assets[chapter] = []
        print(f"\n{chapter}:")
        for item in images:
            path, caption = item[0], item[1]
            wide = item[2] if len(item) > 2 else False
            local = download(path)
            entry = {"src": local, "alt": caption, "caption": caption}
            if wide:
                entry["wide"] = True
            chapter_assets[chapter].append(entry)

    # Parse and download traffic signs
    print("\nTraffic signs:")
    html = HTML_PATH.read_text(encoding="utf-8")
    categories = parse_traffic_signs(html)
    if sum(len(c["signs"]) for c in categories) < 50:
        categories = parse_traffic_signs_v2(html)

    all_sign_paths = set()
    for cat in categories:
        for sign in cat["signs"]:
            all_sign_paths.add(sign["src"])

    # Also get any hyoushiki paths from HTML directly
    for path in re.findall(r'"(/hyoushiki/[^"]+)"', html):
        all_sign_paths.add(path)

    print(f"Downloading {len(all_sign_paths)} traffic sign images...")
    path_map = {}
    for i, path in enumerate(sorted(all_sign_paths)):
        path_map[path] = download(path)
        if (i + 1) % 20 == 0:
            print(f"  ... {i + 1}/{len(all_sign_paths)}")

    # Apply local paths
    for cat in categories:
        for sign in cat["signs"]:
            sign["local"] = path_map.get(sign["src"], download(sign["src"]))

    # If parsing failed, build minimal categories from filenames
    if sum(len(c["signs"]) for c in categories) < 50:
        categories = build_categories_from_paths(sorted(all_sign_paths), path_map)

    out = {
        "chapterImages": chapter_assets,
        "trafficSignCategories": categories,
    }
    out_path = ROOT / "assets" / "image-manifest.json"
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nWrote {out_path}")
    print(f"Categories: {len(categories)}, signs: {sum(len(c['signs']) for c in categories)}")


def build_categories_from_paths(paths, path_map):
    groups = {
        "Prohibition signs (regulations)": [],
        "Guide signs": [],
        "Warning signs": [],
        "Guide signs (instructions)": [],
        "Auxiliary signs (supplementary information)": [],
        "Other": [],
    }
    folder_map = {
        "kisei": "Prohibition signs (regulations)",
        "shiji": "Guide signs",
        "keikai": "Warning signs",
        "annai": "Guide signs (instructions)",
        "hojo": "Auxiliary signs (supplementary information)",
        "etc": "Other",
    }
    names = load_sign_names()
    for path in paths:
        parts = path.split("/")
        folder = parts[2] if len(parts) > 2 else "etc"
        cat = folder_map.get(folder, "Other")
        fname = parts[-1].split(".")[0]
        title = names.get(fname, fname.replace("_", " ").title())
        groups[cat].append({
            "src": path,
            "local": path_map.get(path, path),
            "alt": title,
            "title": title,
            "desc": names.get(fname + "_desc", ""),
        })
    return [{"name": k, "signs": v} for k, v in groups.items() if v]


def load_sign_names():
    """Sign names from original site content (English)."""
    return {
        "kisei01": "No Passage", "kisei02": "No Vehicle Passage", "kisei03": "No Vehicle Entry",
        "kisei04": "No Passage for Non-Motorcycle Vehicles", "kisei05": "No Passage for Large Cargo Vehicles",
        "kisei06": "No Passage for Cargo Vehicles Exceeding Max Load", "kisei07": "No Passage for Large Passenger Vehicles",
        "kisei08": "No Passage for Motorcycles and Motorized Bicycles", "kisei09": "No Passage for Light Vehicles Except Bicycles",
        "kisei10": "No Bicycle Passage", "kisei11": "No Passage for Specified Vehicle Combinations",
        "kisei12": "No Two-Person Riding on Large and Standard Motorcycles", "kisei13": "No Travel Except in Designated Direction",
        "kisei14": "No Vehicle Crossing", "kisei15": "No U-Turn", "kisei16": "No Overtaking by Crossing Right Side",
        "kisei17": "No Overtaking", "kisei18": "No Parking or Stopping", "kisei19": "No Parking",
        "kisei20": "Parking Space Requirement", "kisei21": "Time-Restricted Parking Zone",
        "kisei22": "No Passage for Hazardous Materials", "kisei23": "Weight Limit", "kisei24": "Height Limit",
        "kisei25": "Width Limit", "kisei26": "Maximum Speed", "kisei27": "Maximum Speed for Specific Vehicle Types",
        "kisei28": "Minimum Speed", "kisei29": "Motor Vehicles Only", "kisei30": "Bicycles Only",
        "kisei31": "Bicycles and Pedestrians Only", "kisei32": "Pedestrians Only", "kisei33": "One-Way Traffic",
        "kisei34": "Vehicle Lane Designation", "kisei35": "Lane Designation for Specific Vehicle Types",
        "kisei36": "Lane Designation for Towed Vehicles on Highways", "kisei37": "Dedicated Lane",
        "kisei38": "Priority Lane for Route Buses", "kisei39": "Designated First Lane for Towed Vehicles",
        "kisei40": "Directional Lane Designation", "kisei41": "Two-Stage Right Turn for Motorized Bicycles",
        "kisei42": "Small Right Turn for Motorized Bicycles", "kisei43": "Sound Horn", "kisei44": "Horn Use Zone",
        "kisei45": "Proceed Slowly", "kisei46": "Priority Road Ahead", "kisei47": "Stop",
        "kisei48": "Priority Road Ahead and Stop", "kisei49": "No Pedestrian Passage", "kisei50": "No Pedestrian Crossing",
        "kisei51": "Time-Restricted Parking for Elderly Drivers", "kisei52": "Clockwise Traffic at Roundabout",
        "kisei53": "One-Way Bicycle Traffic",
        "shiji01": "Bicycles May Ride Side by Side", "shiji02": "Vehicles Permitted on Tram Tracks",
        "shiji03": "Parking Permitted", "shiji04": "Stopping Permitted", "shiji05": "Priority Road",
        "shiji06": "Center Line", "shiji07": "Stop Line", "shiji08": "Pedestrian Crossing",
        "shiji09": "Bicycle Crossing", "shiji10": "Pedestrian and Bicycle Crossing", "shiji11": "Safety Zone",
        "shiji12": "Advance Notice of Regulation", "shiji13": "Stopping Permitted for Elderly Driver Vehicles",
        "keikai01": "Crossroad Intersection Ahead", "keikai02": "T-Shaped Intersection Ahead",
        "keikai03": "Y-Shaped Intersection Ahead", "keikai04": "Roundabout Ahead", "keikai05": "Right (Left) Curve Ahead",
        "keikai06": "Right (Left) Sharp Turn Ahead", "keikai07": "Right (Left) Reverse Curve Ahead",
        "keikai08": "Right (Left) Reverse Sharp Turn Ahead", "keikai09": "Right (Left) Hairpin Curve Ahead",
        "keikai10": "Railway Crossing Ahead", "keikai11": "School/Kindergarten/Nursery Ahead",
        "keikai12": "Traffic Signal Ahead", "keikai13": "Slippery Road", "keikai14": "Falling Rocks Hazard",
        "keikai15": "Uneven Road Surface", "keikai16": "Merging Traffic Ahead", "keikai17": "Lane Reduction Ahead",
        "keikai18": "Road Narrows Ahead", "keikai19": "Two-Way Traffic", "keikai20": "Steep Uphill Grade Ahead",
        "keikai21": "Steep Downhill Grade Ahead", "keikai22": "Road Work in Progress", "keikai23": "Crosswind Caution",
        "keikai24": "Animal Crossing Hazard", "keikai25": "Other Hazards",
        "etc01": "Novice Driver Sign", "etc02": "Elderly Driver Sign", "etc03": "Physically Disabled Driver Sign",
        "etc04": "Hearing-Impaired Driver Sign", "etc05": "Provisional License Practice Sign",
        "etc06": "Left Turn Permitted", "etc07": "Wheel Clamp Zone", "etc08": "Designated Fire Hydrant",
        "kisei43m": "Honk sign", "kisei44m": "Horn area sign",
        "p16": "Safety zone passing rule", "p27_01": "Priority road marking", "p27_02": "Priority by direction",
    }


if __name__ == "__main__":
    main()
