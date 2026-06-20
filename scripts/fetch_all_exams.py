#!/usr/bin/env python3
"""Fetch all Karimen/Honmen practice exams from karimen-honmen.com."""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from fetch_exam import (  # noqa: E402
    fetch_and_save,
    rebuild_exams_js,
    update_catalog,
)


def fetch_exam(exam_type: str, number: int, skip_existing: bool = True) -> bool:
    exam_id = f"{exam_type}-{number}"
    out = ROOT / "exams" / f"{exam_id}.json"
    if skip_existing and out.exists():
        print(f"Skip {exam_id} (already exists)")
        return True

    print(f"\n=== Fetching {exam_id} ===")
    try:
        fetch_and_save(exam_type, number)
        return True
    except Exception as exc:
        print(f"FAILED {exam_id}: {exc}")
        return False


def main() -> None:
    skip = "--force" not in sys.argv
    karimen_range = range(1, 17)
    honmen_range = range(1, 17)

    ok = 0
    fail = 0
    for n in karimen_range:
        if fetch_exam("karimen", n, skip_existing=skip):
            ok += 1
        else:
            fail += 1

    for n in honmen_range:
        if fetch_exam("honmen", n, skip_existing=skip):
            ok += 1
        else:
            fail += 1

    rebuild_exams_js()
    print(f"\nDone: {ok} ok, {fail} failed")


if __name__ == "__main__":
    main()
