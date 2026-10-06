const CHAPTERS = [
  {
    id: "traffic-signs",
    icon: "traffic-cone",
    title: "Types of Traffic Signs",
    summary: "4 main categories of Japanese road signs",
    content: `
      <p>There are <strong>4 main types</strong> of road traffic signs in Japan:</p>
      <div class="card-grid">
        <div class="info-card red"><h4>Prohibition Signs</h4><p>Regulations — what you must NOT do (no entry, no parking, speed limits, etc.)</p></div>
        <div class="info-card blue"><h4>Guide Signs</h4><p>Information — priority roads, pedestrian crossings, stop lines, safety zones</p></div>
        <div class="info-card yellow"><h4>Warning Signs</h4><p>Hazards ahead — curves, intersections, slippery roads, school zones</p></div>
        <div class="info-card green"><h4>Instruction Signs</h4><p>Directions, distances, highway numbers, service areas</p></div>
      </div>
      <h3>Key Prohibition Signs to Know</h3>
      <ul class="check-list">
        <li><strong>No Overtaking by Crossing Right Side</strong> — overtaking without crossing to the right is still allowed</li>
        <li><strong>No Parking or Stopping</strong> — both prohibited (numbers show restricted hours)</li>
        <li><strong>No Parking</strong> — stopping briefly is allowed</li>
        <li><strong>Stop</strong> — must stop before the stop line or intersection</li>
        <li><strong>Maximum Speed</strong> — motorized bicycles follow legal limit if sign exceeds it</li>
        <li><strong>Sound Horn / Horn Use Zone</strong> — you must honk at these locations</li>
        <li><strong>Motor Vehicles Only</strong> — no pedestrians, mopeds, or light vehicles</li>
      </ul>
      <h3>Key Guide & Warning Signs</h3>
      <ul class="check-list">
        <li><strong>Priority Road</strong> — your road has right of way at intersections</li>
        <li><strong>Safety Zone</strong> — pedestrians protected; vehicles must not pass through</li>
        <li><strong>Center Line</strong> — marks center of road</li>
        <li><strong>Stop Line</strong> — where vehicles must stop</li>
      </ul>
      <h3>Special Vehicle Marks</h3>
      <ul class="check-list">
        <li><strong>Novice Driver</strong> — within 1 year of license; others must protect them</li>
        <li><strong>Provisional License</strong> — must be displayed during road practice</li>
        <li><strong>Wheel Clamp Zone</strong> — illegal parking may get wheel clamped</li>
      </ul>
      <div class="tip-box">💡 Exam tip: Know the difference between prohibition (regulatory), guide, warning, and instruction signs. Auxiliary signs add time, distance, or vehicle-type details.</div>
      <!--TRAFFIC_SIGNS_GALLERY-->
    `
  },
  {
    id: "ordinary-license",
    icon: "car",
    title: "Types of Vehicles Allowed to Drive",
    summary: "What an ordinary (普通) license covers",
    content: `
      <p>An <strong>ordinary driver's license (普通免許)</strong> allows you to drive:</p>
      <div class="spec-table">
        <div class="spec-row"><span class="spec-label">Ordinary car</span><span>Gross weight under 3.5 tons, max load under 2,000 kg, under 10 passengers</span></div>
        <div class="spec-row"><span class="spec-label">Small special vehicle (小型特殊)</span><span>Small tractors, street cleaning vehicles, etc.</span></div>
        <div class="spec-row"><span class="spec-label">Small motorcycle / moped (原付)</span><span>Engine displacement of 50cc or less</span></div>
      </div>
      <div class="tip-box">💡 Ordinary license does NOT cover large trucks, buses, or motorcycles over 50cc (those need separate licenses).</div>
    `
  },
  {
    id: "speeding",
    icon: "gauge",
    title: "Legal Speed Limits",
    summary: "Default limits when no signs are posted",
    content: `
      <p>On roads <strong>without speed limit signs</strong>, you must not exceed the legal speed limit.</p>
      <div class="speed-cards">
        <div class="speed-card"><div class="speed-num">60</div><div class="speed-unit">km/h</div><div class="speed-label">Cars</div></div>
        <div class="speed-card"><div class="speed-num">30</div><div class="speed-unit">km/h</div><div class="speed-label">Motorized bicycles (原付)</div></div>
      </div>
      <h3>When Towing Another Vehicle</h3>
      <table class="data-table">
        <thead><tr><th>Situation</th><th>Limit</th></tr></thead>
        <tbody>
          <tr><td>Towing vehicle ≤2,000 kg AND towing vehicle weight ≥3× towed vehicle</td><td><strong>40 km/h</strong></td></tr>
          <tr><td>Towed vehicle >2,000 kg OR towing vehicle <3× towed weight</td><td><strong>30 km/h</strong></td></tr>
          <tr><td>Towing with motorcycle/moped (125cc or less engine on trailer)</td><td><strong>25 km/h</strong></td></tr>
        </tbody>
      </table>
    `
  },
  {
    id: "highway-speed-limit",
    icon: "route",
    title: "Legal Speed Limits on Highways",
    summary: "Max and min speeds by vehicle type",
    content: `
      <p>Legal speed limits for different vehicle types on <strong>national highways</strong>:</p>
      <table class="data-table">
        <thead><tr><th>Vehicle Type</th><th>Max Speed</th><th>Min Speed</th></tr></thead>
        <tbody>
          <tr><td>Large/medium passenger vehicles</td><td>100 km/h</td><td>50 km/h</td></tr>
          <tr><td>Medium cargo (under 8 tons)</td><td>100 km/h</td><td>50 km/h</td></tr>
          <tr><td>Standard car (no trailer/3-wheel)</td><td>100 km/h</td><td>50 km/h</td></tr>
          <tr><td>Large/ordinary motorcycle</td><td>100 km/h</td><td>50 km/h</td></tr>
          <tr><td>Large cargo / medium cargo (8t+)</td><td>90 km/h (2024)</td><td>50 km/h</td></tr>
          <tr><td>Ordinary 3-wheel / trailer / large special</td><td>80 km/h</td><td>50 km/h</td></tr>
        </tbody>
      </table>
      <div class="tip-box">💡 Minimum speed on highways is <strong>50 km/h</strong> for all listed vehicle types.</div>
    `
  },
  {
    id: "no-parking",
    icon: "ban",
    title: "No Parking or Stopping Zones",
    summary: "Where you cannot stop or park",
    content: `
      <h3>Both Stopping AND Parking Prohibited</h3>
      <ul class="check-list">
        <li>Areas with no-parking or no-stopping signs/markings</li>
        <li>Inside a racetrack</li>
        <li>Near crest of hill or steep slope</li>
        <li>In tunnels (regardless of lanes)</li>
        <li>At intersections — within <strong>5 meters</strong> from edges</li>
        <li>Within <strong>5 meters</strong> of a road curve</li>
        <li>On pedestrian/bicycle paths — within <strong>5 meters</strong></li>
        <li>At railway crossings — within <strong>10 meters</strong></li>
        <li>Left side of safety zone — within <strong>10 meters</strong> before and after</li>
        <li>Within <strong>10 meters</strong> of bus/tram stop (during operating hours)</li>
      </ul>
      <h3>Parking Prohibited (Temporary Stopping OK)</h3>
      <ul class="check-list">
        <li>Within <strong>1 meter</strong> of a fire alarm</li>
        <li>Within <strong>3 meters</strong> of dedicated vehicle entrance/exit</li>
        <li>Within <strong>5 meters</strong> of construction zone boundary</li>
        <li>Within <strong>5 meters</strong> of fire-fighting equipment or hydrant entrances</li>
        <li>Within <strong>5 meters</strong> of fire hydrant/water intake signs</li>
      </ul>
      <div class="tip-box">⚠️ Exams often use wrong distances (e.g., 5m instead of 3m). Memorize exact numbers!</div>
    `
  },
  {
    id: "parking-rules",
    icon: "circle-parking",
    title: "Parking & Stopping on the Roadside",
    summary: "Where to position your vehicle",
    content: `
      <ul class="check-list">
        <li><strong>No sidewalk, no roadside strip:</strong> park/stop as close as possible to the <em>left edge</em> of the road</li>
        <li><strong>Roadside strip ≤ 0.75 m:</strong> park close to the lane edge</li>
        <li><strong>Roadside strip ≥ 0.75 m:</strong> may park in strip but leave at least 0.75 m for pedestrians</li>
      </ul>
      <h3>Maximum Parking Time (even without "No Parking" signs)</h3>
      <div class="time-cards">
        <div class="time-card"><span class="time-period">Daytime 07:00–19:00</span><span class="time-limit">Max 12 hours</span></div>
        <div class="time-card"><span class="time-period">Nighttime 19:00–07:00</span><span class="time-limit">Max 8 hours</span></div>
      </div>
      <p>Violations may result in fines, license points, or towing — even without "No Parking" signs.</p>
    `
  },
  {
    id: "parking-vs-stopping",
    icon: "timer",
    title: "Parking vs Stopping",
    summary: "The critical 5-minute rule",
    content: `
      <div class="compare-grid">
        <div class="compare-card stop">
          <h3>🛑 Stopping (停車)</h3>
          <ul>
            <li>Passengers getting on/off — always stopping regardless of time</li>
            <li>Loading/unloading luggage — <strong>under 5 minutes</strong></li>
            <li>Driver can still drive immediately</li>
          </ul>
        </div>
        <div class="compare-card park">
          <h3>🅿️ Parking (駐車)</h3>
          <ul>
            <li>Waiting for passengers/goods — <strong>more than 5 minutes</strong></li>
            <li>Driver leaves vehicle and cannot drive immediately</li>
          </ul>
        </div>
      </div>
      <div class="tip-box">💡 The 5-minute threshold is the key exam concept. Passenger pickup/dropoff is ALWAYS stopping, never parking.</div>
    `
  },
  {
    id: "safety-zone",
    icon: "shield",
    title: "What is a Safety Zone?",
    summary: "Pedestrian protection areas",
    content: `
      <p>A <strong>safety zone (安全地帯)</strong> is a facility, sign, or marking (like an island) to protect pedestrians crossing the road or boarding/alighting trams.</p>
      <!--CHAPTER_IMAGES-->
      <h3>When Passing Through</h3>
      <ul class="check-list">
        <li><strong>If pedestrians are present:</strong> drive slowly</li>
        <li><strong>If no pedestrians:</strong> you may pass</li>
      </ul>
      <p>Remember: parking/stopping is prohibited within <strong>10 meters</strong> on the left side of a safety zone.</p>
    `
  },
  {
    id: "child-counting",
    icon: "baby",
    title: "How to Count People",
    summary: "Child passenger equivalence rule",
    content: `
      <div class="highlight-rule">
        <p>Children <strong>under 12 years old</strong> in the car:</p>
        <div class="equation">3 children = 2 adults</div>
      </div>
      <p>This rule is used when calculating passenger capacity limits for vehicles.</p>
    `
  },
  {
    id: "double-overtaking",
    icon: "zap",
    title: "Double Overtaking",
    summary: "When overtaking becomes illegal",
    content: `
      <h3>❌ IS Double Overtaking (Violation)</h3>
      <p>When the vehicle in front is <strong>overtaking another vehicle</strong> and you overtake both at the same time.</p>
      <h3>✅ NOT Double Overtaking</h3>
      <p>When the vehicle in front is <strong>overtaking a motorcycle or bicycle</strong> — overtaking both is allowed.</p>
      <div class="tip-box">⚠️ "Vehicle in front" includes bicycles, motorcycles, and light vehicles that are overtaking. Be careful!</div>
    `
  },
  {
    id: "size-weight",
    icon: "package",
    title: "Cargo Size & Weight Limits",
    summary: "How much you can carry",
    content: `
      <h3>🚗 Car Limits</h3>
      <ul class="check-list">
        <li><strong>Length:</strong> ≤ 120% of vehicle length</li>
        <li><strong>Width:</strong> ≤ 120% of vehicle width</li>
        <li><strong>Height:</strong> ≤ 3.8 m from ground</li>
        <li><strong>Overhang:</strong> front/rear/sides ≤ 10% of vehicle length/width</li>
      </ul>
      <h3>🏍️ Motorcycle Limits</h3>
      <ul class="check-list">
        <li><strong>Length:</strong> ≤ 30 cm beyond carrier/seat</li>
        <li><strong>Width:</strong> ≤ 15 cm each side (30 cm total)</li>
        <li><strong>Height:</strong> ≤ 2 m from ground</li>
        <li><strong>Weight:</strong> Under 50cc → 30 kg | Over 50cc → 60 kg</li>
      </ul>
      <p>Exceeding limits requires a <strong>special cargo permit</strong> from traffic police.</p>
    `
  },
  {
    id: "horn-usage",
    icon: "megaphone",
    title: "Using the Vehicle Horn",
    summary: "When you must and must not honk",
    content: `
      <p>Do <strong>not</strong> use the horn unnecessarily — only in unavoidable danger or where signs require it.</p>
      <h3>"Honk" Sign</h3>
      <!--CHAPTER_IMAGES:0-->
      <p>You <strong>must honk</strong> when you see this sign at specific points.</p>
      <h3>Horn-Required Area</h3>
      <!--CHAPTER_IMAGES:1-->
      <p>In designated horn areas, honk when passing:</p>
      <ul class="check-list">
        <li>Intersection where you cannot see left or right</li>
        <li>Curve where you cannot see ahead</li>
        <li>Hilltop where you cannot see the other side</li>
      </ul>
    `
  },
  {
    id: "no-space-parking",
    icon: "ruler",
    title: "Exceptions to Parking Rules",
    summary: "The 3.5-meter rule and exceptions",
    content: `
      <p>You may <strong>not park</strong> where space to the right of the vehicle is less than <strong>3.5 meters</strong>.</p>
      <!--CHAPTER_IMAGES-->
      <p>When parking is designated by a sign, you may not park outside the designated area.</p>
      <h3>Exceptions (Temporary Parking Allowed)</h3>
      <ul class="check-list">
        <li>Loading/unloading luggage (driver must remain to move immediately)</li>
        <li>Emergency medical care for injured/ill person</li>
      </ul>
    `
  },
  {
    id: "storage-space",
    icon: "home",
    title: "Ensuring Storage Space",
    summary: "2 km parking requirement",
    content: `
      <div class="highlight-rule">
        <p>Vehicle owners must ensure a place to store the vehicle (parking lot) within <strong>2 km</strong> of where the vehicle is regularly used (e.g., home address).</p>
      </div>
      <p><em>This requirement does not apply to motorcycles.</em></p>
      <div class="tip-box">⚠️ Exams may offer wrong options like 3 km or 5 km. The answer is always <strong>2 km</strong>.</div>
    `
  },
  {
    id: "hydroplaning",
    icon: "droplets",
    title: "Hydroplaning",
    summary: "Wet road danger and prevention",
    content: `
      <p><strong>Hydroplaning</strong> occurs at high speed on waterlogged roads — tires lift off the surface, reducing steering and braking.</p>
      <h3>What to Do</h3>
      <ul class="check-list">
        <li>❌ Do NOT sharply turn the wheel or brake abruptly</li>
        <li>✅ Hold steering wheel firmly with both hands</li>
        <li>✅ Use engine braking to slow gradually</li>
      </ul>
      <h3>Prevention</h3>
      <ul class="check-list">
        <li>Check tire wear regularly (worn tires increase risk)</li>
        <li>Increase tire pressure before highway driving</li>
      </ul>
    `
  },
  {
    id: "license-vehicle",
    icon: "id-card",
    title: "Vehicle Types by License",
    summary: "What each license category allows",
    content: `
      <p>Each license type permits only specific vehicles. Driving unauthorized vehicles is illegal.</p>
      <table class="data-table compact">
        <thead><tr><th>License</th><th>Car</th><th>Large MC</th><th>Ord. MC</th><th>Moped</th><th>Small Special</th></tr></thead>
        <tbody>
          <tr><td>Large Vehicle</td><td>〇</td><td>—</td><td>—</td><td>〇</td><td>〇</td></tr>
          <tr><td>Medium Vehicle</td><td>〇</td><td>—</td><td>—</td><td>〇</td><td>〇</td></tr>
          <tr><td>Ordinary Vehicle</td><td>〇</td><td>—</td><td>—</td><td>〇</td><td>〇</td></tr>
          <tr><td>Large Motorcycle (125cc+)</td><td>—</td><td>〇</td><td>〇</td><td>〇</td><td>〇</td></tr>
          <tr><td>Ordinary MC (50–125cc)</td><td>—</td><td>—</td><td>〇</td><td>〇</td><td>〇</td></tr>
          <tr><td>Moped (under 50cc)</td><td>—</td><td>—</td><td>—</td><td>〇</td><td>—</td></tr>
        </tbody>
      </table>
      <p><strong>Towing license:</strong> Required for towing heavy vehicles with large/medium specialized vehicles. Not needed if towed vehicle ≤750 kg or towing accident vehicle with rope.</p>
    `
  },
  {
    id: "periodic-check",
    icon: "wrench",
    title: "Periodic Vehicle Inspections",
    summary: "Inspection intervals by vehicle type",
    content: `
      <table class="data-table">
        <thead><tr><th>Cycle</th><th>Vehicle Types</th></tr></thead>
        <tbody>
          <tr><td><strong>Every 3 months</strong></td><td>Commercial taxis/trucks/buses; large/medium private vehicles; trucks over 8 tons; rented large/medium vehicles</td></tr>
          <tr><td><strong>Every 6 months</strong></td><td>Private trucks under 8 tons; rented standard vehicles; large specialized vehicles; child transport vehicles</td></tr>
          <tr><td><strong>Every 12 months</strong></td><td>Standard private cars/trucks under 660cc; large private motorcycles; motorcycles over 125cc</td></tr>
        </tbody>
      </table>
    `
  },
  {
    id: "daily-check",
    icon: "clipboard-check",
    title: "Daily Vehicle Checks",
    summary: "Pre-operation inspection requirements",
    content: `
      <p>Daily inspection verifies brakes, engine, tire pressure, etc. Timing depends on usage, but these <strong>must be inspected daily before operation</strong>:</p>
      <ul class="check-list">
        <li>Commercial vehicles (except under 660cc and large/standard motorcycles)</li>
        <li>Rented vehicles (rental cars)</li>
        <li>Private vehicles carrying 11+ passengers</li>
        <li>Cargo vehicles (except under 660cc)</li>
        <li>Child transport vehicles (except under 660cc)</li>
        <li>Large specialized vehicles</li>
        <li>Specialized vehicles (water tankers, etc.)</li>
      </ul>
    `
  },
  {
    id: "stopping-distance",
    icon: "octagon",
    title: "Stopping Distance",
    summary: "Reaction + braking distance",
    content: `
      <div class="equation big">Reaction Distance + Braking Distance = Stopping Distance</div>
      <table class="data-table">
        <thead><tr><th>Term</th><th>Definition</th></tr></thead>
        <tbody>
          <tr><td><strong>Reaction Distance</strong></td><td>Distance traveled from recognizing hazard to brakes taking effect</td></tr>
          <tr><td><strong>Braking Distance</strong></td><td>Distance from brakes engaging to complete stop</td></tr>
          <tr><td><strong>Stopping Distance</strong></td><td>Total of reaction + braking distance</td></tr>
        </tbody>
      </table>
      <ul class="check-list">
        <li>Fatigue → longer reaction distance</li>
        <li>Slippery road or worn tires → longer braking distance</li>
      </ul>
    `
  },
  {
    id: "priority-intersections",
    icon: "git-merge",
    title: "Priority at Intersections",
    summary: "Right-of-way without traffic lights",
    content: `
      <h3>1. Priority Road Sign</h3>
      <!--CHAPTER_IMAGES:0-->
      <p>Vehicles on the road with the priority sign always have right of way.</p>
      <h3>2. Centerline Extending into Intersection</h3>
      <!--CHAPTER_IMAGES:1-->
      <p>If centerline extends into intersection, vehicles on that road have priority — regardless of turning direction.</p>
      <h3>3. Road Width</h3>
      <p>When neither road has dividing lines, the <strong>wider road</strong> has priority.</p>
      <h3>4. Direction of Travel</h3>
      <!--CHAPTER_IMAGES:2-->
      <ul class="check-list">
        <li>Traffic from the <strong>left</strong> has priority at intersections</li>
        <li>Going <strong>straight or left</strong> takes priority over turning <strong>right</strong></li>
      </ul>
    `
  },
  {
    id: "police-signals",
    icon: "badge",
    title: "Police Hand Signals",
    summary: "Override traffic lights",
    content: `
      <p>Police hand signals override active traffic lights during accidents, construction, or power outages. You <strong>must obey the officer</strong> even if traffic lights are working.</p>
      <div class="tip-box">💡 Exam trap: Traffic facing the officer's <strong>front or back</strong> is always <strong>RED</strong> — whether arms are horizontal or vertical.</div>
      <h3>Arms Horizontal ↔️</h3>
      <!--CHAPTER_IMAGES:0-->
      <ul class="check-list">
        <li>Toward officer's <strong>front or back</strong> → <span class="badge red">Red light</span> (stop)</li>
        <li>Toward officer's <strong>sides</strong> (parallel to arms) → <span class="badge green">Green light</span> (go)</li>
      </ul>
      <!--CHAPTER_IMAGES:1-->
      <h3>Arms Vertical ⬆️</h3>
      <!--CHAPTER_IMAGES:2-->
      <ul class="check-list">
        <li>Toward officer's <strong>front or back</strong> → <span class="badge red">Red light</span> (stop)</li>
        <li>Toward officer's <strong>sides</strong> (parallel to previous arm direction) → <span class="badge yellow">Yellow light</span> (caution)</li>
      </ul>
      <h3>At Night</h3>
      <p>Officers use a <strong>red lighted baton</strong> with the same arm positions — the rules do not change.</p>
      <div class="compare-grid">
        <div class="compare-card">
          <h3>Quick Reference</h3>
          <table class="data-table compact">
            <thead><tr><th>Your direction</th><th>Arms ↔️</th><th>Arms ⬆️</th></tr></thead>
            <tbody>
              <tr><td>Front / back of officer</td><td><span class="badge red">Red</span></td><td><span class="badge red">Red</span></td></tr>
              <tr><td>Sides (parallel)</td><td><span class="badge green">Green</span></td><td><span class="badge yellow">Yellow</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <p class="image-credit">Diagrams: <a href="https://www.police.pref.saga.jp/koutsu/jikoboshi/_2358.html" target="_blank" rel="noopener">Saga Prefectural Police</a>, <a href="http://www.police.pref.ehime.jp/kotsukikaku/teshingo/newpage1.html" target="_blank" rel="noopener">Ehime Prefectural Police</a></p>
    `
  }
];

const QUIZZES = {
  "traffic-signs": [
    { q: "How many main types of traffic signs are there in Japan?", options: ["2", "3", "4", "5"], answer: 2, explanation: "Japan has 4 main types: Prohibition signs (red, regulations), Guide signs (blue, information), Warning signs (yellow, hazards), and Instruction signs (green, directions)." },
    { q: "A 'No Overtaking by Crossing Right Side' sign means:", options: ["No overtaking at all", "Overtaking without crossing right is allowed", "Only trucks cannot overtake", "Overtaking is allowed on highways"], answer: 1, explanation: "This sign only prohibits overtaking by crossing to the right side of the road. You can still overtake if you stay on your side (e.g., passing a slow vehicle in a wide lane)." },
    { q: "Who must display a novice driver sign?", options: ["Drivers over 65", "Drivers within 1 year of license", "Provisional license holders", "All new residents"], answer: 1, explanation: "Drivers who obtained their license within the past year must display the novice driver (wakaba) mark. Other drivers must protect them by not cutting in front or tailgating." },
    { q: "A Safety Zone sign indicates:", options: ["No vehicles allowed ever", "Pedestrian protection area", "School zone ahead", "Construction zone"], answer: 1, explanation: "Safety zones protect pedestrians crossing roads or boarding/alighting trams. Vehicles must slow down when pedestrians are present and must not park within 10m on the left side." },
    { q: "'No Parking' sign vs 'No Parking or Stopping' sign — which allows brief stopping?", options: ["Both prohibit stopping", "No Parking only", "No Parking or Stopping only", "Neither on highways"], answer: 1, explanation: "'No Parking' allows brief stopping (under 5 minutes for loading/unloading or passenger pickup). 'No Parking or Stopping' prohibits both completely." },
    { q: "'Motor Vehicles Only' sign means which are NOT allowed?", options: ["Cars and trucks", "Pedestrians and mopeds", "Buses only", "Motorcycles only"], answer: 1, explanation: "This sign means only motor vehicles (cars, trucks, buses, motorcycles over 50cc) are allowed. Pedestrians, bicycles, and mopeds (under 50cc) are prohibited." },
    { q: "Who must display a provisional license practice sign?", options: ["Novice drivers", "Provisional license holders during road practice", "Elderly drivers", "Commercial drivers"], answer: 1, explanation: "Provisional license holders must display the practice sign during supervised road practice. This is different from the novice (wakaba) mark for newly licensed drivers." },
    { q: "Warning signs indicate:", options: ["Directions and distances", "Hazards ahead", "Speed limits", "Parking rules"], answer: 1, explanation: "Warning signs (yellow with black symbols) alert drivers to hazards ahead such as curves, intersections, slippery roads, school zones, and railway crossings." },
    { q: "A 'Priority Road' guide sign means:", options: ["You must stop always", "Your road has right of way at intersections", "One-way traffic only", "No overtaking allowed"], answer: 1, explanation: "Vehicles on a priority road always have right of way at intersections. Other vehicles must yield. This applies regardless of which direction you're turning." },
    { q: "Auxiliary signs provide:", options: ["Only color coding", "Time, distance, or vehicle-type details", "International translations", "Fine amounts"], answer: 1, explanation: "Auxiliary signs are smaller signs placed below main signs that add specific details like time restrictions (8-20), distance (500m ahead), or vehicle types affected." }
  ],
  "ordinary-license": [
    { q: "Maximum passenger capacity for ordinary car with ordinary license?", options: ["5", "8", "10", "15"], answer: 2, explanation: "An ordinary license allows driving vehicles with under 10 passengers (driver excluded). Vehicles with 10+ passengers require a medium or large vehicle license." },
    { q: "Maximum gross weight for ordinary car?", options: ["2.5 tons", "3.5 tons", "5 tons", "8 tons"], answer: 1, explanation: "Ordinary license covers vehicles with gross weight under 3.5 tons. Heavier vehicles require medium (3.5-11 tons) or large (over 11 tons) vehicle licenses." },
    { q: "Small motorcycle (原付) engine limit?", options: ["50cc or less", "125cc or less", "250cc or less", "400cc or less"], answer: 0, explanation: "Mopeds (原付/gentsuki) have engines of 50cc or less. They can be driven with an ordinary car license. Motorcycles over 50cc require a separate motorcycle license." },
    { q: "Ordinary license allows driving small special vehicles like:", options: ["Large buses", "Small tractors", "Large trucks", "Taxis"], answer: 1, explanation: "Small special vehicles (小型特殊) include small tractors, forklifts under certain size limits, and street cleaning vehicles. They can be driven with an ordinary license." },
    { q: "Maximum load capacity for ordinary car?", options: ["1,000 kg", "1,500 kg", "2,000 kg", "3,500 kg"], answer: 2, explanation: "Ordinary license covers vehicles with maximum load capacity under 2,000 kg. This is separate from gross weight, which includes the vehicle itself plus cargo plus passengers." },
    { q: "Ordinary license does NOT allow driving:", options: ["Mopeds under 50cc", "Ordinary cars", "Large trucks", "Small special vehicles"], answer: 2, explanation: "Large trucks (gross weight over 11 tons or load over 6.5 tons) require a large vehicle license. Ordinary license only covers mopeds, ordinary cars, and small special vehicles." },
    { q: "Small special vehicles (小型特殊) include:", options: ["Highway buses", "Small tractors and street cleaners", "Large cargo trucks", "Taxis"], answer: 1, explanation: "Small special vehicles are low-speed work vehicles like small agricultural tractors, forklifts (under size limits), and street cleaning machines." },
    { q: "To drive a motorcycle over 50cc you need:", options: ["Ordinary license only", "A separate motorcycle license", "No license", "Moped license only"], answer: 1, explanation: "Motorcycles over 50cc require a separate motorcycle license (ordinary motorcycle for 50-400cc, large motorcycle for over 400cc). An ordinary car license only covers mopeds (50cc or less)." }
  ],
  "speeding": [
    { q: "Legal speed limit for cars (no signs)?", options: ["40 km/h", "50 km/h", "60 km/h", "80 km/h"], answer: 2, explanation: "On general roads without posted speed limits, the legal (statutory) limit is 60 km/h for cars. If a sign shows a higher limit, you still cannot exceed 60 km/h without signs." },
    { q: "Legal speed for motorized bicycles (no signs)?", options: ["20 km/h", "30 km/h", "40 km/h", "50 km/h"], answer: 1, explanation: "Mopeds (原付) have a legal limit of 30 km/h on all roads, regardless of posted signs. Even if a sign shows 50 km/h, mopeds must not exceed 30 km/h." },
    { q: "Towing ≤2,000 kg with vehicle ≥3× weight limit?", options: ["25 km/h", "30 km/h", "40 km/h", "60 km/h"], answer: 2, explanation: "When towing a vehicle ≤2,000 kg AND your vehicle weighs at least 3× the towed vehicle's weight, the limit is 40 km/h. This is the most favorable towing condition." },
    { q: "Towing with motorcycle/moped (125cc trailer)?", options: ["25 km/h", "30 km/h", "40 km/h", "50 km/h"], answer: 0, explanation: "When towing with a motorcycle or moped pulling a trailer with engine 125cc or less, the maximum speed is only 25 km/h due to reduced stability." },
    { q: "Legal speed limit applies on roads:", options: ["Only highways", "Without speed limit signs or markings", "Only in cities", "Only at night"], answer: 1, explanation: "Legal (statutory) speed limits apply on roads without posted speed limit signs or road markings. When signs are present, follow the posted limit (if lower than legal limit)." },
    { q: "Towed vehicle over 2,000 kg — max towing speed?", options: ["25 km/h", "30 km/h", "40 km/h", "60 km/h"], answer: 1, explanation: "When the towed vehicle weighs over 2,000 kg, the maximum towing speed drops to 30 km/h regardless of the towing vehicle's weight ratio." },
    { q: "When towing, if towing vehicle weighs less than 3× towed vehicle:", options: ["40 km/h limit", "30 km/h limit", "60 km/h limit", "No limit"], answer: 1, explanation: "If your vehicle weighs less than 3× the towed vehicle, the limit is 30 km/h (not 40 km/h). The 3× weight ratio is required for the higher 40 km/h limit." },
    { q: "On unsigned roads, exceeding the legal limit is:", options: ["Allowed if traffic is light", "Not permitted", "Allowed on weekends", "Only illegal on highways"], answer: 1, explanation: "The legal speed limit (60 km/h for cars, 30 km/h for mopeds) always applies on roads without signs. Exceeding it is a traffic violation regardless of conditions." }
  ],
  "highway-speed-limit": [
    { q: "Standard car max speed on national highway?", options: ["80 km/h", "90 km/h", "100 km/h", "120 km/h"], answer: 2, explanation: "Standard passenger cars have a maximum speed of 100 km/h on national highways (expressways). Some newer highways allow 110-120 km/h when posted." },
    { q: "Minimum speed on highways for most vehicles?", options: ["30 km/h", "40 km/h", "50 km/h", "60 km/h"], answer: 2, explanation: "The minimum speed on highways is 50 km/h for all vehicle types. Driving too slowly on highways is dangerous and illegal as it disrupts traffic flow." },
    { q: "Large cargo vehicle max speed (2024)?", options: ["80 km/h", "90 km/h", "100 km/h", "110 km/h"], answer: 1, explanation: "Since 2024, large cargo trucks have a maximum highway speed of 90 km/h (increased from 80 km/h). This change was made to improve logistics efficiency." },
    { q: "Trailer max speed on highway?", options: ["60 km/h", "80 km/h", "90 km/h", "100 km/h"], answer: 1, explanation: "Vehicles towing trailers are limited to 80 km/h on highways due to reduced stability and longer braking distances." },
    { q: "Large/ordinary motorcycle max on national highway?", options: ["80 km/h", "90 km/h", "100 km/h", "120 km/h"], answer: 2, explanation: "Motorcycles (both large and ordinary) have the same 100 km/h maximum as standard cars on highways. Note: mopeds (under 50cc) are not allowed on highways." },
    { q: "Ordinary three-wheeled vehicle max on highway?", options: ["60 km/h", "80 km/h", "90 km/h", "100 km/h"], answer: 1, explanation: "Three-wheeled vehicles have reduced stability, so they're limited to 80 km/h on highways, the same as trailers and large special vehicles." },
    { q: "Medium cargo vehicle (8 tons or more) max speed?", options: ["80 km/h", "90 km/h", "100 km/h", "110 km/h"], answer: 1, explanation: "Medium cargo vehicles weighing 8 tons or more are limited to 90 km/h on highways (same as large cargo vehicles since 2024)." },
    { q: "Large special vehicle max on highway?", options: ["60 km/h", "80 km/h", "90 km/h", "100 km/h"], answer: 1, explanation: "Large special vehicles (construction equipment, etc.) are limited to 80 km/h on highways due to their design not being optimized for high-speed travel." }
  ],
  "no-parking": [
    { q: "Distance from intersection where stopping/parking prohibited?", options: ["3 m", "5 m", "10 m", "15 m"], answer: 1, explanation: "Within 5 meters of an intersection edge, both stopping and parking are prohibited. This ensures visibility and space for turning vehicles." },
    { q: "Distance from railway crossing?", options: ["5 m", "10 m", "15 m", "20 m"], answer: 1, explanation: "Within 10 meters of a railway crossing, both stopping and parking are prohibited. This is for safety — stopped vehicles could block the crossing." },
    { q: "Distance from fire alarm (parking prohibited, stopping OK)?", options: ["1 m", "3 m", "5 m", "10 m"], answer: 0, explanation: "Within 1 meter of a fire alarm, only parking is prohibited (stopping is OK). This ensures quick access to the alarm in emergencies." },
    { q: "Distance from dedicated vehicle entrance?", options: ["1 m", "3 m", "5 m", "10 m"], answer: 1, explanation: "Within 3 meters of a garage or dedicated vehicle entrance/exit, only parking is prohibited (stopping is OK). This allows vehicles to enter/exit." },
    { q: "Distance from road curve — no stopping or parking?", options: ["3 m", "5 m", "10 m", "15 m"], answer: 1, explanation: "Within 5 meters of a road curve, both stopping and parking are prohibited due to reduced visibility for approaching vehicles." },
    { q: "Distance from bus/tram stop (during operating hours)?", options: ["5 m", "10 m", "15 m", "20 m"], answer: 1, explanation: "Within 10 meters of a bus or tram stop (during operating hours), both stopping and parking are prohibited to allow public transport to operate." },
    { q: "Stopping AND parking prohibited in:", options: ["Tunnels", "Parking lots", "Wide roads only", "Rural roads only"], answer: 0, explanation: "Tunnels prohibit both stopping and parking regardless of the number of lanes. This is for safety — tunnels have limited escape routes in emergencies." },
    { q: "Distance from construction zone boundary (parking prohibited)?", options: ["1 m", "3 m", "5 m", "10 m"], answer: 2, explanation: "Within 5 meters of a construction zone boundary, only parking is prohibited (stopping is OK). This keeps the work area accessible." },
    { q: "Distance from pedestrian/bicycle path edge?", options: ["3 m", "5 m", "10 m", "15 m"], answer: 1, explanation: "Within 5 meters of a pedestrian or bicycle crossing, both stopping and parking are prohibited to maintain visibility and safety." },
    { q: "Near crest of hill or steep slope:", options: ["Parking allowed briefly", "Both stopping and parking prohibited", "Stopping OK only", "No rules apply"], answer: 1, explanation: "Near the crest of a hill or on a steep slope, both stopping and parking are prohibited due to reduced visibility and rollaway risk." }
  ],
  "parking-rules": [
    { q: "Max daytime parking (07:00-19:00)?", options: ["8 hours", "10 hours", "12 hours", "24 hours"], answer: 2, explanation: "During daytime (07:00-19:00), even without 'No Parking' signs, you cannot park for more than 12 consecutive hours in the same spot." },
    { q: "Max nighttime parking (19:00-07:00)?", options: ["6 hours", "8 hours", "10 hours", "12 hours"], answer: 1, explanation: "During nighttime (19:00-07:00), the maximum parking time is 8 hours. This is shorter than daytime to prevent abandoned vehicles." },
    { q: "If roadside strip ≥ 0.75m, minimum space for pedestrians?", options: ["0.5 m", "0.75 m", "1 m", "1.5 m"], answer: 1, explanation: "When parking in a roadside strip that's 0.75m or wider, you must leave at least 0.75m for pedestrians to walk safely." },
    { q: "Without sidewalk, park as close as possible to:", options: ["Right edge", "Left edge", "Center", "Anywhere"], answer: 1, explanation: "In Japan, you drive on the left side. When there's no sidewalk or roadside strip, park as close to the left edge as possible to minimize obstruction." },
    { q: "Roadside strip ≤ 0.75 m wide — park:", options: ["In the strip", "Close to lane edge", "In the center", "On sidewalk"], answer: 1, explanation: "If the roadside strip is 0.75m or narrower, don't park in it — park close to the lane edge instead, as the strip is too narrow for pedestrians to pass." },
    { q: "Exceeding max parking time without 'No Parking' sign:", options: ["Is allowed", "May result in fines or towing", "Only illegal at night", "Allowed on weekends"], answer: 1, explanation: "Even without 'No Parking' signs, exceeding the time limits (12h day/8h night) is illegal and may result in fines, penalty points, or towing." },
    { q: "On roads with roadside strip (路側帯), spacing rules apply when:", options: ["Only on highways", "Strip is present", "Only in cities", "Never"], answer: 1, explanation: "Roadside strip (路側帯) spacing rules apply whenever a strip is present, regardless of location. The 0.75m threshold determines where you can park." },
    { q: "Daytime max parking hours (07:00–19:00) means up to:", options: ["8 consecutive hours", "10 consecutive hours", "12 consecutive hours", "24 consecutive hours"], answer: 2, explanation: "The 12-hour daytime limit applies to consecutive parking in the same spot. Moving your car resets the timer." }
  ],
  "parking-vs-stopping": [
    { q: "Loading luggage for 6 minutes is considered:", options: ["Stopping", "Parking", "Neither", "Depends on location"], answer: 1, explanation: "Loading/unloading for MORE than 5 minutes is considered parking. Since 6 minutes exceeds 5 minutes, this is parking." },
    { q: "Passenger pickup is always considered:", options: ["Parking", "Stopping", "Illegal", "Depends on time"], answer: 1, explanation: "Passengers getting on or off is ALWAYS considered stopping, regardless of how long it takes. This is a key exam concept." },
    { q: "Parking threshold for waiting/loading:", options: ["3 minutes", "5 minutes", "10 minutes", "15 minutes"], answer: 1, explanation: "The 5-minute threshold is critical: under 5 minutes for loading/unloading = stopping; over 5 minutes = parking." },
    { q: "Driver leaves car — this is:", options: ["Stopping", "Parking", "Allowed anywhere", "Stopping if under 5 min"], answer: 1, explanation: "If the driver leaves the vehicle and cannot drive immediately, it's parking regardless of duration. The driver must be able to move the car immediately for it to be 'stopping'." },
    { q: "Loading luggage for 4 minutes is considered:", options: ["Stopping", "Parking", "Illegal", "Depends on driver"], answer: 0, explanation: "Loading/unloading for UNDER 5 minutes (and driver can move immediately) is considered stopping, not parking." },
    { q: "Waiting for passengers more than 5 minutes is:", options: ["Stopping", "Parking", "Always legal", "Stopping if engine on"], answer: 1, explanation: "Waiting for passengers or goods for MORE than 5 minutes is parking. The engine being on doesn't change this." },
    { q: "Stopping is when the driver:", options: ["Has left the vehicle", "Can still drive immediately", "Is asleep", "Is eating for 30 minutes"], answer: 1, explanation: "Stopping requires the driver to be able to drive the vehicle immediately. If the driver can't respond right away, it becomes parking." },
    { q: "Passenger drop-off regardless of duration is:", options: ["Parking", "Stopping", "Illegal everywhere", "Parking after 3 minutes"], answer: 1, explanation: "Passengers getting on or off is ALWAYS stopping, never parking — this is true regardless of how long it takes. This exception is important for the exam." }
  ],
  "safety-zone": [
    { q: "If pedestrians are in safety zone, you should:", options: ["Stop completely", "Drive slowly", "Honk and pass", "Speed up"], answer: 1, explanation: "When pedestrians are present in a safety zone, you must drive slowly. You don't need to stop completely, but you must proceed with caution." },
    { q: "No pedestrians in safety zone — you may:", options: ["Park", "Pass through", "Stop", "Reverse"], answer: 1, explanation: "If no pedestrians are in the safety zone, you may pass through normally. You don't need to stop, but parking is still prohibited within 10m." },
    { q: "Safety zone prohibits parking within:", options: ["5 m", "10 m", "15 m", "20 m"], answer: 1, explanation: "Parking and stopping are prohibited within 10 meters on the LEFT side of a safety zone, both before and after it." },
    { q: "A safety zone protects:", options: ["Parked vehicles only", "Pedestrians crossing or boarding trams", "Cyclists only", "Construction workers"], answer: 1, explanation: "Safety zones (安全地帯) are facilities or markings that protect pedestrians crossing roads or boarding/alighting from trams." },
    { q: "Safety zone parking prohibition applies on which side?", options: ["Right side", "Left side", "Both sides", "Center only"], answer: 1, explanation: "The 10-meter no-parking zone applies to the LEFT side of the safety zone only. This is because vehicles approach from the left in Japan." },
    { q: "Safety zone is similar to:", options: ["A parking lot", "An island for pedestrian safety", "A bus lane", "A toll booth"], answer: 1, explanation: "Safety zones function like pedestrian islands — raised or marked areas that provide safe refuge for pedestrians crossing the road." },
    { q: "When pedestrians are present in safety zone, you must NOT:", options: ["Drive slowly", "Speed through normally", "Be cautious", "Watch for trams"], answer: 1, explanation: "You must NOT speed through normally when pedestrians are in the safety zone. Slow driving, caution, and watching for trams are all correct behaviors." },
    { q: "10-meter rule for safety zones applies:", options: ["Only before the zone", "Before and after the zone", "Only inside the zone", "Only at night"], answer: 1, explanation: "The 10-meter prohibition applies both before AND after the safety zone on the left side. This ensures the area stays clear for pedestrians." }
  ],
  "child-counting": [
    { q: "Children under what age use the counting rule?", options: ["10", "12", "15", "18"], answer: 1, explanation: "The child counting rule applies to children UNDER 12 years old. Children 12 and older count as full adults." },
    { q: "3 children under 12 equals how many adults?", options: ["1", "2", "3", "4"], answer: 1, explanation: "The formula is 3 children = 2 adults. So 3 children under 12 count as 2 adult passengers for capacity purposes." },
    { q: "6 children under 12 equals how many adults?", options: ["2", "3", "4", "6"], answer: 2, explanation: "Using 3 children = 2 adults: 6 children ÷ 3 × 2 = 4 adults. Six children count as four adult passengers." },
    { q: "9 children under 12 equals how many adults?", options: ["4", "5", "6", "9"], answer: 2, explanation: "Using 3 children = 2 adults: 9 children ÷ 3 × 2 = 6 adults. Nine children count as six adult passengers." },
    { q: "The child counting rule is used for:", options: ["Speed limits", "Passenger capacity limits", "Parking time", "License types"], answer: 1, explanation: "This rule is used when calculating passenger capacity limits for vehicles. It helps determine if you're exceeding the allowed number of passengers." },
    { q: "A 13-year-old child counts as:", options: ["Half an adult", "One full adult", "Not counted", "Two adults"], answer: 1, explanation: "The special counting rule only applies to children UNDER 12. A 13-year-old counts as one full adult passenger." },
    { q: "2 children under 12 equal how many adults?", options: ["1", "2", "3", "0"], answer: 1, explanation: "The formula rounds up for partial ratios. 2 children ÷ 3 × 2 ≈ 1.33, but in practice 2 children count as approximately 2 adults (rounded up for safety)." },
    { q: "The rule states 3 children = 2 adults for children under:", options: ["10 years", "12 years", "15 years", "18 years"], answer: 1, explanation: "The 3 children = 2 adults rule applies specifically to children under 12 years old. This is the exact age threshold to remember." }
  ],
  "double-overtaking": [
    { q: "Double overtaking occurs when front vehicle is overtaking:", options: ["A bicycle only", "Another vehicle", "A parked car", "A pedestrian"], answer: 1, explanation: "Double overtaking is when you overtake a vehicle that is already overtaking another VEHICLE (car, truck, bus). Parked cars don't count." },
    { q: "NOT double overtaking when front vehicle overtakes:", options: ["A truck", "A car", "A motorcycle or bicycle", "A bus"], answer: 2, explanation: "If the vehicle ahead is overtaking a motorcycle or bicycle, you CAN overtake both without it being 'double overtaking'. This is an exception to the rule." },
    { q: "Double overtaking is:", options: ["Allowed on highways", "A traffic violation", "Only illegal at night", "Allowed if fast enough"], answer: 1, explanation: "Double overtaking is always a traffic violation, regardless of road type, time of day, or speed. It's dangerous because multiple vehicles are changing lanes simultaneously." },
    { q: "'Vehicle in front' for double overtaking includes:", options: ["Only cars", "Bicycles and motorcycles overtaking too", "Only trucks", "Parked vehicles"], answer: 1, explanation: "Any moving vehicle ahead counts, including bicycles and motorcycles that are overtaking. If a bicycle ahead is overtaking a car, and you overtake both, that's double overtaking." },
    { q: "You may overtake when front car overtakes a bicycle because:", options: ["Bicycles don't count as vehicles", "It's not considered double overtaking", "Highways allow it", "Speed doesn't matter"], answer: 1, explanation: "When the vehicle ahead is overtaking a bicycle or motorcycle, your overtaking of both is NOT considered double overtaking. This is a specific exception in the law." },
    { q: "Overtaking two vehicles at once when front is passing a car is:", options: ["Legal", "Double overtaking violation", "Allowed on one-way roads", "Only illegal for trucks"], answer: 1, explanation: "This IS double overtaking — you're overtaking a vehicle that is overtaking another vehicle (car). This is illegal regardless of road type or vehicle type." }
  ],
  "size-weight": [
    { q: "Max cargo height for cars?", options: ["2.5 m", "3.0 m", "3.8 m", "4.5 m"], answer: 2, explanation: "Car cargo cannot exceed 3.8 meters from the ground (total height including vehicle). This ensures clearance under bridges and overpasses." },
    { q: "Max cargo weight on motorcycle over 50cc?", options: ["30 kg", "45 kg", "60 kg", "80 kg"], answer: 2, explanation: "Motorcycles over 50cc can carry up to 60 kg of cargo. Mopeds (under 50cc) are limited to 30 kg due to their smaller engines." },
    { q: "Max cargo width extension per side (motorcycle)?", options: ["10 cm", "15 cm", "20 cm", "30 cm"], answer: 1, explanation: "Motorcycle cargo can extend up to 15 cm on each side (30 cm total). This maintains balance and prevents hitting other vehicles." },
    { q: "Car cargo length limit?", options: ["100% of vehicle", "110%", "120%", "150%"], answer: 2, explanation: "Car cargo can be up to 120% of the vehicle's length. The overhang (beyond the vehicle body) is limited to 10% front/rear." },
    { q: "Car cargo width limit?", options: ["100%", "110%", "120%", "150%"], answer: 2, explanation: "Car cargo can be up to 120% of the vehicle's width, with a maximum overhang of 10% on each side." },
    { q: "Motorcycle cargo max height from ground?", options: ["1.5 m", "2 m", "2.5 m", "3 m"], answer: 1, explanation: "Motorcycle cargo cannot exceed 2 meters from the ground (much lower than cars at 3.8m) due to balance and stability concerns." },
    { q: "Moped under 50cc max cargo weight?", options: ["20 kg", "30 kg", "45 kg", "60 kg"], answer: 1, explanation: "Mopeds (under 50cc) can carry a maximum of 30 kg cargo. This is half the limit for larger motorcycles (60 kg) due to their smaller engines." },
    { q: "Car overhang limit (front/rear/sides)?", options: ["5% of length/width", "10% of length/width", "15%", "20%"], answer: 1, explanation: "Cargo can overhang up to 10% of the vehicle's length (front/rear) or width (sides). This prevents unsafe protrusions into traffic." },
    { q: "Exceeding cargo limits requires:", options: ["No action", "Special cargo permit from police", "Insurance only", "Honking"], answer: 1, explanation: "To exceed standard cargo limits, you must obtain a special cargo permit from the traffic police in advance." }
  ],
  "horn-usage": [
    { q: "When should you use the horn?", options: ["Anytime in traffic", "Only in danger or where signs require", "To greet friends", "When angry"], answer: 1, explanation: "Horn use is restricted to unavoidable danger situations OR where signs specifically require it. Unnecessary honking is a traffic violation." },
    { q: "Horn-required area — honk at:", options: ["Every intersection", "Blind curve/hilltop/intersection", "Only highways", "School zones only"], answer: 1, explanation: "In designated horn areas, you must honk when passing blind curves, hilltops, or intersections where you cannot see oncoming traffic." },
    { q: "'Honk' sign means you must:", options: ["Honk continuously", "Honk when passing the sign location", "Never honk", "Honk only at night"], answer: 1, explanation: "The 'Honk' sign (警笛鳴らせ) requires you to honk when passing that specific location to warn other road users of your presence." },
    { q: "Unnecessary horn use is:", options: ["Encouraged in cities", "Not allowed except in danger or where required", "Required at all intersections", "Only illegal on highways"], answer: 1, explanation: "Honking for non-essential reasons (expressing frustration, greeting, etc.) is prohibited. It causes noise pollution and can startle others." },
    { q: "In a horn-required area, honk at a curve where:", options: ["You can see far ahead", "You cannot see ahead", "Traffic is light", "It is daytime only"], answer: 1, explanation: "The purpose of honking at curves is to warn oncoming traffic you can't see. If you can see ahead clearly, honking isn't necessary." },
    { q: "Horn at hilltop is required when:", options: ["You cannot see the other side", "Road is dry", "No other cars present", "Speed is under 30 km/h"], answer: 0, explanation: "Honk at hilltops when you CANNOT see the other side. The horn warns vehicles or pedestrians on the other side of your approach." }
  ],
  "no-space-parking": [
    { q: "Minimum space to right of vehicle for parking?", options: ["2.5 m", "3.0 m", "3.5 m", "5.0 m"], answer: 2, explanation: "You cannot park if the space to the right of your vehicle is less than 3.5 meters. This ensures other vehicles can pass safely." },
    { q: "Exception allowing temporary parking:", options: ["Eating lunch", "Emergency medical care", "Phone call", "Napping"], answer: 1, explanation: "Emergency medical care for injured or ill persons is one of the few exceptions allowing temporary parking even in restricted areas." },
    { q: "Loading/unloading exception requires:", options: ["Driver to leave", "Driver present to move immediately", "Hazard lights off", "10+ minutes"], answer: 1, explanation: "The loading/unloading exception only applies if the driver remains present and can move the vehicle immediately when needed." },
    { q: "When parking is designated by sign, you must:", options: ["Park anywhere nearby", "Park only in designated area", "Park on sidewalk", "Ignore the sign at night"], answer: 1, explanation: "When a sign designates specific parking spots, you must park ONLY in those designated areas. Parking outside them is prohibited." },
    { q: "Less than 3.5 m to the right means:", options: ["Stopping OK, parking OK", "No parking allowed", "Only trucks affected", "Allowed on weekends"], answer: 1, explanation: "The 3.5m rule applies to all vehicles. If parking would leave less than 3.5m for other traffic to pass, parking is prohibited." },
    { q: "Emergency medical care exception allows:", options: ["Permanent parking", "Temporary parking", "No stopping ever", "Parking in tunnels"], answer: 1, explanation: "Emergency medical care allows TEMPORARY parking only — you must move the vehicle once the emergency is resolved." }
  ],
  "storage-space": [
    { q: "Vehicle storage must be within how far from regular use location?", options: ["1 km", "2 km", "3 km", "5 km"], answer: 1, explanation: "Vehicle owners must have a parking/storage place within 2 km of where the vehicle is regularly used (typically your home address)." },
    { q: "Storage space requirement applies to:", options: ["All vehicles", "Cars only, not motorcycles", "Motorcycles only", "Commercial vehicles only"], answer: 1, explanation: "The 2 km storage requirement applies to cars only. Motorcycles are exempt from this parking space requirement." },
    { q: "Storage place examples include:", options: ["Highway shoulder", "Parking lot near home", "Any roadside", "Friend's driveway anywhere"], answer: 1, explanation: "Valid storage includes rented parking lots, home garages, or designated parking spaces — all within 2 km of your regular use address." },
    { q: "Exam trick: wrong distance options may be:", options: ["1 km or 2 km", "3 km or 5 km", "10 km or 20 km", "500 m or 1 km"], answer: 1, explanation: "Exams often include 3 km or 5 km as wrong answers to trick you. Always remember the correct answer is exactly 2 km." },
    { q: "The 2 km rule is measured from:", options: ["Nearest gas station", "Regular use location like home", "Driving school", "Highway entrance"], answer: 1, explanation: "The 2 km is measured from where the vehicle is regularly used — typically your registered home address or workplace." },
    { q: "Motorcycles are:", options: ["Required to have storage within 2 km", "Exempt from storage requirement", "Required 5 km storage", "Only exempt for commercial use"], answer: 1, explanation: "Motorcycles are completely exempt from the vehicle storage location requirement. This rule only applies to cars." }
  ],
  "hydroplaning": [
    { q: "During hydroplaning, you should NOT:", options: ["Hold steering wheel", "Use engine braking", "Brake abruptly", "Slow gradually"], answer: 2, explanation: "NEVER brake abruptly during hydroplaning — this can cause loss of control. Keep the wheel steady and use engine braking to slow gradually." },
    { q: "Hydroplaning risk increases with:", options: ["New tires", "Worn tires", "Low speed", "Dry roads"], answer: 1, explanation: "Worn tires have less tread depth to channel water away, greatly increasing hydroplaning risk. Check tire condition regularly." },
    { q: "Preventive measure before highway driving:", options: ["Decrease tire pressure", "Increase tire pressure", "Remove tires", "Use handbrake"], answer: 1, explanation: "Slightly increasing tire pressure before highway driving helps maintain better contact with the road and reduces hydroplaning risk." },
    { q: "Hydroplaning occurs when:", options: ["Tires grip firmly on dry road", "Tires lift off on waterlogged road at speed", "Driving slowly in rain", "Using engine braking"], answer: 1, explanation: "Hydroplaning happens when water builds up faster than tires can disperse it, causing the tires to 'float' on water and lose contact with the road." },
    { q: "During hydroplaning, hold the wheel:", options: ["With one hand loosely", "Firmly with both hands", "Not at all", "Only if turning"], answer: 1, explanation: "Hold the steering wheel firmly with BOTH hands to maintain control. Don't make sudden steering movements — keep the wheel steady." },
    { q: "To slow during hydroplaning, use:", options: ["Sudden braking", "Engine braking gradually", "Accelerate", "Handbrake immediately"], answer: 1, explanation: "Use engine braking (ease off accelerator, downshift if manual) to slow gradually. Sudden braking or handbrake can cause skidding." },
    { q: "Hydroplaning reduces:", options: ["Fuel use only", "Steering and braking effectiveness", "Engine noise", "Tire wear"], answer: 1, explanation: "When tires lose contact with the road, both steering and braking become ineffective. You lose the ability to control or stop the vehicle." }
  ],
  "license-vehicle": [
    { q: "Ordinary vehicle license allows driving:", options: ["Large trucks", "Ordinary cars", "Large motorcycles", "Buses"], answer: 1, explanation: "An ordinary license allows ordinary cars (under 3.5t gross, under 2t load, under 10 passengers), mopeds (under 50cc), and small special vehicles." },
    { q: "Moped license (under 50cc) allows:", options: ["Ordinary cars", "Mopeds only", "All motorcycles", "Large trucks"], answer: 1, explanation: "A moped-only license permits only mopeds (under 50cc). It does NOT allow cars, larger motorcycles, or any other vehicles." },
    { q: "Towing license NOT required when towed vehicle weighs:", options: ["≤750 kg", "≤1,000 kg", "≤2,000 kg", "≤3,500 kg"], answer: 0, explanation: "No special towing license is needed if the towed vehicle weighs 750 kg or less. Heavier vehicles require a towing endorsement." },
    { q: "Large motorcycle license (125cc+) allows:", options: ["Large trucks", "Large and ordinary motorcycles", "Buses only", "Mopeds only"], answer: 1, explanation: "A large motorcycle license (over 400cc) allows driving large motorcycles, ordinary motorcycles (50-400cc), and mopeds. It does not permit cars." },
    { q: "Ordinary motorcycle license (50–125cc) allows:", options: ["Large motorcycles", "Ordinary motorcycles and mopeds", "Large trucks", "Buses"], answer: 1, explanation: "An ordinary motorcycle license covers motorcycles from 50cc to 400cc, plus mopeds. It does NOT cover large motorcycles (over 400cc)." },
    { q: "Large vehicle license allows driving:", options: ["Mopeds only", "Large trucks, medium trucks, and ordinary cars", "Bicycles", "Trams"], answer: 1, explanation: "A large vehicle license is comprehensive — it covers large vehicles, medium vehicles, ordinary cars, mopeds, and small special vehicles." },
    { q: "Driving a vehicle not permitted by your license:", options: ["Is a legal penalty offense", "Is allowed on weekends", "Only matters on highways", "Requires no penalty"], answer: 0, explanation: "Driving a vehicle your license doesn't cover is a serious offense (無免許運転) with heavy penalties including fines and possible imprisonment." },
    { q: "Towing license not required when towing accident vehicle with:", options: ["A chain only", "A rope", "A trailer", "No connection"], answer: 1, explanation: "No towing license is required when using a rope to tow a broken-down or accident vehicle. This is an emergency exception." }
  ],
  "periodic-check": [
    { q: "Commercial taxis inspected every:", options: ["3 months", "6 months", "12 months", "24 months"], answer: 0, explanation: "Commercial taxis require inspection every 3 months due to heavy daily use and passenger safety concerns." },
    { q: "Standard private car inspected every:", options: ["3 months", "6 months", "12 months", "24 months"], answer: 2, explanation: "Standard private passenger cars need inspection every 12 months. This is the longest interval among commonly used vehicles." },
    { q: "Private trucks under 8 tons inspected every:", options: ["3 months", "6 months", "12 months", "24 months"], answer: 1, explanation: "Private trucks under 8 tons require inspection every 6 months — more frequent than private cars due to heavier loads and usage." },
    { q: "Rented standard vehicles inspected every:", options: ["3 months", "6 months", "12 months", "24 months"], answer: 1, explanation: "Rental vehicles need inspection every 6 months because they're used by multiple drivers and may receive less careful treatment." },
    { q: "Large private motorcycles inspected every:", options: ["3 months", "6 months", "12 months", "24 months"], answer: 2, explanation: "Large private motorcycles (over 250cc) require inspection every 12 months, same as private cars." },
    { q: "Child transport vehicles inspected every:", options: ["3 months", "6 months", "12 months", "24 months"], answer: 1, explanation: "Vehicles transporting children (school buses, etc.) need inspection every 6 months for enhanced safety." },
    { q: "Trucks over 8 tons (commercial) inspected every:", options: ["3 months", "6 months", "12 months", "24 months"], answer: 0, explanation: "Large commercial trucks (over 8 tons) require the most frequent inspection — every 3 months — due to heavy use and safety concerns." },
    { q: "Motorcycles over 125cc inspected every:", options: ["3 months", "6 months", "12 months", "24 months"], answer: 2, explanation: "Motorcycles over 125cc require inspection every 12 months. Note: motorcycles under 250cc don't require vehicle inspection (shaken)." }
  ],
  "daily-check": [
    { q: "Daily inspection required for:", options: ["All personal cars", "Rental vehicles", "Bicycles", "Parked vehicles"], answer: 1, explanation: "Rental vehicles require daily inspection before operation because they're used by different drivers who may not be familiar with the vehicle's condition." },
    { q: "Vehicles carrying how many passengers need daily check?", options: ["8+", "10+", "11+", "15+"], answer: 2, explanation: "Private vehicles carrying 11 or more passengers require daily inspection before operation due to the higher responsibility for passenger safety." },
    { q: "Daily check verifies:", options: ["Paint color only", "Brakes, engine, tire pressure, etc.", "License expiry", "Insurance papers"], answer: 1, explanation: "Daily inspection covers safety-critical items: brakes, engine condition, tire pressure, lights, steering, and other operational systems." },
    { q: "Commercial vehicles (except under 660cc) need daily check:", options: ["Weekly", "Before operation each day", "Monthly", "Never"], answer: 1, explanation: "Commercial vehicles must be inspected BEFORE operation each day they're used. This is mandatory, not optional." },
    { q: "Large specialized vehicles need:", options: ["Annual check only", "Daily inspection before operation", "No inspection", "Check every 3 years"], answer: 1, explanation: "Large specialized vehicles (construction equipment, etc.) require daily inspection before operation due to their specialized nature and potential hazards." },
    { q: "Private cargo vehicles (except under 660cc) need:", options: ["Daily inspection", "No inspection ever", "Only highway check", "Check when sold"], answer: 0, explanation: "Private cargo vehicles (except kei trucks under 660cc) require daily inspection before operation due to the loads they carry." },
    { q: "Daily inspection timing for most vehicles is determined by:", options: ["Police only", "The user based on usage", "Always at midnight", "Every 6 months"], answer: 1, explanation: "For most vehicles, the driver/owner determines when to perform daily inspection based on their usage patterns. Commercial vehicles have stricter requirements." }
  ],
  "stopping-distance": [
    { q: "Stopping distance equals:", options: ["Braking distance only", "Reaction + braking distance", "Reaction distance only", "Speed × time"], answer: 1, explanation: "Total stopping distance = reaction distance (while your brain processes the danger) + braking distance (from brake application to full stop)." },
    { q: "Fatigue affects mainly:", options: ["Braking distance", "Reaction distance", "Vehicle weight", "Tire size"], answer: 1, explanation: "Fatigue slows your mental processing, increasing the time before you react to a hazard. This increases reaction distance, not braking distance." },
    { q: "Worn tires affect mainly:", options: ["Reaction distance", "Braking distance", "Fuel efficiency only", "Reaction time"], answer: 1, explanation: "Worn tires have less grip, increasing the distance needed to stop once brakes are applied. Your reaction time stays the same." },
    { q: "Reaction distance is travel from:", options: ["Brake press to full stop", "Hazard recognition to brakes taking effect", "Engine start to moving", "Stop to restart"], answer: 1, explanation: "Reaction distance is how far you travel from the moment you see a hazard until your foot actually presses the brake and it starts working." },
    { q: "Braking distance is from:", options: ["Seeing hazard to stopping", "Brakes engaging to complete stop", "Engine off to on", "Honk to stop"], answer: 1, explanation: "Braking distance starts when the brakes actually engage (take effect) and ends when the vehicle comes to a complete stop." },
    { q: "Slippery roads mainly increase:", options: ["Reaction distance", "Braking distance", "Engine power", "Fuel consumption only"], answer: 1, explanation: "Slippery roads reduce tire grip, increasing the distance needed to stop after brakes are applied. Your reaction time is unaffected by road conditions." },
    { q: "Stopping distance assumptions include:", options: ["Wet icy roads", "Dry road, good tires", "Worn tires always", "Fatigued driver"], answer: 1, explanation: "Standard stopping distance calculations assume ideal conditions: dry road, good tires, alert driver. Real-world conditions often require more distance." }
  ],
  "priority-intersections": [
    { q: "At intersection, traffic from which direction has priority?", options: ["Right", "Left", "Straight only", "Largest vehicle"], answer: 1, explanation: "At equal intersections, traffic from the LEFT has priority. This is because in Japan, you drive on the left side of the road." },
    { q: "Going straight has priority over:", options: ["Going left", "Turning right", "Stopping", "Reversing"], answer: 1, explanation: "Vehicles going straight or turning left have priority over vehicles turning right. Right-turning vehicles must yield to oncoming traffic." },
    { q: "Without dividing lines, priority goes to:", options: ["Narrower road", "Wider road", "Faster vehicle", "Right side"], answer: 1, explanation: "When roads intersect without dividing lines or signs, the WIDER road has priority. Width indicates the road's importance." },
    { q: "Priority road sign means vehicles on that road:", options: ["Must always stop", "Always have priority", "Yield to all traffic", "Only priority at night"], answer: 1, explanation: "The priority road sign indicates your road has right of way at all intersections. Other vehicles must yield to you." },
    { q: "Centerline extending into intersection gives priority to:", options: ["Narrower road", "Road with centerline", "Left-turning vehicles", "Pedestrians only"], answer: 1, explanation: "If a centerline extends into an intersection, vehicles on that road have priority regardless of turning direction." },
    { q: "At intersections without lights, priority is determined by:", options: ["Vehicle color", "Signs, dividing lines, direction", "Loudest horn", "Vehicle age"], answer: 1, explanation: "Priority is determined by: 1) Signs (priority road), 2) Road markings (centerline), 3) Road width, 4) Direction (left traffic, straight over right turn)." },
    { q: "When facing oncoming traffic, turning right yields to:", options: ["Other right turns", "Going straight or turning left", "Reversing vehicles", "Parked cars"], answer: 1, explanation: "When making a right turn, you must yield to oncoming traffic going straight or turning left. They have priority." }
  ],
  "police-signals": [
    { q: "Arms horizontal — traffic toward officer's front means:", options: ["Green light", "Yellow light", "Red light", "Go slowly"], answer: 2, explanation: "Traffic facing the officer's FRONT or BACK is always RED (stop), regardless of arm position. This is a key exam concept." },
    { q: "Arms vertical — traffic toward sides means:", options: ["Green light", "Yellow light", "Red light", "Stop immediately"], answer: 1, explanation: "When arms are vertical, traffic from the SIDES sees YELLOW (caution). When horizontal, sides see GREEN. Front/back always sees RED." },
    { q: "Police signals vs traffic lights:", options: ["Lights always win", "Police signals override lights", "Whichever is green", "Neither applies"], answer: 1, explanation: "Police hand signals ALWAYS override traffic lights. You must obey the officer even if traffic lights show green." },
    { q: "Arms horizontal — traffic toward officer's sides means:", options: ["Red light", "Green light", "Yellow light", "Stop"], answer: 1, explanation: "When arms are horizontal (extended sideways), traffic from the SIDES (parallel to the arms) sees GREEN and may proceed." },
    { q: "Arms vertical — traffic toward officer's front means:", options: ["Green light", "Yellow light", "Red light", "Proceed with caution"], answer: 2, explanation: "Traffic facing the officer's FRONT or BACK is ALWAYS RED regardless of arm position — horizontal or vertical." },
    { q: "Police hand signals are used during:", options: ["Normal traffic only", "Accidents or construction", "Parking only", "Highway cruising"], answer: 1, explanation: "Police direct traffic during accidents, construction, power outages affecting traffic lights, or other special situations requiring manual control." },
    { q: "You must follow police signals even when:", options: ["Traffic lights are green", "No other cars present", "It is nighttime", "On private roads only"], answer: 0, explanation: "Police signals override ALL traffic signals. Even if the light is green, if the officer signals stop, you MUST stop." },
    {
      q: "In this position (arms horizontal), traffic approaching the officer's SIDES sees:",
      img: "assets/images/police-signals/horizontal-arms.jpg",
      imgAlt: "Police officer with arms horizontal",
      options: ["Red light — stop", "Green light — go", "Yellow light — caution", "Flashing red"],
      answer: 1,
      explanation: "Arms horizontal: SIDES (parallel to arms) = GREEN. The officer's extended arms show the direction of traffic flow."
    },
    {
      q: "In this position (arms horizontal), traffic facing the officer's FRONT sees:",
      img: "assets/images/police-signals/horizontal-arms.jpg",
      imgAlt: "Police officer with arms horizontal",
      options: ["Red light — stop", "Green light — go", "Yellow light — caution", "No signal"],
      answer: 0,
      explanation: "Front/back is ALWAYS RED. Think of it this way: the officer 'blocks' traffic coming toward them or from behind them."
    },
    {
      q: "In this position (arms vertical), traffic from the officer's SIDES sees:",
      img: "assets/images/police-signals/vertical-arms.jpg",
      imgAlt: "Police officer with arms vertical",
      options: ["Red light", "Green light", "Yellow light", "Blue light"],
      answer: 2,
      explanation: "Arms vertical: SIDES = YELLOW (caution, prepare to stop). The arm raised indicates a transition from the previous green."
    },
    {
      q: "In this position (arms vertical), traffic facing the officer's FRONT sees:",
      img: "assets/images/police-signals/vertical-arms.jpg",
      imgAlt: "Police officer with arms vertical",
      options: ["Red light", "Green light", "Yellow light", "Proceed slowly"],
      answer: 0,
      explanation: "Front/back is ALWAYS RED regardless of arm position. This never changes — memorize it!"
    },
    {
      q: "At this intersection, the officer's arms are horizontal. Cars in front of and behind the officer must:",
      img: "assets/images/police-signals/horizontal-diagram.gif",
      imgAlt: "Intersection with horizontal arm signal",
      options: ["Stop (red)", "Go (green)", "Caution (yellow)", "Turn right only"],
      answer: 0,
      explanation: "Cars facing the officer's front or back must STOP (red). Only cars approaching from the sides (parallel to arms) may go."
    },
    {
      q: "Facing the officer's front or back — the signal is ALWAYS:",
      img: "assets/images/police-signals/vertical-arms.jpg",
      imgAlt: "Police officer with arms vertical",
      options: ["Green", "Yellow", "Red", "Depends on arm position"],
      answer: 2,
      explanation: "CRITICAL RULE: Front/back = ALWAYS RED, regardless of arm position. Sides change between green (horizontal) and yellow (vertical)."
    }
  ]
};

// Flatten all quiz questions for "full exam" mode
const ALL_QUIZ = Object.entries(QUIZZES).flatMap(([chapterId, questions]) =>
  questions.map(q => ({ ...q, chapterId }))
);
