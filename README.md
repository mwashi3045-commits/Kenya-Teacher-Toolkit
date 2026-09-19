const curriculum = {
  lower: {
    label: 'Lower Primary (Grade 1–3)',
    grades: ['Grade 1', 'Grade 2', 'Grade 3'],
    subjects: ['English Literacy', 'Kiswahili Literacy', 'Mathematics', 'Environmental Activities', 'Creative Arts', 'Religious Education', 'Physical Education']
  },
  upper: {
    label: 'Upper Primary (Grade 4–6)',
    grades: ['Grade 4', 'Grade 5', 'Grade 6'],
    subjects: ['English', 'Kiswahili', 'Mathematics', 'Science and Technology', 'Social Studies', 'Agriculture', 'Creative Arts and Sports', 'Religious Education']
  },
  junior: {
    label: 'Junior School (Grade 7–9)',
    grades: ['Grade 7', 'Grade 8', 'Grade 9'],
    subjects: ['English', 'Kiswahili', 'Mathematics', 'Integrated Science', 'Social Studies', 'Pre-Technical Studies', 'Agriculture', 'Business Studies', 'Creative Arts and Sports', 'Religious Education']
  },
  senior: {
    label: 'Senior School (Grade 10–12)',
    grades: ['Grade 10', 'Grade 11', 'Grade 12'],
    subjects: ['English', 'Kiswahili', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'Geography', 'History and Citizenship', 'Business Studies', 'Agriculture', 'Computer Science', 'Economics', 'Literature', 'Religious Education']
  }
};

const timetableConfig = {
  lower: { lessonsPerDay: 6, minutes: 30, weekly: 31, subjects: ['Mathematics', 'English Literacy', 'Kiswahili Literacy', 'Environmental Activities', 'Creative Arts', 'Physical Education', 'Religious Education', 'PPI'] },
  upper: { lessonsPerDay: 7, minutes: 35, weekly: 35, subjects: ['Mathematics', 'English', 'Kiswahili', 'Science and Technology', 'Social Studies', 'Agriculture', 'Creative Arts and Sports', 'Religious Education', 'PPI'] },
  junior: { lessonsPerDay: 8, minutes: 40, weekly: 41, subjects: ['Mathematics', 'English', 'Kiswahili', 'Integrated Science', 'Social Studies', 'Pre-Technical Studies', 'Agriculture', 'Business Studies', 'Creative Arts and Sports', 'Religious Education', 'PPI'] },
  senior: { lessonsPerDay: 8, minutes: 40, weekly: 40, subjects: ['Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics', 'Humanities / Pathway Subject', 'Business Studies', 'Computer Science', 'PE / Clubs', 'PPI'] }
};

const STORAGE_KEY = 'kenya-teacher-toolkit-v2';

function defaultStore() {
  return {
    classes: ['Grade 4 East', 'Grade 5 East'],
    learners: [
      { id: cryptoRandomId(), name: 'Amina Kimani', className: 'Grade 4 East', score: 85, notes: 'Strong reading skills; keep encouraging leadership tasks.' },
      { id: cryptoRandomId(), name: 'Daniel Otieno', className: 'Grade 4 East', score: 72, notes: 'Improving in Mathematics; needs more practice with word problems.' },
      { id: cryptoRandomId(), name: 'Mercy Wanjiku', className: 'Grade 5 East', score: 90, notes: 'Very good in science investigations and discussions.' }
    ]
  };
}

function loadStore() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultStore();
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.classes) parsed.classes = [];
    if (!parsed.learners) parsed.learners = [];
    return parsed;
  } catch (error) {
    return defaultStore();
  }
}

function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

let appData = loadStore();

function cryptoRandomId() {
  if (window.crypto && crypto.getRandomValues) {
    const bytes = new Uint32Array(1);
    crypto.getRandomValues(bytes);
    return `id-${bytes[0].toString(16)}`;
  }
  return `id-${Math.random().toString(16).slice(2)}`;
}

function getSelectedBand() {
  const bandSelect = document.getElementById('bandSelect');
  return bandSelect.value || 'lower';
}

function populateBandSelector() {
  const wrapper = document.getElementById('bandButtons');
  wrapper.innerHTML = '';
  Object.entries(curriculum).forEach(([key, value]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'band-btn';
    btn.textContent = value.label;
    btn.dataset.band = key;
    btn.onclick = () => selectBand(key);
    wrapper.appendChild(btn);
  });
  selectBand('lower');
}

function selectBand(key) {
  const bandSelect = document.getElementById('bandSelect');
  const gradeSelect = document.getElementById('gradeSelect');
  const subjectSelect = document.getElementById('subjectSelect');
  const band = curriculum[key];

  bandSelect.value = key;
  gradeSelect.innerHTML = band.grades.map((grade) => `<option value="${grade}">${grade}</option>`).join('');
  subjectSelect.innerHTML = band.subjects.map((subject) => `<option value="${subject}">${subject}</option>`).join('');

  document.querySelectorAll('.band-btn').forEach((button) => {
    button.classList.toggle('active', button.dataset.band === key);
  });

  const timetableBand = document.getElementById('timetableBand');
  if (timetableBand) timetableBand.value = key;
  populateBreakSelect(key);
  renderTimetable();
}

function populateBreakSelect(key) {
  const breakSelect = document.getElementById('breakAfterSelect');
  const config = timetableConfig[key];
  if (!breakSelect) return;

  const options = [];
  for (let i = 1; i <= config.lessonsPerDay - 1; i += 1) {
    options.push(`<option value="${i}">After lesson ${i}</option>`);
  }
  breakSelect.innerHTML = options.join('');
  breakSelect.value = Math.min(3, config.lessonsPerDay - 1).toString();
}

function parseClock(value) {
  if (!value) return 8 * 60 + 20;
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatClock(totalMinutes) {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function getTimetableRows() {
  const timetableForm = document.getElementById('timetableForm');
  const values = Object.fromEntries(new FormData(timetableForm).entries());
  const bandKey = values.band || 'lower';
  const config = timetableConfig[bandKey];
  const startMinutes = parseClock(values.startTime || '08:20');
  const breakAfter = Number(values.breakAfter || 3);
  const breakLength = Number(values.breakLength || 30);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const slotTimes = [];
  let runningTime = startMinutes;

  for (let i = 0; i < config.lessonsPerDay; i += 1) {
    const start = runningTime;
    const end = start + config.minutes;
    slotTimes.push({
      label: `Lesson ${i + 1}`,
      time: `${formatClock(start)}–${formatClock(end)}`
    });

    runningTime = end;
    if (i + 1 === breakAfter) {
      runningTime += breakLength;
    }
  }

  const subjectCycle = [...config.subjects];
  const rows = days.map((day, dayIndex) => ({
    day,
    cells: slotTimes.map((slot, slotIndex) => subjectCycle[(dayIndex * 2 + slotIndex) % subjectCycle.length])
  }));

  return { rows, slotTimes, config };
}

function renderTimetable() {
  const timetableOutput = document.getElementById('timetableOutput');
  const timetableForm = document.getElementById('timetableForm');
  if (!timetableForm || !timetableOutput) return;

  const values = Object.fromEntries(new FormData(timetableForm).entries());
  const bandKey = values.band || 'lower';
  const data = getTimetableRows();
  const table = `
    <div class="generated-heading">
      <h3>${curriculum[bandKey].label}</h3>
      <span>${data.config.weekly} weekly lessons · ${data.config.minutes}-minute periods</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>Day</th>
          ${data.slotTimes.map((slot) => `<th>${slot.label}<br><small>${slot.time}</small></th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${data.rows.map((row) => `
          <tr>
            <th>${row.day}</th>
            ${row.cells.map((subject) => `<td>${subject}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  timetableOutput.innerHTML = table;
}

function sanitizeText(value) {
  return (value || '').trim();
}

function buildLessonPlan(data) {
  return `LESSON PLAN\n==============================\nGrade: ${sanitizeText(data.grade) || 'Not provided'}\nSubject: ${sanitizeText(data.subject) || 'Subject'}\nTerm: ${sanitizeText(data.term)}\nWeek: ${sanitizeText(data.week)}\nLesson title: ${sanitizeText(data.title)}\nStrand: ${sanitizeText(data.strand)}\nSub-strand: ${sanitizeText(data.substrand)}\n\nLearning outcomes\n${sanitizeText(data.outcomes) || 'Outcomes not stated.'}\n\nLearning experiences\n${sanitizeText(data.methods) || 'Methods not entered.'}\n\nResources\n${sanitizeText(data.resources) || 'Resources not listed.'}\n\nAssessment evidence\n${sanitizeText(data.assessment) || 'Assessment not specified.'}\n\nDifferentiation and reflection\n${sanitizeText(data.reflection) || 'Reflection not written yet.'}`;
}

function buildLessonNotes(data) {
  return `LESSON NOTES\n==============================\n${sanitizeText(data.grade) || 'Class'} | ${sanitizeText(data.subject) || 'Subject'}\nLesson title: ${sanitizeText(data.title)}\n\nObjective\n${sanitizeText(data.outcomes) || 'Objective not entered.'}\n\nLesson development\n${sanitizeText(data.methods) || 'Methods not entered.'}\n\nResources\n${sanitizeText(data.resources) || 'Resources not listed.'}\n\nAssessment / reflection\n${sanitizeText(data.assessment) || 'Assessment not stated.'}\n${sanitizeText(data.reflection) || 'Reflection not stated.'}`;
}

function buildSchemeOfWork(data) {
  return `SCHEME OF WORK\n==============================\nGrade: ${sanitizeText(data.grade)}\nSubject: ${sanitizeText(data.subject)}\nTerm: ${sanitizeText(data.term)}\n\nWeek: ${sanitizeText(data.week)}\nStrand: ${sanitizeText(data.strand)}\nSub-strand: ${sanitizeText(data.substrand)}\n\nTopic: ${sanitizeText(data.title)}\nLearning outcomes: ${sanitizeText(data.outcomes)}\nActivities: ${sanitizeText(data.methods)}\nResources: ${sanitizeText(data.resources)}\nAssessment: ${sanitizeText(data.assessment)}`;
}

function buildRecordOfWork(data) {
  return `RECORD OF WORK\n==============================\nGrade: ${sanitizeText(data.grade)}\nSubject: ${sanitizeText(data.subject)}\nTerm: ${sanitizeText(data.term)}\nWeek: ${sanitizeText(data.week)}\n\nContent covered: ${sanitizeText(data.title)}\nStrand: ${sanitizeText(data.strand)}\n\nEvidence: ${sanitizeText(data.assessment) || 'Not recorded.'}\nReflection: ${sanitizeText(data.reflection) || 'Not recorded.'}`;
}

function performanceLevel(score) {
  const numeric = Number(score) || 0;
  if (numeric >= 80) return 'EE — Exceeding Expectation';
  if (numeric >= 60) return 'ME — Meeting Expectation';
  if (numeric >= 40) return 'AE — Approaching Expectation';
  return 'BE — Below Expectation';
}

function buildReportCard(data) {
  const entries = (sanitizeText(data.scores) || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const split = part.split('=').map((item) => item.trim());
      const subject = split[0];
      const score = Number(split[1]);
      if (!subject || Number.isNaN(score)) return null;
      return `${subject}: ${score}/100 — ${performanceLevel(score)}`;
    })
    .filter(Boolean);

  const average = entries.length
    ? Math.round(
        entries
          .map((entry) => Number(entry.match(/(\d+)\/100/)[1]))
          .reduce((total, current) => total + current, 0) / entries.length
      )
    : 0;

  return `REPORT CARD\n==============================\nLearner: ${sanitizeText(data.learner) || 'Learner'}\nClass: ${sanitizeText(data.className) || 'Class'}\nTerm: ${sanitizeText(data.term) || 'Term'}\nTeacher: ${sanitizeText(data.teacher) || 'Teacher'}\n\nPerformance levels\nEE = Exceeding Expectation\nME = Meeting Expectation\nAE = Approaching Expectation\nBE = Below Expectation\n\n${entries.length ? entries.join('\n') : 'No subject scores entered.'}\n\nOverall average: ${average}/100\nOverall level: ${performanceLevel(average)}`;
}

function renderGeneratedDocuments() {
  const form = document.getElementById('curriculumForm');
  const reportForm = document.getElementById('reportForm');
  if (!form) return;

  const planningData = Object.fromEntries(new FormData(form).entries());
  const reportData = reportForm ? Object.fromEntries(new FormData(reportForm).entries()) : {};

  const docs = [
    ['Lesson plan', buildLessonPlan(planningData)],
    ['Lesson notes', buildLessonNotes(planningData)],
    ['Scheme of work', buildSchemeOfWork(planningData)],
    ['Record of work', buildRecordOfWork(planningData)],
    ['Report card', buildReportCard(reportData)]
  ];

  const outputGrid = document.getElementById('outputGrid');
  outputGrid.innerHTML = docs
    .map(([title, content]) => `
      <article class="output-card">
        <h3>${title}</h3>
        <pre>${escapeHtml(content)}</pre>
      </article>
    `)
    .join('');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function updateDashboardStats() {
  const classCount = document.getElementById('classCount');
  const learnerCount = document.getElementById('learnerCount');
  const reportCount = document.getElementById('reportCount');
  const averageScore = document.getElementById('averageScore');

  const classes = appData.classes.length;
  const learners = appData.learners;
  const scores = learners.filter((learner) => Number(learner.score) >= 0 && Number(learner.score) <= 100);
  const total = scores.length ? scores.reduce((sum, learner) => sum + Number(learner.score), 0) / scores.length : 0;

  classCount.textContent = String(classes);
  learnerCount.textContent = String(learners.length);
  reportCount.textContent = String(Math.max(learners.length, 1));
  averageScore.textContent = `${Math.round(total)}%`;
}

function updateClassSelect() {
  const classSelect = document.getElementById('learnerClassSelect');
  if (!classSelect) return;

  classSelect.innerHTML = appData.classes
    .map((className) => `<option value="${className}">${className}</option>`)
    .join('');
}

function renderClasses() {
  const classList = document.getElementById('classList');
  if (!classList) return;

  classList.innerHTML = appData.classes.length
    ? appData.classes
        .map((className) => {
          const size = appData.learners.filter((learner) => learner.className === className).length;
          return `
            <div class="list-item">
              <div>
                <strong>${className}</strong>
                <small>${size} learners</small>
              </div>
              <button class="inline-btn" type="button" data-remove-class="${className}">Remove</button>
            </div>
          `;
        })
        .join('')
    : '<p>No classes added yet.</p>';

  classList.querySelectorAll('[data-remove-class]').forEach((button) => {
    button.addEventListener('click', () => removeClass(button.dataset.removeClass));
  });
}

function renderLearners() {
  const learnerList = document.getElementById('learnerList');
  if (!learnerList) return;

  learnerList.innerHTML = appData.learners.length
    ? appData.learners
        .map((learner) => `
          <div class="list-item">
            <div>
              <strong>${learner.name}</strong>
              <small>${learner.className} · ${learner.score || 0}%</small>
            </div>
            <button class="inline-btn" type="button" data-remove-learner="${learner.id}">Delete</button>
          </div>
        `)
        .join('')
    : '<p>No learners added yet.</p>';

  learnerList.querySelectorAll('[data-remove-learner]').forEach((button) => {
    button.addEventListener('click', () => removeLearner(button.dataset.removeLearner));
  });
}

function renderAnalytics() {
  const analyticsGrid = document.getElementById('analyticsGrid');
  if (!analyticsGrid) return;

  if (!appData.learners.length) {
    analyticsGrid.innerHTML = '<div class="analytics-card"><span>Overview</span><strong>No learners yet</strong></div>';
    return;
  }

  const scores = appData.learners.map((learner) => Number(learner.score) || 0);
  const average = scores.reduce((sum, value) => sum + value, 0) / scores.length;
  const above = scores.filter((score) => score >= 60).length;
  const below = scores.filter((score) => score < 60).length;

  analyticsGrid.innerHTML = `
    <div class="analytics-card">
      <span>Average score</span>
      <strong>${Math.round(average)}%</strong>
    </div>
    <div class="analytics-card">
      <span>Meets expectation</span>
      <strong>${above}</strong>
    </div>
    <div class="analytics-card">
      <span>Needs support</span>
      <strong>${below}</strong>
    </div>
    <div class="analytics-card">
      <span>Classes active</span>
      <strong>${appData.classes.length}</strong>
    </div>
  `;
}

function addClass(className) {
  const nextName = sanitizeText(className);
  if (!nextName) return;
  if (!appData.classes.includes(nextName)) {
    appData.classes.push(nextName);
    saveStore(appData);
    updateClassSelect();
    renderClasses();
    renderAnalytics();
    updateDashboardStats();
  }
}

function removeClass(className) {
  appData.classes = appData.classes.filter((item) => item !== className);
  appData.learners = appData.learners.filter((learner) => learner.className !== className);
  saveStore(appData);
  updateClassSelect();
  renderClasses();
  renderLearners();
  renderAnalytics();
  updateDashboardStats();
}

function removeLearner(id) {
  appData.learners = appData.learners.filter((learner) => learner.id !== id);
  saveStore(appData);
  renderLearners();
  renderAnalytics();
  updateDashboardStats();
}

function addLearner(event) {
  event.preventDefault();
  const name = sanitizeText(document.getElementById('learnerName').value);
  const className = document.getElementById('learnerClassSelect').value;
  const score = Number(document.getElementById('learnerScore').value) || 0;
  const notes = sanitizeText(document.getElementById('learnerNotes').value);

  if (!name) return;

  appData.learners.push({
    id: cryptoRandomId(),
    name,
    className,
    score,
    notes
  });

  saveStore(appData);
  renderLearners();
  renderAnalytics();
  updateDashboardStats();
  event.target.reset();
}

function attachFormHandlers() {
  const curriculumForm = document.getElementById('curriculumForm');
  const timetableForm = document.getElementById('timetableForm');
  const classForm = document.getElementById('classForm');
  const learnerForm = document.getElementById('learnerForm');

  if (curriculumForm) {
    curriculumForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = Object.fromEntries(new FormData(curriculumForm).entries());
      renderGeneratedDocuments();
      const planningSection = document.getElementById('planner');
      planningSection.scrollIntoView({ behavior: 'smooth' });
      localStorage.setItem('kenyaToolkitPlan', JSON.stringify(formData));
    });
  }

  if (timetableForm) {
    timetableForm.addEventListener('submit', (event) => {
      event.preventDefault();
      renderTimetable();
    });
  }

  if (classForm) {
    classForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = sanitizeText(document.getElementById('classNameInput').value);
      addClass(value);
      classForm.reset();
    });
  }

  if (learnerForm) {
    learnerForm.addEventListener('submit', addLearner);
  }

  document.getElementById('saveDraftBtn')?.addEventListener('click', () => {
    const formData = Object.fromEntries(new FormData(curriculumForm).entries());
    localStorage.setItem('kenyaToolkitSavedDraft', JSON.stringify(formData));
    alert('Draft saved locally on this device.');
  });

  document.getElementById('printPlanner')?.addEventListener('click', () => window.print());
  document.getElementById('printTimetable')?.addEventListener('click', () => window.print());
  document.getElementById('printAll')?.addEventListener('click', () => window.print());

  document.getElementById('exportJson')?.addEventListener('click', () => {
    const payload = JSON.stringify({ curriculum, timetableConfig, data: appData }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kenya-teacher-toolkit-export.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('exportCsv')?.addEventListener('click', () => {
    const rows = [['name', 'className', 'score', 'notes']];
    appData.learners.forEach((learner) => {
      rows.push([learner.name, learner.className, learner.score || 0, learner.notes || '']);
    });
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kenya-teacher-toolkit-learners.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('menuButton')?.addEventListener('click', () => {
    const nav = document.getElementById('mainNav');
    nav.classList.toggle('open');
  });

  document.querySelectorAll('#mainNav a').forEach((link) => {
    link.addEventListener('click', () => document.getElementById('mainNav')?.classList.remove('open'));
  });
}

function init() {
  populateBandSelector();
  populateBreakSelect('lower');
  renderTimetable();
  updateClassSelect();
  renderClasses();
  renderLearners();
  renderAnalytics();
  updateDashboardStats();
  attachFormHandlers();

  const savedDraft = localStorage.getItem('kenyaToolkitSavedDraft');
  if (savedDraft) {
    try {
      const draft = JSON.parse(savedDraft);
      Object.entries(draft).forEach(([key, value]) => {
        const field = document.querySelector(`[name="${key}"]`);
        if (field) field.value = value;
      });
    } catch (error) {
      // ignore if invalid
    }
  }

  const savedPlan = localStorage.getItem('kenyaToolkitPlan');
  if (savedPlan) {
    try {
      const plan = JSON.parse(savedPlan);
      Object.entries(plan).forEach(([key, value]) => {
        const field = document.querySelector(`[name="${key}"]`);
        if (field) field.value = value;
      });
    } catch (error) {
      // ignore if invalid
    }
  }

  renderGeneratedDocuments();
}

window.KenyaTeacherToolkit = {
  curriculum,
  timetableConfig,
  performanceLevel,
  buildReportCard,
  renderTimetable,
  getTimetableRows
};

window.addEventListener('DOMContentLoaded', init);
