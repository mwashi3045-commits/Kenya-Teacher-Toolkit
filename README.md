# Kenya Teacher Toolkit

A mobile-friendly, offline-first MVP for Kenyan teachers working with CBC/CBE classroom needs.

## Current MVP

- Dashboard with quick access to core teaching tools
- Lesson planner with learning area, grade, topic, outcomes, activities and resources
- Score calculator with percentage and simple performance feedback
- Learner progress report form
- Device-local saving through `localStorage` (no account or server required yet)
- Print-ready browser output
- Responsive layout for phones, tablets and desktop

## Run locally

This is a dependency-free static web app. Open `index.html` in a browser, or serve the directory with any static server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Suggested next milestones

1. Add automated tests for score calculations and form validation.
2. Add structured lesson/report data and JSON export/import.
3. Add PDF and Word export behind a small backend service.
4. Add optional teacher accounts and school workspaces.
5. Add a secure, opt-in AI lesson assistant and M-Pesa payments only after privacy, consent and server-side verification are designed.
