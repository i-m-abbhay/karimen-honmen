#!/usr/bin/env python3
"""Build signs-content.js with titles and descriptions from source HTML."""

import json
import re
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML_PATH = ROOT / "traffic-signs-source.html"
MANIFEST_PATH = ROOT / "assets" / "image-manifest.json"
OUT_PATH = ROOT / "signs-content.js"

SIGN_NAMES = {
    "kisei01": "No Passage", "kisei02": "No Vehicle Passage", "kisei03": "No Vehicle Entry",
    "kisei04": "No Passage for Non-Motorcycle Vehicles", "kisei05": "No Passage for Large Cargo Vehicles, etc.",
    "kisei06": "No Passage for Cargo Vehicles Exceeding Specified Maximum Load",
    "kisei07": "No Passage for Large Passenger Vehicles, etc.",
    "kisei08": "No Passage for Motorcycles and Motorized Bicycles",
    "kisei09": "No Passage for Light Vehicles Except Bicycles", "kisei10": "No Bicycle Passage",
    "kisei11": "No Passage for Specified Vehicle Combinations",
    "kisei12": "No Two-Person Riding on Large and Standard Motorcycles",
    "kisei13": "No Travel Except in Designated Direction", "kisei14": "No Vehicle Crossing",
    "kisei15": "No U-Turn", "kisei16": "No Overtaking by Crossing Right Side",
    "kisei17": "No Overtaking", "kisei18": "No Parking or Stopping", "kisei19": "No Parking",
    "kisei20": "Parking Space Requirement", "kisei21": "Time-Restricted Parking Zone",
    "kisei22": "No Passage for Vehicles Carrying Hazardous Materials", "kisei23": "Weight Limit",
    "kisei24": "Height Limit", "kisei25": "Width Limit", "kisei26": "Maximum Speed",
    "kisei27": "Maximum Speed for Specific Vehicle Types", "kisei28": "Minimum Speed",
    "kisei29": "Motor Vehicles Only", "kisei30": "Bicycles Only",
    "kisei31": "Bicycles and Pedestrians Only", "kisei32": "Pedestrians Only",
    "kisei33": "One-Way Traffic", "kisei34": "Vehicle Lane Designation",
    "kisei35": "Lane Designation for Specific Vehicle Types",
    "kisei36": "Lane Designation for Towed Vehicles on Highways", "kisei37": "Dedicated Lane",
    "kisei38": "Priority Lane for Route Buses, etc.",
    "kisei39": "Designated First Lane for Towed Vehicles on Motor Vehicle Roads",
    "kisei40": "Directional Lane Designation",
    "kisei41": "Two-Stage Right Turn for Motorized Bicycles",
    "kisei42": "Small Right Turn for Motorized Bicycles", "kisei43": "Sound Horn",
    "kisei44": "Horn Use Zone", "kisei45": "Proceed Slowly", "kisei46": "Priority Road Ahead",
    "kisei47": "Stop", "kisei48": "Priority Road Ahead and Stop",
    "kisei49": "No Pedestrian Passage", "kisei50": "No Pedestrian Crossing",
    "kisei51": "Time-Restricted Parking Zone for Elderly Drivers, etc.",
    "kisei52": "Clockwise Traffic at Roundabout", "kisei53": "One-Way Bicycle Traffic",
    "shiji01": "Bicycles May Ride Side by Side", "shiji02": "Vehicles Permitted on Tram Tracks",
    "shiji03": "Parking Permitted", "shiji04": "Stopping Permitted", "shiji05": "Priority Road",
    "shiji06": "Center Line", "shiji07": "Stop Line", "shiji08": "Pedestrian Crossing",
    "shiji09": "Bicycle Crossing", "shiji10": "Pedestrian and Bicycle Crossing",
    "shiji11": "Safety Zone", "shiji12": "Advance Notice of Regulation",
    "shiji13": "Stopping Permitted for Elderly Driver Designated Vehicles",
    "keikai01": "Crossroad Intersection Ahead", "keikai02": "T-Shaped Intersection Ahead",
    "keikai03": "Y-Shaped Intersection Ahead", "keikai04": "Roundabout Ahead",
    "keikai05": "Right (Left) Curve Ahead", "keikai06": "Right (Left) Sharp Turn Ahead",
    "keikai07": "Right (Left) Reverse Curve Ahead", "keikai08": "Right (Left) Reverse Sharp Turn Ahead",
    "keikai09": "Right (Left) Hairpin Curve Ahead", "keikai10": "Railway Crossing Ahead",
    "keikai11": "School, Kindergarten, Nursery, etc. Ahead", "keikai12": "Traffic Signal Ahead",
    "keikai13": "Slippery Road", "keikai14": "Falling Rocks Hazard", "keikai15": "Uneven Road Surface",
    "keikai16": "Merging Traffic Ahead", "keikai17": "Lane Reduction Ahead",
    "keikai18": "Road Narrows Ahead", "keikai19": "Two-Way Traffic",
    "keikai20": "Steep Uphill Grade Ahead", "keikai21": "Steep Downhill Grade Ahead",
    "keikai22": "Road Work in Progress", "keikai23": "Crosswind Caution",
    "keikai24": "Animal Crossing Hazard", "keikai25": "Other Hazards",
    "annai01": "Municipality", "annai02": "Prefecture", "annai03": "Prefecture",
    "annai04": "Entrance Direction", "annai05": "Entrance Advance Notice",
    "annai06": "Designated Road with Relaxed Gross Weight Limit",
    "annai07": "Designated Road with Relaxed Height Limit", "annai08": "Direction and Distance",
    "annai09": "Direction and Lane", "annai10": "Exit Advance Notice",
    "annai11": "Direction and Orientation Advance Notice", "annai12": "Direction and Orientation",
    "annai13": "Direction, Orientation, and Distance",
    "annai14": "Direction, Orientation, and Road Nickname Advance Notice",
    "annai15": "Direction, Orientation, and Road Nickname",
    "annai16": "Direction and Exit Advance Notice", "annai17": "Direction, Lane, and Exit Advance Notice",
    "annai18": "Direction and Exit", "annai19": "Exit", "annai20": "Notable Location",
    "annai21": "Major Location", "annai22": "Toll Booth", "annai23": "Service Area Advance Notice",
    "annai24": "Service Area", "annai25": "Emergency Telephone", "annai26": "Pull-off Area",
    "annai27": "Emergency Parking Strip", "annai28": "Parking Lot", "annai29": "Climbing Lane",
    "annai30": "National Highway Number", "annai31": "Prefectural Road Number",
    "annai32": "Road Nickname", "annai33": "Detour", "annai34": "Sloped Road",
    "annai35": "Bus Stop", "annai36": "Tram Stop",
    "hojo01": "Distance/Area", "hojo02": "Day/Time", "hojo03": "Vehicle Type",
    "hojo04": "Parking Space", "hojo05": "Start", "hojo06": "Within Section/Area",
    "hojo07": "End", "hojo08": "No Overtaking", "hojo09": "School Route",
    "hojo10": "Railway Crossing Caution", "hojo11": "Crosswind Caution", "hojo12": "Animal Caution",
    "hojo13": "Caution", "hojo14": "Caution Notes", "hojo15": "Reason for Restriction",
    "hojo16": "Direction", "hojo17": "Place Name", "hojo18": "Priority Road Ahead",
    "hojo19": "Starting Point", "hojo20": "Endpoint", "hojo21": "Designated Vehicle Only",
    "etc01": "Novice Driver Sign", "etc02": "Elderly Driver Sign",
    "etc03": "Physically Disabled Driver Sign", "etc04": "Hearing-Impaired Driver Sign",
    "etc05": "Provisional License Practice Sign", "etc06": "Left Turn Permitted",
    "etc07": "Wheel Clamp Zone", "etc08": "Designated Fire Hydrant",
}

# Downloaded keikai image files are offset by one from keikai03 onward; map each
# file to the title that matches the pictogram actually stored on disk.
KEIKAI_VISUAL_TITLE_OVERRIDES = {
    "keikai03": "T-Shaped Intersection Ahead",
    "keikai04": "Y-Shaped Intersection Ahead",
    "keikai05": "Roundabout Ahead",
    "keikai06": "Right (Left) Curve Ahead",
    "keikai07": "Right (Left) Sharp Turn Ahead",
    "keikai08": "Right (Left) Reverse Curve Ahead",
    "keikai09": "Right (Left) Reverse Sharp Turn Ahead",
    "keikai10": "Right (Left) Hairpin Curve Ahead",
    "keikai11": "Railway Crossing Ahead",
    "keikai12": "School, Kindergarten, Nursery, etc. Ahead",
    "keikai13": "Traffic Signal Ahead",
    "keikai14": "Slippery Road",
    "keikai15": "Falling Rocks Hazard",
    "keikai16": "Uneven Road Surface",
    "keikai17": "Merging Traffic Ahead",
    "keikai18": "Lane Reduction Ahead",
    "keikai19": "Road Narrows Ahead",
    "keikai20": "Two-Way Traffic",
    "keikai21": "Steep Uphill Grade Ahead",
    "keikai22": "Steep Downhill Grade Ahead",
    "keikai23": "Road Work in Progress",
    "keikai24": "Crosswind Caution",
    "keikai25": "Animal Crossing Hazard",
    "keikai26": "Other Hazards",
}

SIGN_DESCRIPTIONS = {
    "kisei01": "No passage is allowed for all pedestrians, vehicles, and trams.",
    "kisei02": "Vehicles (automobiles, motorized bicycles, and light vehicles) are not allowed to pass.",
    "kisei03": "Vehicles are not allowed to enter (often placed at the exit of one-way roads).",
    "kisei16": "Vehicles must not cross to the right side of the road to overtake (overtaking without crossing to the right side is allowed).",
    "kisei18": "Vehicles are not allowed to park or stop (numbers indicate prohibited hours).",
    "kisei19": "Vehicles are not allowed to park (stopping briefly is allowed).",
    "kisei20": "Vehicles must not park unless there is the parking space indicated by the supplementary sign on the right side.",
    "kisei26": "Vehicles must not exceed the maximum speed indicated. Motorized bicycles follow legal limit if sign exceeds it.",
    "kisei43": "Indicates a location where vehicles and trams must sound their horn.",
    "kisei44": "Indicates a zone where vehicles and trams must sound their horn.",
    "kisei47": "Vehicles must stop immediately before the stop line, or before the intersection if no stop line.",
    "shiji05": "Indicates that the road with the sign is a priority road.",
    "shiji11": "Indicates a safety zone for pedestrians where vehicles are not allowed to pass.",
    "etc01": "Required within one year of obtaining a license. Surrounding drivers must protect these vehicles.",
    "etc05": "Required to be displayed by provisional license holders when practicing on the road.",
}


def parse_descriptions_from_html(html: str) -> dict:
    descs = dict(SIGN_DESCRIPTIONS)
    rows = re.findall(
        r'<tr[^>]*>\s*<td[^>]*>\s*<img[^>]*src="/hyoushiki/[^"]+/([^/"]+)\.[^"]+"[^>]*>'
        r'[\s\S]*?</td>\s*<td[^>]*>([\s\S]*?)</td>',
        html,
    )
    for fname, cell in rows:
        text = re.sub(r"<[^>]+>", " ", cell)
        text = unescape(re.sub(r"\s+", " ", text).strip())
        if text:
            descs[fname] = text
    return descs


def fix_local_path(path: str) -> str:
    return path.replace("assets/images/images/", "assets/images/")


def title_for_sign(local_path: str, descs: dict) -> tuple[str, str]:
    fname = Path(local_path).stem
    title = KEIKAI_VISUAL_TITLE_OVERRIDES.get(fname) or SIGN_NAMES.get(fname, fname)
    desc = descs.get(fname, "")
    return title, desc


def main():
    html = HTML_PATH.read_text(encoding="utf-8")
    descs = parse_descriptions_from_html(html)

    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    categories = []

    folder_order = [
        "Prohibition signs (regulations)",
        "Guide signs",
        "Warning signs",
        "Guide signs (instructions)",
        "Auxiliary signs (supplementary information)",
        "Other",
    ]

    for cat in manifest["trafficSignCategories"]:
        signs = []
        for sign in cat["signs"]:
            local = fix_local_path(sign.get("local", ""))
            fname = Path(local).stem
            title, desc = title_for_sign(local, descs)
            signs.append({"img": local, "title": title, "desc": desc})
        categories.append({"name": cat["name"], "signs": signs})

    categories.sort(key=lambda c: folder_order.index(c["name"]) if c["name"] in folder_order else 99)

    chapter_images = {}
    for ch, imgs in manifest["chapterImages"].items():
        chapter_images[ch] = []
        for i in imgs:
            entry = {
                "img": fix_local_path(i["src"]),
                "alt": i["alt"],
                "caption": i.get("caption", i["alt"]),
            }
            if i.get("wide"):
                entry["wide"] = True
            chapter_images[ch].append(entry)

    out = f"const CHAPTER_IMAGES = {json.dumps(chapter_images, ensure_ascii=False, indent=2)};\n\n"
    out += f"const TRAFFIC_SIGN_CATEGORIES = {json.dumps(categories, ensure_ascii=False, indent=2)};\n"
    OUT_PATH.write_text(out, encoding="utf-8")
    print(f"Wrote {OUT_PATH} ({len(categories)} categories, {sum(len(c['signs']) for c in categories)} signs)")


if __name__ == "__main__":
    main()
