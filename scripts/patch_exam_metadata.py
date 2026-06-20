"""Patch existing exam JSON files with points/maxScore metadata."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXAMS_DIR = ROOT / "exams"

for path in sorted(EXAMS_DIR.glob("*.json")):
    exam = json.loads(path.read_text(encoding="utf-8"))
    changed = False
    if exam["type"] == "honmen":
        if exam.get("timeLimitMinutes") != 50:
            exam["timeLimitMinutes"] = 50
            changed = True
        exam["maxScore"] = 100
        for i, q in enumerate(exam["questions"]):
            pts = 2 if i >= 90 else 1
            if q.get("points") != pts:
                q["points"] = pts
                changed = True
        if exam.get("title", "").startswith("Honmen") is False:
            exam["title"] = f"Honmen Practice Test {exam['number']}"
            changed = True
    else:
        exam["maxScore"] = 100
        if exam.get("timeLimitMinutes") != 30:
            exam["timeLimitMinutes"] = 30
            changed = True
        for q in exam["questions"]:
            if q.get("points") != 2:
                q["points"] = 2
                changed = True
        if not exam.get("title", "").startswith("Karimen"):
            exam["title"] = f"Karimen Practice Test {exam['number']}"
            changed = True
    if changed:
        path.write_text(json.dumps(exam, indent=2, ensure_ascii=False), encoding="utf-8")
        print("patched", path.name)

# rebuild catalog + js
import sys
sys.path.insert(0, str(ROOT / "scripts"))
from fetch_exam import rebuild_exams_js
rebuild_exams_js()
