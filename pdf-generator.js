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

  function generateRevisionPDF() {
    const doc = new jsPDF('p', 'mm', 'a4');
    let y = CONFIG.margin;
    let pageNum = 1;

    // Helper functions
    function addPage() {
      doc.addPage();
      pageNum++;
      y = CONFIG.margin;
      addPageNumber();
    }

    function addPageNumber() {
      doc.setFontSize(CONFIG.fontSize.small);
      doc.setTextColor(...CONFIG.colors.lightText);
      doc.text(`Page ${pageNum}`, CONFIG.pageWidth - CONFIG.margin, CONFIG.pageHeight - 10, { align: 'right' });
      doc.text('Karimen + Honmen Revision Guide', CONFIG.margin, CONFIG.pageHeight - 10);
    }

    function checkPageBreak(neededHeight = 20) {
      if (y + neededHeight > CONFIG.pageHeight - CONFIG.margin - 15) {
        addPage();
        return true;
      }
      return false;
    }

    function drawSectionTitle(title, color = CONFIG.colors.primary) {
      checkPageBreak(15);
      doc.setFillColor(...color);
      doc.rect(CONFIG.margin, y, CONFIG.pageWidth - 2 * CONFIG.margin, 8, 'F');
      doc.setFontSize(CONFIG.fontSize.sectionTitle);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text(title, CONFIG.margin + 3, y + 5.5);
      doc.setFont('helvetica', 'normal');
      y += 12;
    }

    function drawSubTitle(title) {
      checkPageBreak(10);
      doc.setFontSize(CONFIG.fontSize.subTitle);
      doc.setTextColor(...CONFIG.colors.primary);
      doc.setFont('helvetica', 'bold');
      doc.text(title, CONFIG.margin, y);
      doc.setFont('helvetica', 'normal');
      y += 7;
    }

    function drawText(text, indent = 0) {
      doc.setFontSize(CONFIG.fontSize.normal);
      doc.setTextColor(...CONFIG.colors.text);
      const maxWidth = CONFIG.pageWidth - 2 * CONFIG.margin - indent;
      const lines = doc.splitTextToSize(text, maxWidth);
      
      for (const line of lines) {
        checkPageBreak(6);
        doc.text(line, CONFIG.margin + indent, y);
        y += CONFIG.lineHeight;
      }
    }

    function drawBullet(text, indent = 5) {
      doc.setFontSize(CONFIG.fontSize.normal);
      doc.setTextColor(...CONFIG.colors.text);
      const maxWidth = CONFIG.pageWidth - 2 * CONFIG.margin - indent - 5;
      const lines = doc.splitTextToSize(text, maxWidth);
      
      checkPageBreak(6);
      doc.text('•', CONFIG.margin + indent, y);
      
      for (let i = 0; i < lines.length; i++) {
        if (i > 0) checkPageBreak(6);
        doc.text(lines[i], CONFIG.margin + indent + 5, y);
        y += CONFIG.lineHeight;
      }
    }

    function drawNumberBox(value, description) {
      checkPageBreak(10);
      
      // Value box
      doc.setFillColor(240, 249, 255);
      doc.roundedRect(CONFIG.margin, y - 4, 30, 8, 1, 1, 'F');
      doc.setFontSize(CONFIG.fontSize.normal);
      doc.setTextColor(...CONFIG.colors.primary);
      doc.setFont('helvetica', 'bold');
      doc.text(value, CONFIG.margin + 15, y, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      
      // Description
      doc.setTextColor(...CONFIG.colors.text);
      const maxWidth = CONFIG.pageWidth - 2 * CONFIG.margin - 35;
      const lines = doc.splitTextToSize(description, maxWidth);
      doc.text(lines[0], CONFIG.margin + 33, y);
      y += 8;
      
      if (lines.length > 1) {
        for (let i = 1; i < lines.length; i++) {
          doc.text(lines[i], CONFIG.margin + 33, y);
          y += 6;
        }
      }
    }

    function drawQuizQuestion(qNum, question, options, correctIndex) {
      checkPageBreak(35);
      
      // Question
      doc.setFontSize(CONFIG.fontSize.normal);
      doc.setTextColor(...CONFIG.colors.text);
      doc.setFont('helvetica', 'bold');
      const qText = `Q${qNum}. ${question}`;
      const qLines = doc.splitTextToSize(qText, CONFIG.pageWidth - 2 * CONFIG.margin);
      for (const line of qLines) {
        checkPageBreak(6);
        doc.text(line, CONFIG.margin, y);
        y += CONFIG.lineHeight;
      }
      doc.setFont('helvetica', 'normal');
      
      // Options
      options.forEach((opt, idx) => {
        checkPageBreak(6);
        const isCorrect = idx === correctIndex;
        const prefix = isCorrect ? '✓ ' : '   ';
        const letter = String.fromCharCode(65 + idx);
        
        if (isCorrect) {
          doc.setTextColor(...CONFIG.colors.success);
          doc.setFont('helvetica', 'bold');
        } else {
          doc.setTextColor(...CONFIG.colors.lightText);
          doc.setFont('helvetica', 'normal');
        }
        
        doc.text(`${prefix}${letter}) ${opt}`, CONFIG.margin + 5, y);
        y += CONFIG.lineHeight;
      });
      
      y += 3;
    }

    // ============ PAGE 1: Title Page ============
    y = 60;
    doc.setFontSize(28);
    doc.setTextColor(...CONFIG.colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('Karimen + Honmen', CONFIG.pageWidth / 2, y, { align: 'center' });
    
    y += 15;
    doc.setFontSize(20);
    doc.setTextColor(...CONFIG.colors.text);
    doc.text('Complete Revision Guide', CONFIG.pageWidth / 2, y, { align: 'center' });
    
    y += 25;
    doc.setFontSize(CONFIG.fontSize.normal);
    doc.setTextColor(...CONFIG.colors.lightText);
    doc.text('Japanese Driving License Theory Exam Preparation', CONFIG.pageWidth / 2, y, { align: 'center' });
    
    y += 10;
    doc.text('Karimen (仮免) & Honmen (本免)', CONFIG.pageWidth / 2, y, { align: 'center' });
    
    // Exam info box
    y += 30;
    doc.setFillColor(240, 249, 255);
    doc.roundedRect(CONFIG.margin + 20, y, CONFIG.pageWidth - 2 * CONFIG.margin - 40, 35, 3, 3, 'F');
    y += 10;
    doc.setFontSize(CONFIG.fontSize.subTitle);
    doc.setTextColor(...CONFIG.colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('Exam Quick Facts', CONFIG.pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.setFontSize(CONFIG.fontSize.normal);
    doc.setTextColor(...CONFIG.colors.text);
    doc.setFont('helvetica', 'normal');
    doc.text('Karimen: 50 true/false questions • Pass: 90/100 points', CONFIG.pageWidth / 2, y, { align: 'center' });
    y += 6;
    doc.text('Honmen: 90 T/F + 5 situational • Pass: 90/100 points', CONFIG.pageWidth / 2, y, { align: 'center' });
    
    // Contents
    y += 30;
    doc.setFontSize(CONFIG.fontSize.sectionTitle);
    doc.setTextColor(...CONFIG.colors.text);
    doc.setFont('helvetica', 'bold');
    doc.text('Contents', CONFIG.pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.setFontSize(CONFIG.fontSize.normal);
    doc.setFont('helvetica', 'normal');
    const contents = [
      '1. Important Numbers to Remember',
      '2. Chapter Key Facts Summary',
      '3. Complete Quiz Q&A with Answers'
    ];
    contents.forEach(item => {
      doc.text(item, CONFIG.pageWidth / 2, y, { align: 'center' });
      y += 7;
    });
    
    // Footer
    y = CONFIG.pageHeight - 30;
    doc.setFontSize(CONFIG.fontSize.small);
    doc.setTextColor(...CONFIG.colors.lightText);
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(`Generated: ${today}`, CONFIG.pageWidth / 2, y, { align: 'center' });
    y += 5;
    doc.text('Pass mark: 90% • Study all chapters thoroughly!', CONFIG.pageWidth / 2, y, { align: 'center' });
    
    addPageNumber();

    // ============ SECTION 1: Important Numbers ============
    addPage();
    drawSectionTitle('SECTION 1: Important Numbers to Remember', CONFIG.colors.danger);
    y += 3;
    
    doc.setFontSize(CONFIG.fontSize.small);
    doc.setTextColor(...CONFIG.colors.lightText);
    doc.text('Memorize these exact values - exams often test with wrong numbers!', CONFIG.margin, y);
    y += 10;

    IMPORTANT_NUMBERS.forEach(category => {
      drawSubTitle(category.category);
      category.items.forEach(item => {
        drawNumberBox(item.value, item.description);
      });
      y += 5;
    });

    // ============ SECTION 2: Chapter Key Facts ============
    addPage();
    drawSectionTitle('SECTION 2: Chapter Key Facts Summary', CONFIG.colors.success);
    y += 3;
    
    doc.setFontSize(CONFIG.fontSize.small);
    doc.setTextColor(...CONFIG.colors.lightText);
    doc.text('Essential points from each chapter for quick revision', CONFIG.margin, y);
    y += 10;

    if (typeof CHAPTERS !== 'undefined') {
      CHAPTERS.forEach((chapter, idx) => {
        checkPageBreak(30);
        
        // Chapter header
        doc.setFillColor(249, 250, 251);
        doc.rect(CONFIG.margin, y - 3, CONFIG.pageWidth - 2 * CONFIG.margin, 8, 'F');
        doc.setFontSize(CONFIG.fontSize.subTitle);
        doc.setTextColor(...CONFIG.colors.primary);
        doc.setFont('helvetica', 'bold');
        doc.text(`${idx + 1}. ${chapter.title}`, CONFIG.margin + 2, y + 2);
        doc.setFont('helvetica', 'normal');
        y += 10;
        
        // Key facts
        const facts = CHAPTER_KEY_FACTS[chapter.id] || [];
        facts.forEach(fact => {
          drawBullet(fact, 3);
        });
        
        y += 5;
      });
    }

    // ============ SECTION 3: Quiz Q&A ============
    addPage();
    drawSectionTitle('SECTION 3: Complete Quiz Questions & Answers', CONFIG.colors.primary);
    y += 3;
    
    doc.setFontSize(CONFIG.fontSize.small);
    doc.setTextColor(...CONFIG.colors.lightText);
    doc.text('All chapter quiz questions with correct answers marked ✓', CONFIG.margin, y);
    y += 10;

    if (typeof QUIZZES !== 'undefined' && typeof CHAPTERS !== 'undefined') {
      let totalQNum = 1;
      
      CHAPTERS.forEach((chapter, chIdx) => {
        const questions = QUIZZES[chapter.id] || [];
        if (questions.length === 0) return;
        
        checkPageBreak(20);
        
        // Chapter title for quiz section
        doc.setFillColor(...CONFIG.colors.primary);
        doc.rect(CONFIG.margin, y - 1, CONFIG.pageWidth - 2 * CONFIG.margin, 7, 'F');
        doc.setFontSize(CONFIG.fontSize.normal);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(`Chapter ${chIdx + 1}: ${chapter.title} (${questions.length} questions)`, CONFIG.margin + 3, y + 4);
        doc.setFont('helvetica', 'normal');
        y += 12;
        
        questions.forEach((q, qIdx) => {
          // Skip image-based questions in PDF (they won't display well)
          if (q.img) {
            drawQuizQuestion(totalQNum, q.q + ' [Image-based question - see app]', q.options, q.answer);
          } else {
            drawQuizQuestion(totalQNum, q.q, q.options, q.answer);
          }
          totalQNum++;
        });
        
        y += 5;
      });
    }

    // ============ Final Page: Quick Reference ============
    addPage();
    drawSectionTitle('QUICK REFERENCE CARD', CONFIG.colors.warning);
    y += 5;

    // Two-column layout for quick reference
    const colWidth = (CONFIG.pageWidth - 2 * CONFIG.margin - 10) / 2;
    const leftCol = CONFIG.margin;
    const rightCol = CONFIG.margin + colWidth + 10;
    let leftY = y;
    let rightY = y;

    // Left column - Stopping vs Parking
    doc.setFontSize(CONFIG.fontSize.subTitle);
    doc.setTextColor(...CONFIG.colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('Stopping vs Parking', leftCol, leftY);
    leftY += 7;
    doc.setFontSize(CONFIG.fontSize.small);
    doc.setTextColor(...CONFIG.colors.text);
    doc.setFont('helvetica', 'normal');
    const stopPark = [
      'STOPPING: Passenger on/off (any time)',
      'STOPPING: Loading ≤5 minutes',
      'STOPPING: Driver can move immediately',
      'PARKING: Waiting/loading >5 minutes',
      'PARKING: Driver leaves vehicle'
    ];
    stopPark.forEach(item => {
      doc.text('• ' + item, leftCol, leftY);
      leftY += 5;
    });

    // Left column - Police Signals
    leftY += 5;
    doc.setFontSize(CONFIG.fontSize.subTitle);
    doc.setTextColor(...CONFIG.colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('Police Hand Signals', leftCol, leftY);
    leftY += 7;
    doc.setFontSize(CONFIG.fontSize.small);
    doc.setTextColor(...CONFIG.colors.text);
    doc.setFont('helvetica', 'normal');
    const police = [
      'Front/Back of officer = RED (always)',
      'Arms horizontal + sides = GREEN',
      'Arms vertical + sides = YELLOW',
      'Police signals OVERRIDE lights'
    ];
    police.forEach(item => {
      doc.text('• ' + item, leftCol, leftY);
      leftY += 5;
    });

    // Right column - Priority Rules
    doc.setFontSize(CONFIG.fontSize.subTitle);
    doc.setTextColor(...CONFIG.colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('Intersection Priority', rightCol, rightY);
    rightY += 7;
    doc.setFontSize(CONFIG.fontSize.small);
    doc.setTextColor(...CONFIG.colors.text);
    doc.setFont('helvetica', 'normal');
    const priority = [
      '1. Priority road sign = always wins',
      '2. Centerline extends = that road wins',
      '3. No lines = wider road wins',
      '4. Traffic from LEFT has priority',
      '5. Straight/left > turning right'
    ];
    priority.forEach(item => {
      doc.text('• ' + item, rightCol, rightY);
      rightY += 5;
    });

    // Right column - License Coverage
    rightY += 5;
    doc.setFontSize(CONFIG.fontSize.subTitle);
    doc.setTextColor(...CONFIG.colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('Ordinary License Covers', rightCol, rightY);
    rightY += 7;
    doc.setFontSize(CONFIG.fontSize.small);
    doc.setTextColor(...CONFIG.colors.text);
    doc.setFont('helvetica', 'normal');
    const license = [
      '✓ Ordinary cars (<3.5t, <2000kg, <10 pax)',
      '✓ Small special vehicles',
      '✓ Mopeds (≤50cc)',
      '✗ Large trucks, buses',
      '✗ Motorcycles >50cc'
    ];
    license.forEach(item => {
      doc.text(item, rightCol, rightY);
      rightY += 5;
    });

    // Bottom tips
    y = Math.max(leftY, rightY) + 15;
    checkPageBreak(40);
    
    doc.setFillColor(254, 249, 195);
    doc.roundedRect(CONFIG.margin, y, CONFIG.pageWidth - 2 * CONFIG.margin, 30, 2, 2, 'F');
    y += 8;
    doc.setFontSize(CONFIG.fontSize.subTitle);
    doc.setTextColor(...CONFIG.colors.text);
    doc.setFont('helvetica', 'bold');
    doc.text('Final Exam Tips', CONFIG.pageWidth / 2, y, { align: 'center' });
    y += 7;
    doc.setFontSize(CONFIG.fontSize.small);
    doc.setFont('helvetica', 'normal');
    doc.text('• Read questions carefully - watch for "NOT", "ALWAYS", "NEVER"', CONFIG.pageWidth / 2, y, { align: 'center' });
    y += 5;
    doc.text('• Memorize exact distances and times - wrong numbers are common traps', CONFIG.pageWidth / 2, y, { align: 'center' });
    y += 5;
    doc.text('• 90% pass mark = max 5 wrong on Karimen, max 10 wrong on Honmen', CONFIG.pageWidth / 2, y, { align: 'center' });

    // Good luck message
    y += 15;
    doc.setFontSize(CONFIG.fontSize.sectionTitle);
    doc.setTextColor(...CONFIG.colors.success);
    doc.setFont('helvetica', 'bold');
    doc.text('Good luck with your exam! 頑張ってください！', CONFIG.pageWidth / 2, y, { align: 'center' });

    addPageNumber();

    // Save the PDF
    doc.save('Karimen-Honmen-Revision-Guide.pdf');
  }

  // Show loading state while generating PDF
  function downloadRevisionPDF() {
    const loadingOverlay = document.getElementById('examLoadingOverlay');
    if (loadingOverlay) {
      loadingOverlay.textContent = 'Generating PDF...';
      loadingOverlay.classList.remove('hidden');
    }

    // Use setTimeout to allow UI to update
    setTimeout(() => {
      try {
        generateRevisionPDF();
      } catch (error) {
        console.error('PDF generation failed:', error);
        alert('Failed to generate PDF. Please try again.');
      } finally {
        if (loadingOverlay) {
          loadingOverlay.classList.add('hidden');
          loadingOverlay.textContent = 'Loading exam…';
        }
      }
    }, 100);
  }

  // Initialize PDF download buttons
  function initPDFDownload() {
    const btnSidebar = document.getElementById('btnDownloadPDF');
    const btnHero = document.getElementById('btnDownloadPDFHero');

    if (btnSidebar) {
      btnSidebar.addEventListener('click', downloadRevisionPDF);
    }

    if (btnHero) {
      btnHero.addEventListener('click', downloadRevisionPDF);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPDFDownload);
  } else {
    initPDFDownload();
  }

  // Export for external use
  window.downloadRevisionPDF = downloadRevisionPDF;
})();
