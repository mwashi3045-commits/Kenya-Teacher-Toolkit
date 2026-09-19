const $ = (selector) => document.querySelector(selector);
const status = $('#savedStatus');
const STORAGE_PREFIX = 'ktt:';

function showStatus(message) {
  if (!status) return;
  status.textContent = message;
  window.clearTimeout(showStatus.timer);
  showStatus.timer = window.setTimeout(() => { status.textContent = 'All changes saved locally'; }, 2200);
}

function formDataObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function saveForm(form, announce = true) {
  localStorage.setItem(`${STORAGE_PREFIX}${form.id}`, JSON.stringify(formDataObject(form)));
  if (announce) showStatus('Saved just now');
}

function restoreForm(form) {
  const raw = localStorage.getItem(`${STORAGE_PREFIX}${form.id}`);
  if (!raw) return;
  try {
    Object.entries(JSON.parse(raw)).forEach(([key, value]) => {
      const field = form.elements.namedItem(key);
      if (field) field.value = value;
    });
  } catch { localStorage.removeItem(`${STORAGE_PREFIX}${form.id}`); }
}

function download(filename, content, type = 'application/json') {
  const blob = new Blob([content], { type });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function exportWorkspace() {
  const forms = [...document.querySelectorAll('form')];
  const payload = {
    app: 'Kenya Teacher Toolkit',
    version: 1,
    exportedAt: new Date().toISOString(),
    forms: Object.fromEntries(forms.map((form) => [form.id, formDataObject(form)]))
  };
  download(`kenya-teacher-toolkit-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(payload, null, 2));
  showStatus('Workspace exported');
}

function importWorkspace(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result);
      if (!payload || payload.app !== 'Kenya Teacher Toolkit' || !payload.forms) throw new Error('Invalid toolkit file');
      Object.entries(payload.forms).forEach(([id, values]) => {
        const form = document.getElementById(id);
        if (!form || !values || typeof values !== 'object') return;
        Object.entries(values).forEach(([key, value]) => {
          const field = form.elements.namedItem(key);
          if (field) field.value = String(value);
        });
        saveForm(form, false);
      });
      showStatus('Workspace imported');
    } catch { alert('That file is not a valid Kenya Teacher Toolkit export.'); }
  };
  reader.readAsText(file);
}

// Add export/import controls without requiring a backend or account.
function addWorkspaceControls() {
  const heading = document.querySelector('#dashboard .hero-actions');
  if (!heading) return;
  const exportButton = document.createElement('button');
  exportButton.className = 'button ghost';
  exportButton.type = 'button';
  exportButton.textContent = 'Export workspace';
  exportButton.addEventListener('click', exportWorkspace);
  const importButton = document.createElement('button');
  importButton.className = 'button ghost';
  importButton.type = 'button';
  importButton.textContent = 'Import workspace';
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'application/json,.json'; input.hidden = true;
  importButton.addEventListener('click', () => input.click());
  input.addEventListener('change', () => { if (input.files[0]) importWorkspace(input.files[0]); input.value = ''; });
  heading.append(exportButton, importButton, input);
}

document.querySelectorAll('form').forEach((form) => {
  restoreForm(form);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    saveForm(form);
    alert(`${form.id === 'lessonForm' ? 'Lesson plan' : 'Learner report'} saved on this device.`);
  });
});

document.querySelectorAll('[data-clear]').forEach((button) => button.addEventListener('click', () => {
  const form = document.getElementById(button.dataset.clear);
  form.reset();
  localStorage.removeItem(`${STORAGE_PREFIX}${form.id}`);
  showStatus('Form cleared');
}));

document.querySelectorAll('[data-print]').forEach((button) => button.addEventListener('click', () => {
  const form = document.getElementById(button.dataset.print);
  if (!form.checkValidity()) { form.reportValidity(); return; }
  window.print();
}));
$('#printDashboard')?.addEventListener('click', () => window.print());

function calculate() {
  const scored = Number($('#scored').value);
  const total = Number($('#total').value);
  const valid = Number.isFinite(scored) && Number.isFinite(total) && total > 0 && scored >= 0;
  const percentage = valid ? Math.max(0, Math.min(100, (scored / total) * 100)) : 0;
  $('#percentage').textContent = valid ? `${Math.round(percentage)}%` : '—';
  const label = !valid ? 'Enter valid marks' : percentage >= 75 ? 'Exceeds expectations' : percentage >= 50 ? 'Meets expectations' : 'Needs more support';
  $('#gradeResult').textContent = label;
  $('#scoreMessage').textContent = !valid ? 'Marks scored must be zero or more and total marks must be above zero.' : percentage >= 50 ? 'Keep encouraging this learner’s progress.' : 'Plan a short revision activity and check in again.';
  return { scored, total, percentage, valid, label };
}
$('#calculate')?.addEventListener('click', calculate);
$('#scored')?.addEventListener('input', calculate);
$('#total')?.addEventListener('input', calculate);

$('#menuButton')?.addEventListener('click', () => $('#mainNav').classList.toggle('open'));
document.querySelectorAll('#mainNav a').forEach((link) => link.addEventListener('click', () => $('#mainNav').classList.remove('open')));
addWorkspaceControls();

// Exposed for the dependency-free browser test page.
window.KenyaTeacherToolkit = { calculateScore: (scored, total) => {
  const numericScored = Number(scored);
  const numericTotal = Number(total);
  if (!Number.isFinite(numericScored) || !Number.isFinite(numericTotal) || numericScored < 0 || numericTotal <= 0) return { valid: false, percentage: 0 };
  return { valid: true, percentage: Math.max(0, Math.min(100, (numericScored / numericTotal) * 100)) };
} };
