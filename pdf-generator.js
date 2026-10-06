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

    // ============ DIAGRAM DRAWING FUNCTIONS ============
    
    function drawSpeedLimitDiagram() {
      checkPageBreak(75);
      const startX = CONFIG.margin;
      const barWidth = 25;
      const maxBarHeight = 50;
      const baseY = y + 60;
      
      doc.setFontSize(CONFIG.fontSize.subTitle);
      doc.setTextColor(...CONFIG.colors.primary);
      doc.setFont('helvetica', 'bold');
      doc.text('Speed Limits at a Glance', CONFIG.pageWidth / 2, y, { align: 'center' });
      y += 8;
      doc.setFont('helvetica', 'normal');
      
      const speeds = [
        { label: 'Car', value: 60, color: [59, 130, 246] },
        { label: 'Moped', value: 30, color: [234, 179, 8] },
        { label: 'Highway', value: 100, color: [34, 197, 94] },
        { label: 'Hwy Min', value: 50, color: [107, 114, 128] },
        { label: 'Cargo', value: 90, color: [168, 85, 247] },
        { label: 'Trailer', value: 80, color: [239, 68, 68] }
      ];
      
      const totalWidth = speeds.length * (barWidth + 8);
      let barX = (CONFIG.pageWidth - totalWidth) / 2;
      
      speeds.forEach(item => {
        const barHeight = (item.value / 100) * maxBarHeight;
        
        // Draw bar
        doc.setFillColor(...item.color);
        doc.rect(barX, baseY - barHeight, barWidth, barHeight, 'F');
        
        // Draw value on top
        doc.setFontSize(9);
        doc.setTextColor(...item.color);
        doc.setFont('helvetica', 'bold');
        doc.text(`${item.value}`, barX + barWidth/2, baseY - barHeight - 2, { align: 'center' });
        
        // Draw label below
        doc.setFontSize(7);
        doc.setTextColor(...CONFIG.colors.text);
        doc.setFont('helvetica', 'normal');
        doc.text(item.label, barX + barWidth/2, baseY + 5, { align: 'center' });
        
        barX += barWidth + 8;
      });
      
      // Unit label
      doc.setFontSize(8);
      doc.setTextColor(...CONFIG.colors.lightText);
      doc.text('km/h', CONFIG.pageWidth / 2, baseY + 12, { align: 'center' });
      
      y = baseY + 18;
    }

    function drawDistanceZonesDiagram() {
      checkPageBreak(85);
      const centerX = CONFIG.pageWidth / 2;
      const roadY = y + 45;
      
      doc.setFontSize(CONFIG.fontSize.subTitle);
      doc.setTextColor(...CONFIG.colors.primary);
      doc.setFont('helvetica', 'bold');
      doc.text('No Stopping/Parking Zones - Distance Rules', centerX, y, { align: 'center' });
      y += 10;
      
      // Draw road
      doc.setFillColor(180, 180, 180);
      doc.rect(CONFIG.margin + 10, roadY - 8, CONFIG.pageWidth - 2*CONFIG.margin - 20, 16, 'F');
      doc.setDrawColor(255, 255, 255);
      doc.setLineDashPattern([3, 3], 0);
      doc.line(CONFIG.margin + 10, roadY, CONFIG.pageWidth - CONFIG.margin - 10, roadY);
      doc.setLineDashPattern([], 0);
      
      // Intersection box
      doc.setFillColor(200, 200, 200);
      doc.rect(centerX - 15, roadY - 15, 30, 30, 'F');
      doc.setFontSize(7);
      doc.setTextColor(80, 80, 80);
      doc.text('Intersection', centerX, roadY + 2, { align: 'center' });
      
      // 5m zone (red)
      doc.setFillColor(254, 202, 202);
      doc.rect(centerX - 45, roadY - 12, 25, 10, 'F');
      doc.rect(centerX + 20, roadY - 12, 25, 10, 'F');
      doc.setFontSize(8);
      doc.setTextColor(...CONFIG.colors.danger);
      doc.setFont('helvetica', 'bold');
      doc.text('5m', centerX - 32, roadY - 5, { align: 'center' });
      doc.text('5m', centerX + 32, roadY - 5, { align: 'center' });
      
      // Legend
      const legendY = roadY + 25;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      
      // 5m items
      doc.setFillColor(254, 202, 202);
      doc.rect(CONFIG.margin + 5, legendY, 8, 5, 'F');
      doc.setTextColor(...CONFIG.colors.text);
      doc.text('5m: Intersections, Curves, Ped. paths', CONFIG.margin + 16, legendY + 4);
      
      // 10m items
      doc.setFillColor(254, 249, 195);
      doc.rect(CONFIG.margin + 5, legendY + 8, 8, 5, 'F');
      doc.text('10m: Railway crossings, Safety zones, Bus stops', CONFIG.margin + 16, legendY + 12);
      
      // Parking only items
      doc.setFillColor(219, 234, 254);
      doc.rect(CONFIG.margin + 5, legendY + 16, 8, 5, 'F');
      doc.text('1m/3m/5m: Fire alarms, Entrances, Construction (parking only)', CONFIG.margin + 16, legendY + 20);
      
      y = legendY + 28;
    }

    function drawPoliceSignalsDiagram() {
      checkPageBreak(90);
      const centerX = CONFIG.pageWidth / 2;
      
      doc.setFontSize(CONFIG.fontSize.subTitle);
      doc.setTextColor(...CONFIG.colors.primary);
      doc.setFont('helvetica', 'bold');
      doc.text('Police Hand Signals - Quick Reference', centerX, y, { align: 'center' });
      y += 12;
      
      // Two columns for the two positions
      const col1X = CONFIG.margin + 35;
      const col2X = CONFIG.pageWidth - CONFIG.margin - 35;
      const figureY = y + 25;
      
      // Arms Horizontal
      doc.setFontSize(10);
      doc.setTextColor(...CONFIG.colors.text);
      doc.setFont('helvetica', 'bold');
      doc.text('Arms Horizontal', col1X, y, { align: 'center' });
      
      // Draw stick figure with horizontal arms
      doc.setDrawColor(60, 60, 60);
      doc.setLineWidth(1.5);
      // Head
      doc.circle(col1X, figureY - 12, 5);
      // Body
      doc.line(col1X, figureY - 7, col1X, figureY + 8);
      // Arms horizontal
      doc.line(col1X - 15, figureY - 2, col1X + 15, figureY - 2);
      // Legs
      doc.line(col1X, figureY + 8, col1X - 8, figureY + 18);
      doc.line(col1X, figureY + 8, col1X + 8, figureY + 18);
      doc.setLineWidth(0.5);
      
      // Direction indicators for horizontal
      doc.setFontSize(8);
      // Front/Back = RED
      doc.setFillColor(...CONFIG.colors.danger);
      doc.circle(col1X, figureY - 25, 4, 'F');
      doc.circle(col1X, figureY + 28, 4, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('R', col1X, figureY - 23.5, { align: 'center' });
      doc.text('R', col1X, figureY + 29.5, { align: 'center' });
      
      // Sides = GREEN
      doc.setFillColor(...CONFIG.colors.success);
      doc.circle(col1X - 25, figureY - 2, 4, 'F');
      doc.circle(col1X + 25, figureY - 2, 4, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text('G', col1X - 25, figureY - 0.5, { align: 'center' });
      doc.text('G', col1X + 25, figureY - 0.5, { align: 'center' });
      
      // Arms Vertical
      doc.setTextColor(...CONFIG.colors.text);
      doc.text('Arms Vertical', col2X, y, { align: 'center' });
      
      // Draw stick figure with vertical arm
      doc.setDrawColor(60, 60, 60);
      doc.setLineWidth(1.5);
      // Head
      doc.circle(col2X, figureY - 12, 5);
      // Body
      doc.line(col2X, figureY - 7, col2X, figureY + 8);
      // One arm up, one down
      doc.line(col2X, figureY - 2, col2X, figureY - 20);
      doc.line(col2X, figureY - 2, col2X - 10, figureY + 5);
      // Legs
      doc.line(col2X, figureY + 8, col2X - 8, figureY + 18);
      doc.line(col2X, figureY + 8, col2X + 8, figureY + 18);
      doc.setLineWidth(0.5);
      
      // Direction indicators for vertical
      doc.setFontSize(8);
      // Front/Back = RED
      doc.setFillColor(...CONFIG.colors.danger);
      doc.circle(col2X, figureY - 32, 4, 'F');
      doc.circle(col2X, figureY + 28, 4, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text('R', col2X, figureY - 30.5, { align: 'center' });
      doc.text('R', col2X, figureY + 29.5, { align: 'center' });
      
      // Sides = YELLOW
      doc.setFillColor(...CONFIG.colors.warning);
      doc.circle(col2X - 20, figureY - 2, 4, 'F');
      doc.circle(col2X + 20, figureY - 2, 4, 'F');
      doc.setTextColor(80, 80, 80);
      doc.text('Y', col2X - 20, figureY - 0.5, { align: 'center' });
      doc.text('Y', col2X + 20, figureY - 0.5, { align: 'center' });
      
      // Legend
      y = figureY + 38;
      doc.setFontSize(9);
      doc.setTextColor(...CONFIG.colors.text);
      doc.setFont('helvetica', 'normal');
      
      const legendStartX = CONFIG.margin + 20;
      doc.setFillColor(...CONFIG.colors.danger);
      doc.circle(legendStartX, y, 3, 'F');
      doc.text('R = RED (Stop)', legendStartX + 6, y + 1);
      
      doc.setFillColor(...CONFIG.colors.success);
      doc.circle(legendStartX + 50, y, 3, 'F');
      doc.text('G = GREEN (Go)', legendStartX + 56, y + 1);
      
      doc.setFillColor(...CONFIG.colors.warning);
      doc.circle(legendStartX + 105, y, 3, 'F');
      doc.text('Y = YELLOW (Caution)', legendStartX + 111, y + 1);
      
      y += 8;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...CONFIG.colors.danger);
      doc.text('KEY: Front/Back of officer = ALWAYS RED!', centerX, y, { align: 'center' });
      
      y += 10;
    }

    function drawStoppingVsParkingDiagram() {
      checkPageBreak(70);
      const centerX = CONFIG.pageWidth / 2;
      const boxWidth = 80;
      const boxHeight = 50;
      const gap = 10;
      
      doc.setFontSize(CONFIG.fontSize.subTitle);
      doc.setTextColor(...CONFIG.colors.primary);
      doc.setFont('helvetica', 'bold');
      doc.text('Stopping vs Parking - The 5-Minute Rule', centerX, y, { align: 'center' });
      y += 10;
      
      // Stopping box (green)
      const stopX = centerX - boxWidth - gap/2;
      doc.setFillColor(220, 252, 231);
      doc.roundedRect(stopX, y, boxWidth, boxHeight, 3, 3, 'F');
      doc.setDrawColor(...CONFIG.colors.success);
      doc.roundedRect(stopX, y, boxWidth, boxHeight, 3, 3, 'S');
      
      doc.setFontSize(11);
      doc.setTextColor(...CONFIG.colors.success);
      doc.setFont('helvetica', 'bold');
      doc.text('STOPPING', stopX + boxWidth/2, y + 10, { align: 'center' });
      
      doc.setFontSize(8);
      doc.setTextColor(...CONFIG.colors.text);
      doc.setFont('helvetica', 'normal');
      const stopItems = ['Passenger on/off (ANY time)', 'Loading ≤ 5 min', 'Driver can move NOW'];
      stopItems.forEach((item, i) => {
        doc.text('• ' + item, stopX + 5, y + 20 + i*8);
      });
      
      // Parking box (red)
      const parkX = centerX + gap/2;
      doc.setFillColor(254, 226, 226);
      doc.roundedRect(parkX, y, boxWidth, boxHeight, 3, 3, 'F');
      doc.setDrawColor(...CONFIG.colors.danger);
      doc.roundedRect(parkX, y, boxWidth, boxHeight, 3, 3, 'S');
      
      doc.setFontSize(11);
      doc.setTextColor(...CONFIG.colors.danger);
      doc.setFont('helvetica', 'bold');
      doc.text('PARKING', parkX + boxWidth/2, y + 10, { align: 'center' });
      
      doc.setFontSize(8);
      doc.setTextColor(...CONFIG.colors.text);
      doc.setFont('helvetica', 'normal');
      const parkItems = ['Waiting/loading > 5 min', 'Driver leaves vehicle', 'Cannot move immediately'];
      parkItems.forEach((item, i) => {
        doc.text('• ' + item, parkX + 5, y + 20 + i*8);
      });
      
      // 5 minute divider
      y += boxHeight + 5;
      doc.setFillColor(...CONFIG.colors.warning);
      doc.roundedRect(centerX - 25, y, 50, 12, 2, 2, 'F');
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.setFont('helvetica', 'bold');
      doc.text('5 MIN', centerX, y + 8, { align: 'center' });
      
      y += 18;
    }

    function drawPriorityDiagram() {
      checkPageBreak(75);
      const centerX = CONFIG.pageWidth / 2;
      
      doc.setFontSize(CONFIG.fontSize.subTitle);
      doc.setTextColor(...CONFIG.colors.primary);
      doc.setFont('helvetica', 'bold');
      doc.text('Intersection Priority Rules', centerX, y, { align: 'center' });
      y += 12;
      
      // Priority hierarchy as numbered boxes
      const boxWidth = 160;
      const boxHeight = 12;
      const startX = (CONFIG.pageWidth - boxWidth) / 2;
      
      const priorities = [
        { num: '1', text: 'Priority Road Sign', color: [34, 197, 94] },
        { num: '2', text: 'Centerline extends into intersection', color: [59, 130, 246] },
        { num: '3', text: 'Wider road has priority', color: [168, 85, 247] },
        { num: '4', text: 'Traffic from LEFT goes first', color: [234, 179, 8] },
        { num: '5', text: 'Straight/Left > Turning Right', color: [239, 68, 68] }
      ];
      
      priorities.forEach((item, i) => {
        // Number circle
        doc.setFillColor(...item.color);
        doc.circle(startX + 8, y + 6, 6, 'F');
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(item.num, startX + 8, y + 8, { align: 'center' });
        
        // Text box
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(startX + 18, y, boxWidth - 18, boxHeight, 2, 2, 'F');
        doc.setFontSize(9);
        doc.setTextColor(...CONFIG.colors.text);
        doc.setFont('helvetica', 'normal');
        doc.text(item.text, startX + 22, y + 8);
        
        // Arrow down (except last)
        if (i < priorities.length - 1) {
          doc.setTextColor(...CONFIG.colors.lightText);
          doc.text('↓', startX + 8, y + boxHeight + 4, { align: 'center' });
        }
        
        y += boxHeight + 6;
      });
      
      y += 5;
    }

    function drawCargoLimitsDiagram() {
      checkPageBreak(65);
      const centerX = CONFIG.pageWidth / 2;
      
      doc.setFontSize(CONFIG.fontSize.subTitle);
      doc.setTextColor(...CONFIG.colors.primary);
      doc.setFont('helvetica', 'bold');
      doc.text('Cargo Limits - Visual Guide', centerX, y, { align: 'center' });
      y += 12;
      
      // Car diagram
      const carX = CONFIG.margin + 40;
      const carY = y + 15;
      
      // Simple car shape
      doc.setFillColor(200, 200, 200);
      doc.roundedRect(carX, carY, 40, 15, 2, 2, 'F');
      doc.roundedRect(carX + 8, carY - 8, 24, 10, 2, 2, 'F');
      
      // Dimension arrows
      doc.setDrawColor(...CONFIG.colors.primary);
      doc.setFontSize(7);
      doc.setTextColor(...CONFIG.colors.primary);
      
      // Length arrow (120%)
      doc.line(carX - 5, carY + 20, carX + 45, carY + 20);
      doc.text('120% length', carX + 20, carY + 25, { align: 'center' });
      
      // Width arrow (120%)
      doc.line(carX - 10, carY - 5, carX - 10, carY + 18);
      doc.text('120%', carX - 15, carY + 5, { align: 'right' });
      
      // Height indicator
      doc.setTextColor(...CONFIG.colors.danger);
      doc.text('Max 3.8m', carX + 50, carY - 5);
      doc.text('from ground', carX + 50, carY);
      
      // Motorcycle diagram
      const bikeX = CONFIG.pageWidth - CONFIG.margin - 60;
      const bikeY = carY;
      
      // Simple bike shape
      doc.setFillColor(200, 200, 200);
      doc.circle(bikeX, bikeY + 10, 6);
      doc.circle(bikeX + 25, bikeY + 10, 6);
      doc.rect(bikeX + 5, bikeY + 2, 15, 8, 'F');
      
      // Dimensions
      doc.setTextColor(...CONFIG.colors.primary);
      doc.text('+30cm', bikeX + 30, bikeY + 5);
      doc.text('+15cm each side', bikeX + 5, bikeY + 25, { align: 'center' });
      doc.setTextColor(...CONFIG.colors.danger);
      doc.text('Max 2m height', bikeX + 5, bikeY - 8, { align: 'center' });
      
      y = carY + 35;
      
      // Weight limits
      doc.setFontSize(8);
      doc.setTextColor(...CONFIG.colors.text);
      doc.setFont('helvetica', 'normal');
      doc.text('Motorcycle weight: ≤50cc = 30kg max | >50cc = 60kg max', centerX, y, { align: 'center' });
      
      y += 10;
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
      '1. Visual Memory Aids (Diagrams)',
      '2. Important Numbers to Remember',
      '3. Chapter Key Facts Summary',
      '4. Complete Quiz Q&A with Answers'
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

    // ============ SECTION 1: Visual Memory Aids ============
    addPage();
    drawSectionTitle('SECTION 1: Visual Memory Aids', CONFIG.colors.primary);
    y += 3;
    
    doc.setFontSize(CONFIG.fontSize.small);
    doc.setTextColor(...CONFIG.colors.lightText);
    doc.text('Visual diagrams to help you remember key concepts quickly', CONFIG.margin, y);
    y += 12;

    // Speed limits diagram
    drawSpeedLimitDiagram();
    y += 8;
    
    // Stopping vs Parking diagram
    drawStoppingVsParkingDiagram();
    
    // New page for more diagrams
    addPage();
    drawSectionTitle('SECTION 1: Visual Memory Aids (continued)', CONFIG.colors.primary);
    y += 8;
    
    // Police signals diagram
    drawPoliceSignalsDiagram();
    y += 5;
    
    // Priority diagram
    drawPriorityDiagram();
    
    // New page for distance and cargo diagrams
    addPage();
    drawSectionTitle('SECTION 1: Visual Memory Aids (continued)', CONFIG.colors.primary);
    y += 8;
    
    // Distance zones diagram
    drawDistanceZonesDiagram();
    y += 8;
    
    // Cargo limits diagram
    drawCargoLimitsDiagram();

    // ============ SECTION 2: Important Numbers ============
    addPage();
    drawSectionTitle('SECTION 2: Important Numbers to Remember', CONFIG.colors.danger);
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

    // ============ SECTION 3: Chapter Key Facts ============
    addPage();
    drawSectionTitle('SECTION 3: Chapter Key Facts Summary', CONFIG.colors.success);
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
    drawSectionTitle('SECTION 4: Complete Quiz Questions & Answers', CONFIG.colors.primary);
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
