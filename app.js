// ===== State =====
const STORAGE_KEY = 'karimen-knowledge-progress';
const ONBOARDING_KEY = 'karimen-onboarding-dismissed';
const LAST_CHAPTER_KEY = 'karimen-last-chapter';
const THEME_KEY = 'karimen-theme';

let state = {
  studied: new Set(),
  quizzesPassed: new Set(),
  currentChapter: 0,
  currentMode: 'learn',
  quizQuestions: [],
  quizIndex: 0,
  quizScore: 0,
  quizAnswered: false,
  quizType: 'chapter', // 'chapter' | 'full' | 'signs'
  reviewIndex: 0
};

// ===== DOM =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const views = {
  dashboard: $('#viewDashboard'),
  learn: $('#viewLearn'),
  quiz: $('#viewQuiz'),
  review: $('#viewReview'),
  feedback: $('#viewFeedback')
};

const FEEDBACK_EMAIL = 'abhay.tiwari.er@gmail.com';

function buildGmailComposeUrl(to, subject, body = '') {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to,
    su: subject
  });
  if (body) params.set('body', body);
  return `https://mail.google.com/mail/?${params.toString()}`;
}

// ===== Persistence =====
function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      state.studied = new Set(saved.studied || []);
      state.quizzesPassed = new Set(saved.quizzesPassed || []);
    }
  } catch (_) { /* ignore */ }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    studied: [...state.studied],
    quizzesPassed: [...state.quizzesPassed]
  }));
  updateProgressUI();
}

// ===== Navigation =====
function announceView(title) {
  const live = $('#ariaLive');
  if (live) live.textContent = title;
  const topbar = $('#topbarTitle');
  if (topbar) {
    topbar.focus({ preventScroll: true });
  }
}

function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  views[name].classList.add('active');
  closeSidebar();
  const title = $('#topbarTitle')?.textContent || name;
  announceView(title);
}

function openModal({ title, body, confirmLabel = 'Confirm', cancelLabel = 'Cancel' }) {
  return new Promise((resolve) => {
    const overlay = $('#modalOverlay');
    const titleEl = $('#modalTitle');
    const bodyEl = $('#modalBody');
    const confirmBtn = $('#modalConfirm');
    const cancelBtn = $('#modalCancel');
    if (!overlay || !titleEl || !bodyEl || !confirmBtn || !cancelBtn) {
      resolve(false);
      return;
    }

    titleEl.textContent = title;
    bodyEl.textContent = body;
    confirmBtn.textContent = confirmLabel;
    cancelBtn.textContent = cancelLabel;
    overlay.classList.remove('hidden');
    confirmBtn.focus();

    const cleanup = () => {
      overlay.classList.add('hidden');
      confirmBtn.removeEventListener('click', onConfirm);
      cancelBtn.removeEventListener('click', onCancel);
      overlay.removeEventListener('click', onOverlay);
      document.removeEventListener('keydown', onKey);
    };

    const onConfirm = () => { cleanup(); resolve(true); };
    const onCancel = () => { cleanup(); resolve(false); };
    const onOverlay = (e) => { if (e.target === overlay) onCancel(); };
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };

    confirmBtn.addEventListener('click', onConfirm);
    cancelBtn.addEventListener('click', onCancel);
    overlay.addEventListener('click', onOverlay);
    document.addEventListener('keydown', onKey);
  });
}

function wrapContentTables(container) {
  container.querySelectorAll('.data-table').forEach(table => {
    if (table.parentElement?.classList.contains('table-scroll')) return;
    const wrap = document.createElement('div');
    wrap.className = 'table-scroll';
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  });
}

function setMode(mode) {
  state.currentMode = mode;
  $$('.mode-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
  if (mode === 'quiz' && views.learn.classList.contains('active')) {
    startChapterQuiz(state.currentChapter);
  }
}

function openChapter(index) {
  state.currentChapter = index;
  const ch = CHAPTERS[index];
  localStorage.setItem(LAST_CHAPTER_KEY, String(index));
  $('#topbarTitle').textContent = ch.title;
  const contentEl = $('#chapterContent');
  contentEl.innerHTML = buildChapterHTML(ch);
  wrapContentTables(contentEl);
  highlightNavChapter(ch.id);
  setMarkReadLabel(state.studied.has(ch.id));
  showView('learn');
  if (ch.id === 'traffic-signs') initSignGallery();
  const signsBtn = $('#btnSignsOnlyQuiz');
  if (signsBtn) signsBtn.classList.toggle('hidden', ch.id !== 'traffic-signs');
  window.scrollTo(0, 0);
  renderContinueCard();
}

function buildFigure(img, alt, caption, wide = false) {
  const cls = wide ? 'content-figure wide' : 'content-figure';
  return `<figure class="${cls}">
    <img src="${img}" alt="${alt}" loading="lazy">
    ${caption ? `<figcaption>${caption}</figcaption>` : ''}
  </figure>`;
}

function buildChapterImagesHTML(chapterId) {
  const images = CHAPTER_IMAGES[chapterId];
  if (!images?.length) return { all: '', indexed: [] };

  const indexed = images.map(img => buildFigure(img.img, img.alt, img.caption, img.wide));
  return {
    all: `<div class="figure-row">${indexed.join('')}</div>`,
    indexed
  };
}

function buildTrafficSignGalleryHTML() {
  if (typeof TRAFFIC_SIGN_CATEGORIES === 'undefined') return '';

  const categories = TRAFFIC_SIGN_CATEGORIES.map(cat => `
    <section class="sign-category">
      <h3>${cat.name} <span class="sign-count">${cat.signs.length}</span></h3>
      <div class="sign-grid">
        ${cat.signs.map(sign => `
          <article class="sign-card" data-title="${sign.title.toLowerCase()}">
            <div class="sign-img-wrap">
              <img src="${sign.img}" alt="${sign.title}" loading="lazy">
            </div>
            <h4>${sign.title}</h4>
            ${sign.desc ? `<p>${sign.desc}</p>` : ''}
          </article>
        `).join('')}
      </div>
    </section>
  `).join('');

  return `
    <div class="sign-gallery-wrap">
      <h3>Complete Sign Reference</h3>
      <p class="sign-gallery-intro">All signs from the official study material — tap to enlarge. Use search to filter.</p>
      <input type="search" id="signSearch" class="sign-search" placeholder="Search signs by name…">
      <div class="sign-gallery" id="signGallery">${categories}</div>
    </div>`;
}

function buildChapterHTML(ch) {
  let html = `<h2 class="chapter-heading">${icon(ch.icon, { size: 28, class: 'chapter-heading-icon' })}<span>${ch.title}</span></h2>${ch.content}`;
  html = decorateContentIcons(html);

  if (ch.id === 'traffic-signs') {
    html = html.replace('<!--TRAFFIC_SIGNS_GALLERY-->', buildTrafficSignGalleryHTML());
    return html;
  }

  const { all, indexed } = buildChapterImagesHTML(ch.id);
  if (!indexed.length) return html;

  if (html.includes('<!--CHAPTER_IMAGES:')) {
    indexed.forEach((fig, i) => {
      html = html.replace(`<!--CHAPTER_IMAGES:${i}-->`, fig);
    });
    html = html.replace('<!--CHAPTER_IMAGES-->', all);
  } else if (html.includes('<!--CHAPTER_IMAGES-->')) {
    html = html.replace('<!--CHAPTER_IMAGES-->', all);
  } else {
    html += all;
  }

  return html;
}

function initSignGallery() {
  const search = $('#signSearch');
  if (!search) return;

  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    $$('.sign-card').forEach(card => {
      const title = card.dataset.title || '';
      const text = card.textContent.toLowerCase();
      card.classList.toggle('hidden', q && !title.includes(q) && !text.includes(q));
    });
    $$('.sign-category').forEach(section => {
      const visible = section.querySelectorAll('.sign-card:not(.hidden)').length;
      section.classList.toggle('hidden', q && visible === 0);
    });
  });

  $$('.sign-img-wrap img').forEach(img => {
    img.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.className = 'img-lightbox';
      overlay.innerHTML = `<img src="${img.src}" alt="${img.alt}"><button class="icon-btn" aria-label="Close"></button>`;
      const closeBtn = overlay.querySelector('button');
      if (closeBtn) closeBtn.innerHTML = icon('x', { size: 20 });
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.tagName === 'BUTTON') overlay.remove();
      });
      document.body.appendChild(overlay);
    });
  });
}

function highlightNavChapter(id) {
  $$('.chapter-link').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.id === id);
  });
}

// ===== Render =====
function renderChapterNav() {
  const nav = $('#chapterNav');
  nav.innerHTML = CHAPTERS.map((ch, i) => {
    const studied = state.studied.has(ch.id);
    const passed = state.quizzesPassed.has(ch.id);
    let badge = '';
    if (passed) badge = `<span class="ch-badge">${icon('check', { size: 12, class: 'badge-icon' })}</span>`;
    else if (studied) badge = `<span class="ch-badge">${icon('book-open', { size: 12, class: 'badge-icon' })}</span>`;
    return `
      <button class="chapter-link" data-id="${ch.id}" data-index="${i}">
        <span class="ch-icon">${icon(ch.icon, { size: 14 })}</span>
        <span class="ch-title">${ch.title}</span>
        ${badge}
      </button>`;
  }).join('');

  nav.querySelectorAll('.chapter-link').forEach(btn => {
    btn.addEventListener('click', () => openChapter(+btn.dataset.index));
  });
}

function renderDashboard() {
  const grid = $('#dashboardGrid');
  grid.innerHTML = CHAPTERS.map((ch, i) => {
    const studied = state.studied.has(ch.id);
    const passed = state.quizzesPassed.has(ch.id);
    const signCount = ch.id === 'traffic-signs' ? getAllSigns().length : 0;
    const quizCount = ch.id === 'traffic-signs'
      ? (QUIZZES[ch.id] || []).length + SIGNS_CHAPTER_EXTRA
      : (QUIZZES[ch.id] || []).length;
    const actionLabel = studied ? 'Review chapter' : 'Start chapter';
    const signsQuizBtn = ch.id === 'traffic-signs'
      ? `<button type="button" class="btn btn-outline btn-sm card-signs-quiz btn-with-icon" data-action="signs-quiz">${btnIcon('traffic-cone')} Signs Quiz</button>`
      : '';
    return `
      <div class="chapter-card-wrap">
        <button type="button" class="chapter-card ${studied ? 'studied' : ''} ${passed ? 'quiz-passed' : ''}" data-index="${i}" aria-label="${actionLabel}: ${ch.title}">
          <div class="chapter-card-inner">
            <div class="card-icon">${icon(ch.icon, { size: 32 })}</div>
            <h3>${ch.title}</h3>
            <p>${ch.summary}</p>
            <div class="card-meta">
              ${studied ? '<span class="tag tag-studied">Studied</span>' : ''}
              ${passed ? '<span class="tag tag-studied">Quiz passed</span>' : ''}
              <span class="tag tag-quiz">${quizCount} quiz Qs</span>
              ${signCount ? `<span class="tag tag-signs">${signCount} signs</span>` : ''}
            </div>
          </div>
        </button>
        ${signsQuizBtn}
      </div>`;
  }).join('');

  grid.querySelectorAll('.chapter-card').forEach(card => {
    card.addEventListener('click', () => openChapter(+card.dataset.index));
  });

  grid.querySelectorAll('[data-action="signs-quiz"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      startSignsQuiz();
    });
  });
}

function renderContinueCard() {
  const card = $('#continueCard');
  if (!card) return;

  const lastIndex = parseInt(localStorage.getItem(LAST_CHAPTER_KEY), 10);
  const hasProgress = state.studied.size > 0 || state.quizzesPassed.size > 0 || !Number.isNaN(lastIndex);

  if (!hasProgress) {
    card.classList.add('hidden');
    return;
  }

  const index = Number.isNaN(lastIndex) ? 0 : Math.min(Math.max(lastIndex, 0), CHAPTERS.length - 1);
  const ch = CHAPTERS[index];
  const studied = state.studied.has(ch.id);
  const passed = state.quizzesPassed.has(ch.id);

  $('#continueTitle').textContent = studied && passed
    ? `Review: ${ch.title}`
    : studied
      ? `Quiz next: ${ch.title}`
      : `Continue: ${ch.title}`;

  $('#continueMessage').textContent = studied && passed
    ? 'You have studied and passed the quiz for this chapter.'
    : studied
      ? 'You have read this chapter — try the chapter quiz.'
      : 'Pick up where you left off.';

  card.classList.remove('hidden');
  $('#btnContinueStudy').onclick = () => {
    if (studied && !passed) {
      state.currentChapter = index;
      startChapterQuiz(index);
    } else {
      openChapter(index);
    }
  };
}

function updateProgressUI() {
  const total = CHAPTERS.length;
  const studiedCount = state.studied.size;
  const passedCount = state.quizzesPassed.size;
  const studiedPct = (studiedCount / total) * 100;
  const quizPct = (passedCount / total) * 100;
  const pct = Math.round(((studiedCount + passedCount) / (total * 2)) * 100);

  $('#progressPercent').textContent = `${pct}%`;
  const studiedFill = $('#progressFillStudied');
  const quizFill = $('#progressFillQuiz');
  if (studiedFill) studiedFill.style.width = `${studiedPct}%`;
  if (quizFill) quizFill.style.width = `${quizPct}%`;
  const legacyFill = $('#progressFill');
  if (legacyFill) legacyFill.style.width = `${pct}%`;
  $('#chaptersRead').textContent = `${studiedCount}/${total}`;
  $('#quizzesPassed').textContent = `${passedCount}`;
  renderContinueCard();
}

function animateScore(el, target, total, duration = 600) {
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = `${target} / ${total}`;
    return;
  }
  const start = performance.now();
  const from = 0;
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const val = Math.round(from + (target - from) * t);
    const pct = Math.round((val / total) * 100);
    el.textContent = `${val} / ${total} (${pct}%)`;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ===== Sign Quiz =====
const SIGNS_QUIZ_LENGTH = 30;
const SIGNS_CHAPTER_EXTRA = 15;

function isValidSignTitle(title) {
  if (!title || title.length < 4) return false;
  return !/^[a-z]+\d+$/i.test(title);
}

function getAllSigns() {
  if (typeof TRAFFIC_SIGN_CATEGORIES === 'undefined') return [];
  return TRAFFIC_SIGN_CATEGORIES.flatMap(cat =>
    cat.signs
      .filter(s => isValidSignTitle(s.title))
      .map(s => ({ ...s, category: cat.name }))
  );
}

function pickWrongSignTitles(sign, allSigns, count = 3) {
  const sameCat = shuffle(allSigns.filter(s =>
    s.category === sign.category && s.title !== sign.title
  ));
  const others = shuffle(allSigns.filter(s => s.title !== sign.title));
  const picked = [];
  const seen = new Set();

  for (const s of [...sameCat, ...others]) {
    if (picked.length >= count) break;
    if (!seen.has(s.title)) {
      seen.add(s.title);
      picked.push(s.title);
    }
  }
  return picked;
}

function buildSignQuizQuestions(signs, count) {
  const pool = shuffle(signs);
  const selected = pool.slice(0, Math.min(count, pool.length));

  return selected.map(sign => {
    const wrong = pickWrongSignTitles(sign, signs);
    const options = shuffle([sign.title, ...wrong]);
    return {
      q: 'What does this traffic sign mean?',
      img: sign.img,
      imgAlt: sign.title,
      options,
      answer: options.indexOf(sign.title),
      signTitle: sign.title,
      type: 'sign'
    };
  });
}

// ===== Quiz =====
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startChapterQuiz(index) {
  const ch = CHAPTERS[index];
  let questions = [...(QUIZZES[ch.id] || [])];
  if (!questions.length && ch.id !== 'traffic-signs') return;

  if (ch.id === 'traffic-signs') {
    const signQs = buildSignQuizQuestions(getAllSigns(), SIGNS_CHAPTER_EXTRA);
    questions = shuffle([...questions, ...signQs]);
  }

  state.quizType = 'chapter';
  state.currentChapter = index;
  state.quizQuestions = shuffle(questions);
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;

  $('#quizTitle').textContent = `${ch.title} Quiz`;
  $('#topbarTitle').textContent = 'Quiz';
  $('#quizBody').classList.remove('hidden');
  $('#quizResults').classList.add('hidden');
  showView('quiz');
  renderQuizQuestion();
}

function startSignsQuiz() {
  const signs = getAllSigns();
  if (!signs.length) return;

  state.quizType = 'signs';
  state.quizQuestions = buildSignQuizQuestions(signs, SIGNS_QUIZ_LENGTH);
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;

  $('#quizTitle').textContent = 'Traffic Signs Picture Quiz';
  $('#topbarTitle').textContent = 'Signs Quiz';
  $('#quizBody').classList.remove('hidden');
  $('#quizResults').classList.add('hidden');
  showView('quiz');
  renderQuizQuestion();
}

function startFullQuiz() {
  state.quizType = 'full';
  state.quizQuestions = shuffle(ALL_QUIZ);
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;

  $('#quizTitle').textContent = 'Full Practice Exam';
  $('#topbarTitle').textContent = 'Full Exam';
  $('#quizBody').classList.remove('hidden');
  $('#quizResults').classList.add('hidden');
  showView('quiz');
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const q = state.quizQuestions[state.quizIndex];
  const total = state.quizQuestions.length;
  const questionEl = $('#quizQuestion');

  $('#quizCounter').textContent = `${state.quizIndex + 1} / ${total}`;
  $('#quizScoreDisplay').textContent = `Score: ${state.quizScore}`;
  $('#quizFeedback').classList.add('hidden');
  $('#btnQuizNext').classList.add('hidden');
  state.quizAnswered = false;

  if (q.img) {
    questionEl.innerHTML = `
      <p class="quiz-q-text">${q.q}</p>
      <div class="quiz-sign-prompt">
        <img src="${q.img}" alt="${q.imgAlt || 'Traffic sign'}" class="quiz-sign-img">
      </div>`;
  } else {
    questionEl.textContent = q.q;
  }

  const optionsEl = $('#quizOptions');
  optionsEl.innerHTML = q.options.map((opt, i) =>
    `<button class="quiz-option${q.type === 'sign' ? ' quiz-option-sign' : ''}" data-index="${i}">${opt}</button>`
  ).join('');

  optionsEl.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => selectAnswer(+btn.dataset.index));
  });
}

function selectAnswer(index) {
  if (state.quizAnswered) return;
  state.quizAnswered = true;

  const q = state.quizQuestions[state.quizIndex];
  const correct = index === q.answer;
  if (correct) state.quizScore++;

  const options = $$('.quiz-option');
  options.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    else if (i === index && !correct) btn.classList.add('incorrect');
  });

  const fb = $('#quizFeedback');
  fb.classList.remove('hidden', 'correct-fb', 'incorrect-fb');
  fb.classList.add(correct ? 'correct-fb' : 'incorrect-fb');

  const correctLabel = q.signTitle || q.options[q.answer];
  fb.innerHTML = correct
    ? `${icon('circle-check', { size: 18, class: 'feedback-icon' })} Correct! <strong>${correctLabel}</strong>`
    : `${icon('circle-x', { size: 18, class: 'feedback-icon' })} Incorrect. The answer is: <strong>${correctLabel}</strong>`;
  if (!correct && q.img) {
    fb.innerHTML += `<div class="quiz-feedback-sign"><img src="${q.img}" alt="${correctLabel}"></div>`;
  }
  if (q.explanation) {
    fb.innerHTML += `<p class="quiz-feedback-explanation">${q.explanation}</p>`;
  }

  $('#quizScoreDisplay').textContent = `Score: ${state.quizScore}`;
  $('#btnQuizNext').classList.remove('hidden');
  $('#btnQuizNext').textContent = '';
  $('#btnQuizNext').innerHTML = state.quizIndex < state.quizQuestions.length - 1
    ? `${btnIcon('arrow-right')} Next Question`
    : 'See Results';
}

function showQuizResults() {
  const total = state.quizQuestions.length;
  const pct = Math.round((state.quizScore / total) * 100);
  const passed = pct >= 90;

  $('#quizBody').classList.add('hidden');
  $('#quizResults').classList.remove('hidden');

  setIcon($('#resultsIcon'), resultsIconName(passed, pct), 64, 'results-icon-svg');
  $('#resultsTitle').textContent = passed ? 'Excellent!' : 'Keep Practicing!';
  animateScore($('#resultsScore'), state.quizScore, total);
  $('#resultsMessage').textContent = passed
    ? (state.quizType === 'signs'
      ? 'Great sign recognition! You know your Japanese road signs.'
      : 'You scored 90% or higher — exam ready for this section!')
    : (state.quizType === 'signs'
      ? 'Review the sign gallery and try again — aim for 90%.'
      : 'You need 90% to pass the Karimen/Honmen exam. Review the chapters you missed.');

  if (state.quizType === 'chapter') {
    const ch = CHAPTERS[state.currentChapter];
    if (passed) {
      state.quizzesPassed.add(ch.id);
      saveProgress();
      renderChapterNav();
      renderDashboard();
    }
  } else if (state.quizType === 'signs') {
    if (passed) {
      state.quizzesPassed.add('signs-quiz');
      saveProgress();
      renderChapterNav();
      renderDashboard();
    }
  } else if (passed) {
    CHAPTERS.forEach(ch => state.quizzesPassed.add(ch.id));
    saveProgress();
    renderChapterNav();
    renderDashboard();
  }
}

// ===== Quick Review =====
function renderReviewCard() {
  const ch = CHAPTERS[state.reviewIndex];
  $('#reviewCounter').textContent = `${state.reviewIndex + 1} / ${CHAPTERS.length}`;
  setIcon($('#reviewIcon'), ch.icon, 48, 'flashcard-icon-svg');
  $('#reviewTitle').textContent = ch.title;
  $('#reviewSummary').textContent = ch.summary;
  $('#reviewBack').innerHTML = decorateContentIcons(ch.content);
  $('#flashcardInner').classList.remove('flipped');
  const flashcard = $('#flashcard');
  if (flashcard) flashcard.setAttribute('aria-pressed', 'false');
}

function openReview() {
  state.reviewIndex = 0;
  renderReviewCard();
  showView('review');
}

function openFeedback() {
  $('#topbarTitle').textContent = 'Report a Discrepancy';
  showView('feedback');
  window.scrollTo(0, 0);
}

function submitFeedback(event) {
  event.preventDefault();
  const category = $('#feedbackCategory').value.trim();
  const location = $('#feedbackLocation').value.trim();
  const message = $('#feedbackMessage').value.trim();
  if (!category || !message) return;

  const subject = `Karimen Hub: ${category} discrepancy`;
  const body = [
    `Category: ${category}`,
    location ? `Location: ${location}` : null,
    '',
    message
  ].filter(Boolean).join('\n');

  const url = buildGmailComposeUrl(FEEDBACK_EMAIL, subject, body);
  window.open(url, '_blank', 'noopener,noreferrer');
}

function buildFeedbackText() {
  const category = $('#feedbackCategory').value.trim();
  const location = $('#feedbackLocation').value.trim();
  const message = $('#feedbackMessage').value.trim();
  if (!category || !message) return null;
  return [
    `Category: ${category}`,
    location ? `Location: ${location}` : null,
    '',
    message
  ].filter(Boolean).join('\n');
}

function initFeedbackExtras() {
  const shareBtn = $('#btnShareFeedback');
  if (shareBtn && navigator.share) {
    shareBtn.classList.remove('hidden');
    shareBtn.addEventListener('click', async () => {
      const body = buildFeedbackText();
      if (!body) return;
      try {
        await navigator.share({
          title: 'Karimen Hub discrepancy report',
          text: body
        });
      } catch (_) { /* user cancelled */ }
    });
  }

  $('#btnCopyFeedback')?.addEventListener('click', async () => {
    const body = buildFeedbackText();
    if (!body) return;
    try {
      await navigator.clipboard.writeText(body);
      const block = $('#feedbackCopyBlock');
      const preview = $('#feedbackCopyPreview');
      if (block && preview) {
        preview.textContent = 'Message copied to clipboard.';
        block.classList.remove('hidden');
      }
    } catch (_) {
      const block = $('#feedbackCopyBlock');
      const preview = $('#feedbackCopyPreview');
      if (block && preview) {
        preview.textContent = body;
        block.classList.remove('hidden');
      }
    }
  });

  $('#btnCopyEmail')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(FEEDBACK_EMAIL);
    } catch (_) { /* ignore */ }
  });
}

function initOnboarding() {
  const banner = $('#onboardingBanner');
  if (!banner) return;
  if (localStorage.getItem(ONBOARDING_KEY) === '1') {
    banner.classList.add('hidden');
    return;
  }
  $('#btnDismissOnboarding')?.addEventListener('click', () => {
    localStorage.setItem(ONBOARDING_KEY, '1');
    banner.classList.add('hidden');
  });
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  updateThemeToggleLabel();
  $('#btnThemeToggle')?.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem(THEME_KEY, 'dark');
    }
    updateThemeToggleLabel();
  });
}

function updateThemeToggleLabel() {
  const btn = $('#btnThemeToggle');
  if (!btn) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.innerHTML = isDark
    ? `${btnIcon('sun')} Light mode`
    : `${btnIcon('moon')} Dark mode`;
}

// ===== Sidebar =====
function closeSidebar() {
  $('#sidebar').classList.remove('open');
  $('#overlay').classList.remove('active');
}

function openSidebar() {
  $('#sidebar').classList.add('open');
  $('#overlay').classList.add('active');
}

function initStaticIcons() {
  setIcon('#logoIcon', 'graduation-cap', 32, 'logo-icon-svg');
  setIcon('#sidebarClose', 'x', 20);
  setIcon('#menuToggle', 'menu', 22);
  setIcon('#resultsIcon', 'party-popper', 64, 'results-icon-svg');
  setIcon('#tfResultsIcon', 'party-popper', 64, 'results-icon-svg');

  document.querySelectorAll('[data-icon]').forEach(el => {
    const name = el.dataset.icon;
    const size = Number(el.dataset.iconSize) || (el.classList.contains('section-icon') ? 22 : 18);
    el.innerHTML = icon(name, { size });
  });
}

function setMarkReadLabel(studied = false) {
  const btn = $('#btnMarkRead');
  if (!btn) return;
  if (studied) {
    btn.innerHTML = `${btnIcon('check')} Studied`;
    btn.classList.add('btn-success');
    btn.classList.remove('btn-secondary');
    btn.disabled = true;
  } else {
    btn.innerHTML = `${btnIcon('check')} Mark as Studied`;
    btn.classList.remove('btn-success');
    btn.classList.add('btn-secondary');
    btn.disabled = false;
  }
}

function toggleFlashcard() {
  const inner = $('#flashcardInner');
  const flashcard = $('#flashcard');
  if (!inner || !flashcard) return;
  const flipped = inner.classList.toggle('flipped');
  flashcard.setAttribute('aria-pressed', flipped ? 'true' : 'false');
}

// ===== Init =====
function init() {
  initStaticIcons();
  loadProgress();
  initTheme();
  initOnboarding();
  initFeedbackExtras();
  renderChapterNav();
  renderDashboard();
  updateProgressUI();

  $('#btnHeroMore')?.addEventListener('click', () => {
    $('#heroMorePanel')?.classList.toggle('hidden');
  });

  // Dashboard actions
  $('#btnStartLearning').addEventListener('click', () => openChapter(0));
  $('#btnJumpQuiz').addEventListener('click', startFullQuiz);
  $('#btnFullQuiz').addEventListener('click', startFullQuiz);
  $('#btnSignsQuiz').addEventListener('click', startSignsQuiz);
  $('#btnSignsQuizHero').addEventListener('click', startSignsQuiz);
  $('#btnSignsOnlyQuiz').addEventListener('click', startSignsQuiz);
  $('#btnQuickReview').addEventListener('click', openReview);
  $('#btnReportDiscrepancy').addEventListener('click', openFeedback);
  $('#feedbackForm').addEventListener('submit', submitFeedback);
  $('#btnFeedbackBack').addEventListener('click', () => {
    $('#topbarTitle').textContent = 'Dashboard';
    showView('dashboard');
    renderContinueCard();
  });

  // Learn navigation
  $('#btnBackDashboard').addEventListener('click', () => {
    $('#topbarTitle').textContent = 'Dashboard';
    showView('dashboard');
    renderContinueCard();
  });

  $('#btnPrevChapter').addEventListener('click', () => {
    if (state.currentChapter > 0) openChapter(state.currentChapter - 1);
  });

  $('#btnNextChapter').addEventListener('click', () => {
    if (state.currentChapter < CHAPTERS.length - 1) openChapter(state.currentChapter + 1);
  });

  $('#btnMarkRead').addEventListener('click', () => {
    const ch = CHAPTERS[state.currentChapter];
    if (state.studied.has(ch.id)) return;
    state.studied.add(ch.id);
    saveProgress();
    renderChapterNav();
    renderDashboard();
    setMarkReadLabel(true);
  });

  $('#btnStartChapterQuiz').addEventListener('click', () => {
    setMode('quiz');
    startChapterQuiz(state.currentChapter);
  });

  // Mode tabs
  $$('.mode-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      setMode(tab.dataset.mode);
      if (tab.dataset.mode === 'learn' && !views.dashboard.classList.contains('active')) {
        openChapter(state.currentChapter);
      }
    });
  });

  // Quiz
  $('#btnQuizBack').addEventListener('click', () => {
    if (state.quizType === 'chapter') openChapter(state.currentChapter);
    else if (state.quizType === 'signs') openChapter(0);
    else showView('dashboard');
  });

  $('#btnQuizNext').addEventListener('click', () => {
    if (state.quizIndex < state.quizQuestions.length - 1) {
      state.quizIndex++;
      renderQuizQuestion();
    } else {
      showQuizResults();
    }
  });

  $('#btnRetryQuiz').addEventListener('click', () => {
    if (state.quizType === 'chapter') startChapterQuiz(state.currentChapter);
    else if (state.quizType === 'signs') startSignsQuiz();
    else startFullQuiz();
  });

  $('#btnContinueLearning').addEventListener('click', () => {
    if (state.quizType === 'chapter') {
      const next = state.currentChapter + 1;
      if (next < CHAPTERS.length) openChapter(next);
      else showView('dashboard');
    } else if (state.quizType === 'signs') {
      openChapter(0);
    } else {
      showView('dashboard');
    }
  });

  // Review
  $('#btnReviewBack').addEventListener('click', () => showView('dashboard'));
  const flashcardEl = $('#flashcard');
  flashcardEl?.addEventListener('click', toggleFlashcard);
  flashcardEl?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFlashcard();
    }
  });
  $('#btnReviewPrev').addEventListener('click', (e) => {
    e.stopPropagation();
    if (state.reviewIndex > 0) { state.reviewIndex--; renderReviewCard(); }
  });
  $('#btnReviewNext').addEventListener('click', (e) => {
    e.stopPropagation();
    if (state.reviewIndex < CHAPTERS.length - 1) { state.reviewIndex++; renderReviewCard(); }
    else showView('dashboard');
  });

  // Mobile sidebar
  $('#menuToggle').addEventListener('click', openSidebar);
  $('#sidebarClose').addEventListener('click', closeSidebar);
  $('#overlay').addEventListener('click', closeSidebar);
}

document.addEventListener('DOMContentLoaded', init);
