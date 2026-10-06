// ===== Image-Based and Situation-Based Test Module =====

const specialTestState = {
  type: null, // 'image' | 'situation'
  questions: [],
  index: 0,
  answers: [],
  score: 0,
  submitted: false
};

function specialTest$(sel) { return document.querySelector(sel); }

// Extract all image-based questions from loaded exams
async function getAllImageQuestions() {
  const imageQuestions = [];
  
  if (typeof EXAM_CATALOG === 'undefined') return imageQuestions;
  
  for (const entry of EXAM_CATALOG) {
    try {
      let exam;
      if (typeof examCache !== 'undefined' && examCache[entry.id]) {
        exam = examCache[entry.id];
      } else {
        const resp = await fetch(entry.file);
        if (resp.ok) {
          exam = await resp.json();
        }
      }
      
      if (exam && exam.questions) {
        exam.questions.forEach((q, idx) => {
          if (q.img && !q.q.includes("What kinds of things should you be careful of")) {
            imageQuestions.push({
              ...q,
              examId: entry.id,
              examTitle: entry.title,
              originalIndex: idx
            });
          }
        });
      }
    } catch (e) {
      console.warn(`Could not load exam ${entry.id}:`, e);
    }
  }
  
  return imageQuestions;
}

// Extract all situation-based questions from loaded exams
async function getAllSituationQuestions() {
  const situationQuestions = [];
  
  if (typeof EXAM_CATALOG === 'undefined') return situationQuestions;
  
  for (const entry of EXAM_CATALOG) {
    try {
      let exam;
      if (typeof examCache !== 'undefined' && examCache[entry.id]) {
        exam = examCache[entry.id];
      } else {
        const resp = await fetch(entry.file);
        if (resp.ok) {
          exam = await resp.json();
        }
      }
      
      if (exam && exam.questions) {
        exam.questions.forEach((q, idx) => {
          if (q.img && q.q.includes("What kinds of things should you be careful of")) {
            situationQuestions.push({
              ...q,
              examId: entry.id,
              examTitle: entry.title,
              originalIndex: idx
            });
          }
        });
      }
    } catch (e) {
      console.warn(`Could not load exam ${entry.id}:`, e);
    }
  }
  
  return situationQuestions;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function startImageTest() {
  const overlay = specialTest$('#examLoadingOverlay');
  if (overlay) overlay.classList.remove('hidden');
  
  try {
    const allQuestions = await getAllImageQuestions();
    if (!allQuestions.length) {
      alert('No image-based questions available. Please try again later.');
      return;
    }
    
    // Select 30 random image questions
    const selected = shuffleArray(allQuestions).slice(0, 30);
    
    specialTestState.type = 'image';
    specialTestState.questions = selected;
    specialTestState.index = 0;
    specialTestState.answers = Array(selected.length).fill(null);
    specialTestState.score = 0;
    specialTestState.submitted = false;
    
    specialTest$('#specialTestTitle').textContent = 'Image-Based Test';
    specialTest$('#specialTestSubtitle').textContent = 'Traffic signs and visual recognition';
    specialTest$('#topbarTitle').textContent = 'Image Test';
    
    renderSpecialTest();
    showSpecialTestView();
  } finally {
    if (overlay) overlay.classList.add('hidden');
  }
}

async function startSituationTest() {
  const overlay = specialTest$('#examLoadingOverlay');
  if (overlay) overlay.classList.remove('hidden');
  
  try {
    const allQuestions = await getAllSituationQuestions();
    if (!allQuestions.length) {
      alert('No situation-based questions available. Please try again later.');
      return;
    }
    
    // Use all situation questions (usually around 16-20)
    const selected = shuffleArray(allQuestions);
    
    specialTestState.type = 'situation';
    specialTestState.questions = selected;
    specialTestState.index = 0;
    specialTestState.answers = Array(selected.length).fill(null);
    specialTestState.score = 0;
    specialTestState.submitted = false;
    
    specialTest$('#specialTestTitle').textContent = 'Situation-Based Test';
    specialTest$('#specialTestSubtitle').textContent = 'Real driving scenarios - What should you be careful of?';
    specialTest$('#topbarTitle').textContent = 'Situation Test';
    
    renderSpecialTest();
    showSpecialTestView();
  } finally {
    if (overlay) overlay.classList.add('hidden');
  }
}

function showSpecialTestView() {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  specialTest$('#viewSpecialTest').classList.add('active');
  if (typeof closeSidebar === 'function') closeSidebar();
  window.scrollTo(0, 0);
}

function renderSpecialTest() {
  const q = specialTestState.questions[specialTestState.index];
  const total = specialTestState.questions.length;
  const selected = specialTestState.answers[specialTestState.index];
  
  specialTest$('#specialTestCounter').textContent = `Question ${specialTestState.index + 1} / ${total}`;
  specialTest$('#specialTestScore').textContent = `Score: ${specialTestState.score}`;
  
  // Render question
  const questionEl = specialTest$('#specialTestQuestion');
  questionEl.textContent = q.q;
  
  // Render image
  const imgEl = specialTest$('#specialTestImage');
  if (q.img) {
    imgEl.innerHTML = `<img src="${q.img}" alt="Question image" class="special-test-img">`;
    imgEl.classList.remove('hidden');
  } else {
    imgEl.classList.add('hidden');
  }
  
  // Update answer buttons
  const trueBtn = specialTest$('#btnSpecialTrue');
  const falseBtn = specialTest$('#btnSpecialFalse');
  trueBtn.classList.remove('selected', 'correct', 'incorrect');
  falseBtn.classList.remove('selected', 'correct', 'incorrect');
  trueBtn.disabled = specialTestState.submitted;
  falseBtn.disabled = specialTestState.submitted;
  
  if (selected !== null) {
    if (selected === q.answer) {
      if (selected === 1) trueBtn.classList.add('correct');
      else falseBtn.classList.add('correct');
    } else {
      if (selected === 1) trueBtn.classList.add('incorrect');
      else falseBtn.classList.add('incorrect');
      if (q.answer === 1) trueBtn.classList.add('correct');
      else falseBtn.classList.add('correct');
    }
  }
  
  // Render feedback
  const feedbackEl = specialTest$('#specialTestFeedback');
  if (selected !== null) {
    const correct = selected === q.answer;
    const correctLabel = q.answer === 1 ? '○ True' : '× False';
    feedbackEl.classList.remove('hidden', 'correct-fb', 'incorrect-fb');
    feedbackEl.classList.add(correct ? 'correct-fb' : 'incorrect-fb');
    
    let html = correct
      ? `${typeof icon === 'function' ? icon('circle-check', { size: 18, class: 'feedback-icon' }) : '✓'} Correct! <strong>${correctLabel}</strong>`
      : `${typeof icon === 'function' ? icon('circle-x', { size: 18, class: 'feedback-icon' }) : '✗'} Incorrect. The answer is: <strong>${correctLabel}</strong>`;
    
    if (q.explanation) {
      html += `<p class="special-test-explanation">${q.explanation}</p>`;
    }
    
    feedbackEl.innerHTML = html;
  } else {
    feedbackEl.classList.add('hidden');
  }
  
  // Update navigation
  renderSpecialTestNav();
  updateSpecialTestNextBtn();
}

function renderSpecialTestNav() {
  const nav = specialTest$('#specialTestNav');
  if (!nav) return;
  
  nav.innerHTML = specialTestState.questions.map((q, i) => {
    const answered = specialTestState.answers[i] !== null;
    const current = i === specialTestState.index;
    return `<button type="button" class="special-nav-btn${current ? ' current' : ''}${answered ? ' answered' : ''}" data-index="${i}">${i + 1}</button>`;
  }).join('');
  
  nav.querySelectorAll('.special-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      specialTestState.index = +btn.dataset.index;
      renderSpecialTest();
    });
  });
}

function updateSpecialTestNextBtn() {
  const btn = specialTest$('#btnSpecialNext');
  if (!btn) return;
  
  const answered = specialTestState.answers[specialTestState.index] !== null;
  const isLast = specialTestState.index >= specialTestState.questions.length - 1;
  
  btn.disabled = !answered;
  btn.textContent = isLast ? 'See Results' : 'Next Question';
}

function selectSpecialAnswer(value) {
  if (specialTestState.answers[specialTestState.index] !== null) return;
  
  specialTestState.answers[specialTestState.index] = value;
  const q = specialTestState.questions[specialTestState.index];
  if (value === q.answer) {
    specialTestState.score++;
  }
  
  renderSpecialTest();
}

function nextSpecialQuestion() {
  if (specialTestState.answers[specialTestState.index] === null) return;
  
  if (specialTestState.index < specialTestState.questions.length - 1) {
    specialTestState.index++;
    renderSpecialTest();
    window.scrollTo(0, 0);
  } else {
    showSpecialTestResults();
  }
}

function showSpecialTestResults() {
  specialTestState.submitted = true;
  
  const total = specialTestState.questions.length;
  const score = specialTestState.score;
  const pct = Math.round((score / total) * 100);
  const passed = pct >= 80;
  
  specialTest$('#specialTestBody').classList.add('hidden');
  specialTest$('#specialTestResults').classList.remove('hidden');
  
  const resultIcon = specialTest$('#specialResultsIcon');
  if (typeof resultsIconName === 'function' && typeof icon === 'function') {
    resultIcon.innerHTML = icon(resultsIconName(passed, pct), { size: 64, class: 'results-icon-svg' });
  } else {
    resultIcon.textContent = passed ? '🎉' : '📚';
  }
  
  specialTest$('#specialResultsTitle').textContent = passed ? 'Great Job!' : 'Keep Practicing!';
  
  const scoreEl = specialTest$('#specialResultsScore');
  if (typeof animateScore === 'function') {
    animateScore(scoreEl, score, total);
  } else {
    scoreEl.textContent = `${score} / ${total}`;
  }
  
  const typeLabel = specialTestState.type === 'image' ? 'image-based' : 'situation-based';
  specialTest$('#specialResultsMessage').textContent = passed
    ? `You scored ${pct}% on ${typeLabel} questions. Great visual recognition!`
    : `You scored ${pct}%. Review the ${typeLabel} questions you missed and try again.`;
  
  // Render review list
  const reviewList = specialTest$('#specialReviewList');
  reviewList.innerHTML = specialTestState.questions.map((q, i) => {
    const user = specialTestState.answers[i];
    const correct = user === q.answer;
    const userLabel = user === null ? '—' : user === 1 ? '○ True' : '× False';
    const correctLabel = q.answer === 1 ? '○ True' : '× False';
    const img = q.img ? `<img src="${q.img}" alt="Question ${i + 1}" class="special-review-img">` : '';
    const expl = q.explanation && !correct ? `<p class="special-review-expl">${q.explanation}</p>` : '';
    
    return `
      <details class="special-review-item${correct ? ' correct' : ' incorrect'}">
        <summary>
          <span class="special-review-num">Q${i + 1}</span>
          <span class="special-review-verdict">${correct ? '✓' : '✗'}</span>
          <span class="special-review-answers">You: ${userLabel} · Answer: ${correctLabel}</span>
        </summary>
        <div class="special-review-body">
          ${img}
          <p>${q.q}</p>
          ${expl}
        </div>
      </details>`;
  }).join('');
}

function retrySpecialTest() {
  if (specialTestState.type === 'image') {
    startImageTest();
  } else {
    startSituationTest();
  }
}

function exitSpecialTest() {
  specialTest$('#topbarTitle').textContent = 'Dashboard';
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  specialTest$('#viewDashboard').classList.add('active');
  if (typeof renderContinueCard === 'function') renderContinueCard();
}

function initSpecialTests() {
  // Button event listeners
  specialTest$('#btnImageTest')?.addEventListener('click', startImageTest);
  specialTest$('#btnSituationTest')?.addEventListener('click', startSituationTest);
  specialTest$('#btnImageTestHero')?.addEventListener('click', startImageTest);
  specialTest$('#btnSituationTestHero')?.addEventListener('click', startSituationTest);
  
  // Test controls
  specialTest$('#btnSpecialTestBack')?.addEventListener('click', exitSpecialTest);
  specialTest$('#btnSpecialTrue')?.addEventListener('click', () => selectSpecialAnswer(1));
  specialTest$('#btnSpecialFalse')?.addEventListener('click', () => selectSpecialAnswer(0));
  specialTest$('#btnSpecialNext')?.addEventListener('click', nextSpecialQuestion);
  specialTest$('#btnSpecialRetry')?.addEventListener('click', retrySpecialTest);
  specialTest$('#btnSpecialDone')?.addEventListener('click', exitSpecialTest);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (!specialTest$('#viewSpecialTest')?.classList.contains('active')) return;
    if (specialTestState.submitted) return;
    if (e.target.matches('input, textarea, select')) return;
    
    if (e.key === '1') {
      e.preventDefault();
      selectSpecialAnswer(1);
    } else if (e.key === '0') {
      e.preventDefault();
      selectSpecialAnswer(0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      nextSpecialQuestion();
    }
  });
}

document.addEventListener('DOMContentLoaded', initSpecialTests);
