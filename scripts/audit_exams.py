#!/usr/bin/env python3
"""Audit True/False answer distribution in exam JSON files."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXAMS_DIR = ROOT / "exams"


def audit(exam_type: str = "karimen") -> None:
    files = sorted(
        EXAMS_DIR.glob(f"{exam_type}-*.json"),
        key=lambda p: int(p.stem.split("-")[1]),
    )
    print(f"{'id':<14} {'True':>5} {'False':>5} {'expl':>5}  status")
    print("-" * 45)
    broken = []
    for path in files:
        data = json.loads(path.read_text(encoding="utf-8"))
        qs = data["questions"]
        true_n = sum(1 for q in qs if q["answer"] == 1)
        false_n = sum(1 for q in qs if q["answer"] == 0)
        expl_n = sum(1 for q in qs if q.get("explanation"))
        if true_n == 0:
            status = "BROKEN (all False)"
            broken.append(data["id"])
        elif false_n == 0:
            status = "BROKEN (all True)"
            broken.append(data["id"])
        else:
            status = "ok"
        print(f"{data['id']:<14} {true_n:>5} {false_n:>5} {expl_n:>5}  {status}")
    if broken:
        print(f"\nBroken exams ({len(broken)}): {', '.join(broken)}")
    else:
        print("\nAll exams look healthy.")


if __name__ == "__main__":
    audit(sys.argv[1] if len(sys.argv) > 1 else "karimen")
