"""Parse karimen-honmen.com exam page HTML and extract questions."""
import re
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def parse_exam_html(html: str) -> list[dict]:
    chunks = re.findall(r'self\.__next_f\.push\(\[1,"(.*?)"\]\)', html, re.DOTALL)
    full = "".join(chunks)
    # Unescape common Next.js escapes
    full = full.replace("\\n", "\n").replace('\\"', '"').replace("\\\\", "\\")

    questions = []

    # Pattern: question objects with text and boolean answer
    for m in re.finditer(
        r'\{"id":\d+,"text":"((?:[^"\\]|\\.)*)","answer":(true|false)(?:,"image":"([^"]*)")?\}',
        full,
    ):
        text = json.loads(f'"{m.group(1)}"')
        answer = 1 if m.group(2) == "true" else 0
        q = {"q": text, "answer": answer}
        if m.group(3):
            q["img"] = m.group(3)
        questions.append(q)

    if questions:
        return questions

    # Alternate: look for question array in RSC payload
    for m in re.finditer(r'"text":"((?:[^"\\]|\\.)*)","answer":(true|false)', full):
        text = json.loads(f'"{m.group(1)}"')
        answer = 1 if m.group(2) == "true" else 0
        questions.append({"q": text, "answer": answer})

    return questions


def main():
    src = ROOT / "exam-source-16.html"
    if len(sys.argv) > 1:
        src = Path(sys.argv[1])
    html = src.read_text(encoding="utf-8")
    questions = parse_exam_html(html)
    print(f"Found {len(questions)} questions")
    if questions:
        print(json.dumps(questions[:3], indent=2, ensure_ascii=False))
        out = ROOT / "exams" / "karimen-16.json"
        out.parent.mkdir(exist_ok=True)
        exam = {
            "id": "karimen-16",
            "title": "Karimen Practice Test 16",
            "type": "karimen",
            "number": 16,
            "source": "https://karimen-honmen.com/en/exam/karimen/16",
            "passScore": 90,
            "pointsPerQuestion": 2,
            "timeLimitMinutes": 30,
            "questions": questions,
        }
        out.write_text(json.dumps(exam, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"Wrote {out}")


if __name__ == "__main__":
    main()
