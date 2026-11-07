# Karimen Knowledge Hub

A study site for the Japanese driving license written tests: **karimen** (仮免, the provisional license test) and **honmen** (本免, the full license test). I built it while preparing for the test myself in Nagasaki.

**Live site:** https://i-m-abbhay.github.io/karimen-honmen/

## What's inside

- **Study chapters**: short lessons on traffic signs, speed limits, parking and stopping, right of way, stopping distance, hydroplaning, vehicle checks and more.
- **Practice exams**: 16 karimen and 16 honmen true/false exams with scoring and a history of past attempts.
- **Image test and situation test**: question sets built around road signs and illustrated driving situations.
- **Chapter quiz mix**: random questions across chapters for quick review.
- **One-shot revision PDF**: download a printable summary with diagrams, signs and exam Q&A tables, and pick the sections you want.

Progress and exam history are saved in your browser (`localStorage`). There is no account and no server.

## Run locally

It's a static site with no build step:

```bash
git clone https://github.com/i-m-abbhay/karimen-honmen.git
cd karimen-honmen
python -m http.server 8000
```

Then open http://localhost:8000.

## Tech

Plain HTML, CSS and JavaScript, with [jsPDF](https://github.com/parallax/jsPDF) and jsPDF-AutoTable for the PDF export. Deployed to GitHub Pages by `.github/workflows/pages.yml`.
