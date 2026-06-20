// ===== Official-style T/F Exam Runner =====
const QUICK_FEEDBACK_KEY = 'karimen-quick-feedback';

const examState = {
  examId: null,
  exam: null,
  index: 0,
  answers: [],
  timerId: null,
  endsAt: null,
  startedAt: null,
  submitted: false,
  filter: 'all'
};

const examCache = {};
let examBundleLoading = null;

async function loadExamBundleFallback() {
  if (typeof EXAMS !== 'undefined') return;
  if (!examBundleLoading) {
    examBundleLoading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'exams-data.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load exam bundle'));
      document.body.appendChild(script);
    });
  }
  await examBundleLoading;
}

function questionPoints(exam, q, index) {
  if (q.points != null) return q.points;
  return exam.pointsPerQuestion ?? 2;
}

function getFilteredExams() {
  if (typeof EXAM_CATALOG === 'undefined') return [];
  if (examState.filter === 'all') return EXAM_CATALOG;
  return EXAM_CATALOG.filter(e => e.type === examState.filter);
}

function exam$(sel) { return document.querySelector(sel); }

function isQuickFeedbackEnabled() {
  return localStorage.getItem(QUICK_FEEDBACK_KEY) === '1';
}

function setQuickFeedbackEnabled(enabled) {
  localStorage.setItem(QUICK_FEEDBACK_KEY, enabled ? '1' : '0');
}

function syncQuickFeedbackToggle() {
  const input = exam$('#quickFeedbackCheck');
  if (input) input.checked = isQuickFeedbackEnabled();
}

function announceExamView(title) {
  if (typeof announceView === 'function') announceView(title);
}

function showExamView(name) {
  const viewMap = {
    list: exam$('#viewExamList'),
    run: exam$('#viewExamRun'),
    dashboard: exam$('#viewDashboard')
  };
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  if (name === 'list') viewMap.list.classList.add('active');
  else if (name === 'run') viewMap.run.classList.add('active');
  else viewMap.dashboard.classList.add('active');
  if (typeof closeSidebar === 'function') closeSidebar();
  const title = exam$('#topbarTitle')?.textContent || name;
  announceExamView(title);
}

async function loadExam(examId) {
  if (examCache[examId]) return examCache[examId];

  const entry = EXAM_CATALOG.find(e => e.id === examId);
  if (!entry) return null;

  const overlay = exam$('#examLoadingOverlay');
  overlay?.classList.remove('hidden');

  try {
    const resp = await fetch(entry.file);
    if (!resp.ok) throw new Error(`Failed to load ${entry.file}`);
    const exam = await resp.json();
    examCache[examId] = exam;
    return exam;
  } catch (err) {
    try {
      await loadExamBundleFallback();
      const exam = typeof EXAMS !== 'undefined' ? EXAMS[examId] : null;
      if (exam) {
        examCache[examId] = exam;
        return exam;
      }
    } catch (_) { /* fall through */ }
    console.error(err);
    return null;
  } finally {
    overlay?.classList.add('hidden');
  }
}

function examImageAlt(q, index) {
  if (q.imgAlt) return q.imgAlt;
  const text = (q.q || '').slice(0, 80);
  return text ? `Figure for question ${index + 1}: ${text}` : `Exam figure for question ${index + 1}`;
}

function renderExamCards(container, limit = null) {
  const items = getFilteredExams();
  const shown = limit ? items.slice(0, limit) : items;
  if (!shown.length) {
    container.innerHTML = '<p class="exam-list-empty">No exams in this category yet.</p>';
    return;
  }
  container.innerHTML = shown.map(entry => {
    const typeLabel = entry.type === 'honmen' ? 'Honmen' : 'Karimen';
    const qLabel = entry.type === 'honmen'
      ? `${entry.questionCount} questions (90 T/F + 5 situational)`
      : `${entry.questionCount} true/false`;
    const summary = getExamSummary(entry.id);
    const stats = formatExamSummaryLine(summary);
    const statsHtml = stats
      ? `<p class="exam-card-stats${summary.passed ? ' passed' : ''}">${stats}</p>`
      : '';
    return `
      <article class="exam-list-card" data-exam-id="${entry.id}">
        <div class="exam-list-card-top">
          <span class="exam-type-badge exam-type-${entry.type}">${typeLabel}</span>
          <span class="exam-number">#${entry.number}</span>
        </div>
        <h4>${entry.title}</h4>
        <p>${qLabel} · ${entry.timeLimitMinutes} min · Pass ${entry.passScore}/${entry.maxScore || 100}</p>
        ${statsHtml}
        <button class="btn btn-primary btn-block" type="button">Start Exam</button>
      </article>`;
  }).join('');

  container.querySelectorAll('.exam-list-card button').forEach(btn => {
    btn.addEventListener('click', () => startExam(btn.closest('.exam-list-card').dataset.examId));
  });
}

function openExamList() {
  exam$('#topbarTitle').textContent = 'Practice Exams';
  renderExamCards(exam$('#examListGrid'));
  renderExamHistory();
  showExamView('list');
}

async function renderExamHistory() {
  const listEl = exam$('#examHistoryList');
  if (!listEl) return;

  listEl.innerHTML = '<p class="exam-history-loading">Loading history…</p>';

  const history = await getExamHistory(100);
  if (!history.length) {
    listEl.innerHTML = '<p class="exam-history-empty">No exams completed yet. Scores are saved automatically on this device.</p>';
    return;
  }

  listEl.innerHTML = history.map(item => `
    <article class="exam-history-row${item.passed ? ' passed' : ''}">
      <div class="exam-history-main">
        <span class="exam-type-badge exam-type-${item.type}">${item.type === 'honmen' ? 'Honmen' : 'Karimen'}</span>
        <strong>${item.title}</strong>
      </div>
      <div class="exam-history-meta">
        <span class="exam-history-score">${item.score} / ${item.maxScore}</span>
        <span class="exam-history-badge${item.passed ? ' pass' : ' fail'}">${item.passed ? 'Passed' : 'Failed'}</span>
        ${item.timedOut ? '<span class="exam-history-badge timeout">Time up</span>' : ''}
        <span class="exam-history-date">${formatAttemptDate(item.finishedAt)}</span>
        ${item.durationSec != null ? `<span class="exam-history-duration">${formatDuration(item.durationSec)}</span>` : ''}
      </div>
    </article>
  `).join('');
}

function setExamFilter(filter) {
  examState.filter = filter;
  document.querySelectorAll('.exam-filter-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.filter === filter);
  });
  renderExamCards(exam$('#examListGrid'));
  renderExamCards(exam$('#examLibraryGrid'), 6);
}

async function startExam(examId) {
  const exam = await loadExam(examId);
  if (!exam) {
    if (typeof openModal === 'function') {
      await openModal({
        title: 'Could not load exam',
        body: 'The exam file could not be loaded. Check your connection and try again.',
        confirmLabel: 'OK',
        cancelLabel: 'Close'
      });
    }
    return;
  }

  stopExamTimer();
  examState.examId = examId;
  examState.exam = exam;
  examState.index = 0;
  examState.answers = Array(exam.questions.length).fill(null);
  examState.submitted = false;
  examState.startedAt = Date.now();
  examState.endsAt = Date.now() + exam.timeLimitMinutes * 60 * 1000;

  exam$('#tfExamTitle').textContent = exam.title;
  exam$('#tfExamBody').classList.remove('hidden');
  exam$('#tfExamResults').classList.add('hidden');
  exam$('#topbarTitle').textContent = exam.title;
  exam$('#btnExamSubmit').disabled = false;
  exam$('#btnExamNavFab')?.classList.remove('hidden');

  renderQuestionNav();
  renderTfQuestion();
  startExamTimer();
  syncQuickFeedbackToggle();
  closeExamNavSheet();
  showExamView('run');
  window.scrollTo(0, 0);
}

function startExamTimer() {
  stopExamTimer();
  updateTimerDisplay();
  examState.timerId = setInterval(() => {
    updateTimerDisplay();
    if (Date.now() >= examState.endsAt) submitExam(true);
  }, 1000);
}

function stopExamTimer() {
  if (examState.timerId) {
    clearInterval(examState.timerId);
    examState.timerId = null;
  }
}

function updateTimerDisplay() {
  const remaining = Math.max(0, examState.endsAt - Date.now());
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const el = exam$('#tfExamTimer');
  el.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  el.classList.toggle('timer-warning', remaining < 5 * 60 * 1000);
}

function isMobileExamNav() {
  return window.matchMedia('(max-width: 768px)').matches;
}

function openExamNavSheet() {
  if (!isMobileExamNav()) return;
  exam$('#examNavContainer')?.classList.add('open');
  const overlay = exam$('#examNavSheetOverlay');
  overlay?.classList.add('active');
  overlay?.setAttribute('aria-hidden', 'false');
  exam$('#btnExamNavFab')?.setAttribute('aria-expanded', 'true');
}

function closeExamNavSheet() {
  exam$('#examNavContainer')?.classList.remove('open');
  const overlay = exam$('#examNavSheetOverlay');
  overlay?.classList.remove('active');
  overlay?.setAttribute('aria-hidden', 'true');
  exam$('#btnExamNavFab')?.setAttribute('aria-expanded', 'false');
}

function updateExamNavFab() {
  const label = exam$('#tfNavFabLabel');
  if (!label || !examState.exam) return;
  const total = examState.exam.questions.length;
  label.textContent = `Q ${examState.index + 1} / ${total}`;
}

function updateTfNextButton() {
  const btn = exam$('#btnTfNext');
  if (!btn || !examState.exam) return;
  const total = examState.exam.questions.length;
  const answered = examState.answers[examState.index] !== null;
  const isLast = examState.index >= total - 1;
  btn.disabled = !answered || examState.submitted;
  btn.textContent = isLast ? 'Finish & score' : 'Next question';
}

function renderQuestionNav() {
  const nav = exam$('#tfQuestionNav');
  const cols = examState.exam.questions.length > 50 ? 10 : 5;
  if (!isMobileExamNav()) {
    nav.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  } else {
    nav.style.gridTemplateColumns = 'repeat(8, minmax(44px, 1fr))';
  }
  nav.innerHTML = examState.exam.questions.map((q, i) => {
    const answered = examState.answers[i] !== null;
    const current = i === examState.index;
    const situational = examState.exam.type === 'honmen' && i >= 90;
    return `<button type="button" class="tf-q-num${current ? ' current' : ''}${answered ? ' answered' : ''}${situational ? ' situational' : ''}" data-index="${i}" title="${situational ? 'Situational (2 pts)' : ''}">${i + 1}</button>`;
  }).join('');

  nav.querySelectorAll('.tf-q-num').forEach(btn => {
    btn.addEventListener('click', () => {
      examState.index = +btn.dataset.index;
      renderQuestionNav();
      renderTfQuestion();
      closeExamNavSheet();
    });
  });

  updateExamNavFab();
}

function updateTfAnswerButtons(selected, q) {
  const trueBtn = exam$('#btnTfTrue');
  const falseBtn = exam$('#btnTfFalse');
  trueBtn.classList.remove('selected', 'correct', 'incorrect');
  falseBtn.classList.remove('selected', 'correct', 'incorrect');

  if (selected === null) return;

  if (isQuickFeedbackEnabled()) {
    if (q.answer === 1) trueBtn.classList.add('correct');
    else falseBtn.classList.add('correct');
    if (selected !== q.answer) {
      if (selected === 1) trueBtn.classList.add('incorrect');
      else falseBtn.classList.add('incorrect');
    }
    return;
  }

  trueBtn.classList.toggle('selected', selected === 1);
  falseBtn.classList.toggle('selected', selected === 0);
}

function renderTfFeedback(q, userAnswer) {
  const panel = exam$('#tfQuickFeedback');
  if (!panel) return;

  if (!isQuickFeedbackEnabled() || userAnswer === null) {
    panel.classList.add('hidden');
    panel.innerHTML = '';
    return;
  }

  const correct = userAnswer === q.answer;
  const correctLabel = q.answer === 1 ? '○ True' : '× False';
  const userLabel = userAnswer === 1 ? '○ True' : '× False';

  panel.classList.remove('hidden', 'correct-fb', 'incorrect-fb');
  panel.classList.add(correct ? 'correct-fb' : 'incorrect-fb');

  let html = correct
    ? `${icon('circle-check', { size: 18, class: 'feedback-icon' })} Correct! The answer is <strong>${correctLabel}</strong>`
    : `${icon('circle-x', { size: 18, class: 'feedback-icon' })} Incorrect. You chose ${userLabel}. The answer is <strong>${correctLabel}</strong>`;

  if (q.explanation) {
    html += `<p class="tf-quick-feedback-expl">${q.explanation}</p>`;
  }

  panel.innerHTML = html;
}

function renderTfQuestion() {
  const q = examState.exam.questions[examState.index];
  const total = examState.exam.questions.length;
  const selected = examState.answers[examState.index];
  const situational = examState.exam.type === 'honmen' && examState.index >= 90;

  exam$('#tfQuestionCounter').textContent = situational
    ? `Question ${examState.index + 1} / ${total} (Situational · 2 pts)`
    : `Question ${examState.index + 1} / ${total}`;
  exam$('#tfQuestionText').textContent = q.q;

  const imgWrap = exam$('#tfQuestionImage');
  if (q.img) {
    const alt = examImageAlt(q, examState.index);
    imgWrap.classList.remove('hidden');
    imgWrap.innerHTML = `<img src="${q.img}" alt="${alt.replace(/"/g, '&quot;')}" class="tf-exam-img">`;
  } else {
    imgWrap.classList.add('hidden');
    imgWrap.innerHTML = '';
  }

  updateTfAnswerButtons(selected, q);
  renderTfFeedback(q, selected);
  updateTfNextButton();
  updateExamNavFab();
}

function selectTfAnswer(value) {
  if (examState.submitted) return;
  examState.answers[examState.index] = value;
  renderQuestionNav();
  renderTfQuestion();
}

function nextTfQuestion() {
  if (examState.submitted) return;
  if (examState.answers[examState.index] === null) return;
  if (examState.index < examState.exam.questions.length - 1) {
    examState.index++;
    renderQuestionNav();
    renderTfQuestion();
  } else {
    submitExam(false);
  }
}

async function submitExam(auto = false) {
  if (examState.submitted) return;
  const unanswered = examState.answers.filter(a => a === null).length;
  if (!auto && unanswered > 0) {
    const ok = typeof openModal === 'function'
      ? await openModal({
          title: 'Unanswered questions',
          body: `${unanswered} question(s) are still unanswered. Score the exam anyway?`,
          confirmLabel: 'Score anyway',
          cancelLabel: 'Go back'
        })
      : confirm(`${unanswered} question(s) unanswered. Score anyway?`);
    if (!ok) return;
  }

  examState.submitted = true;
  stopExamTimer();
  closeExamNavSheet();
  exam$('#btnExamNavFab')?.classList.add('hidden');
  exam$('#btnExamSubmit').disabled = true;

  const exam = examState.exam;
  const maxScore = exam.maxScore || 100;
  let points = 0;
  const review = exam.questions.map((q, i) => {
    const user = examState.answers[i];
    const correct = user === q.answer;
    const pts = questionPoints(exam, q, i);
    if (correct) points += pts;
    return { q, user, correct, index: i, pts };
  });

  const passed = points >= exam.passScore;
  exam$('#tfExamBody').classList.add('hidden');
  exam$('#tfExamResults').classList.remove('hidden');
  exam$('#tfResultsIcon').innerHTML = icon(resultsIconName(passed, Math.round((points / maxScore) * 100)), { size: 64, class: 'results-icon-svg' });
  exam$('#tfResultsTitle').textContent = passed ? 'Passed!' : auto ? "Time's Up" : 'Keep Practicing';

  const scoreEl = exam$('#tfResultsScore');
  if (typeof animateScore === 'function') {
    animateScore(scoreEl, points, maxScore);
  } else {
    scoreEl.textContent = `${points} / ${maxScore}`;
  }

  exam$('#tfResultsMessage').textContent = passed
    ? `You scored ${points}/${maxScore} — above the ${exam.passScore} pass mark.`
    : `You need ${exam.passScore}/${maxScore} to pass. Review the questions below.`;

  exam$('#tfReviewList').innerHTML = review.map(item => {
    const userLabel = item.user === null ? '—' : item.user === 1 ? '○ True' : '× False';
    const correctLabel = item.q.answer === 1 ? '○ True' : '× False';
    const imgAlt = item.q.img ? examImageAlt(item.q, item.index) : '';
    const img = item.q.img ? `<img src="${item.q.img}" alt="${imgAlt.replace(/"/g, '&quot;')}" class="tf-review-img">` : '';
    const expl = item.q.explanation && !item.correct
      ? `<p class="tf-review-expl">${item.q.explanation}</p>` : '';
    return `
      <details class="tf-review-item${item.correct ? ' correct' : ' incorrect'}">
        <summary>
          <span class="tf-review-num">Q${item.index + 1}</span>
          <span class="tf-review-verdict">${item.correct ? icon('check', { size: 16, class: 'verdict-icon success' }) : icon('x', { size: 16, class: 'verdict-icon danger' })}</span>
          <span class="tf-review-answers">You: ${userLabel} · Answer: ${correctLabel}</span>
        </summary>
        <div class="tf-review-body">
          <p>${item.q.q}</p>
          ${img}
          ${expl}
        </div>
      </details>`;
  }).join('');

  saveExamProgress(exam, points, passed, auto);
}

async function saveExamProgress(exam, score, passed, timedOut = false) {
  const finishedAt = new Date().toISOString();
  const answered = examState.answers.filter(a => a !== null).length;
  const durationSec = examState.startedAt
    ? Math.round((Date.now() - examState.startedAt) / 1000)
    : null;

  await addExamAttempt({
    examId: exam.id,
    title: exam.title,
    type: exam.type,
    number: exam.number,
    score,
    maxScore: exam.maxScore || 100,
    passScore: exam.passScore,
    passed,
    timedOut,
    answered,
    total: exam.questions.length,
    startedAt: examState.startedAt ? new Date(examState.startedAt).toISOString() : finishedAt,
    finishedAt,
    durationSec
  });

  renderExamCards(exam$('#examListGrid'));
  renderExamCards(exam$('#examLibraryGrid'), 6);
  renderExamHistory();
}

function handleExamKeydown(e) {
  if (!exam$('#viewExamRun').classList.contains('active')) return;
  if (examState.submitted) return;
  if (e.target.matches('input, textarea, select')) return;

  if (e.key === '0') {
    e.preventDefault();
    selectTfAnswer(0);
  } else if (e.key === '1') {
    e.preventDefault();
    selectTfAnswer(1);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    nextTfQuestion();
  }
}

function initExamModule() {
  if (typeof EXAM_CATALOG === 'undefined') return;

  renderExamCards(exam$('#examLibraryGrid'), 6);

  exam$('#btnExamList')?.addEventListener('click', openExamList);
  exam$('#btnExamListHero')?.addEventListener('click', openExamList);
  exam$('#btnViewAllExams')?.addEventListener('click', openExamList);
  document.querySelectorAll('.exam-filter-tab').forEach(tab => {
    tab.addEventListener('click', () => setExamFilter(tab.dataset.filter));
  });
  exam$('#btnExamListBack')?.addEventListener('click', () => {
    exam$('#topbarTitle').textContent = 'Dashboard';
    showExamView('dashboard');
  });

  exam$('#btnExamRunBack')?.addEventListener('click', async () => {
    if (!examState.submitted && examState.answers.some(a => a !== null)) {
      const ok = typeof openModal === 'function'
        ? await openModal({
            title: 'Leave exam?',
            body: 'Your progress on this attempt will be lost.',
            confirmLabel: 'Leave',
            cancelLabel: 'Stay'
          })
        : confirm('Leave exam? Your progress will be lost.');
      if (!ok) return;
    }
    stopExamTimer();
    openExamList();
  });

  exam$('#btnTfTrue')?.addEventListener('click', () => selectTfAnswer(1));
  exam$('#btnTfFalse')?.addEventListener('click', () => selectTfAnswer(0));
  exam$('#btnTfNext')?.addEventListener('click', () => nextTfQuestion());
  exam$('#btnExamNavFab')?.addEventListener('click', () => {
    const container = exam$('#examNavContainer');
    if (container?.classList.contains('open')) closeExamNavSheet();
    else openExamNavSheet();
  });
  exam$('#btnCloseExamNav')?.addEventListener('click', closeExamNavSheet);
  exam$('#examNavSheetOverlay')?.addEventListener('click', closeExamNavSheet);
  if (exam$('#btnCloseExamNav') && typeof icon === 'function') {
    exam$('#btnCloseExamNav').innerHTML = icon('x', { size: 20 });
  }
  exam$('#quickFeedbackCheck')?.addEventListener('change', (e) => {
    setQuickFeedbackEnabled(e.target.checked);
    renderTfQuestion();
  });
  syncQuickFeedbackToggle();
  exam$('#btnExamSubmit')?.addEventListener('click', () => submitExam(false));
  exam$('#btnExamRetry')?.addEventListener('click', () => startExam(examState.examId));
  exam$('#btnExamDone')?.addEventListener('click', openExamList);

  exam$('#btnClearExamHistory')?.addEventListener('click', async () => {
    const ok = typeof openModal === 'function'
      ? await openModal({
          title: 'Clear exam history?',
          body: 'This removes all saved exam scores and attempts on this device.',
          confirmLabel: 'Clear history',
          cancelLabel: 'Cancel'
        })
      : confirm('Clear all exam history and scores on this device?');
    if (!ok) return;
    await clearExamHistory();
    renderExamCards(exam$('#examListGrid'));
    renderExamCards(exam$('#examLibraryGrid'), 6);
    renderExamHistory();
  });

  document.addEventListener('keydown', handleExamKeydown);
}

document.addEventListener('DOMContentLoaded', initExamModule);
