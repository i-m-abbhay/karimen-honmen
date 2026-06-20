#!/usr/bin/env python3
"""Fetch Karimen/Honmen practice exam from karimen-honmen.com.

Uses the public exam.json API for authoritative question text and answers.

Usage:
  python scripts/fetch_exam.py https://karimen-honmen.com/en/exam/karimen/16
  python scripts/fetch_exam.py karimen 16
  python scripts/fetch_exam.py karimen 6-15   # range
"""

from __future__ import annotations

import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXAMS_DIR = ROOT / "exams"
ASSETS_DIR = ROOT / "assets" / "images" / "exams"
BASE = "https://karimen-honmen.com"


def parse_url(arg: str) -> tuple[str, int]:
    m = re.search(r"/exam/(karimen|honmen)/(\d+)", arg)
    if m:
        return m.group(1), int(m.group(2))
    if len(sys.argv) >= 3 and sys.argv[1] in ("karimen", "honmen"):
        return sys.argv[1], int(sys.argv[2])
    raise ValueError(f"Cannot parse exam URL or id: {arg}")


def parse_range_args(argv: list[str]) -> list[tuple[str, int]]:
    """Parse CLI args into (exam_type, number) pairs. Supports ranges like karimen 6-15."""
    if not argv:
        return [("karimen", 16)]

    if len(argv) == 1:
        if argv[0].startswith("http"):
            exam_type, number = parse_url(argv[0])
            return [(exam_type, number)]
        if "-" in argv[0] and argv[0][0].isdigit():
            start, end = map(int, argv[0].split("-", 1))
            exam_type = "karimen"
            return [(exam_type, n) for n in range(start, end + 1)]

    if len(argv) >= 2 and argv[0] in ("karimen", "honmen"):
        exam_type = argv[0]
        spec = argv[1]
        if "-" in spec:
            start, end = map(int, spec.split("-", 1))
            return [(exam_type, n) for n in range(start, end + 1)]
        return [(exam_type, int(spec))]

    exam_type, number = parse_url(argv[0])
    return [(exam_type, number)]


def download_file(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 0:
        return
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            dest.write_bytes(resp.read())
    except Exception as exc:
        print(f"  warn: could not download {url}: {exc}")


def resolve_image_url(exam_type: str, number: int, image_ref: str) -> str:
    ref = image_ref.strip().lstrip("./")
    if ref.startswith("images/"):
        return f"{BASE}/{exam_type}/exams/{number}/{ref}"
    if "練習問題画面_files" in ref or ref.endswith((".gif", ".png", ".jpg", ".jpeg")):
        name = Path(ref).name
        return f"{BASE}/{exam_type}/exams/{number}/%E7%B7%B4%E7%BF%92%E5%95%8F%E9%A1%8C%E7%94%BB%E9%9D%A2_files/{name}"
    return f"{BASE}/{exam_type}/exams/{number}/{ref}"


def local_image_path(exam_type: str, number: int, image_ref: str) -> str:
    name = Path(image_ref).name
    local = ASSETS_DIR / exam_type / str(number) / name
    remote = resolve_image_url(exam_type, number, image_ref)
    download_file(remote, local)
    return str(local.relative_to(ROOT)).replace("\\", "/")


def fetch_exam_json(exam_type: str, number: int) -> list[dict]:
    url = f"{BASE}/{exam_type}/exams/{number}/exam.json"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def build_exam_from_api(items: list[dict], exam_type: str, number: int) -> dict:
    questions = []
    for item in sorted(items, key=lambda x: x["question"]):
        answer = 1 if item.get("correct") else 0
        q: dict = {
            "q": item["en"],
            "answer": answer,
        }
        if answer == 0 and item.get("explanation_en"):
            q["explanation"] = item["explanation_en"]
        images = item.get("images") or []
        if images:
            q["img"] = local_image_path(exam_type, number, images[0])
        questions.append(q)

    if exam_type == "honmen":
        for i, q in enumerate(questions):
            q["points"] = 2 if i >= 90 else 1
        return {
            "id": f"{exam_type}-{number}",
            "title": f"Honmen Practice Test {number}",
            "type": exam_type,
            "number": number,
            "source": f"{BASE}/en/exam/{exam_type}/{number}",
            "passScore": 90,
            "maxScore": 100,
            "timeLimitMinutes": 50,
            "questionCount": len(questions),
            "questions": questions,
        }

    for q in questions:
        q["points"] = 2
    return {
        "id": f"{exam_type}-{number}",
        "title": f"Karimen Practice Test {number}",
        "type": exam_type,
        "number": number,
        "source": f"{BASE}/en/exam/{exam_type}/{number}",
        "passScore": 90,
        "maxScore": 100,
        "pointsPerQuestion": 2,
        "timeLimitMinutes": 30,
        "questionCount": len(questions),
        "questions": questions,
    }


def update_catalog(exam: dict) -> None:
    catalog_path = ROOT / "exams-catalog.json"
    catalog = []
    if catalog_path.exists():
        catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    entry = {
        "id": exam["id"],
        "title": exam["title"],
        "type": exam["type"],
        "number": exam["number"],
        "file": f"exams/{exam['id']}.json",
        "questionCount": exam["questionCount"],
        "passScore": exam["passScore"],
        "maxScore": exam.get("maxScore", 100),
        "timeLimitMinutes": exam["timeLimitMinutes"],
    }
    catalog = [e for e in catalog if e["id"] != exam["id"]]
    catalog.append(entry)
    catalog.sort(key=lambda e: (e["type"], e["number"]))
    catalog_path.write_text(json.dumps(catalog, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Updated {catalog_path}")


def rebuild_exams_js() -> None:
    catalog_path = ROOT / "exams-catalog.json"
    if not catalog_path.exists():
        return
    catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    exams = {}
    for entry in catalog:
        data = json.loads((ROOT / entry["file"]).read_text(encoding="utf-8"))
        exams[entry["id"]] = data
    out = ROOT / "exams-data.js"
    out.write_text(
        "const EXAM_CATALOG = "
        + json.dumps(catalog, indent=2, ensure_ascii=False)
        + ";\n\nconst EXAMS = "
        + json.dumps(exams, indent=2, ensure_ascii=False)
        + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {out}")


def fetch_and_save(exam_type: str, number: int) -> dict:
    api_url = f"{BASE}/{exam_type}/exams/{number}/exam.json"
    print(f"Fetching {api_url} ...")
    items = fetch_exam_json(exam_type, number)
    if len(items) < 10:
        raise SystemExit(f"Expected ~50 questions, got {len(items)}")

    exam = build_exam_from_api(items, exam_type, number)
    true_n = sum(1 for q in exam["questions"] if q["answer"] == 1)
    false_n = len(exam["questions"]) - true_n
    print(f"  {exam['id']}: {len(exam['questions'])} questions (True={true_n}, False={false_n})")

    EXAMS_DIR.mkdir(exist_ok=True)
    out = EXAMS_DIR / f"{exam['id']}.json"
    out.write_text(json.dumps(exam, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"  Wrote {out}")
    update_catalog(exam)
    return exam


def main() -> None:
    targets = parse_range_args(sys.argv[1:])
    for exam_type, number in targets:
        fetch_and_save(exam_type, number)

    rebuild_exams_js()


if __name__ == "__main__":
    main()
