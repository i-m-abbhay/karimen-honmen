// PDF Generator for Karimen + Honmen Knowledge Hub
// Creates a comprehensive revision PDF with all study material

(function() {
  'use strict';

  const { jsPDF } = window.jspdf;

  // PDF Configuration
  const CONFIG = {
    pageWidth: 210,
    pageHeight: 297,
    margin: 15,
    lineHeight: 6,
    fontSize: {
      title: 24,
      sectionTitle: 14,
      subTitle: 12,
      normal: 10,
      small: 9
    },
    colors: {
      primary: [59, 130, 246],      // Blue
      success: [34, 197, 94],       // Green
      warning: [234, 179, 8],       // Yellow
      danger: [239, 68, 68],        // Red
      text: [31, 41, 55],           // Dark gray
      lightText: [107, 114, 128],   // Gray
      highlight: [254, 249, 195]    // Light yellow
    }
  };

  // Important numbers to remember - extracted from chapters
  const IMPORTANT_NUMBERS = [
    { category: 'Speed Limits (No Signs)', items: [
      { value: '60 km/h', description: 'Cars on regular roads' },
      { value: '30 km/h', description: 'Motorized bicycles (原付)' },
      { value: '100 km/h', description: 'Most vehicles on highways (max)' },
      { value: '50 km/h', description: 'Minimum speed on highways' },
      { value: '90 km/h', description: 'Large cargo vehicles on highways (2024)' },
      { value: '80 km/h', description: 'Trailers/3-wheel vehicles on highways' }
    ]},
    { category: 'Towing Speed Limits', items: [
      { value: '40 km/h', description: 'Towed vehicle ≤2,000 kg AND towing vehicle ≥3× towed weight' },
      { value: '30 km/h', description: 'Towed vehicle >2,000 kg OR towing vehicle <3× towed weight' },
      { value: '25 km/h', description: 'Towing with motorcycle/moped (125cc or less)' }
    ]},
    { category: 'No Stopping OR Parking Zones', items: [
      { value: '5 meters', description: 'From intersection edges' },
      { value: '5 meters', description: 'From road curves' },
      { value: '5 meters', description: 'From pedestrian/bicycle paths' },
      { value: '10 meters', description: 'From railway crossings' },
      { value: '10 meters', description: 'From safety zone (left side)' },
      { value: '10 meters', description: 'From bus/tram stops (during hours)' }
    ]},
    { category: 'No Parking Zones (Stopping OK)', items: [
      { value: '1 meter', description: 'From fire alarms' },
      { value: '3 meters', description: 'From dedicated vehicle entrance/exit' },
      { value: '5 meters', description: 'From construction zone boundary' },
      { value: '5 meters', description: 'From fire-fighting equipment/hydrants' }
    ]},
    { category: 'Parking Rules', items: [
      { value: '3.5 meters', description: 'Minimum space to right for parking' },
      { value: '0.75 meters', description: 'Min pedestrian space in roadside strip' },
      { value: '12 hours', description: 'Max parking daytime (07:00-19:00)' },
      { value: '8 hours', description: 'Max parking nighttime (19:00-07:00)' },
      { value: '5 minutes', description: 'Parking vs Stopping threshold' },
      { value: '2 km', description: 'Storage space from regular use location' }
    ]},
    { category: 'Cargo Limits - Cars', items: [
      { value: '120%', description: 'Max cargo length (of vehicle length)' },
      { value: '120%', description: 'Max cargo width (of vehicle width)' },
      { value: '3.8 meters', description: 'Max cargo height from ground' },
      { value: '10%', description: 'Max overhang front/rear/sides' }
    ]},
    { category: 'Cargo Limits - Motorcycles', items: [
      { value: '30 cm', description: 'Max length beyond carrier/seat' },
      { value: '15 cm', description: 'Max width each side (30 cm total)' },
      { value: '2 meters', description: 'Max height from ground' },
      { value: '30 kg', description: 'Max weight (under 50cc)' },
      { value: '60 kg', description: 'Max weight (over 50cc)' }
    ]},
    { category: 'Ordinary License Limits', items: [
      { value: '< 3.5 tons', description: 'Gross weight limit' },
      { value: '< 2,000 kg', description: 'Max load capacity' },
      { value: '< 10 passengers', description: 'Passenger limit' },
      { value: '50cc or less', description: 'Moped engine limit' }
    ]},
    { category: 'Other Important Numbers', items: [
      { value: '3 children = 2 adults', description: 'Under 12 years old equivalence' },
      { value: '≤ 750 kg', description: 'Towing license not required if towed vehicle weight' },
      { value: '90%', description: 'Pass mark for both Karimen and Honmen exams' }
    ]}
  ];

  // Key facts for each chapter - condensed for revision
  const CHAPTER_KEY_FACTS = {
    'traffic-signs': [
      '4 main types: Prohibition (red), Guide (blue), Warning (yellow), Instruction (green)',
      'Novice driver sign: required within 1 year of license',
      'Provisional license sign: required during road practice',
      '"No Overtaking by Crossing Right Side" - overtaking without crossing IS allowed',
      '"No Parking" allows brief stopping; "No Parking or Stopping" prohibits both'
    ],
    'ordinary-license': [
      'Allows: ordinary cars, small special vehicles, mopeds (≤50cc)',
      'Does NOT allow: large trucks, buses, motorcycles over 50cc',
      'Gross weight under 3.5 tons, max load under 2,000 kg, under 10 passengers'
    ],
    'speeding': [
      'No sign = 60 km/h for cars, 30 km/h for mopeds',
      'Legal limit applies on all roads without posted speed signs'
    ],
    'highway-speed-limit': [
      'Max 100 km/h for most vehicles, min 50 km/h for all',
      'Large cargo: 90 km/h max (2024), Trailers: 80 km/h max'
    ],
    'no-parking': [
      '5m from intersections, curves, pedestrian paths',
      '10m from railway crossings, safety zones, bus/tram stops',
      'Tunnels: both stopping AND parking prohibited regardless of lanes'
    ],
    'parking-rules': [
      'Park close to LEFT edge of road (no sidewalk)',
      'Daytime max 12 hours, nighttime max 8 hours'
    ],
    'parking-vs-stopping': [
      '5-minute rule: over 5 min = parking, under 5 min = stopping',
      'Passenger pickup/dropoff = ALWAYS stopping regardless of time',
      'Driver leaving vehicle = parking (cannot drive immediately)'
    ],
    'safety-zone': [
      'Protects pedestrians crossing or boarding trams',
      'Pedestrians present = drive slowly; No pedestrians = may pass',
      'No parking within 10m on LEFT side'
    ],
    'child-counting': [
      '3 children under 12 = 2 adults for passenger capacity',
      'Used for calculating vehicle capacity limits'
    ],
    'double-overtaking': [
      'IS violation: overtaking when front vehicle is overtaking another vehicle',
      'NOT violation: front vehicle overtaking motorcycle/bicycle'
    ],
    'size-weight': [
      'Cars: max 120% length/width, 3.8m height, 10% overhang',
      'Motorcycles: 30cm length, 15cm each side, 2m height'
    ],
    'horn-usage': [
      'Only use in unavoidable danger OR where signs require',
      'Horn required at: blind curves, hilltops, intersections with no visibility'
    ],
    'no-space-parking': [
      'No parking if space to right < 3.5 meters',
      'Exceptions: loading/unloading (driver present), emergency medical care'
    ],
    'storage-space': [
      'Must have parking within 2 km of regular use location',
      'Does NOT apply to motorcycles'
    ],
    'hydroplaning': [
      'Do NOT brake abruptly or turn sharply',
      'Hold wheel firmly, use engine braking to slow gradually',
      'Check tire wear regularly; increase pressure before highway'
    ],
    'license-vehicle': [
      'Each license allows specific vehicles only',
      'Towing license not needed if towed vehicle ≤750 kg or towing accident vehicle with rope'
    ],
    'periodic-check': [
      'Every 3 months: commercial taxis/buses, large private vehicles',
      'Every 6 months: private trucks <8 tons, rental vehicles',
      'Every 12 months: standard private cars, large motorcycles'
    ],
    'daily-check': [
      'Required for: commercial vehicles, rentals, 11+ passenger vehicles',
      'Checks: brakes, engine, tire pressure before operation'
    ],
    'stopping-distance': [
      'Stopping = Reaction distance + Braking distance',
      'Fatigue → longer reaction; Worn tires/wet road → longer braking'
    ],
    'priority-intersections': [
      'Priority road sign = always has right of way',
      'Centerline into intersection = that road has priority',
      'No lines = wider road has priority',
      'Traffic from LEFT has priority; Straight/left > turning right'
    ],
    'police-signals': [
      'Police signals OVERRIDE traffic lights',
      'Front/back of officer = ALWAYS RED (stop)',
      'Arms horizontal + your sides = GREEN (go)',
      'Arms vertical + your sides = YELLOW (caution)'
    ]
  };

  const SECTIONS = [
    { id: 'diagrams', title: 'Visual Memory Aids', color: CONFIG.colors.primary },
    { id: 'numbers', title: 'Important Numbers to Remember', color: CONFIG.colors.danger },
    { id: 'facts', title: 'Chapter Key Facts Summary', color: CONFIG.colors.success },
    { id: 'signs', title: 'Traffic Signs', color: [220, 38, 38] },
    { id: 'quiz', title: 'Chapter Quiz Questions & Answers', color: CONFIG.colors.primary },
    { id: 'exams', title: 'Practice Exam Q&A', color: [124, 58, 237] },
    { id: 'quickref', title: 'Quick Reference Card', color: CONFIG.colors.warning }
  ];

  const DEFAULT_SELECTION = {
    sections: SECTIONS.map(s => s.id),
    exams: typeof EXAM_CATALOG !== 'undefined' ? EXAM_CATALOG.map(e => e.id) : [],
    images: true,
    explanations: true
  };

  const POLICE_PHOTOS = {
    horizontal: 'assets/images/police-signals/horizontal-arms.jpg',
    vertical: 'assets/images/police-signals/vertical-arms.jpg'
  };

  const PURPLE = [124, 58, 237];
  const GREY = [148, 163, 184];
  const ROAD = [203, 213, 225];
  const NAVY = [30, 58, 95];

  // Helvetica (WinAnsi) can't draw these; anything else outside Latin-1 (kanji, emoji) is dropped.
  const GLYPHS = { '≤': '<=', '≥': '>=', '≈': '~', '→': '->', '←': '<-', '↔': '<->', '↓': 'v', '⬆': '^',
    '【': '[', '】': ']', '〇': 'O', '△': '^', ' ': ' ' };
  function safe(s) {
    return String(s ?? '')
      .replace(/[≤≥≈→←↔↓⬆【】〇△ ]/g, ch => GLYPHS[ch])
      .replace(/[^\x00-\xff‘’“”–—•…]/gu, '')
      .replace(/\s*\(\s*\)/g, '');
  }

  const imageCache = new Map();
  // Canvas -> JPEG shrinks the file and converts GIFs, which jsPDF can't embed.
  function loadImage(src, maxPx) {
    const key = `${src}@${maxPx}`;
    if (!imageCache.has(key)) {
      imageCache.set(key, new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
          try {
            const scale = Math.min(1, maxPx / Math.max(img.naturalWidth, img.naturalHeight));
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
            canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve({ key, data: canvas.toDataURL('image/jpeg', 0.8), w: canvas.width, h: canvas.height });
          } catch (e) {
            resolve(null); // tainted canvas when the page is opened via file://
          }
        };
        img.onerror = () => resolve(null);
        img.src = src;
      }));
    }
    return imageCache.get(key);
  }

  async function loadImages(srcs, maxPx, onProgress) {
    const unique = [...new Set(srcs.filter(Boolean))];
    const out = {};
    let done = 0;
    await Promise.all(unique.map(async src => {
      out[src] = await loadImage(src, maxPx);
      if (onProgress) onProgress(++done, unique.length);
    }));
    return out;
  }

  async function loadExamData(entry) {
    try {
      const resp = await fetch(entry.file);
      if (resp.ok) return await resp.json();
    } catch (e) { /* file:// - fall back to the bundled copy */ }
    if (typeof loadExamBundleFallback === 'function') await loadExamBundleFallback().catch(() => {});
    return typeof EXAMS !== 'undefined' ? EXAMS[entry.id] || null : null;
  }

  async function generateRevisionPDF(sel, progress) {
    const has = id => sel.sections.includes(id);
    const M = CONFIG.margin;
    const W = CONFIG.pageWidth - 2 * M;
    const BOTTOM = CONFIG.pageHeight - M - 15;

    // ---------- Preload data ----------
    const examEntries = has('exams') && typeof EXAM_CATALOG !== 'undefined'
      ? EXAM_CATALOG.filter(e => sel.exams.includes(e.id))
        .sort((a, b) => (a.type === 'karimen' ? 0 : 1) - (b.type === 'karimen' ? 0 : 1) || a.number - b.number)
      : [];
    let loaded = 0;
    const exams = (await Promise.all(examEntries.map(async entry => {
      const exam = await loadExamData(entry);
      progress(`Loading exams ${++loaded}/${examEntries.length}…`);
      return exam;
    }))).filter(Boolean);

    const imgSrcs = [];
    if (has('signs') && typeof TRAFFIC_SIGN_CATEGORIES !== 'undefined') {
      TRAFFIC_SIGN_CATEGORIES.forEach(c => c.signs.forEach(s => imgSrcs.push(s.img)));
    }
    if (sel.images) exams.forEach(ex => ex.questions.forEach(q => imgSrcs.push(q.img)));
    const images = await loadImages(imgSrcs, 320, (d, n) => progress(`Loading pictures ${d}/${n}…`));
    const photos = has('diagrams') ? await loadImages(Object.values(POLICE_PHOTOS), 700) : {};

    progress('Building PDF pages…');
    await new Promise(r => setTimeout(r, 30)); // let the overlay repaint before the long synchronous build

    const doc = new jsPDF('p', 'mm', 'a4');
    const rawText = doc.text.bind(doc);
    const rawSplit = doc.splitTextToSize.bind(doc);
    doc.text = (text, ...args) => rawText(Array.isArray(text) ? text.map(safe) : safe(text), ...args);
    doc.splitTextToSize = (text, ...args) => rawSplit(safe(text), ...args);

    let y = M;

    // ---------- Basic helpers ----------
    function addPage() {
      doc.addPage();
      y = M;
    }

    function checkPageBreak(neededHeight = 20) {
      if (y + neededHeight > BOTTOM) {
        addPage();
        return true;
      }
      return false;
    }

    function font(size, color = CONFIG.colors.text, style = 'normal') {
      doc.setFontSize(size);
      doc.setTextColor(...color);
      doc.setFont('helvetica', style);
    }

    function drawSectionTitle(title, color = CONFIG.colors.primary) {
      checkPageBreak(15);
      doc.setFillColor(...color);
      doc.rect(M, y, W, 8, 'F');
      font(CONFIG.fontSize.sectionTitle, [255, 255, 255], 'bold');
      doc.text(title, M + 3, y + 5.5);
      y += 12;
    }

    function drawSubTitle(title) {
      checkPageBreak(10);
      font(CONFIG.fontSize.subTitle, CONFIG.colors.primary, 'bold');
      doc.text(title, M, y);
      y += 7;
    }

    function drawIntro(text) {
      font(CONFIG.fontSize.small, CONFIG.colors.lightText);
      doc.text(text, M, y);
      y += 10;
    }

    function drawBullet(text, indent = 5) {
      font(CONFIG.fontSize.normal);
      const lines = doc.splitTextToSize(text, W - indent - 5);
      checkPageBreak(6);
      doc.setFillColor(...CONFIG.colors.primary);
      doc.circle(M + indent + 0.8, y - 1.2, 0.8, 'F');
      lines.forEach((line, i) => {
        if (i > 0) checkPageBreak(6);
        doc.text(line, M + indent + 5, y);
        y += CONFIG.lineHeight;
      });
    }

    function drawNumberBox(value, description) {
      checkPageBreak(10);
      doc.setFillColor(240, 249, 255);
      doc.roundedRect(M, y - 4, 32, 8, 1, 1, 'F');
      font(CONFIG.fontSize.normal, CONFIG.colors.primary, 'bold');
      doc.text(value, M + 16, y + 0.5, { align: 'center' });
      font(CONFIG.fontSize.normal);
      const lines = doc.splitTextToSize(description, W - 37);
      doc.text(lines[0], M + 35, y + 0.5);
      y += 8;
      for (let i = 1; i < lines.length; i++) {
        doc.text(lines[i], M + 35, y);
        y += 6;
      }
    }

    function drawTick(x, ty, color = CONFIG.colors.success) {
      doc.setDrawColor(...color);
      doc.setLineWidth(0.6);
      doc.lines([[1.1, 1.2], [2.2, -2.6]], x, ty);
      doc.setLineWidth(0.2);
    }

    function drawQuizQuestion(qNum, question, options, correctIndex) {
      checkPageBreak(30);
      font(CONFIG.fontSize.normal, CONFIG.colors.text, 'bold');
      doc.splitTextToSize(`Q${qNum}. ${question}`, W).forEach(line => {
        checkPageBreak(6);
        doc.text(line, M, y);
        y += CONFIG.lineHeight;
      });
      options.forEach((opt, idx) => {
        const isCorrect = idx === correctIndex;
        font(CONFIG.fontSize.normal, isCorrect ? CONFIG.colors.success : CONFIG.colors.lightText, isCorrect ? 'bold' : 'normal');
        doc.splitTextToSize(`${String.fromCharCode(65 + idx)}) ${opt}`, W - 12).forEach((line, i) => {
          checkPageBreak(6);
          if (isCorrect && i === 0) drawTick(M + 5, y - 1.2);
          doc.text(line, M + 10, y);
          y += CONFIG.lineHeight - 0.5;
        });
      });
      y += 3;
    }

    function drawImageFit(img, x, iy, w, h) {
      if (!img) return;
      const s = Math.min(w / img.w, h / img.h);
      const dw = img.w * s;
      const dh = img.h * s;
      doc.addImage(img.data, 'JPEG', x + (w - dw) / 2, iy + (h - dh) / 2, dw, dh, img.key, 'FAST');
    }

    // ---------- Diagram helpers ----------
    function arrowHead(x, ay, angle, size = 1.8) {
      const a1 = angle + Math.PI * 0.85;
      const a2 = angle - Math.PI * 0.85;
      doc.triangle(x, ay, x + size * Math.cos(a1), ay + size * Math.sin(a1),
        x + size * Math.cos(a2), ay + size * Math.sin(a2), 'F');
    }

    function arrow(x1, y1, x2, y2, color = CONFIG.colors.text, both = false) {
      doc.setDrawColor(...color);
      doc.setFillColor(...color);
      doc.setLineWidth(0.35);
      doc.line(x1, y1, x2, y2);
      const angle = Math.atan2(y2 - y1, x2 - x1);
      arrowHead(x2, y2, angle);
      if (both) arrowHead(x1, y1, angle + Math.PI);
      doc.setLineWidth(0.2);
    }

    // Two-headed dimension line with its label beside the midpoint.
    function dimLine(x1, y1, x2, y2, label, color = CONFIG.colors.primary) {
      arrow(x1, y1, x2, y2, color, true);
      font(7, color, 'bold');
      if (y1 === y2) doc.text(label, (x1 + x2) / 2, y1 - 1.2, { align: 'center' });
      else doc.text(label, x1 + 1.5, (y1 + y2) / 2 + 1);
    }

    function diagramTitle(title, neededHeight) {
      checkPageBreak(neededHeight + 10);
      font(CONFIG.fontSize.subTitle, CONFIG.colors.primary, 'bold');
      doc.text(title, CONFIG.pageWidth / 2, y, { align: 'center' });
      doc.setDrawColor(...CONFIG.colors.primary);
      doc.setLineWidth(0.3);
      doc.line(CONFIG.pageWidth / 2 - 30, y + 2, CONFIG.pageWidth / 2 + 30, y + 2);
      doc.setLineWidth(0.2);
      y += 9;
    }

    function card(x, cy, w, h, fill, border) {
      doc.setFillColor(...fill);
      doc.setDrawColor(...border);
      doc.setLineWidth(0.3);
      doc.roundedRect(x, cy, w, h, 2, 2, 'FD');
      doc.setLineWidth(0.2);
    }

    // ---------- Diagrams ----------
    function drawSpeedLimitDiagram() {
      const groups = [
        { name: 'General roads (no speed sign)', items: [
          { label: 'Ordinary car', value: 60, color: CONFIG.colors.primary },
          { label: 'Moped (50cc or less)', value: 30, color: CONFIG.colors.warning }
        ]},
        { name: 'Expressways', items: [
          { label: 'Most vehicles - maximum', value: 100, color: CONFIG.colors.success },
          { label: 'Large cargo trucks - maximum', value: 90, color: PURPLE },
          { label: 'Trailers / 3-wheelers - maximum', value: 80, color: CONFIG.colors.danger },
          { label: 'All vehicles - MINIMUM', value: 50, color: GREY, min: true }
        ]},
        { name: 'Towing another vehicle', items: [
          { label: 'Towed <= 2,000 kg, tower 3x heavier', value: 40, color: [14, 165, 233] },
          { label: 'Any other car towing', value: 30, color: [14, 165, 233] },
          { label: 'Motorcycle / moped towing', value: 25, color: [14, 165, 233] }
        ]}
      ];
      const rowH = 7;
      const groupH = 6.5;
      const itemCount = groups.reduce((n, g) => n + g.items.length, 0);
      const chartH = groups.length * groupH + itemCount * rowH;
      diagramTitle('Speed Limits at a Glance', chartH + 12);

      const labelW = 62;
      const x0 = M + labelW;
      const scale = (W - labelW - 16) / 100;
      const top = y;

      doc.setDrawColor(229, 231, 235);
      for (let v = 0; v <= 100; v += 20) doc.line(x0 + v * scale, top, x0 + v * scale, top + chartH);

      groups.forEach(group => {
        font(8, CONFIG.colors.lightText, 'bold');
        doc.text(group.name.toUpperCase(), M, y + 4.5);
        y += groupH;
        group.items.forEach(item => {
          const barW = item.value * scale;
          font(8, CONFIG.colors.text);
          doc.text(item.label, x0 - 2, y + 4.3, { align: 'right' });
          doc.setFillColor(...item.color);
          if (item.min) {
            doc.setDrawColor(...item.color);
            doc.setLineDashPattern([1, 1], 0);
            doc.rect(x0, y + 1, barW, 5, 'S');
            doc.setLineDashPattern([], 0);
          } else {
            doc.roundedRect(x0, y + 1, barW, 5, 0.8, 0.8, 'F');
          }
          font(8.5, item.color, 'bold');
          doc.text(`${item.value} km/h`, x0 + barW + 2, y + 4.6);
          y += rowH;
        });
      });

      doc.setDrawColor(...CONFIG.colors.lightText);
      doc.line(x0, y, x0 + 100 * scale, y);
      font(7, CONFIG.colors.lightText);
      for (let v = 0; v <= 100; v += 20) doc.text(String(v), x0 + v * scale, y + 4, { align: 'center' });
      doc.text('km/h', x0 + 100 * scale + 4, y + 4);
      y += 12;
    }

    function drawStoppingVsParkingDiagram() {
      diagramTitle('Stopping vs Parking - the 5-Minute Rule', 82);
      const x1 = M + 5;
      const x5 = M + 70;
      const x2 = W + M - 8;
      const barY = y + 8;

      font(11, CONFIG.colors.success, 'bold');
      doc.text('STOPPING', (x1 + x5) / 2, barY - 2.5, { align: 'center' });
      font(11, CONFIG.colors.danger, 'bold');
      doc.text('PARKING', (x5 + x2) / 2, barY - 2.5, { align: 'center' });

      doc.setFillColor(...CONFIG.colors.success);
      doc.rect(x1, barY, x5 - x1, 6, 'F');
      doc.setFillColor(...CONFIG.colors.danger);
      doc.rect(x5, barY, x2 - x5, 6, 'F');
      arrowHead(x2 + 5, barY + 3, 0, 5);

      doc.setDrawColor(...CONFIG.colors.text);
      doc.setLineWidth(0.8);
      doc.line(x5, barY - 1.5, x5, barY + 8);
      doc.setLineWidth(0.2);
      font(8, CONFIG.colors.lightText);
      doc.text('0 min', x1, barY + 11, { align: 'center' });
      doc.text('time', x2 + 2, barY + 11, { align: 'center' });
      font(10, CONFIG.colors.text, 'bold');
      doc.text('5 min', x5, barY + 12, { align: 'center' });
      y = barY + 17;

      const boxW = (W - 6) / 2;
      const boxH = 27;
      const boxes = [
        { x: M, title: 'Driver can move off at once', fill: [220, 252, 231], border: CONFIG.colors.success,
          items: ['Waiting / loading 5 min or less', 'Driver stays with the vehicle', 'Allowed in "No Parking" zones'] },
        { x: M + boxW + 6, title: 'Vehicle is left / waits long', fill: [254, 226, 226], border: CONFIG.colors.danger,
          items: ['Waiting / loading over 5 min', 'Driver leaves the vehicle', 'Breakdown standing still (any time)'] }
      ];
      boxes.forEach(b => {
        card(b.x, y, boxW, boxH, b.fill, b.border);
        font(9, b.border, 'bold');
        doc.text(b.title, b.x + 4, y + 6);
        font(8.5);
        b.items.forEach((item, i) => {
          doc.setFillColor(...b.border);
          doc.circle(b.x + 5, y + 12 + i * 5.5 - 1, 0.8, 'F');
          doc.text(item, b.x + 8, y + 12 + i * 5.5);
        });
      });
      y += boxH + 4;

      card(M, y, W, 17, [254, 249, 195], CONFIG.colors.warning);
      font(9, CONFIG.colors.text, 'bold');
      doc.text('Exceptions that beat the clock', M + 4, y + 5.5);
      font(8.5);
      doc.text('- Passengers getting on or off = STOPPING, however long it takes', M + 4, y + 10.5);
      doc.text('- Driver walks away and cannot move the car at once = PARKING, even under 5 min', M + 4, y + 15);
      y += 25;
    }

    function drawOfficerFront(fx, fy, raised) {
      doc.setFillColor(...NAVY);
      doc.setDrawColor(...NAVY);
      doc.circle(fx, fy + 4, 2.8, 'F');
      doc.rect(fx - 3, fy, 6, 1.6, 'F'); // cap
      doc.roundedRect(fx - 4, fy + 7.5, 8, 13, 1.2, 1.2, 'F');
      doc.setLineCap('round');
      doc.setLineWidth(2);
      doc.line(fx - 2, fy + 20, fx - 2.5, fy + 30);
      doc.line(fx + 2, fy + 20, fx + 2.5, fy + 30);
      if (raised) {
        doc.line(fx + 5, fy + 9, fx + 5.5, fy - 5);
        doc.line(fx - 5, fy + 9, fx - 6, fy + 19);
      } else {
        doc.line(fx - 5, fy + 9.5, fx - 14, fy + 9.5);
        doc.line(fx + 5, fy + 9.5, fx + 14, fy + 9.5);
      }
      doc.setLineWidth(0.2);
      doc.setLineCap('butt');
    }

    function drawCar(x, cy, w, h, color, letter) {
      doc.setFillColor(...color);
      doc.roundedRect(x, cy, w, h, 1, 1, 'F');
      font(7, color === CONFIG.colors.warning ? CONFIG.colors.text : [255, 255, 255], 'bold');
      doc.text(letter, x + w / 2, cy + h / 2 + 1.2, { align: 'center' });
    }

    function drawCrossroads(cx, cy, sideColor, raised) {
      const S = 28;
      const R = 9;
      doc.setFillColor(...ROAD);
      doc.rect(cx - R, cy - S, 2 * R, 2 * S, 'F');
      doc.rect(cx - S, cy - R, 2 * S, 2 * R, 'F');
      doc.setDrawColor(255, 255, 255);
      doc.setLineDashPattern([1.5, 1.5], 0);
      doc.line(cx, cy - S, cx, cy - R);
      doc.line(cx, cy + R, cx, cy + S);
      doc.line(cx - S, cy, cx - R, cy);
      doc.line(cx + R, cy, cx + S, cy);
      doc.setLineDashPattern([], 0);

      // Japan drives on the left: each car sits in the left lane of its approach.
      drawCar(cx - 8, cy + 12, 7, 11, CONFIG.colors.danger, 'R');
      drawCar(cx + 1, cy - 23, 7, 11, CONFIG.colors.danger, 'R');
      const side = sideColor === CONFIG.colors.success ? 'G' : 'Y';
      drawCar(cx - 23, cy - 8, 11, 7, sideColor, side);
      drawCar(cx + 12, cy + 1, 11, 7, sideColor, side);

      doc.setFillColor(...NAVY);
      doc.circle(cx, cy, 2.4, 'F');
      doc.setDrawColor(...NAVY);
      doc.setLineWidth(1);
      if (raised) {
        doc.line(cx - 3.5, cy, cx + 3.5, cy);
        doc.setFillColor(...CONFIG.colors.warning);
        doc.circle(cx + 3.8, cy, 1.1, 'F');
      } else {
        doc.line(cx - 7, cy, cx + 7, cy);
      }
      doc.setLineWidth(0.2);
      doc.setFillColor(255, 255, 255);
      doc.triangle(cx - 1.2, cy + 1, cx + 1.2, cy + 1, cx, cy + 2.4, 'F'); // faces the bottom of the page

      font(6, CONFIG.colors.lightText, 'bold');
      doc.text('BACK', cx + 11, cy - 22);
      doc.text('FRONT', cx + 11, cy + 25);
      doc.text('SIDE', cx - 26, cy - 11);
      doc.text('SIDE', cx + 19, cy + 12);
    }

    function drawPoliceSignalsDiagram() {
      const photoH = photos[POLICE_PHOTOS.horizontal] ? 29 : 0;
      const panelH = 72 + photoH + (photoH ? 3 : 0);
      diagramTitle('Police Hand Signals - What Each Direction Sees', panelH + 22);
      const panelW = (W - 6) / 2;
      const panels = [
        { title: 'Arms stretched out sideways', color: CONFIG.colors.success, raised: false, photo: photos[POLICE_PHOTOS.horizontal] },
        { title: 'Arm raised straight up', color: CONFIG.colors.warning, raised: true, photo: photos[POLICE_PHOTOS.vertical] }
      ];
      panels.forEach((p, i) => {
        const px = M + i * (panelW + 6);
        card(px, y, panelW, panelH, [248, 250, 252], [226, 232, 240]);
        font(9.5, CONFIG.colors.text, 'bold');
        doc.text(p.title, px + panelW / 2, y + 6, { align: 'center' });
        drawOfficerFront(px + 15, y + 22, p.raised);
        font(6.5, CONFIG.colors.lightText);
        doc.text('front view', px + 15, y + 57, { align: 'center' });
        drawCrossroads(px + panelW - 30, y + 40, p.color, p.raised);
        if (p.photo) drawImageFit(p.photo, px + 3, y + 72, panelW - 6, photoH);
      });
      y += panelH + 6;

      const legend = [
        { color: CONFIG.colors.danger, text: 'R = RED: stop' },
        { color: CONFIG.colors.success, text: 'G = GREEN: go' },
        { color: CONFIG.colors.warning, text: 'Y = YELLOW: stop before the line' }
      ];
      let lx = M + 10;
      legend.forEach(l => {
        doc.setFillColor(...l.color);
        doc.circle(lx, y - 1, 2, 'F');
        font(8.5);
        doc.text(l.text, lx + 4, y);
        lx += 52;
      });
      y += 7;
      font(9, CONFIG.colors.danger, 'bold');
      doc.text("Facing the officer's FRONT or BACK = always RED. Officer signals override traffic lights.", CONFIG.pageWidth / 2, y, { align: 'center' });
      y += 10;
    }

    function drawPriorityDiagram() {
      const steps = [
        { q: 'Is one road a PRIORITY ROAD (priority-road sign)?', a: 'The priority road goes first' },
        { q: "Does one road's centerline run through the intersection?", a: 'That road goes first' },
        { q: 'Is one road clearly WIDER than the other?', a: 'The wider road goes first' }
      ];
      const boxH = 13;
      const gap = 9;
      diagramTitle('Intersection Priority - Decision Flow', steps.length * (boxH + gap) + 34);
      const qx = M + 2;
      const qw = 104;
      const ax = M + 126;
      const aw = W - 126;

      steps.forEach((s, i) => {
        card(qx, y, qw, boxH, [239, 246, 255], CONFIG.colors.primary);
        doc.setFillColor(...CONFIG.colors.primary);
        doc.circle(qx + 6, y + boxH / 2, 3.2, 'F');
        font(9, [255, 255, 255], 'bold');
        doc.text(String(i + 1), qx + 6, y + boxH / 2 + 1.2, { align: 'center' });
        font(8.5);
        const lines = doc.splitTextToSize(s.q, qw - 14);
        doc.text(lines, qx + 12, y + boxH / 2 + 1.2 - (lines.length - 1) * 1.8);

        arrow(qx + qw, y + boxH / 2, ax - 1, y + boxH / 2, CONFIG.colors.success);
        font(7.5, CONFIG.colors.success, 'bold');
        doc.text('YES', (qx + qw + ax) / 2, y + boxH / 2 - 1.5, { align: 'center' });

        card(ax, y, aw, boxH, [220, 252, 231], CONFIG.colors.success);
        font(8.5, [21, 128, 61], 'bold');
        doc.text(doc.splitTextToSize(s.a, aw - 6), ax + aw / 2, y + boxH / 2 + 1.2, { align: 'center' });

        arrow(qx + qw / 2, y + boxH, qx + qw / 2, y + boxH + gap - 0.5, CONFIG.colors.danger);
        font(7.5, CONFIG.colors.danger, 'bold');
        doc.text('NO', qx + qw / 2 + 2, y + boxH + gap / 2 + 1);
        y += boxH + gap;
      });

      card(qx, y, W - 4, boxH, [254, 249, 195], CONFIG.colors.warning);
      font(9, CONFIG.colors.text, 'bold');
      doc.text('Roads are equal: the vehicle coming from your LEFT goes first', qx + (W - 4) / 2, y + boxH / 2 + 1.2, { align: 'center' });
      y += boxH + 4;

      font(8.5, CONFIG.colors.lightText);
      doc.text('Always: a right-turning vehicle yields to oncoming vehicles going straight or turning left.', CONFIG.pageWidth / 2, y + 2, { align: 'center' });
      y += 10;
    }

    function drawDistanceZonesDiagram() {
      diagramTitle('No Stopping / No Parking Distances (1 m = 2 mm)', 108);
      const roadTop = y + 12;
      const roadH = 16;
      const right = M + W;

      // Roads
      doc.setFillColor(...ROAD);
      doc.rect(M, roadTop, W, roadH, 'F');
      doc.rect(47, roadTop - 10, 16, roadH + 20, 'F');

      // No-stopping zones: 5 m around the intersection, 10 m around the bus stop and the railway crossing
      const zones = [[37, 47], [63, 73], [85, 105], [105, 125], [140, 160], [164, 184]];
      zones.forEach(([a, b]) => {
        doc.setFillColor(254, 202, 202);
        doc.rect(a, roadTop, b - a, roadH, 'F');
        doc.setDrawColor(...CONFIG.colors.danger);
        doc.setLineDashPattern([1, 0.8], 0);
        doc.rect(a, roadTop, b - a, roadH, 'S');
        doc.setLineDashPattern([], 0);
      });

      doc.setDrawColor(255, 255, 255);
      doc.setLineDashPattern([2, 2], 0);
      doc.line(M, roadTop + roadH / 2, 47, roadTop + roadH / 2);
      doc.line(63, roadTop + roadH / 2, right, roadTop + roadH / 2);
      doc.setLineDashPattern([], 0);

      // Railway crossing
      doc.setDrawColor(55, 65, 81);
      doc.setLineWidth(0.8);
      doc.line(160, roadTop - 6, 160, roadTop + roadH + 6);
      doc.line(164, roadTop - 6, 164, roadTop + roadH + 6);
      doc.setLineWidth(0.4);
      for (let ty = roadTop - 5; ty <= roadTop + roadH + 5; ty += 2.5) doc.line(158.5, ty, 165.5, ty);
      doc.setLineWidth(0.2);

      // Bus stop pole
      doc.setFillColor(...CONFIG.colors.primary);
      doc.circle(105, roadTop - 3, 2, 'F');
      font(5, [255, 255, 255], 'bold');
      doc.text('BUS', 105, roadTop - 2.3, { align: 'center' });

      font(8, CONFIG.colors.text, 'bold');
      doc.text('Intersection', 55, roadTop - 12, { align: 'center' });
      doc.text('Bus / tram stop', 105, roadTop - 7, { align: 'center' });
      doc.text('Railway crossing', 162, roadTop - 8, { align: 'center' });

      const dimY = roadTop + roadH + 5;
      dimLine(37, dimY, 47, dimY, '5 m', CONFIG.colors.danger);
      dimLine(63, dimY, 73, dimY, '5 m', CONFIG.colors.danger);
      dimLine(85, dimY, 105, dimY, '10 m', CONFIG.colors.danger);
      dimLine(105, dimY, 125, dimY, '10 m', CONFIG.colors.danger);
      dimLine(140, dimY, 160, dimY, '10 m', CONFIG.colors.danger);
      dimLine(164, dimY, 184, dimY, '10 m', CONFIG.colors.danger);
      y = dimY + 9;

      doc.setFillColor(254, 202, 202);
      doc.setDrawColor(...CONFIG.colors.danger);
      doc.rect(M, y - 3.5, 7, 4.5, 'FD');
      font(8.5, CONFIG.colors.text, 'bold');
      doc.text('No stopping AND no parking', M + 10, y);
      font(8.5);
      y += 5.5;
      doc.text('5 m: intersections, road bends, crosswalks / bicycle crossings', M + 10, y);
      y += 5;
      doc.text('10 m: railway crossings, safety zones (left side), bus & tram stops (service hours). Tunnels: anywhere.', M + 10, y);
      y += 9;

      font(9, CONFIG.colors.primary, 'bold');
      doc.text('No PARKING only (a brief stop is OK)', M, y);
      y += 3;
      const pills = [
        ['1 m', 'Fire alarm'],
        ['3 m', 'Garage / vehicle entrance'],
        ['5 m', 'Fire hydrant / equipment'],
        ['5 m', 'Road construction'],
        ['3.5 m', 'Min. space left on right']
      ];
      const pw = (W - 4 * 3) / pills.length;
      pills.forEach(([value, text], i) => {
        const px = M + i * (pw + 3);
        card(px, y, pw, 15, [219, 234, 254], CONFIG.colors.primary);
        font(11, CONFIG.colors.primary, 'bold');
        doc.text(value, px + pw / 2, y + 6.5, { align: 'center' });
        font(6.8, CONFIG.colors.text);
        doc.text(text, px + pw / 2, y + 11.5, { align: 'center' });
      });
      y += 26;
    }

    function drawCargoLimitsDiagram() {
      diagramTitle('Cargo Limits - Size Envelope', 118);
      const top = y;

      // Car - side view
      const g = top + 38;
      doc.setDrawColor(...CONFIG.colors.lightText);
      doc.line(M + 5, g, M + 92, g);
      doc.setDrawColor(...CONFIG.colors.danger);
      doc.setLineDashPattern([1.5, 1], 0);
      doc.line(M + 10, g - 34, M + 84, g - 34);
      doc.setLineDashPattern([], 0);
      font(7, CONFIG.colors.danger, 'bold');
      doc.text('max height 3.8 m from the ground', M + 47, g - 35.5, { align: 'center' });

      doc.setFillColor(254, 243, 199);
      doc.setDrawColor(...CONFIG.colors.warning);
      doc.setLineDashPattern([1.2, 0.8], 0);
      doc.rect(30, g - 30, 60, 14, 'FD');
      doc.setLineDashPattern([], 0);
      font(7, [161, 98, 7], 'bold');
      doc.text('max cargo', 60, g - 22, { align: 'center' });

      doc.setFillColor(...GREY);
      doc.roundedRect(35, g - 16, 50, 9, 1.5, 1.5, 'F');
      doc.setFillColor(55, 65, 81);
      doc.circle(43, g - 4, 4, 'F');
      doc.circle(77, g - 4, 4, 'F');
      dimLine(M + 85, g, M + 85, g - 34, '3.8 m', CONFIG.colors.danger);
      dimLine(30, g + 5, 35, g + 5, '10%');
      dimLine(85, g + 5, 90, g + 5, '10%');
      dimLine(30, g + 12, 90, g + 12, 'total: 120% of vehicle length');
      font(7.5, CONFIG.colors.lightText);
      doc.text('Car - side view', 60, g + 18, { align: 'center' });

      // Car - top view
      const cx = 155;
      const cy = top + 22;
      doc.setFillColor(254, 243, 199);
      doc.setDrawColor(...CONFIG.colors.warning);
      doc.setLineDashPattern([1.2, 0.8], 0);
      doc.rect(cx - 30, cy - 12.5, 60, 25, 'FD');
      doc.setLineDashPattern([], 0);
      doc.setFillColor(...GREY);
      doc.roundedRect(cx - 25, cy - 10, 50, 20, 2, 2, 'F');
      font(7, [255, 255, 255], 'bold');
      doc.text('vehicle', cx, cy + 1, { align: 'center' });
      dimLine(cx + 33, cy - 12.5, cx + 33, cy + 12.5, '120%');
      dimLine(cx - 33, cy - 12.5, cx - 33, cy - 10, '');
      font(6.5, CONFIG.colors.primary, 'bold');
      doc.text('10% each side', cx - 34, cy - 14, { align: 'center' });
      font(7.5, CONFIG.colors.lightText);
      doc.text('Car - top view (width)', cx, cy + 20, { align: 'center' });

      // Motorcycle - side view
      const g2 = top + 104;
      doc.setDrawColor(...CONFIG.colors.lightText);
      doc.line(M + 5, g2, M + 80, g2);
      doc.setDrawColor(...CONFIG.colors.danger);
      doc.setLineDashPattern([1.5, 1], 0);
      doc.line(M + 10, g2 - 34, M + 72, g2 - 34);
      doc.setLineDashPattern([], 0);
      font(7, CONFIG.colors.danger, 'bold');
      doc.text('max height 2 m from the ground', M + 40, g2 - 35.5, { align: 'center' });
      doc.setFillColor(254, 243, 199);
      doc.setDrawColor(...CONFIG.colors.warning);
      doc.setLineDashPattern([1.2, 0.8], 0);
      doc.rect(60, g2 - 27, 18, 10, 'FD');
      doc.setLineDashPattern([], 0);
      // wheels
      doc.setFillColor(55, 65, 81);
      doc.circle(38, g2 - 6, 6, 'F');
      doc.circle(70, g2 - 6, 6, 'F');
      doc.setFillColor(226, 232, 240);
      doc.circle(38, g2 - 6, 2.5, 'F');
      doc.circle(70, g2 - 6, 2.5, 'F');
      // body, fork, handlebar, seat, rear carrier
      doc.setFillColor(...GREY);
      doc.lines([[16, 0], [8, 6], [-20, 2]], 42, g2 - 14, [1, 1], 'F', true);
      doc.setDrawColor(55, 65, 81);
      doc.setLineWidth(1.2);
      doc.line(38, g2 - 6, 43, g2 - 20);
      doc.line(40, g2 - 20, 46, g2 - 20);
      doc.setLineWidth(0.2);
      doc.setFillColor(55, 65, 81);
      doc.roundedRect(46, g2 - 17, 14, 3, 1, 1, 'F');
      doc.rect(60, g2 - 17, 12, 1.2, 'F');
      doc.line(64, g2 - 16, 68, g2 - 9);
      dimLine(72, g2 - 29.5, 78, g2 - 29.5, '+30 cm');
      dimLine(M + 72, g2, M + 72, g2 - 34, '2 m', CONFIG.colors.danger);
      font(7.5, CONFIG.colors.lightText);
      doc.text('Motorcycle - side view', 55, g2 + 5, { align: 'center' });

      const tx = 118;
      let ty = g2 - 30;
      font(9.5, CONFIG.colors.text, 'bold');
      doc.text('Motorcycle cargo limits', tx, ty);
      font(8.5);
      ['Length: carrier + 30 cm', 'Width: carrier + 15 cm each side', 'Height: 2 m from the ground',
        'Weight: moped 30 kg, motorcycle 60 kg'].forEach(line => {
        ty += 6;
        doc.setFillColor(...CONFIG.colors.warning);
        doc.circle(tx + 1, ty - 1.1, 0.8, 'F');
        doc.text(line, tx + 4, ty);
      });

      y = g2 + 12;
    }

    // ---------- Traffic signs ----------
    function drawTrafficSigns() {
      if (typeof TRAFFIC_SIGN_CATEGORIES === 'undefined') return;
      const cols = 4;
      const gap = 4;
      const cardW = (W - gap * (cols - 1)) / cols;
      const imgH = 20;
      const clip = (lines, max) => lines.length > max ? [...lines.slice(0, max - 1), lines[max - 1].replace(/\s*\S*$/, '...')] : lines;

      TRAFFIC_SIGN_CATEGORIES.forEach(cat => {
        checkPageBreak(60);
        drawSubTitle(`${cat.name} (${cat.signs.length})`);
        for (let i = 0; i < cat.signs.length; i += cols) {
          const row = cat.signs.slice(i, i + cols).map(s => {
            font(7.5, CONFIG.colors.text, 'bold');
            const title = clip(doc.splitTextToSize(s.title, cardW - 4), 3);
            font(6.5);
            const desc = s.desc ? clip(doc.splitTextToSize(s.desc, cardW - 4), 4) : [];
            return { s, title, desc };
          });
          const textH = Math.max(...row.map(r => r.title.length * 3.2 + r.desc.length * 2.8));
          const cardH = imgH + 6 + textH;
          checkPageBreak(cardH + 2);
          row.forEach((r, j) => {
            const x = M + j * (cardW + gap);
            card(x, y, cardW, cardH, [255, 255, 255], [229, 231, 235]);
            drawImageFit(images[r.s.img], x + 2, y + 2, cardW - 4, imgH);
            let ty = y + imgH + 5.5;
            font(7.5, CONFIG.colors.text, 'bold');
            doc.text(r.title, x + 2, ty);
            ty += r.title.length * 3.2;
            font(6.5, CONFIG.colors.lightText);
            doc.text(r.desc, x + 2, ty);
          });
          y += cardH + gap;
        }
        y += 3;
      });
    }

    // ---------- Practice exam tables ----------
    function drawExamTable(exam) {
      const color = exam.type === 'karimen' ? CONFIG.colors.primary : PURPLE;
      checkPageBreak(40);
      doc.setFillColor(...color);
      doc.roundedRect(M, y, W, 9, 1.5, 1.5, 'F');
      font(11, [255, 255, 255], 'bold');
      doc.text(exam.title, M + 3, y + 6.2);
      font(8, [255, 255, 255]);
      doc.text(`${exam.questions.length} questions  |  pass ${exam.passScore}/${exam.maxScore || 100}  |  ${exam.timeLimitMinutes} min`,
        M + W - 3, y + 6, { align: 'right' });
      y += 11;

      const THUMB_W = 26;
      const THUMB_H = 19;
      const pic = q => sel.images && q.img ? images[q.img] : null;
      const head = ['#', 'Question', 'Answer'];
      if (sel.explanations) head.push('Explanation');

      doc.autoTable({
        startY: y,
        margin: { left: M, right: M, top: M, bottom: CONFIG.pageHeight - BOTTOM },
        head: [head],
        body: exam.questions.map((q, i) => {
          const row = [String(i + 1), safe(q.q), q.answer ? 'TRUE' : 'FALSE'];
          if (sel.explanations) row.push(safe(q.explanation || ''));
          return row;
        }),
        rowPageBreak: 'avoid',
        styles: { font: 'helvetica', fontSize: 7.5, cellPadding: 1.5, textColor: CONFIG.colors.text,
          lineColor: [229, 231, 235], lineWidth: 0.1, valign: 'middle' },
        headStyles: { fillColor: color, textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        columnStyles: {
          0: { cellWidth: 8, halign: 'center', textColor: CONFIG.colors.lightText },
          2: { cellWidth: 15, halign: 'center', fontStyle: 'bold' },
          3: { cellWidth: 55, textColor: [75, 85, 99], fontSize: 7 }
        },
        didParseCell: data => {
          if (data.section !== 'body') return;
          const q = exam.questions[data.row.index];
          if (data.column.index === 2) {
            data.cell.styles.fillColor = q.answer ? [220, 252, 231] : [254, 226, 226];
            data.cell.styles.textColor = q.answer ? [21, 128, 61] : [185, 28, 28];
          }
          if (data.column.index === 1 && pic(q)) {
            data.cell.styles.cellPadding = { top: 1.5, bottom: 1.5, right: 1.5, left: THUMB_W + 3 };
            data.cell.styles.minCellHeight = THUMB_H + 3;
          }
        },
        didDrawCell: data => {
          if (data.section !== 'body' || data.column.index !== 1) return;
          const img = pic(exam.questions[data.row.index]);
          if (img) drawImageFit(img, data.cell.x + 1.5, data.cell.y + 1.5, THUMB_W, data.cell.height - 3);
        }
      });
      y = doc.lastAutoTable.finalY + 8;
    }

    // ============ Title page ============
    y = 60;
    font(28, CONFIG.colors.primary, 'bold');
    doc.text('Karimen + Honmen', CONFIG.pageWidth / 2, y, { align: 'center' });
    y += 15;
    font(20, CONFIG.colors.text, 'bold');
    doc.text('Complete Revision Guide', CONFIG.pageWidth / 2, y, { align: 'center' });
    y += 25;
    font(CONFIG.fontSize.normal, CONFIG.colors.lightText);
    doc.text('Japanese Driving License Theory Exam Preparation', CONFIG.pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.text('Karimen (provisional license) & Honmen (full license)', CONFIG.pageWidth / 2, y, { align: 'center' });

    y += 30;
    doc.setFillColor(240, 249, 255);
    doc.roundedRect(M + 20, y, W - 40, 35, 3, 3, 'F');
    y += 10;
    font(CONFIG.fontSize.subTitle, CONFIG.colors.primary, 'bold');
    doc.text('Exam Quick Facts', CONFIG.pageWidth / 2, y, { align: 'center' });
    y += 8;
    font(CONFIG.fontSize.normal);
    doc.text('Karimen: 50 true/false questions - Pass: 90/100 points', CONFIG.pageWidth / 2, y, { align: 'center' });
    y += 6;
    doc.text('Honmen: 90 T/F + 5 situational - Pass: 90/100 points', CONFIG.pageWidth / 2, y, { align: 'center' });

    const chosen = SECTIONS.filter(s => has(s.id));
    y += 30;
    font(CONFIG.fontSize.sectionTitle, CONFIG.colors.text, 'bold');
    doc.text('Contents', CONFIG.pageWidth / 2, y, { align: 'center' });
    y += 10;
    font(CONFIG.fontSize.normal);
    chosen.forEach((s, i) => {
      const extra = s.id === 'exams' ? ` (${exams.length} exams)` : '';
      doc.text(`${i + 1}. ${s.title}${extra}`, CONFIG.pageWidth / 2, y, { align: 'center' });
      y += 7;
    });

    font(CONFIG.fontSize.small, CONFIG.colors.lightText);
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(`Generated: ${today}`, CONFIG.pageWidth / 2, CONFIG.pageHeight - 30, { align: 'center' });
    doc.text('Pass mark: 90% - Study all chapters thoroughly!', CONFIG.pageWidth / 2, CONFIG.pageHeight - 25, { align: 'center' });

    // ============ Sections ============
    chosen.forEach((section, i) => {
      addPage();
      drawSectionTitle(`SECTION ${i + 1}: ${section.title}`, section.color);
      y += 2;
      sectionRenderers()[section.id]();
    });

    // Footers last, so autoTable-created pages are numbered too.
    const total = doc.getNumberOfPages();
    for (let p = 2; p <= total; p++) {
      doc.setPage(p);
      font(CONFIG.fontSize.small, CONFIG.colors.lightText);
      doc.text(`Page ${p} of ${total}`, CONFIG.pageWidth - M, CONFIG.pageHeight - 10, { align: 'right' });
      doc.text('Karimen + Honmen Revision Guide', M, CONFIG.pageHeight - 10);
    }

    doc.save('Karimen-Honmen-Revision-Guide.pdf');

    // Function declarations below are hoisted, so the section loop above can call them.
    function sectionRenderers() {
      return {
        diagrams() {
          drawIntro('Visual diagrams to help you remember key concepts quickly');
          drawSpeedLimitDiagram();
          drawStoppingVsParkingDiagram();
          drawPoliceSignalsDiagram();
          drawPriorityDiagram();
          drawDistanceZonesDiagram();
          drawCargoLimitsDiagram();
        },
        numbers() {
          drawIntro('Memorize these exact values - exams often test with wrong numbers!');
          IMPORTANT_NUMBERS.forEach(category => {
            drawSubTitle(category.category);
            category.items.forEach(item => drawNumberBox(item.value, item.description));
            y += 5;
          });
        },
        facts() {
          drawIntro('Essential points from each chapter for quick revision');
          if (typeof CHAPTERS === 'undefined') return;
          CHAPTERS.forEach((chapter, idx) => {
            checkPageBreak(30);
            doc.setFillColor(249, 250, 251);
            doc.rect(M, y - 3, W, 8, 'F');
            font(CONFIG.fontSize.subTitle, CONFIG.colors.primary, 'bold');
            doc.text(`${idx + 1}. ${chapter.title}`, M + 2, y + 2);
            y += 10;
            (CHAPTER_KEY_FACTS[chapter.id] || []).forEach(fact => drawBullet(fact, 3));
            y += 5;
          });
        },
        signs() {
          drawIntro('Every sign from the Traffic Signs chapter, grouped by type');
          drawTrafficSigns();
        },
        quiz() {
          drawIntro('All chapter quiz questions - the correct answer is ticked in green');
          if (typeof QUIZZES === 'undefined' || typeof CHAPTERS === 'undefined') return;
          let totalQNum = 1;
          CHAPTERS.forEach((chapter, chIdx) => {
            const questions = QUIZZES[chapter.id] || [];
            if (questions.length === 0) return;
            checkPageBreak(20);
            doc.setFillColor(...CONFIG.colors.primary);
            doc.rect(M, y - 1, W, 7, 'F');
            font(CONFIG.fontSize.normal, [255, 255, 255], 'bold');
            doc.text(`Chapter ${chIdx + 1}: ${chapter.title} (${questions.length} questions)`, M + 3, y + 4);
            y += 12;
            questions.forEach(q => {
              drawQuizQuestion(totalQNum++, q.img ? `${q.q} [Image question - see app]` : q.q, q.options, q.answer);
            });
            y += 5;
          });
        },
        exams() {
          drawIntro('Every practice exam question with its answer. TRUE = the statement is correct.');
          if (exams.length === 0) {
            drawText('Could not load the exam files. Open the site through a web server and try again.');
            return;
          }
          exams.forEach(drawExamTable);
        },
        quickref: drawQuickReference
      };
    }

    function drawText(text) {
      font(CONFIG.fontSize.normal);
      doc.splitTextToSize(text, W).forEach(line => {
        checkPageBreak(6);
        doc.text(line, M, y);
        y += CONFIG.lineHeight;
      });
    }

    function drawQuickReference() {
      const colWidth = (W - 10) / 2;
      const leftCol = M;
      const rightCol = M + colWidth + 10;
      const block = (title, items, x, startY) => {
        font(CONFIG.fontSize.subTitle, CONFIG.colors.primary, 'bold');
        doc.text(title, x, startY);
        startY += 7;
        font(CONFIG.fontSize.small);
        items.forEach(item => {
          doc.text(`- ${item}`, x, startY);
          startY += 5;
        });
        return startY + 5;
      };
      let leftY = block('Stopping vs Parking', [
        'STOPPING: Passenger on/off (any time)',
        'STOPPING: Loading 5 minutes or less',
        'STOPPING: Driver can move immediately',
        'PARKING: Waiting/loading over 5 minutes',
        'PARKING: Driver leaves vehicle'
      ], leftCol, y);
      leftY = block('Police Hand Signals', [
        'Front/Back of officer = RED (always)',
        'Arms horizontal + sides = GREEN',
        'Arm vertical + sides = YELLOW',
        'Police signals OVERRIDE lights'
      ], leftCol, leftY);
      let rightY = block('Intersection Priority', [
        '1. Priority road sign = always wins',
        '2. Centerline extends = that road wins',
        '3. No lines = wider road wins',
        '4. Traffic from LEFT has priority',
        '5. Straight/left > turning right'
      ], rightCol, y);
      rightY = block('Ordinary License Covers', [
        'YES: Ordinary cars (<3.5t, <2000kg, <10 pax)',
        'YES: Small special vehicles',
        'YES: Mopeds (50cc or less)',
        'NO: Large trucks, buses',
        'NO: Motorcycles over 50cc'
      ], rightCol, rightY);

      y = Math.max(leftY, rightY) + 10;
      checkPageBreak(50);
      doc.setFillColor(254, 249, 195);
      doc.roundedRect(M, y, W, 30, 2, 2, 'F');
      y += 8;
      font(CONFIG.fontSize.subTitle, CONFIG.colors.text, 'bold');
      doc.text('Final Exam Tips', CONFIG.pageWidth / 2, y, { align: 'center' });
      y += 7;
      font(CONFIG.fontSize.small);
      [
        '- Read questions carefully - watch for "NOT", "ALWAYS", "NEVER"',
        '- Memorize exact distances and times - wrong numbers are common traps',
        '- 90% pass mark = max 5 wrong on Karimen, max 10 points lost on Honmen'
      ].forEach(line => {
        doc.text(line, CONFIG.pageWidth / 2, y, { align: 'center' });
        y += 5;
      });
      y += 12;
      font(CONFIG.fontSize.sectionTitle, CONFIG.colors.success, 'bold');
      doc.text('Good luck with your exam! Ganbatte kudasai!', CONFIG.pageWidth / 2, y, { align: 'center' });
    }
  }

  async function downloadRevisionPDF(sel = DEFAULT_SELECTION) {
    const overlay = document.getElementById('examLoadingOverlay');
    const progress = msg => { if (overlay) overlay.textContent = msg; };
    progress('Generating PDF…');
    if (overlay) overlay.classList.remove('hidden');
    try {
      await generateRevisionPDF(sel, progress);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      if (overlay) {
        overlay.classList.add('hidden');
        overlay.textContent = 'Loading exam…';
      }
    }
  }

  // ---------- Picker dialog ----------
  const PREFS_KEY = 'karimen-pdf-selection';

  function readSelection(form) {
    const checked = name => [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(i => i.value);
    const opts = checked('opt');
    return { sections: checked('section'), exams: checked('exam'),
      images: opts.includes('images'), explanations: opts.includes('explanations') };
  }

  function applySelection(form, sel) {
    const lists = { section: sel.sections, exam: sel.exams,
      opt: [sel.images && 'images', sel.explanations && 'explanations'] };
    form.querySelectorAll('input[type="checkbox"]').forEach(input => {
      input.checked = (lists[input.name] || []).includes(input.value);
    });
  }

  function savedSelection() {
    try {
      const saved = JSON.parse(localStorage.getItem(PREFS_KEY));
      if (saved && Array.isArray(saved.sections) && Array.isArray(saved.exams)) return saved;
    } catch (e) { /* storage blocked or corrupt - use defaults */ }
    return DEFAULT_SELECTION;
  }

  function initPDFDialog() {
    const dialog = document.getElementById('pdfDialog');
    const form = document.getElementById('pdfForm');
    if (!dialog || !form || typeof dialog.showModal !== 'function') return null;

    if (typeof EXAM_CATALOG !== 'undefined') {
      form.querySelectorAll('.pdf-exam-grid').forEach(grid => {
        grid.innerHTML = EXAM_CATALOG
          .filter(e => e.type === grid.dataset.type)
          .sort((a, b) => a.number - b.number)
          .map(e => `<label class="pdf-chip" title="${e.title}"><input type="checkbox" name="exam" value="${e.id}"><span>${e.number}</span></label>`)
          .join('');
      });
    }

    const picker = document.getElementById('pdfExamPicker');
    const summary = document.getElementById('pdfSummary');
    const generate = document.getElementById('pdfGenerate');
    const update = () => {
      const sel = readSelection(form);
      const examsOn = sel.sections.includes('exams');
      picker.disabled = !examsOn;
      const questions = examsOn && typeof EXAM_CATALOG !== 'undefined'
        ? EXAM_CATALOG.filter(e => sel.exams.includes(e.id)).reduce((n, e) => n + (e.questionCount || 0), 0)
        : 0;
      summary.textContent = `${sel.sections.length} section${sel.sections.length === 1 ? '' : 's'}` +
        (examsOn ? `, ${sel.exams.length} exams (${questions} questions)` : '');
      generate.disabled = sel.sections.length === 0;
    };

    form.addEventListener('change', update);
    form.querySelectorAll('[data-pick]').forEach(btn => btn.addEventListener('click', () => {
      form.querySelectorAll(`.pdf-exam-grid[data-type="${btn.dataset.pick}"] input`)
        .forEach(input => { input.checked = Boolean(btn.dataset.on); });
      update();
    }));
    dialog.addEventListener('close', () => {
      if (dialog.returnValue !== 'ok') return;
      const sel = readSelection(form);
      try { localStorage.setItem(PREFS_KEY, JSON.stringify(sel)); } catch (e) { /* not critical */ }
      downloadRevisionPDF(sel);
    });

    return () => {
      applySelection(form, savedSelection());
      update();
      dialog.returnValue = ''; // Esc keeps the previous returnValue otherwise
      dialog.showModal();
    };
  }

  function initPDFDownload() {
    const openDialog = initPDFDialog() || (() => downloadRevisionPDF());
    ['btnDownloadPDF', 'btnDownloadPDFHero'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', openDialog);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPDFDownload);
  } else {
    initPDFDownload();
  }

  window.downloadRevisionPDF = downloadRevisionPDF;
})();
