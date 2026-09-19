# Kenya Teacher Toolkit

A mobile-friendly, offline-first MVP for Kenyan teachers working with CBC/CBE classroom needs.

## Current MVP

- Dashboard with quick access to core teaching tools
- Lesson planner with learning area, grade, topic, outcomes, activities and resources
- Score calculator with validation and simple performance feedback
- Learner progress report form
- Device-local saving through `localStorage` (no account or server required yet)
- Export/import of lesson plans and reports as a JSON workspace file
- Print-ready browser output
- Responsive layout for phones, tablets and desktop

## Run locally

This is a dependency-free static web app. Open `index.html` in a browser, or serve the directory with any static server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Test locally

Open `tests/index.html` in a browser. It runs the score-calculator smoke tests without installing dependencies. When using a local server, visit `http://localhost:8000/tests/`.

## Suggested next milestones

1. Add richer assessment records and learner lists.
2. Add PDF and Word export behind a small backend service.
3. Add optional teacher accounts and school workspaces.
4. Add a secure, opt-in AI lesson assistant and M-Pesa payments only after privacy, consent and server-side verification are designed.
