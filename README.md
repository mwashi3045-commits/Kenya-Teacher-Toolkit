const curriculumData = {
  lowerPrimary: {
    grades: ['Grade 1', 'Grade 2', 'Grade 3'],
    subjects: [
      'English Literacy', 'Kiswahili Literacy', 'Mathematics', 'Environmental Activities',
      'Religious Education', 'Creative Arts', 'Physical Education', 'Life Skills'
    ],
    performanceLevels: [
      { code: 'EE', label: 'Exceeding Expectation', descriptor: 'Demonstrates strong mastery and applies concepts beyond expected level.' },
      { code: 'ME', label: 'Meeting Expectation', descriptor: 'Consistently meets the expected standard for the competency.' },
      { code: 'AE', label: 'Approaching Expectation', descriptor: 'Shows emerging understanding with some support.' },
      { code: 'BE', label: 'Below Expectation', descriptor: 'Requires more support and frequent guidance.' }
    ]
  },
  upperPrimary: {
    grades: ['Grade 4', 'Grade 5', 'Grade 6'],
    subjects: [
      'Mathematics', 'English', 'Kiswahili', 'Science', 'Social Studies', 'Agriculture',
      'ICT', 'Religious Education', 'Home Science', 'Physical Education'
    ],
    performanceLevels: [
      { code: 'EE', label: 'Exceeding Expectation', descriptor: 'Confidently applies skills with depth and independence.' },
      { code: 'ME', label: 'Meeting Expectation', descriptor: 'Meets the curriculum benchmark consistently.' },
      { code: 'AE', label: 'Approaching Expectation', descriptor: 'Progressing but still requires guided practice.' },
      { code: 'BE', label: 'Below Expectation', descriptor: 'Needs structured remediation and support.' }
    ]
  },
  juniorSchool: {
    grades: ['Grade 7', 'Grade 8', 'Grade 9'],
    subjects: [
      'Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics',
      'Geography', 'History & Government', 'Business Studies', 'Agriculture',
      'Computer Studies', 'Religious Education', 'Home Science', 'Physical Education'
    ],
    performanceLevels: [
      { code: 'EE', label: 'Exceeding Expectation', descriptor: 'Applies concepts with precision and demonstrates leadership in learning.' },
      { code: 'ME', label: 'Meeting Expectation', descriptor: 'Shows secure understanding of expected competencies.' },
      { code: 'AE', label: 'Approaching Expectation', descriptor: 'Needs more reinforcement to meet curriculum targets.' },
      { code: 'BE', label: 'Below Expectation', descriptor: 'Requires intervention and targeted support.' }
    ]
  },
  seniorSchool: {
    grades: ['Grade 10', 'Grade 11', 'Grade 12', 'Grade 13'],
    subjects: [
      'Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics',
      'Geography', 'History', 'Economics', 'Business Studies', 'Agriculture',
      'Computer Science', 'Accounting', 'Literature', 'Religious Education', 'Home Science'
    ],
    performanceLevels: [
      { code: 'EE', label: 'Exceeding Expectation', descriptor: 'Demonstrates advanced understanding and synthesis of knowledge.' },
      { code: 'ME', label: 'Meeting Expectation', descriptor: 'Consistently meets established competency standards.' },
      { code: 'AE', label: 'Approaching Expectation', descriptor: 'Shows partial understanding with need for guided development.' },
      { code: 'BE', label: 'Below Expectation', descriptor: 'Requires intensive support and re-teaching.' }
    ]
  }
};

const state = loadState();
const STORAGE_KEY = 'kenya-teacher-toolkit:v2';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { drafts: [] };
    return JSON.parse(raw);
  } catch {
    return { drafts: [] };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function updateSubjectCount() {
  const count = Object.values(curriculumData).reduce((sum, band) => sum + band.subjects.length, 0);
  document.getElementById('subjectCount').textContent = String(count);
}

function getSelectedBand() {
  const active = document.querySelector('.band-button.active');
  return active ? active.dataset.band : 'lowerPrimary';
}

function populateSubjects(selectedBand = 'lowerPrimary') {
  const subjectSelect = document.getElementById('subjectSelect');
  const subjects = curriculumData[selectedBand].subjects;

  subjectSelect.innerHTML = subjects.map((subject) => `<option value="${subject}">${subject}</option>`).join('');
  subjectSelect.value = subjects[0];
}

function buildBandSelector() {
  const container = document.getElementById('bandSelector');
  // create 4 grade band buttons
  Object.entries(curriculumData).forEach(([bandName, bandInfo]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'band-button active';
    if (bandName !== 'lowerPrimary') button.classList.remove('active');
    button.dataset.band = bandName;
    button.textContent = bandInfo.grades[0] + '–' + bandInfo.grades[bandInfo.grades.length - 1];
    button.addEventListener('click', () => {
      document.querySelectorAll('.band-button').forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      const currentBand = button.dataset.band;
      document.getElementById('gradeBand').value = currentBand;
      populateSubjects(currentBand);
    });
    container.appendChild(button);
  });

  const bandSelect = document.getElementById('gradeBand');
  bandSelect.addEventListener('change', (event) => {
    const selected = event.target.value;
    document.querySelectorAll('.band-button').forEach((btn) => btn.classList.toggle('active', btn.dataset.band === selected));
    populateSubjects(selected);
  });
}

function calculatePerformance(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0 || numeric > 100) {
    return { code: 'BE', label: 'Below Expectation', score: 0 };
  }
  if (numeric >= 80) return { code: 'EE', label: 'Exceeding Expectation', score: numeric };
  if (numeric >= 60) return { code: 'ME', label: 'Meeting Expectation', score: numeric };
  if (numeric >= 40) return { code: 'AE', label: 'Approaching Expectation', score: numeric };
  return { code: 'BE', label: 'Below Expectation', score: numeric };
}

function trimValue(value) {
  return value ? String(value).trim() : '';
}

function buildLessonPlan(data) {
  const subject = trimValue(data.subject) || 'Subject';
  const className = trimValue(data.className) || 'Class';
  const term = trimValue(data.term) || 'Term';
  const week = trimValue(data.week) || 'Week';
  const title = trimValue(data.lessonTitle) || 'Lesson';
  const strand = trimValue(data.strand) || 'Strand';
  const subStrand = trimValue(data.subStrand) || 'Sub-strand';
  const teacher = trimValue(data.teacherName) || 'Teacher';
  const outcomes = trimValue(data.learningOutcomes) || 'Learning outcome not added.';
  const inquiry = trimValue(data.inquiryQuestion) || 'Key inquiry question not added.';
  const resources = trimValue(data.resources) || 'Resources not added.';
  const methods = trimValue(data.methods) || 'Methods not added.';
  const differentiation = trimValue(data.differentiation) || 'Differentiation not added.';
  const assessment = trimValue(data.assessment) || 'Assessment strategy not added.';
  const reflection = trimValue(data.reflection) || 'Reflection not added.';

  return `LESSON PLAN\n==================================================\nSchool: Kenya Teacher Toolkit\nTeacher: ${teacher}\nClass: ${className}\nSubject: ${subject}\nTerm: ${term}\nWeek/Cycle: ${week}\nStrand: ${strand}\nSub-strand: ${subStrand}\nLesson title: ${title}\n\n1. Learning outcomes\n${outcomes}\n\n2. Key inquiry question\n${inquiry}\n\n3. Learning resources\n${resources}\n\n4. Learning experiences / teaching and learning activities\n${methods}\n\n5. Differentiation and inclusion\n${differentiation}\n\n6. Assessment and evidence of learning\n${assessment}\n\n7. Reflection and next steps\n${reflection}`;
}

function buildLessonNotes(data) {
  const subject = trimValue(data.subject) || 'Subject';
  const title = trimValue(data.lessonTitle) || 'Lesson';
  const className = trimValue(data.className) || 'Class';
  const teacher = trimValue(data.teacherName) || 'Teacher';
  const methods = trimValue(data.methods) || 'Learning experiences not added.';
  const outcomes = trimValue(data.learningOutcomes) || 'Learning outcome not added.';
  const reflection = trimValue(data.reflection) || 'Reflection not yet captured.';

  return `LESSON NOTES\n==================================================\nTeacher: ${teacher}\nClass: ${className}\nSubject: ${subject}\nLesson title: ${title}\n\nObjectives:\n${outcomes}\n\nLesson development:\n${methods}\n\nImportant teaching points:\n- Ensure learners are active and engaged in the task.\n- Link concept to real-life classroom contexts.\n- Use competency-based activities to reinforce the learning outcome.\n\nReflection:\n${reflection}`;
}

function buildSchemeOfWork(data) {
  const subject = trimValue(data.subject) || 'Subject';
  const className = trimValue(data.className) || 'Class';
  const term = trimValue(data.term) || 'Term';
  const strand = trimValue(data.strand) || 'Strand';
  const subStrand = trimValue(data.subStrand) || 'Sub-strand';
  const title = trimValue(data.lessonTitle) || 'Lesson';
  const teacher = trimValue(data.teacherName) || 'Teacher';

  const weeks = [
    'Week 1', 'Week 2', 'Week 3', 'Week 4',
    'Week 5', 'Week 6', 'Week 7', 'Week 8'
  ];

  const rows = weeks.map((week, index) => `${week}: ${strand} (${subStrand}) — ${title} ${index + 1}; Learning activities, assessment and reflection for ${subject}.`).join('\n');

  return `SCHEME OF WORK\n==================================================\nTeacher: ${teacher}\nClass: ${className}\nSubject: ${subject}\nTerm: ${term}\n\nStrand: ${strand}\nSub-strand: ${subStrand}\n\n${rows}`;
}

function buildRecordOfWork(data) {
  const subject = trimValue(data.subject) || 'Subject';
  const className = trimValue(data.className) || 'Class';
  const term = trimValue(data.term) || 'Term';
  const week = trimValue(data.week) || 'Week';
  const title = trimValue(data.lessonTitle) || 'Lesson';
  const strand = trimValue(data.strand) || 'Strand';
  const assessment = trimValue(data.assessment) || 'Assessment not specified.';
  const reflection = trimValue(data.reflection) || 'Reflection not specified.';

  return `RECORD OF WORK\n==================================================\nClass: ${className}\nSubject: ${subject}\nTerm: ${term}\nWeek: ${week}\n\nLesson title: ${title}\nStrand: ${strand}\n\nContent covered:\n- ${title}\n- Key points connected to the competency\n\nAssessment activities:\n${assessment}\n\nRemarks:\n${reflection}`;
}

function buildReportCard(data) {
  const learner = trimValue(data.learnerName) || 'Learner';
  const className = trimValue(data.reportClass) || 'Class';
  const term = trimValue(data.reportTerm) || 'Term';
  const teacher = trimValue(data.reportTeacher) || 'Teacher';
  const rawScores = trimValue(data.subjectScores) || '';

  const scoreEntries = rawScores
    .split(',')
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const [subject, value] = pair.split('=').map((part) => part.trim());
      if (!subject || value === undefined) return null;
      const score = Number(value);
      const performance = calculatePerformance(score);
      return { subject, score, performance };
    })
    .filter(Boolean);

  const lines = scoreEntries.length
    ? scoreEntries.map(({ subject, score, performance }) => `${subject}: ${score}/100 — ${performance.code} (${performance.label})`).join('\n')
    : 'No subject scores entered.';

  const average = scoreEntries.length
    ? Math.round(scoreEntries.reduce((sum, entry) => sum + entry.score, 0) / scoreEntries.length)
    : 0;
  const overall = calculatePerformance(average);

  return `REPORT CARD\n==================================================\nLearner: ${learner}\nClass: ${className}\nTerm: ${term}\nTeacher: ${teacher}\n\nPerformance levels adopted in KICD-aligned reporting:\n- EE = Exceeding Expectation\n- ME = Meeting Expectation\n- AE = Approaching Expectation\n- BE = Below Expectation\n\nSubject performance\n${lines}\n\nOverall average: ${average}/100\nOverall performance: ${overall.code} (${overall.label})\n\nTeacher comment: ${overall.code === 'EE' ? 'Outstanding progress. Learner demonstrates strong command of competencies.' : overall.code === 'ME' ? 'Good progress. Learner is meeting the expected curriculum standards.' : overall.code === 'AE' ? 'The learner is progressing and would benefit from additional scaffolding.' : 'Learner requires close support and targeted intervention.'}`;
}

function renderOutput(data) {
  const outputGrid = document.getElementById('outputGrid');
  const docs = [
    { title: 'Lesson Plan', content: buildLessonPlan(data) },
    { title: 'Lesson Notes', content: buildLessonNotes(data) },
    { title: 'Scheme of Work', content: buildSchemeOfWork(data) },
    { title: 'Record of Work', content: buildRecordOfWork(data) },
    { title: 'Report Card', content: buildReportCard(document.getElementById('reportCardForm') ? Object.fromEntries(new FormData(document.getElementById('reportCardForm')).entries()) : {}) }
  ];

  outputGrid.innerHTML = docs.map((doc) => `
    <article class="output-card">
      <h3>${doc.title}</h3>
      <pre>${escapeHtml(doc.content)}</pre>
    </article>
  `).join('');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function saveDraft() {
  const formData = Object.fromEntries(new FormData(document.getElementById('curriculumForm')).entries());
  state.drafts = state.drafts || [];
  state.drafts.unshift({ ...formData, savedAt: new Date().toISOString() });
  if (state.drafts.length > 10) state.drafts = state.drafts.slice(0, 10);
  saveState();
  alert('Draft saved locally on this device.');
}

function handleCurriculumSubmit(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  renderOutput(data);
}

function handleReportSubmit(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  renderOutput(Object.fromEntries(new FormData(document.getElementById('curriculumForm')).entries()));
  const reportCard = buildReportCard(data);

  const outputGrid = document.getElementById('outputGrid');
  const reportCardCard = document.createElement('article');
  reportCardCard.className = 'output-card';
  reportCardCard.innerHTML = `<h3>Report Card</h3><pre>${escapeHtml(reportCard)}</pre>`;

  const existingCard = Array.from(outputGrid.querySelectorAll('.output-card'));
  if (existingCard[4]) existingCard[4].replaceWith(reportCardCard);
  else outputGrid.appendChild(reportCardCard);
}

function exportWorkspace() {
  const curriculum = Object.fromEntries(new FormData(document.getElementById('curriculumForm')).entries());
  const report = Object.fromEntries(new FormData(document.getElementById('reportCardForm')).entries());
  const payload = {
    app: 'Kenya Teacher Toolkit',
    exportedAt: new Date().toISOString(),
    data: { curriculum, report, drafts: state.drafts || [] }
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'kenya-teacher-toolkit-export.json';
  link.click();
  URL.revokeObjectURL(url);
  alert('Workspace exported successfully.');
}

function importWorkspace(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const json = JSON.parse(reader.result);
      const imported = json?.data || json;
      if (!imported) throw new Error('Invalid file');

      if (imported.curriculum) {
        const form = document.getElementById('curriculumForm');
        Object.entries(imported.curriculum).forEach(([key, value]) => {
          const field = form.elements.namedItem(key);
          if (field) field.value = value;
        });
      }

      if (imported.report) {
        const form = document.getElementById('reportCardForm');
        Object.entries(imported.report).forEach(([key, value]) => {
          const field = form.elements.namedItem(key);
          if (field) field.value = value;
        });
      }

      if (Array.isArray(imported.drafts)) {
        state.drafts = imported.drafts;
        saveState();
      }

      renderOutput(Object.fromEntries(new FormData(document.getElementById('curriculumForm')).entries()));
      alert('Workspace imported successfully.');
    } catch {
      alert('This file is not a valid Kenya Teacher Toolkit export.');
    }
  };
  reader.readAsText(file);
}

function bindEvents() {
  document.getElementById('curriculumForm').addEventListener('submit', handleCurriculumSubmit);
  document.getElementById('reportCardForm').addEventListener('submit', handleReportSubmit);
  document.getElementById('saveDraft').addEventListener('click', saveDraft);
  document.getElementById('exportBtn').addEventListener('click', exportWorkspace);
  document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importInput').click());
  document.getElementById('importInput').addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (file) importWorkspace(file);
    event.target.value = '';
  });

  document.getElementById('printDashboard').addEventListener('click', () => window.print());
  document.getElementById('printGenerator').addEventListener('click', () => window.print());
  document.getElementById('printReportCard').addEventListener('click', () => window.print());

  document.getElementById('menuButton').addEventListener('click', () => {
    document.getElementById('mainNav').classList.toggle('open');
  });

  document.querySelectorAll('#mainNav a').forEach((link) => {
    link.addEventListener('click', () => document.getElementById('mainNav').classList.remove('open'));
  });
}

function init() {
  updateSubjectCount();
  buildBandSelector();
  populateSubjects();
  renderOutput(Object.fromEntries(new FormData(document.getElementById('curriculumForm')).entries()));
  bindEvents();
}

window.KenyaTeacherToolkit = {
  curriculumData,
  calculatePerformance,
  buildReportCard,
  buildLessonPlan,
  buildSchemeOfWork
};

init();
