const CBE_BANDS = {
  'lower': {
    label: 'Lower Primary (Grade 1–3)',
    grades: ['Grade 1', 'Grade 2', 'Grade 3'],
    subjects: ['English Literacy', 'Kiswahili Literacy', 'Mathematics', 'Environmental Activities', 'Creative Arts', 'Religious Education', 'Physical Education']
  },
  'upper': {
    label: 'Upper Primary (Grade 4–6)',
    grades: ['Grade 4', 'Grade 5', 'Grade 6'],
    subjects: ['English', 'Kiswahili', 'Mathematics', 'Science and Technology', 'Social Studies', 'Agriculture', 'Creative Arts and Sports', 'Religious Education']
  },
  'junior': {
    label: 'Junior School (Grade 7–9)',
    grades: ['Grade 7', 'Grade 8', 'Grade 9'],
    subjects: ['English', 'Kiswahili', 'Mathematics', 'Integrated Science', 'Social Studies', 'Pre-Technical Studies', 'Agriculture', 'Business Studies', 'Creative Arts and Sports', 'Religious Education']
  },
  'senior': {
    label: 'Senior School (Grade 10–12)',
    grades: ['Grade 10', 'Grade 11', 'Grade 12'],
    subjects: ['English', 'Kiswahili', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'Geography', 'History and Citizenship', 'Business Studies', 'Agriculture', 'Computer Science', 'Economics', 'Religious Education']
  }
};

const CBE_LEVELS = [
  { level: 8, code: 'EE1', band: 'EE', range: '90–100%', label: 'Exceeding Expectations', descriptor: 'Performs all expected activities accurately and independently.' },
  { level: 7, code: 'EE2', band: 'EE', range: '75–89%', label: 'Exceeding Expectations', descriptor: 'Performs expected activities very well, with strong application.' },
  { level: 6, code: 'ME1', band: 'ME', range: '58–74%', label: 'Meeting Expectations', descriptor: 'Follows instructions and completes most activities correctly.' },
  { level: 5, code: 'ME2', band: 'ME', range: '41–57%', label: 'Meeting Expectations', descriptor: 'Completes essential activities with developing consistency.' },
  { level: 4, code: 'AE1', band: 'AE', range: '31–40%', label: 'Approaching Expectations', descriptor: 'Attempts tasks but needs support and is inconsistent.' },
  { level: 3, code: 'AE2', band: 'AE', range: '21–30%', label: 'Approaching Expectations', descriptor: 'Shows partial understanding and requires guided practice.' },
  { level: 2, code: 'BE1', band: 'BE', range: '11–20%', label: 'Below Expectations', descriptor: 'Shows major inaccuracies and needs intensive support.' },
  { level: 1, code: 'BE2', band: 'BE', range: '1–10%', label: 'Below Expectations', descriptor: 'Is unable to complete most activities without substantial support.' }
];

function levelForScore(score) {
  const value = Number(score);
  if (!Number.isFinite(value) || value < 1) return CBE_LEVELS[CBE_LEVELS.length - 1];
  return CBE_LEVELS.find((item) => value >= Number(item.range.split('–')[0])) || CBE_LEVELS[CBE_LEVELS.length - 1];
}

function populate(select, values) {
  select.innerHTML = values.map((value) => `<option value="${value}">${value}</option>`).join('');
}

function initAssessment() {
  const bandSelect = document.getElementById('bandSelect');
  const gradeSelect = document.getElementById('gradeSelect');
  const subjectSelect = document.getElementById('subjectSelect');
  const levelGrid = document.getElementById('levelGrid');

  populate(bandSelect, Object.keys(CBE_BANDS));
  bandSelect.innerHTML = Object.entries(CBE_BANDS).map(([key, value]) => `<option value="${key}">${value.label}</option>`).join('');

  function updateBand() {
    const band = CBE_BANDS[bandSelect.value];
    populate(gradeSelect, band.grades);
    populate(subjectSelect, band.subjects);
  }
  bandSelect.addEventListener('change', updateBand);
  updateBand();

  levelGrid.innerHTML = CBE_LEVELS.map((item) => `
    <article class="level-card">
      <strong>Level ${item.level} · ${item.code}</strong>
      <small>${item.band} · ${item.range}</small>
      <p><b>${item.label}.</b> ${item.descriptor}</p>
    </article>
  `).join('');

  document.getElementById('evaluateBtn').addEventListener('click', () => {
    const level = levelForScore(document.getElementById('scoreInput').value);
    const result = document.getElementById('result');
    const band = CBE_BANDS[bandSelect.value];
    result.hidden = false;
    result.innerHTML = `<strong>${band.label} · ${gradeSelect.value} · ${subjectSelect.value}</strong><br>Level ${level.level} (${level.code}) — ${level.band}: ${level.label}<br><span>${level.descriptor}</span>`;
  });

  document.getElementById('printBtn').addEventListener('click', () => window.print());
}

window.KenyaCBEAssessment = { CBE_BANDS, CBE_LEVELS, levelForScore };
window.addEventListener('DOMContentLoaded', initAssessment);
