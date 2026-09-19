const STORAGE_KEY = 'kenya-teacher-toolkit-v2';
const PROFILE_KEY = 'kenyaTeacherToolkitProfile';
const AUTH_KEY = 'kenyaTeacherToolkitAuth';

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
    subjects: ['English', 'Kiswahili', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'Geography', 'History and Citizenship', 'Business Studies', 'Agriculture', 'Computer Science', 'Economics', 'Religious Education']
  }
};

const timetableConfig = {
  lower: { lessonsPerDay: 6, minutes: 30, weekly: 31, subjects: ['Mathematics', 'English Literacy', 'Kiswahili Literacy', 'Environmental Activities', 'Creative Arts', 'Physical Education', 'Religious Education'] },
  upper: { lessonsPerDay: 7, minutes: 35, weekly: 35, subjects: ['Mathematics', 'English', 'Kiswahili', 'Science and Technology', 'Social Studies', 'Agriculture', 'Creative Arts and Sports', 'Religious Education'] },
  junior: { lessonsPerDay: 8, minutes: 40, weekly: 41, subjects: ['Mathematics', 'English', 'Kiswahili', 'Integrated Science', 'Social Studies', 'Pre-Technical Studies', 'Agriculture', 'Business Studies', 'Creative Arts and Sports'] },
  senior: { lessonsPerDay: 8, minutes: 40, weekly: 40, subjects: ['Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics', 'Humanities / Pathway Subject', 'Business Studies', 'Computer Science', 'Economics'] }
};

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

function loadProfile() {
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) {
    return {
      schoolName: 'Nairobi Valley Academy',
      teacherName: 'Grace Wambui',
      email: 'teacher@school.ke',
      phone: '0712 000 000',
      region: 'Nairobi County'
    };
  }

  try {
    return { ...loadDefaultProfile(), ...JSON.parse(raw) };
  } catch (error) {
    return loadDefaultProfile();
  }
}

function loadDefaultProfile() {
  return {
    schoolName: 'Nairobi Valley Academy',
    teacherName: 'Grace Wambui',
    email: 'teacher@school.ke',
    phone: '0712 000 000',
    region: 'Nairobi County'
  };
}

function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === 'true';
}

function setAuthenticated(value) {
  localStorage.setItem(AUTH_KEY, value ? 'true' : 'false');
}

let appData = loadStore();
let activeProfile = loadProfile();

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
  return `LESSON PLAN\n==============================\nGrade: ${sanitizeText(data.grade) || 'Not provided'}\nSubject: ${sanitizeText(data.subject) || 'Subject'}\nTerm: ${sanitizeText(data.term)}\nWeek: ${sanitizeText(data.week)}\nLesson title: ${sanitizeText(data.title)}\nStrand: ${sanitizeText(data.strand)}\nSub-strand: ${sanitizeText(data.substrand)}\n\nLearning outcomes:\n${sanitizeText(data.outcomes) || 'To be stated'}\n\nLearning experiences:\n${sanitizeText(data.methods) || 'Teacher-guided learning activities'}\n\nResources:\n${sanitizeText(data.resources) || 'Relevant classroom materials'}\n\nAssessment evidence:\n${sanitizeText(data.assessment) || 'Observation and oral questioning'}\n\nDifferentiation and reflection:\n${sanitizeText(data.reflection) || 'Support and monitor learners'}`;
}

function buildLessonNotes(data) {
  return `LESSON NOTES\n==============================\n${sanitizeText(data.grade) || 'Class'} | ${sanitizeText(data.subject) || 'Subject'}\nLesson title: ${sanitizeText(data.title)}\n\nObjective:\n${sanitizeText(data.outcomes) || 'Review learning objective'}\n\nTeaching steps:\n${sanitizeText(data.methods) || 'Introduce, explain, practise, assess'}\n\nSupport notes:\n${sanitizeText(data.reflection) || 'Use varied examples and checks for understanding'}`;
}

function buildSchemeOfWork(data) {
  return `SCHEME OF WORK\n==============================\nGrade: ${sanitizeText(data.grade)}\nSubject: ${sanitizeText(data.subject)}\nTerm: ${sanitizeText(data.term)}\n\nWeek: ${sanitizeText(data.week)}\nStrand: ${sanitizeText(data.strand)}\nSub-strand: ${sanitizeText(data.substrand)}\n\nLearning outcomes:\n${sanitizeText(data.outcomes) || 'Continued learning'}\n\nAssessment\/resources:\n${sanitizeText(data.assessment) || 'Use classroom observation'}\n\nNotes:\n${sanitizeText(data.methods) || 'Promote active participation and practice'}`;
}

function buildRecordOfWork(data) {
  return `RECORD OF WORK\n==============================\nGrade: ${sanitizeText(data.grade)}\nSubject: ${sanitizeText(data.subject)}\nTerm: ${sanitizeText(data.term)}\nWeek: ${sanitizeText(data.week)}\n\nLesson title: ${sanitizeText(data.title)}\n\nCovered content:\n${sanitizeText(data.strand)} / ${sanitizeText(data.substrand)}\n\nOutcomes achieved:\n${sanitizeText(data.outcomes) || 'Learning outcomes met'}\n\nTeacher reflection:\n${sanitizeText(data.reflection) || 'Lesson completed successfully'}`;
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

  return `REPORT CARD\n==============================\nLearner: ${sanitizeText(data.learner) || 'Learner'}\nClass: ${sanitizeText(data.className) || 'Class'}\nTerm: ${sanitizeText(data.term) || 'Term'}\n\n${entries.join('\n') || 'No subject scores entered'}\n\nAverage score: ${average}%`;
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

function renderSchoolSummary() {
  const summary = document.getElementById('schoolSummary');
  if (!summary) return;

  summary.innerHTML = `
    <div class="summary-grid">
      <div><span>School</span><strong>${activeProfile.schoolName}</strong></div>
      <div><span>Teacher</span><strong>${activeProfile.teacherName}</strong></div>
      <div><span>Email</span><strong>${activeProfile.email}</strong></div>
      <div><span>Phone</span><strong>${activeProfile.phone}</strong></div>
      <div><span>Region</span><strong>${activeProfile.region}</strong></div>
    </div>
  `;
}

function populateProfileForm() {
  const fields = document.getElementById('schoolProfileForm');
  if (!fields) return;

  fields.schoolName.value = activeProfile.schoolName;
  fields.teacherName.value = activeProfile.teacherName;
  fields.email.value = activeProfile.email;
  fields.phone.value = activeProfile.phone;
  fields.region.value = activeProfile.region;
}

function updateAuthOverlay() {
  const overlay = document.getElementById('authOverlay');
  if (!overlay) return;

  if (isAuthenticated()) {
    overlay.classList.add('hidden');
  } else {
    overlay.classList.remove('hidden');
  }
}

function showAuthOverlay() {
  const overlay = document.getElementById('authOverlay');
  if (overlay) overlay.classList.remove('hidden');
}

function hideAuthOverlay() {
  const overlay = document.getElementById('authOverlay');
  if (overlay) overlay.classList.add('hidden');
}

function generateAiSuggestion() {
  const output = document.getElementById('aiSuggestionOutput');
  if (!output) return;

  const form = document.getElementById('curriculumForm');
  const data = form ? Object.fromEntries(new FormData(form).entries()) : {};
  const currentBand = data.band || 'lower';
  const currentSubject = data.subject || 'Mathematics';
  const relatedScores = appData.learners
    .filter((learner) => learner.className)
    .map((learner) => Number(learner.score) || 0);
  const average = relatedScores.length
    ? Math.round(relatedScores.reduce((sum, score) => sum + score, 0) / relatedScores.length)
    : 0;

  const suggestion = `${activeProfile.teacherName || 'Teacher'}: For ${curriculum[currentBand].label} in ${currentSubject}, focus on quick recap tasks and a short differentiated practice set. Current class average is ${average}%. Use guided support for learners below 60% and enrichment activities for learners above 80%. Keep the lesson interactive: starter task, mini demonstration, paired practice, and exit ticket.`;

  output.innerHTML = `<p>${suggestion}</p>`;
}

function buildExportPayload() {
  return {
    profile: activeProfile,
    data: appData,
    curriculum,
    timetableConfig,
    exportedAt: new Date().toISOString()
  };
}

function triggerDownload(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function restoreFromJson(payload) {
  if (!payload || typeof payload !== 'object') {
    alert('Invalid backup file.');
    return;
  }

  if (payload.profile) {
    activeProfile = { ...loadDefaultProfile(), ...payload.profile };
    saveProfile(activeProfile);
    populateProfileForm();
    renderSchoolSummary();
  }

  if (payload.data && Array.isArray(payload.data.classes) && Array.isArray(payload.data.learners)) {
    appData = payload.data;
    saveStore(appData);
    updateClassSelect();
    renderClasses();
    renderLearners();
    renderAnalytics();
    updateDashboardStats();
  }
}

function attachFormHandlers() {
  const curriculumForm = document.getElementById('curriculumForm');
  const timetableForm = document.getElementById('timetableForm');
  const classForm = document.getElementById('classForm');
  const learnerForm = document.getElementById('learnerForm');
  const authForm = document.getElementById('authForm');
  const schoolProfileForm = document.getElementById('schoolProfileForm');

  if (authForm) {
    authForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = Object.fromEntries(new FormData(authForm).entries());
      activeProfile = {
        schoolName: sanitizeText(formData.schoolName) || 'School',
        teacherName: sanitizeText(formData.teacherName) || 'Teacher',
        email: sanitizeText(formData.email) || '',
        phone: sanitizeText(formData.phone) || '',
        region: sanitizeText(formData.region) || ''
      };
      saveProfile(activeProfile);
      populateProfileForm();
      renderSchoolSummary();
      setAuthenticated(true);
      updateAuthOverlay();
    });
  }

  if (schoolProfileForm) {
    schoolProfileForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = Object.fromEntries(new FormData(schoolProfileForm).entries());
      activeProfile = {
        schoolName: sanitizeText(formData.schoolName) || 'School',
        teacherName: sanitizeText(formData.teacherName) || 'Teacher',
        email: sanitizeText(formData.email) || '',
        phone: sanitizeText(formData.phone) || '',
        region: sanitizeText(formData.region) || ''
      };
      saveProfile(activeProfile);
      renderSchoolSummary();
      alert('School profile saved.');
    });
  }

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
  document.getElementById('printSchoolProfile')?.addEventListener('click', () => window.print());

  document.getElementById('exportJson')?.addEventListener('click', () => {
    const payload = JSON.stringify(buildExportPayload(), null, 2);
    triggerDownload('kenya-teacher-toolkit-backup.json', payload, 'application/json');
  });

  document.getElementById('restoreJson')?.addEventListener('click', () => {
    document.getElementById('restoreFileInput')?.click();
  });

  document.getElementById('restoreFileInput')?.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      restoreFromJson(payload);
    } catch (error) {
      alert('This backup file could not be read.');
    }
    event.target.value = '';
  });

  document.getElementById('exportCsv')?.addEventListener('click', () => {
    const rows = [['name', 'className', 'score', 'notes']];
    appData.learners.forEach((learner) => {
      rows.push([learner.name, learner.className, learner.score || 0, learner.notes || '']);
    });
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    triggerDownload('kenya-teacher-toolkit-learners.csv', csv, 'text/csv;charset=utf-8;');
  });

  document.getElementById('generateAiSuggestion')?.addEventListener('click', generateAiSuggestion);

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    setAuthenticated(false);
    showAuthOverlay();
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
  renderSchoolSummary();
  populateProfileForm();
  attachFormHandlers();
  updateAuthOverlay();

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
  getTimetableRows,
  generateAiSuggestion,
  restoreFromJson,
  loadProfile
};

window.addEventListener('DOMContentLoaded', init);
