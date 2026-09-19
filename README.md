const STORAGE_KEY = 'kenya-teacher-toolkit:v1';
const defaultState = {
  lessons: [],
  assessments: [],
  reports: []
};

const state = loadState();
const $ = (selector) => document.querySelector(selector);

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function calculatePercentage(scored, total) {
  const numericScored = Number(scored);
  const numericTotal = Number(total);

  if (!Number.isFinite(numericScored) || !Number.isFinite(numericTotal) || numericTotal <= 0 || numericScored < 0) {
    return { valid: false, percentage: 0 };
  }

  const percentage = Math.max(0, Math.min(100, (numericScored / numericTotal) * 100));
  return { valid: true, percentage };
}

function getPerformanceLabel(percentage) {
  if (percentage >= 75) return 'Exceeds expectations';
  if (percentage >= 50) return 'Meets expectations';
  return 'Needs more support';
}

function formatDate(value) {
  if (!value) return 'No date';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-KE', { dateStyle: 'medium' }).format(date);
}

function updateStats() {
  const lessons = state.lessons.length;
  const assessments = state.assessments.length;
  const reports = state.reports.length;

  const averageScore = (() => {
    if (!state.assessments.length) return 0;
    const total = state.assessments.reduce((sum, item) => {
      const result = calculatePercentage(item.scored, item.total);
      return sum + (result.valid ? result.percentage : 0);
    }, 0);
    return Math.round(total / state.assessments.length);
  })();

  $('#statLessons').textContent = String(lessons);
  $('#statAssessments').textContent = String(assessments);
  $('#statReports').textContent = String(reports);
  $('#statAverage').textContent = `${averageScore}%`;
  $('#lessonCountBadge').textContent = String(lessons);
  $('#assessmentCountBadge').textContent = String(assessments);
  $('#reportCountBadge').textContent = String(reports);
}

function createLessonListItem(lesson) {
  const item = document.createElement('article');
  item.className = 'list-item';
  item.innerHTML = `
    <h4>${lesson.topic || 'Untitled lesson'}</h4>
    <p>${lesson.area || 'No learning area'} · ${lesson.grade || 'No grade'}</p>
    <p>${lesson.outcome || 'No learning outcome yet.'}</p>
    <div class="meta-row">
      <span class="tag">${formatDate(lesson.date)}</span>
      <span>${lesson.duration || 'Duration not set'}</span>
    </div>
    <div class="item-actions">
      <button class="icon-button" type="button" data-edit-lesson="${lesson.id}">Edit</button>
      <button class="icon-button delete" type="button" data-delete-lesson="${lesson.id}">Delete</button>
    </div>
  `;
  return item;
}

function createAssessmentListItem(assessment) {
  const result = calculatePercentage(assessment.scored, assessment.total);
  const percent = result.valid ? `${Math.round(result.percentage)}%` : '—';
  const performance = result.valid ? getPerformanceLabel(result.percentage) : 'Check marks';

  const item = document.createElement('article');
  item.className = 'list-item';
  item.innerHTML = `
    <h4>${assessment.learner || 'Unnamed learner'}</h4>
    <p>${assessment.subject || 'No subject'} · ${assessment.type || 'Assessment'}</p>
    <p>${assessment.grade || 'No grade'} · ${assessment.scored || 0}/${assessment.total || 0} marks</p>
    <div class="meta-row">
      <span class="tag">${percent}</span>
      <span>${performance}</span>
    </div>
    <div class="item-actions">
      <button class="icon-button" type="button" data-edit-assessment="${assessment.id}">Edit</button>
      <button class="icon-button delete" type="button" data-delete-assessment="${assessment.id}">Delete</button>
    </div>
  `;
  return item;
}

function createReportListItem(report) {
  const item = document.createElement('article');
  item.className = 'list-item';
  item.innerHTML = `
    <h4>${report.learner || 'Unnamed learner'}</h4>
    <p>${report.subject || 'No subject'} · ${report.grade || 'No grade'} · ${report.term || 'Term'}</p>
    <p>${report.strengths || 'No strengths noted yet.'}</p>
    <div class="meta-row">
      <span class="tag">${report.term || 'Term'}</span>
      <span>Report</span>
    </div>
    <div class="item-actions">
      <button class="icon-button" type="button" data-edit-report="${report.id}">Edit</button>
      <button class="icon-button delete" type="button" data-delete-report="${report.id}">Delete</button>
    </div>
  `;
  return item;
}

function renderLists() {
  const lessonList = $('#lessonPlanList');
  const assessmentList = $('#assessmentList');
  const reportList = $('#reportList');

  lessonList.innerHTML = '';
  state.lessons.forEach((lesson) => lessonList.appendChild(createLessonListItem(lesson)));

  assessmentList.innerHTML = '';
  state.assessments.forEach((assessment) => assessmentList.appendChild(createAssessmentListItem(assessment)));

  reportList.innerHTML = '';
  state.reports.forEach((report) => reportList.appendChild(createReportListItem(report)));

  if (!state.lessons.length) lessonList.innerHTML = '<p class="empty-state">No lesson plans saved yet.</p>';
  if (!state.assessments.length) assessmentList.innerHTML = '<p class="empty-state">No assessments saved yet.</p>';
  if (!state.reports.length) reportList.innerHTML = '<p class="empty-state">No learner reports saved yet.</p>';
}

function updateAssessmentPreview() {
  const scored = $('#scored');
  const total = $('#total');
  const resultEl = $('#assessmentResult');
  const performanceEl = $('#performanceLabel');

  if (!scored || !total) return;

  const result = calculatePercentage(scored.value, total.value);
  const percentage = result.valid ? `${Math.round(result.percentage)}%` : '—';
  resultEl.textContent = percentage;
  performanceEl.textContent = result.valid ? getPerformanceLabel(result.percentage) : 'Enter valid marks';
}

function syncForm(formId, data) {
  const form = document.getElementById(formId);
  if (!form) return;
  Object.entries(data).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);
    if (field) field.value = value;
  });
}

function saveLesson(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());

  const entry = {
    id: data.id || crypto.randomUUID(),
    ...data,
    date: data.date || new Date().toISOString().slice(0, 10)
  };

  const index = state.lessons.findIndex((item) => item.id === entry.id);
  if (index >= 0) state.lessons[index] = entry;
  else state.lessons.unshift(entry);

  saveState();
  renderDashboard();
  renderLists();
  form.reset();
  form.removeAttribute('data-edit-id');
  alert('Lesson plan saved successfully.');
}

function saveAssessment(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const result = calculatePercentage(data.scored, data.total);

  if (!result.valid) {
    alert('Please enter valid marks. Total marks must be greater than zero and marks scored cannot be negative.');
    return;
  }

  const entry = {
    id: data.id || crypto.randomUUID(),
    ...data,
    scored: Number(data.scored),
    total: Number(data.total)
  };

  const index = state.assessments.findIndex((item) => item.id === entry.id);
  if (index >= 0) state.assessments[index] = entry;
  else state.assessments.unshift(entry);

  saveState();
  renderDashboard();
  renderLists();
  form.reset();
  $('#scored').value = '32';
  $('#total').value = '40';
  updateAssessmentPreview();
  alert('Assessment saved successfully.');
}

function saveReport(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());

  const entry = {
    id: data.id || crypto.randomUUID(),
    ...data
  };

  const index = state.reports.findIndex((item) => item.id === entry.id);
  if (index >= 0) state.reports[index] = entry;
  else state.reports.unshift(entry);

  saveState();
  renderDashboard();
  renderLists();
  form.reset();
  alert('Learner report saved successfully.');
}

function clearForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.reset();
  if (formId === 'assessmentForm') {
    $('#scored').value = '32';
    $('#total').value = '40';
  }
  updateAssessmentPreview();
}

function editLesson(id) {
  const lesson = state.lessons.find((item) => item.id === id);
  if (!lesson) return;
  syncForm('lessonForm', lesson);
  window.location.hash = '#lesson-planner';
}

function deleteLesson(id) {
  state.lessons = state.lessons.filter((item) => item.id !== id);
  saveState();
  renderDashboard();
  renderLists();
}

function editAssessment(id) {
  const assessment = state.assessments.find((item) => item.id === id);
  if (!assessment) return;
  syncForm('assessmentForm', assessment);
  updateAssessmentPreview();
  window.location.hash = '#assessment';
}

function deleteAssessment(id) {
  state.assessments = state.assessments.filter((item) => item.id !== id);
  saveState();
  renderDashboard();
  renderLists();
}

function editReport(id) {
  const report = state.reports.find((item) => item.id === id);
  if (!report) return;
  syncForm('reportForm', report);
  window.location.hash = '#reports';
}

function deleteReport(id) {
  state.reports = state.reports.filter((item) => item.id !== id);
  saveState();
  renderDashboard();
  renderLists();
}

function exportWorkspace() {
  const payload = {
    app: 'Kenya Teacher Toolkit',
    version: 1,
    exportedAt: new Date().toISOString(),
    data: state
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = 'kenya-teacher-toolkit-export.json';
  link.click();
  URL.revokeObjectURL(href);
  alert('Workspace exported successfully.');
}

function importWorkspace(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const json = JSON.parse(reader.result);
      const imported = json?.data || json;
      if (!imported || typeof imported !== 'object') throw new Error('Invalid file');

      state.lessons = Array.isArray(imported.lessons) ? imported.lessons : [];
      state.assessments = Array.isArray(imported.assessments) ? imported.assessments : [];
      state.reports = Array.isArray(imported.reports) ? imported.reports : [];

      saveState();
      renderDashboard();
      renderLists();
      alert('Workspace imported successfully.');
    } catch {
      alert('The selected file is not a valid Kenya Teacher Toolkit export.');
    }
  };
  reader.readAsText(file);
}

function bindEventHandlers() {
  $('#lessonForm').addEventListener('submit', saveLesson);
  $('#assessmentForm').addEventListener('submit', saveAssessment);
  $('#reportForm').addEventListener('submit', saveReport);

  $('#clearLessonForm').addEventListener('click', () => clearForm('lessonForm'));
  $('#clearAssessmentForm').addEventListener('click', () => clearForm('assessmentForm'));
  $('#clearReportForm').addEventListener('click', () => clearForm('reportForm'));

  $('#printDashboard').addEventListener('click', () => window.print());
  $('#printLessonForm').addEventListener('click', () => {
    const form = $('#lessonForm');
    if (!form.reportValidity()) return;
    window.print();
  });
  $('#printReportForm').addEventListener('click', () => {
    const form = $('#reportForm');
    if (!form.reportValidity()) return;
    window.print();
  });

  $('#calculateAssessment').addEventListener('click', () => {
    const form = $('#assessmentForm');
    if (!form.reportValidity()) return;
    updateAssessmentPreview();
  });

  $('#scored').addEventListener('input', updateAssessmentPreview);
  $('#total').addEventListener('input', updateAssessmentPreview);

  $('#exportBtn').addEventListener('click', exportWorkspace);
  $('#importBtn').addEventListener('click', () => $('#importInput').click());
  $('#importInput').addEventListener('change', (event) => {
    const [file] = event.target.files;
    if (file) importWorkspace(file);
    event.target.value = '';
  });

  $('#menuButton').addEventListener('click', () => {
    $('#mainNav').classList.toggle('open');
  });

  document.querySelectorAll('#mainNav a').forEach((link) => {
    link.addEventListener('click', () => $('#mainNav').classList.remove('open'));
  });

  document.addEventListener('click', (event) => {
    const lessonEdit = event.target.dataset.editLesson;
    const lessonDelete = event.target.dataset.deleteLesson;
    const assessmentEdit = event.target.dataset.editAssessment;
    const assessmentDelete = event.target.dataset.deleteAssessment;
    const reportEdit = event.target.dataset.editReport;
    const reportDelete = event.target.dataset.deleteReport;

    if (lessonEdit) editLesson(lessonEdit);
    if (lessonDelete) deleteLesson(lessonDelete);
    if (assessmentEdit) editAssessment(assessmentEdit);
    if (assessmentDelete) deleteAssessment(assessmentDelete);
    if (reportEdit) editReport(reportEdit);
    if (reportDelete) deleteReport(reportDelete);
  });
}

function renderDashboard() {
  updateStats();
  renderLists();
}

function init() {
  updateAssessmentPreview();
  renderDashboard();
  bindEventHandlers();
}

window.KenyaTeacherToolkit = {
  calculateScore: (scored, total) => calculatePercentage(scored, total),
  getPerformanceLabel,
  state
};

init();
