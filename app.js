:root {
  --ink: #17343b;
  --muted: #576f73;
  --teal: #0f766e;
  --teal-dark: #115e59;
  --accent: #f59e0b;
  --cream: #fffdf8;
  --panel: #f5faf9;
  --line: #dfece8;
  --danger: #b91c1c;
  --shadow: 0 18px 48px rgba(12, 39, 41, 0.09);
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  font-family: Inter, "Segoe UI", sans-serif;
  color: var(--ink);
  background: #ffffff;
}

img { max-width: 100%; }

a { color: inherit; text-decoration: none; }

button, input, select, textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem clamp(1rem, 2vw, 2rem);
  background: rgba(255, 255, 255, 0.94);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(12px);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
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
  letter-spacing: 0;
  text-transform: none;
}

#mainNav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

#mainNav a,
.nav-action {
  border: 0;
  background: none;
  color: var(--muted);
  font-weight: 600;
  padding: 0.55rem 0.8rem;
  border-radius: 999px;
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
  border: 1px solid var(--line);
  background: white;
  border-radius: 10px;
  width: 42px;
  height: 42px;
  font-size: 1.2rem;
}

.section {
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(1.4rem, 2vw, 2.2rem) clamp(1rem, 2.5vw, 2.3rem);
}

.hero {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
  gap: clamp(1.5rem, 3vw, 3rem);
  background: linear-gradient(135deg, #edfaf7, #f7fbf9, #f5f7ff);
  border-radius: 24px;
  margin-top: 1.2rem;
  padding-block: clamp(2rem, 4vw, 4rem);
}

.hero-copy-block h1 {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.5rem, 5vw, 4.7rem);
  line-height: 1.02;
  letter-spacing: -0.05em;
  margin: 0.35rem 0 1rem;
}

.hero-copy-block p {
  font-size: 1.06rem;
  line-height: 1.7;
  color: var(--muted);
  max-width: 620px;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--teal);
}

.hero-actions,
.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1.3rem;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 12px;
  padding: 0.8rem 1.2rem;
  font-weight: 700;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.button:hover {
  transform: translateY(-1px);
}

.button.primary {
  background: linear-gradient(135deg, var(--teal), #14b8a6);
  color: white;
  box-shadow: 0 10px 24px rgba(15, 118, 110, 0.25);
}

.button.ghost {
  background: white;
  color: var(--teal);
  border: 1px solid var(--line);
}

.button.small {
  padding: 0.55rem 0.8rem;
  font-size: 0.82rem;
}

.hero-panel {
  background: white;
  border: 1px solid var(--line);
  border-radius: 22px;
  padding: 1.5rem 1.35rem;
  box-shadow: var(--shadow);
}

.panel-tag {
  margin: 0;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #d97706;
  font-weight: 800;
}

.hero-panel h2 {
  margin: 0.6rem 0;
  font-size: clamp(1.6rem, 3vw, 2.5rem);
  font-family: Georgia, serif;
}

.hero-panel p {
  margin: 0 0 1rem;
  color: var(--muted);
  line-height: 1.6;
}

.mini-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: grid;
  gap: 0.7rem;
  color: var(--ink);
  font-weight: 600;
}

.mini-list li::before {
  content: "✓";
  display: inline-block;
  width: 1.3rem;
  color: var(--teal);
}

.stats-section {
  padding-top: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.stat-card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 1.1rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 600;
}

.stat-card strong {
  font-size: clamp(1.8rem, 3vw, 2.3rem);
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

.workspace-block {
  padding-top: 0;
}

.two-column-layout {
  display: grid;
  grid-template-columns: 1.4fr 0.9fr;
  gap: 1.1rem;
}

.panel {
  background: var(--cream);
  border: 1px solid #f0eadf;
  border-radius: 20px;
  padding: 1.2rem;
  box-shadow: 0 8px 24px rgba(23, 52, 59, 0.04);
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
  border: 1px solid #d0dfdb;
  border-radius: 10px;
  padding: 0.72rem 0.8rem;
  background: white;
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

.result-box {
  background: rgba(15, 118, 110, 0.05);
  border: 1px solid rgba(15, 118, 110, 0.15);
  border-radius: 12px;
  padding: 0.9rem 1rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.result-label {
  display: block;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin-bottom: 0.4rem;
}

#assessmentResult, #performanceLabel {
  font-size: 1.1rem;
}

.side-panel {
  min-height: 360px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.1rem;
  height: 2.1rem;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.1);
  color: var(--teal);
  font-weight: 800;
}

.list-stack {
  display: grid;
  gap: 0.8rem;
}

.list-item {
  background: white;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 0.85rem 0.9rem;
}

.list-item h4 {
  margin: 0 0 0.35rem;
  font-size: 1rem;
}

.list-item p {
  margin: 0.22rem 0;
  color: var(--muted);
  font-size: 0.86rem;
  line-height: 1.5;
}

.list-item .meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.5rem;
}

.list-item .tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(245, 158, 11, 0.14);
  color: #a15d00;
  border-radius: 999px;
  padding: 0.28rem 0.5rem;
  font-size: 0.72rem;
  font-weight: 700;
}

.item-actions {
  margin-top: 0.65rem;
  display: flex;
  gap: 0.5rem;
}

.icon-button {
  border: 1px solid var(--line);
  background: white;
  color: var(--ink);
  border-radius: 8px;
  padding: 0.45rem 0.6rem;
  font-size: 0.8rem;
}

.icon-button.delete {
  color: var(--danger);
}

footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  padding: 1.3rem clamp(1rem, 2vw, 2rem) 2.5rem;
  color: var(--muted);
  font-size: 0.9rem;
  border-top: 1px solid var(--line);
  margin-top: 2rem;
}

@media (max-width: 900px) {
  .hero,
  .two-column-layout,
  .stats-grid {
    grid-template-columns: 1fr;
  }

  #mainNav {
    position: absolute;
    top: 72px;
    right: 1rem;
    left: 1rem;
    padding: 0.8rem;
    display: none;
    flex-direction: column;
    align-items: stretch;
    background: white;
    border: 1px solid var(--line);
    border-radius: 16px;
    box-shadow: var(--shadow);
  }

  #mainNav.open {
    display: flex;
  }

  .menu-button {
    display: block;
  }
}

@media (max-width: 620px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .result-box,
  .section-heading,
  footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-copy-block h1 {
    letter-spacing: -0.04em;
  }
}
