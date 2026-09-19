const $ = (selector) => document.querySelector(selector);
const status = $('#savedStatus');

// Keep the first MVP useful without requiring an account or backend.
function saveForm(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  localStorage.setItem(`ktt:${form.id}`, JSON.stringify(data));
  status.textContent = 'Saved just now';
  setTimeout(() => { status.textContent = 'All changes saved locally'; }, 2200);
}
function restoreForm(form) {
  const raw = localStorage.getItem(`ktt:${form.id}`);
  if (!raw) return;
  Object.entries(JSON.parse(raw)).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);
    if (field) field.value = value;
  });
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
  localStorage.removeItem(`ktt:${form.id}`);
  status.textContent = 'Form cleared';
}));

document.querySelectorAll('[data-print]').forEach((button) => button.addEventListener('click', () => {
  const form = document.getElementById(button.dataset.print);
  if (!form.checkValidity()) { form.reportValidity(); return; }
  window.print();
}));
$('#printDashboard').addEventListener('click', () => window.print());

function calculate() {
  const scored = Number($('#scored').value) || 0;
  const total = Number($('#total').value) || 1;
  const percentage = Math.max(0, Math.min(100, (scored / total) * 100));
  $('#percentage').textContent = `${Math.round(percentage)}%`;
  const label = percentage >= 75 ? 'Exceeds expectations' : percentage >= 50 ? 'Meets expectations' : 'Needs more support';
  $('#gradeResult').textContent = label;
  $('#scoreMessage').textContent = percentage >= 50 ? 'Keep encouraging this learner’s progress.' : 'Plan a short revision activity and check in again.';
}
$('#calculate').addEventListener('click', calculate);
$('#scored').addEventListener('input', calculate);
$('#total').addEventListener('input', calculate);

$('#menuButton').addEventListener('click', () => $('#mainNav').classList.toggle('open'));
document.querySelectorAll('#mainNav a').forEach((link) => link.addEventListener('click', () => $('#mainNav').classList.remove('open')));
