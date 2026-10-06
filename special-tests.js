// ===== Image-Based and Situation-Based Test Module =====
// Version 2.0 - MCQ format for situations

const specialTestState = {
  type: null, // 'image' | 'situation'
  questions: [],
  index: 0,
  answers: [], // For image: single answer; For situation: array of selected indices
  score: 0,
  submitted: false,
  questionAnswered: false
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

// Get situation questions from dedicated data file
function getSituationQuestions() {
  if (typeof SITUATION_QUESTIONS !== 'undefined' && Array.isArray(SITUATION_QUESTIONS)) {
    // Validate that questions have the correct structure
    const valid = SITUATION_QUESTIONS.filter(q => 
      q.scenario && Array.isArray(q.statements) && q.statements.length > 0
    );
    console.log('Loaded', valid.length, 'situation questions');
    return valid;
  }
  console.warn('SITUATION_QUESTIONS not loaded or invalid');
  return [];
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
  console.log('Starting Situation Test...');
  const overlay = specialTest$('#examLoadingOverlay');
  if (overlay) overlay.classList.remove('hidden');
  
  try {
    const allQuestions = getSituationQuestions();
    console.log('Got', allQuestions.length, 'situation questions');
    
    if (!allQuestions.length) {
      alert('No situation-based questions available. Please make sure situation-data.js is loaded.');
      if (overlay) overlay.classList.add('hidden');
      return;
    }
    
    // Verify first question has correct structure
    if (!allQuestions[0].scenario || !allQuestions[0].statements) {
      alert('Situation questions have incorrect format. Please refresh the page.');
      if (overlay) overlay.classList.add('hidden');
      return;
    }
    
    // Shuffle and use all situation questions
    const selected = shuffleArray(allQuestions);
    
    specialTestState.type = 'situation';
    specialTestState.questions = selected;
    specialTestState.index = 0;
    specialTestState.answers = selected.map(() => []); // Array of arrays for multiple selections
    specialTestState.score = 0;
    specialTestState.submitted = false;
    specialTestState.questionAnswered = false;
    
    console.log('State type set to:', specialTestState.type);
    
    specialTest$('#specialTestTitle').textContent = 'Situation-Based Test';
    specialTest$('#specialTestSubtitle').textContent = 'Select ALL correct statements for each scenario';
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
  if (specialTestState.type === 'situation') {
    renderSituationTest();
  } else {
    renderImageTest();
  }
  renderSpecialTestNav();
  updateSpecialTestNextBtn();
}

function renderImageTest() {
  const q = specialTestState.questions[specialTestState.index];
  const total = specialTestState.questions.length;
  const selected = specialTestState.answers[specialTestState.index];
  
  specialTest$('#specialTestCounter').textContent = `Question ${specialTestState.index + 1} / ${total}`;
  specialTest$('#specialTestScore').textContent = `Score: ${specialTestState.score}`;
  
  // IMPORTANT: Show T/F controls, hide MCQ controls
  const imageControls = specialTest$('#imageTestControls');
  const sitControls = specialTest$('#situationTestControls');
  
  if (imageControls) {
    imageControls.style.display = 'block';
    imageControls.classList.remove('hidden');
  }
  if (sitControls) {
    sitControls.style.display = 'none';
    sitControls.classList.add('hidden');
  }
  
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
}

function renderSituationTest() {
  const q = specialTestState.questions[specialTestState.index];
  const total = specialTestState.questions.length;
  const selected = specialTestState.answers[specialTestState.index] || [];
  
  // Validate question has correct structure
  if (!q.scenario || !q.statements) {
    console.error('Invalid situation question format:', q);
    return;
  }
  
  specialTest$('#specialTestCounter').textContent = `Scenario ${specialTestState.index + 1} / ${total}`;
  specialTest$('#specialTestScore').textContent = `Score: ${specialTestState.score}`;
  
  // IMPORTANT: Hide T/F controls, show MCQ controls
  const imageControls = specialTest$('#imageTestControls');
  const sitControls = specialTest$('#situationTestControls');
  
  if (imageControls) imageControls.style.display = 'none';
  if (sitControls) sitControls.style.display = 'block';
  
  // Also use classList as backup
  if (imageControls) imageControls.classList.add('hidden');
  if (sitControls) sitControls.classList.remove('hidden');
  
  // Render scenario
  const questionEl = specialTest$('#specialTestQuestion');
  questionEl.innerHTML = `<strong>${q.scenario}</strong><p class="situation-instruction">Select ALL statements that are TRUE:</p>`;
  
  // Render image
  const imgEl = specialTest$('#specialTestImage');
  if (q.img) {
    imgEl.innerHTML = `<img src="${q.img}" alt="Driving scenario" class="special-test-img situation-img">`;
    imgEl.classList.remove('hidden');
  } else {
    imgEl.classList.add('hidden');
  }
  
  // Render statement checkboxes
  const statementsEl = specialTest$('#situationStatements');
  const isAnswered = specialTestState.questionAnswered;
  
  statementsEl.innerHTML = q.statements.map((stmt, idx) => {
    const isSelected = selected.includes(idx);
    const showResult = isAnswered;
    let classes = 'situation-statement';
    if (isSelected) classes += ' selected';
    if (showResult) {
      if (stmt.correct && isSelected) classes += ' correct';
      else if (stmt.correct && !isSelected) classes += ' missed';
      else if (!stmt.correct && isSelected) classes += ' incorrect';
    }
    
    return `
      <label class="${classes}" data-index="${idx}">
        <input type="checkbox" ${isSelected ? 'checked' : ''} ${isAnswered ? 'disabled' : ''}>
        <span class="statement-text">${stmt.text}</span>
        ${showResult ? `<span class="statement-result">${stmt.correct ? '✓ Correct' : '✗ Incorrect'}</span>` : ''}
      </label>
    `;
  }).join('');
  
  // Add event listeners for checkboxes
  if (!isAnswered) {
    statementsEl.querySelectorAll('input[type="checkbox"]').forEach((cb, idx) => {
      cb.addEventListener('change', () => toggleSituationStatement(idx));
    });
  }
  
  // Update submit button
  const submitBtn = specialTest$('#btnSituationSubmit');
  submitBtn.disabled = isAnswered || selected.length === 0;
  submitBtn.classList.toggle('hidden', isAnswered);
  
  // Render feedback
  const feedbackEl = specialTest$('#specialTestFeedback');
  if (isAnswered) {
    const correctIndices = q.statements.map((s, i) => s.correct ? i : -1).filter(i => i >= 0);
    const allCorrect = correctIndices.length === selected.length && 
                       correctIndices.every(i => selected.includes(i));
    
    feedbackEl.classList.remove('hidden', 'correct-fb', 'incorrect-fb');
    feedbackEl.classList.add(allCorrect ? 'correct-fb' : 'incorrect-fb');
    
    const correctCount = selected.filter(i => q.statements[i].correct).length;
    const totalCorrect = correctIndices.length;
    
    let html = allCorrect
      ? `${typeof icon === 'function' ? icon('circle-check', { size: 18, class: 'feedback-icon' }) : '✓'} <strong>Perfect!</strong> You identified all ${totalCorrect} correct statements.`
      : `${typeof icon === 'function' ? icon('circle-x', { size: 18, class: 'feedback-icon' }) : '✗'} You got ${correctCount}/${totalCorrect} correct statements.`;
    
    if (q.explanation) {
      html += `<p class="special-test-explanation">${q.explanation}</p>`;
    }
    
    feedbackEl.innerHTML = html;
  } else {
    feedbackEl.classList.add('hidden');
  }
}

function renderSpecialTestNav() {
  const nav = specialTest$('#specialTestNav');
  if (!nav) return;
  
  nav.innerHTML = specialTestState.questions.map((q, i) => {
    let answered;
    if (specialTestState.type === 'situation') {
      // For situation: check if this question was submitted
      answered = i < specialTestState.index || (i === specialTestState.index && specialTestState.questionAnswered);
    } else {
      answered = specialTestState.answers[i] !== null;
    }
    const current = i === specialTestState.index;
    return `<button type="button" class="special-nav-btn${current ? ' current' : ''}${answered ? ' answered' : ''}" data-index="${i}">${i + 1}</button>`;
  }).join('');
  
  nav.querySelectorAll('.special-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newIndex = +btn.dataset.index;
      // For situations, only allow going back to review answered questions
      if (specialTestState.type === 'situation' && newIndex > specialTestState.index && !specialTestState.questionAnswered) {
        return; // Can't skip ahead
      }
      specialTestState.index = newIndex;
      if (specialTestState.type === 'situation') {
        specialTestState.questionAnswered = newIndex < specialTestState.questions.length && 
          (specialTestState.answers[newIndex]?.length > 0 || newIndex < getLastAnsweredSituationIndex());
      }
      renderSpecialTest();
    });
  });
}

function getLastAnsweredSituationIndex() {
  // Find the last question that was answered
  for (let i = specialTestState.questions.length - 1; i >= 0; i--) {
    if (specialTestState.answers[i]?.length > 0) return i;
  }
  return -1;
}

function updateSpecialTestNextBtn() {
  const btn = specialTest$('#btnSpecialNext');
  if (!btn) return;
  
  let answered;
  if (specialTestState.type === 'situation') {
    answered = specialTestState.questionAnswered;
  } else {
    answered = specialTestState.answers[specialTestState.index] !== null;
  }
  
  const isLast = specialTestState.index >= specialTestState.questions.length - 1;
  
  btn.disabled = !answered;
  btn.textContent = isLast ? 'See Results' : (specialTestState.type === 'situation' ? 'Next Scenario' : 'Next Question');
}

function selectSpecialAnswer(value) {
  if (specialTestState.type === 'situation') return; // Use MCQ for situations
  if (specialTestState.answers[specialTestState.index] !== null) return;
  
  specialTestState.answers[specialTestState.index] = value;
  const q = specialTestState.questions[specialTestState.index];
  if (value === q.answer) {
    specialTestState.score++;
  }
  
  renderSpecialTest();
}

function toggleSituationStatement(idx) {
  if (specialTestState.questionAnswered) return;
  
  const selected = specialTestState.answers[specialTestState.index] || [];
  const newSelected = selected.includes(idx)
    ? selected.filter(i => i !== idx)
    : [...selected, idx];
  
  specialTestState.answers[specialTestState.index] = newSelected;
  renderSituationTest();
  renderSpecialTestNav();
  updateSpecialTestNextBtn();
}

function submitSituationAnswer() {
  if (specialTestState.questionAnswered) return;
  
  const q = specialTestState.questions[specialTestState.index];
  const selected = specialTestState.answers[specialTestState.index] || [];
  
  // Check if answer is correct (must select exactly the correct statements)
  const correctIndices = q.statements.map((s, i) => s.correct ? i : -1).filter(i => i >= 0);
  const allCorrect = correctIndices.length === selected.length && 
                     correctIndices.every(i => selected.includes(i));
  
  if (allCorrect) {
    specialTestState.score++;
  }
  
  specialTestState.questionAnswered = true;
  renderSituationTest();
  renderSpecialTestNav();
  updateSpecialTestNextBtn();
}

function nextSpecialQuestion() {
  if (specialTestState.type === 'situation') {
    if (!specialTestState.questionAnswered) return;
  } else {
    if (specialTestState.answers[specialTestState.index] === null) return;
  }
  
  if (specialTestState.index < specialTestState.questions.length - 1) {
    specialTestState.index++;
    specialTestState.questionAnswered = false; // Reset for next question
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
    ? `You scored ${pct}% on ${typeLabel} questions. ${specialTestState.type === 'situation' ? 'Excellent hazard perception!' : 'Great visual recognition!'}`
    : `You scored ${pct}%. Review the ${typeLabel === 'situation-based' ? 'scenarios' : 'questions'} you missed and try again.`;
  
  // Render review list
  const reviewList = specialTest$('#specialReviewList');
  
  if (specialTestState.type === 'situation') {
    reviewList.innerHTML = specialTestState.questions.map((q, i) => {
      const selected = specialTestState.answers[i] || [];
      const correctIndices = q.statements.map((s, idx) => s.correct ? idx : -1).filter(idx => idx >= 0);
      const allCorrect = correctIndices.length === selected.length && 
                         correctIndices.every(idx => selected.includes(idx));
      
      const img = q.img ? `<img src="${q.img}" alt="Scenario ${i + 1}" class="special-review-img">` : '';
      
      const statementsHtml = q.statements.map((stmt, idx) => {
        const wasSelected = selected.includes(idx);
        let statusClass = '';
        let statusText = '';
        if (stmt.correct && wasSelected) {
          statusClass = 'correct';
          statusText = '✓ Correct';
        } else if (stmt.correct && !wasSelected) {
          statusClass = 'missed';
          statusText = '✗ Missed';
        } else if (!stmt.correct && wasSelected) {
          statusClass = 'incorrect';
          statusText = '✗ Wrong';
        } else {
          statusClass = 'neutral';
          statusText = '—';
        }
        return `<div class="review-statement ${statusClass}">
          <span class="review-statement-check">${wasSelected ? '☑' : '☐'}</span>
          <span class="review-statement-text">${stmt.text}</span>
          <span class="review-statement-status">${statusText}</span>
        </div>`;
      }).join('');
      
      return `
        <details class="special-review-item${allCorrect ? ' correct' : ' incorrect'}">
          <summary>
            <span class="special-review-num">S${i + 1}</span>
            <span class="special-review-verdict">${allCorrect ? '✓' : '✗'}</span>
            <span class="special-review-answers">${allCorrect ? 'All correct' : 'Some errors'}</span>
          </summary>
          <div class="special-review-body">
            ${img}
            <p><strong>${q.scenario}</strong></p>
            <div class="review-statements">${statementsHtml}</div>
            ${q.explanation ? `<p class="special-review-expl">${q.explanation}</p>` : ''}
          </div>
        </details>`;
    }).join('');
  } else {
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
  specialTest$('#btnSituationSubmit')?.addEventListener('click', submitSituationAnswer);
  specialTest$('#btnSpecialNext')?.addEventListener('click', nextSpecialQuestion);
  specialTest$('#btnSpecialRetry')?.addEventListener('click', retrySpecialTest);
  specialTest$('#btnSpecialDone')?.addEventListener('click', exitSpecialTest);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (!specialTest$('#viewSpecialTest')?.classList.contains('active')) return;
    if (specialTestState.submitted) return;
    if (e.target.matches('input, textarea, select')) return;
    
    // Only T/F shortcuts for image tests
    if (specialTestState.type === 'image') {
      if (e.key === '1') {
        e.preventDefault();
        selectSpecialAnswer(1);
      } else if (e.key === '0') {
        e.preventDefault();
        selectSpecialAnswer(0);
      }
    }
    
    if (e.key === 'Enter') {
      e.preventDefault();
      if (specialTestState.type === 'situation' && !specialTestState.questionAnswered) {
        submitSituationAnswer();
      } else {
        nextSpecialQuestion();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', initSpecialTests);
