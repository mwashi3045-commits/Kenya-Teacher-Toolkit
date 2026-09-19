/* Band-aware, offline AI-style document generation.
 * This creates structured drafts locally; connect generateBandDocumentPack to a
 * protected AI API later if server-side generation is required.
 */
(function () {
  const subjectFocus = {
    Mathematics: 'concrete examples, mathematical language, worked examples and independent practice',
    English: 'oral language, reading, vocabulary, grammar and a short writing task',
    'English Literacy': 'phonics, oral language, shared reading and guided writing',
    Kiswahili: 'kusikiliza, kuzungumza, kusoma, kuandika and vocabulary development',
    'Kiswahili Literacy': 'phonological awareness, oral language, shared reading and emergent writing',
    Science: 'observation, prediction, investigation, evidence and safety',
    'Science and Technology': 'observation, investigation, design thinking and safe use of technology',
    'Integrated Science': 'inquiry, practical investigation, evidence and scientific communication',
    'Social Studies': 'local context, source discussion, mapping, citizenship and reflection',
    Agriculture: 'demonstration, practical work, sustainability and observation',
    'Creative Arts': 'demonstration, exploration, making, performance and critique',
    'Creative Arts and Sports': 'creative process, performance, teamwork and reflection',
    'Religious Education': 'story, values, discussion, application and personal reflection',
    'Physical Education': 'demonstration, safe movement, practice, teamwork and feedback',
    Biology: 'observation, practical work, evidence and biological vocabulary',
    Chemistry: 'symbols, practical investigation, observation and safe laboratory practice',
    Physics: 'prediction, measurement, practical investigation and explanation',
    Geography: 'maps, field evidence, data interpretation and environmental responsibility',
    'History and Citizenship': 'source analysis, chronology, evidence and responsible citizenship',
    'Business Studies': 'real-life cases, decision-making, calculation and entrepreneurship',
    'Computer Science': 'computational thinking, algorithms, practical creation and testing',
    Economics: 'real-life examples, data interpretation and reasoned decisions'
  };

  const bandLabels = {
    lower: 'Lower Primary (Grade 1–3)',
    upper: 'Upper Primary (Grade 4–6)',
    junior: 'Junior School (Grade 7–9)',
    senior: 'Senior School (Grade 10–12)'
  };

  const bandApproach = {
    lower: 'Use play-based, story-led, multisensory activities with modelling, talk and short hands-on tasks.',
    upper: 'Use learner-centred group work, practical examples, guided discovery and clear formative checks.',
    junior: 'Use inquiry, collaboration, projects, real-life problem solving and reflection on competencies.',
    senior: 'Use pathway-aware, analytical and practical learning with evidence, application and independent study.'
  };

  function text(value, fallback) { return (value || '').trim() || fallback; }
  function escapeHtml(value) { return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }

  function makePack(data) {
    const band = data.band || 'lower';
    const subject = text(data.subject, 'Learning area');
    const grade = text(data.grade, 'Class');
    const title = text(data.title, `${subject} learning activity`);
    const strand = text(data.strand, 'Relevant strand');
    const substrand = text(data.substrand, 'Relevant sub-strand');
    const outcomes = text(data.outcomes, `Learners will demonstrate understanding of ${title}.`);
    const focus = subjectFocus[subject] || 'discussion, practical activity, learner explanation and formative assessment';
    const approach = bandApproach[band] || bandApproach.lower;
    const methods = text(data.methods, `${approach} Begin with a diagnostic question, model the skill, facilitate paired practice, then use an exit task.`);
    const resources = text(data.resources, 'Learner books, locally available materials, chalkboard, activity cards and assessment checklist.');
    const assessment = text(data.assessment, 'Observation, oral questioning, learner product, peer feedback and a short exit task.');
    const reflection = text(data.reflection, 'Record learners needing support, enrichment and follow-up in the next lesson.');
    const week = text(data.week, 'Week 1 / Lesson 1');
    const term = text(data.term, 'Term 1');

    const lessonPlan = `LESSON PLAN\n==============================\nBand: ${bandLabels[band]}\nGrade: ${grade}\nSubject: ${subject}\nTerm: ${term}\n${week}\nLesson title: ${title}\nStrand: ${strand}\nSub-strand: ${substrand}\n\nSpecific learning outcomes:\n${outcomes}\n\nKey competency focus:\nCommunication and collaboration; critical thinking and problem solving; self-efficacy.\n\nLearning experiences / teaching methods:\n${methods}\n\nSubject-informed approach:\nPrioritise ${focus}.\n\nResources:\n${resources}\n\nAssessment evidence:\n${assessment}\n\nDifferentiation and reflection:\n${reflection}`;

    const notes = `LESSON NOTES\n==============================\n${bandLabels[band]} | ${grade} | ${subject}\nTopic: ${title}\nStrand: ${strand} | Sub-strand: ${substrand}\n\nTeacher preparation:\nPrepare examples and materials appropriate to the learners' age and local context.\n\nIntroduction:\nConnect ${title} to learners' experiences using a question, object, story or short demonstration.\n\nDevelopment:\n1. Model the target skill and language.\n2. Guide learners through ${focus}.\n3. Let learners practise collaboratively.\n4. Ask learners to explain or demonstrate their thinking.\n\nClosure:\nUse an exit question or performance task linked to: ${outcomes}\n\nSupport and extension:\nProvide a smaller worked example and peer support for learners who need it; offer an open-ended challenge to learners ready for extension.\n\nTeacher reflection:\n${reflection}`;

    const scheme = `SCHEME OF WORK\n==============================\nBand: ${bandLabels[band]}\nGrade: ${grade}\nSubject: ${subject}\nTerm: ${term}\nWeek: ${week}\n\nStrand: ${strand}\nSub-strand: ${substrand}\nTopic: ${title}\n\nSpecific learning outcomes:\n${outcomes}\n\nSuggested learning experiences:\n${methods}\n\nResources:\n${resources}\n\nAssessment methods:\n${assessment}\n\nCore competencies and values:\nCommunication and collaboration; critical thinking; creativity; respect, responsibility and integrity.\n\nAdaptation for this band:\n${approach}`;

    const record = `RECORD OF WORK\n==============================\nBand: ${bandLabels[band]}\nGrade: ${grade}\nSubject: ${subject}\nTerm: ${term}\nWeek / lesson: ${week}\nDate: ____________________\n\nStrand / sub-strand: ${strand} / ${substrand}\nContent covered: ${title}\n\nLearning outcomes achieved or not achieved:\n${outcomes}\n\nActivities completed:\n${methods}\n\nAssessment evidence collected:\n${assessment}\n\nLearners requiring support / enrichment:\n__________________________________________________\n\nTeacher comment and next action:\n${reflection}`;

    return { lessonPlan, notes, scheme, record, band, subject, grade, title };
  }

  function renderPack(pack) {
    const output = document.getElementById('outputGrid');
    if (!output) return;
    const docs = [
      ['AI lesson plan', pack.lessonPlan],
      ['AI lesson notes', pack.notes],
      ['AI scheme of work', pack.scheme],
      ['AI record of work', pack.record]
    ];
    output.innerHTML = docs.map(([title, content]) => `<article class="output-card"><h3>${title}</h3><pre>${escapeHtml(content)}</pre><button class="btn secondary copy-document" type="button">Copy document</button></article>`).join('');
    output.querySelectorAll('.copy-document').forEach((button, index) => {
      button.addEventListener('click', async () => {
        await navigator.clipboard?.writeText(docs[index][1]);
        button.textContent = 'Copied';
        setTimeout(() => { button.textContent = 'Copy document'; }, 1200);
      });
    });
  }

  function getFormData() {
    const form = document.getElementById('curriculumForm');
    return form ? Object.fromEntries(new FormData(form).entries()) : {};
  }

  function generateBandDocumentPack() {
    const data = getFormData();
    const pack = makePack(data);
    renderPack(pack);
    const output = document.getElementById('aiSuggestionOutput');
    if (output) output.innerHTML = `<p><strong>AI pack generated:</strong> ${escapeHtml(pack.title)} for ${escapeHtml(pack.grade)} · ${escapeHtml(pack.subject)} · ${escapeHtml(bandLabels[pack.band])}. Review the draft against your approved curriculum design before teaching or formal submission.</p>`;
    localStorage.setItem('kenyaToolkitAiPack', JSON.stringify({ data, pack, generatedAt: new Date().toISOString() }));
    document.getElementById('outputGrid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function init() {
    const panel = document.querySelector('.ai-panel');
    if (!panel || document.getElementById('generateCompletePack')) return;
    const actions = panel.querySelector('.section-head');
    const button = document.createElement('button');
    button.id = 'generateCompletePack';
    button.type = 'button';
    button.className = 'btn primary';
    button.textContent = 'Generate complete AI pack';
    button.title = 'Generate lesson plan, notes, scheme of work and record of work for the selected band and subject';
    actions?.appendChild(button);
    button.addEventListener('click', generateBandDocumentPack);
    document.getElementById('curriculumForm')?.addEventListener('change', () => {
      const output = document.getElementById('aiSuggestionOutput');
      if (output) output.innerHTML = '<p>Selection updated. Generate the complete AI pack to create all four documents for this band and subject.</p>';
    });
  }

  window.KenyaTeacherToolkitAI = { makePack, generateBandDocumentPack, subjectFocus, bandLabels };
  window.addEventListener('DOMContentLoaded', init);
}());
