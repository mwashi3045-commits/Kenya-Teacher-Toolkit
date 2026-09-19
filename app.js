:root {
  --ink: #17343b;
  --muted: #5f7275;
  --teal: #0f766e;
  --teal-dark: #115e59;
  --panel: #f4fbf9;
  --line: #dfeeea;
  --cream: #fffdf8;
  --accent: #f59e0b;
  --danger: #b91c1c;
  --shadow: 0 18px 50px rgba(11, 39, 42, 0.08);
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  font-family: Inter, "Segoe UI", sans-serif;
  color: var(--ink);
  background: white;
}

a { color: inherit; text-decoration: none; }

button, input, select, textarea {
  font: inherit;
}

button { cursor: pointer; }

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem clamp(1rem, 2vw, 2rem);
  background: rgba(255, 255, 255, 0.94);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(12px);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 0.7rem;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 0.85rem;
  background: linear-gradient(135deg, var(--teal), #14b8a6);
  color: white;
  font-weight: 800;
  font-size: 1rem;
}

.brand-text strong {
  font-size: 1.05rem;
  text-transform: none;
  letter-spacing: 0;
}

#mainNav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

#mainNav a,
.nav-action {
  border: 0;
  background: none;
  color: var(--muted);
  font-weight: 600;
  border-radius: 999px;
  padding: 0.55rem 0.8rem;
}

#mainNav a:hover,
.nav-action:hover {
  background: rgba(15, 118, 110, 0.07);
  color: var(--teal);
}

.nav-action {
  border: 1px solid var(--line);
  background: white;
}

.nav-action.secondary {
  color: var(--teal);
}

.menu-button {
  display: none;
  width: 42px;
  height: 42px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: white;
  font-size: 1.2rem;
}

.section {
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(1.2rem, 2vw, 2rem) clamp(1rem, 2.5vw, 2.2rem);
}

.hero {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  align-items: center;
  background: linear-gradient(135deg, #ecfaf7, #f8fbf9, #f8f8ff);
  border-radius: 26px;
  margin-top: 1rem;
  gap: clamp(1.2rem, 3vw, 3rem);
  padding-block: clamp(2rem, 4vw, 4rem);
}

.hero-copy h1 {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.6rem, 5vw, 4.8rem);
  letter-spacing: -0.05em;
  line-height: 1.02;
  margin: 0.45rem 0 1rem;
}

.hero-copy p {
  color: var(--muted);
  line-height: 1.7;
  font-size: 1.05rem;
  max-width: 640px;
}

.eyebrow {
  margin: 0;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 800;
  color: var(--teal);
}

.hero-actions,
.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1.2rem;
}

.button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: 0;
  border-radius: 12px;
  padding: 0.8rem 1.2rem;
  font-weight: 700;
  transition: transform 0.15s ease;
}

.button:hover {
  transform: translateY(-1px);
}

.button.primary {
  background: linear-gradient(135deg, var(--teal), #14b8a6);
  color: white;
  box-shadow: 0 12px 24px rgba(15, 118, 110, 0.22);
}

.button.ghost {
  background: white;
  color: var(--teal);
  border: 1px solid var(--line);
}

.hero-panel {
  background: white;
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 1.5rem 1.2rem;
  box-shadow: var(--shadow);
}

.panel-tag {
  margin: 0;
  font-size: 0.7rem;
  color: #d97706;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 800;
}

.hero-panel h2 {
  font-size: clamp(1.7rem, 3vw, 2.7rem);
  margin: 0.5rem 0 0.7rem;
  font-family: Georgia, serif;
}

.mini-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: grid;
  gap: 0.8rem;
}

.mini-list li::before {
  content: "✓";
  display: inline-block;
  width: 1.2rem;
  color: var(--teal);
  font-weight: 800;
}

.stats-section { padding-top: 0; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.stat-card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 1rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 600;
}

.stat-card strong {
  font-size: clamp(1.8rem, 3vw, 2.2rem);
  letter-spacing: -0.04em;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.section-heading h2 {
  font-family: Georgia, serif;
  font-size: clamp(2rem, 3vw, 2.8rem);
  margin: 0.25rem 0 0;
  letter-spacing: -0.04em;
}

.band-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin: 0 0 1.2rem;
}

.band-button {
  border: 1px solid var(--line);
  background: white;
  color: var(--muted);
  border-radius: 999px;
  padding: 0.7rem 0.9rem;
  font-weight: 700;
}

.band-button.active {
  background: rgba(15, 118, 110, 0.08);
  color: var(--teal);
  border-color: rgba(15, 118, 110, 0.15);
}

.panel {
  background: var(--cream);
  border: 1px solid #f0ebdf;
  border-radius: 20px;
  padding: 1.2rem;
  box-shadow: 0 8px 24px rgba(18, 47, 51, 0.04);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.form-grid label {
  display: grid;
  gap: 0.45rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: #446368;
}

.full-width { grid-column: 1 / -1; }

input, select, textarea {
  width: 100%;
  border: 1px solid #d1e0db;
  background: white;
  border-radius: 10px;
  padding: 0.72rem 0.8rem;
  color: var(--ink);
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: rgba(15, 118, 110, 0.8);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
}

textarea {
  resize: vertical;
  min-height: 90px;
}

.output-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.output-card {
  background: white;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 1rem;
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.02);
}

.output-card h3 {
  margin: 0 0 0.8rem;
  font-size: 1.1rem;
}

.output-card pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font: 0.78rem/1.6 "SFMono-Regular", Consolas, monospace;
  color: var(--ink);
  background: #f9fafb;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 0.9rem;
}

.report-card-panel { margin-top: 1rem; }

footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 2.5rem;
  padding: 1.25rem clamp(1rem, 2vw, 2rem) 2rem;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.9rem;
}

.empty-state {
  color: var(--muted);
  margin: 0;
}

@media (max-width: 900px) {
  .hero,
  .stats-grid,
  .form-grid {
    grid-template-columns: 1fr;
  }

  #mainNav {
    position: absolute;
    top: 72px;
    right: 1rem;
    left: 1rem;
    display: none;
    flex-direction: column;
    align-items: stretch;
    background: white;
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 0.8rem;
    box-shadow: var(--shadow);
  }

  #mainNav.open {
    display: flex;
  }

  .menu-button { display: block; }
}

@media (max-width: 620px) {
  .section-heading,
  footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
