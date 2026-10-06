// Situation-Based Test Data
// Uses actual questions from Honmen exams with image-matched scenarios
// Each scenario requires identifying ALL correct hazard statements

const SITUATION_QUESTIONS = [
  {
    id: "sit-1",
    img: "assets/images/exams/honmen/1/K044.jpg",
    scenario: "You are driving along at 40 km/h. Look at the road conditions in the image.",
    statements: [
      { text: "The road ahead may have hidden hazards around curves or obstacles.", correct: true },
      { text: "I should reduce speed and increase my awareness of the surroundings.", correct: true },
      { text: "Since I can see the road ahead, I can maintain my current speed.", correct: false }
    ],
    explanation: "Always anticipate hazards that may be hidden from view. Reduce speed when visibility is limited or road conditions are uncertain."
  },
  {
    id: "sit-2", 
    img: "assets/images/exams/honmen/1/K085.jpg",
    scenario: "While driving on an expressway at 80 km/h, the hazard lights of the vehicle ahead begin to flash.",
    statements: [
      { text: "Traffic may be congested or stopped ahead.", correct: true },
      { text: "I should begin slowing down and increase following distance.", correct: true },
      { text: "Hazard lights just mean the vehicle has a problem; I can pass it normally.", correct: false }
    ],
    explanation: "Hazard lights on expressways often warn of danger ahead. Always slow down and prepare to stop when you see them."
  },
  {
    id: "sit-3",
    img: "assets/images/exams/honmen/1/K069.jpg",
    scenario: "You are driving along at 35 km/h. Because of construction, the road is covered with steel plates.",
    statements: [
      { text: "Steel plates become very slippery, especially when wet.", correct: true },
      { text: "I should avoid sudden braking or sharp steering on the steel plates.", correct: true },
      { text: "Steel plates provide good traction, so I can drive normally.", correct: false }
    ],
    explanation: "Steel plates are extremely slippery. Reduce speed before reaching them and avoid any sudden maneuvers."
  },
  {
    id: "sit-4",
    img: "assets/images/exams/honmen/1/K026.jpg",
    scenario: "You are driving along at 40 km/h. Observe the situation in the image.",
    statements: [
      { text: "Pedestrians or other road users may enter my path unexpectedly.", correct: true },
      { text: "I should be prepared to stop or take evasive action if needed.", correct: true },
      { text: "As long as I stay in my lane, I don't need to worry about others.", correct: false }
    ],
    explanation: "Always be alert for unexpected movements from pedestrians, cyclists, or other vehicles entering your path."
  },
  {
    id: "sit-5",
    img: "assets/images/exams/honmen/1/K057.jpg",
    scenario: "You are driving along at 25 km/h. Look at the surroundings in the image.",
    statements: [
      { text: "People (especially children) may suddenly appear from unexpected places.", correct: true },
      { text: "I should drive cautiously and be ready to stop immediately.", correct: true },
      { text: "At this slow speed, I don't need to be extra cautious.", correct: false }
    ],
    explanation: "Even at low speeds, always be prepared for unexpected pedestrian movements, especially in residential areas."
  },
  {
    id: "sit-6",
    img: "assets/images/exams/honmen/2/K025.jpg",
    scenario: "You are driving along at 30 km/h. Observe the traffic situation.",
    statements: [
      { text: "Other vehicles may change direction or speed unexpectedly.", correct: true },
      { text: "I should maintain safe distance and watch for signals from other drivers.", correct: true },
      { text: "Other drivers will always signal their intentions clearly.", correct: false }
    ],
    explanation: "Never assume other drivers will behave predictably. Always maintain safe distance and be ready for sudden changes."
  },
  {
    id: "sit-7",
    img: "assets/images/exams/honmen/2/K048.jpg",
    scenario: "You are driving along at 40 km/h. Look at the vehicles and surroundings.",
    statements: [
      { text: "Parked or stopped vehicles may have people exiting unexpectedly.", correct: true },
      { text: "I should slow down and leave extra space when passing stopped vehicles.", correct: true },
      { text: "Stopped vehicles are not a concern if they're not blocking my lane.", correct: false }
    ],
    explanation: "Stopped vehicles pose hazards: doors may open, pedestrians may appear, or vehicles may pull out suddenly."
  },
  {
    id: "sit-8",
    img: "assets/images/exams/honmen/2/K033.jpg",
    scenario: "You are driving along at 30 km/h. Assess the road conditions.",
    statements: [
      { text: "Road conditions ahead may require me to adjust my driving.", correct: true },
      { text: "I should be prepared to slow down or stop if conditions change.", correct: true },
      { text: "The road ahead looks fine, so I can continue without changes.", correct: false }
    ],
    explanation: "Road conditions can change quickly. Always observe ahead and be ready to adjust your speed and driving."
  },
  {
    id: "sit-9",
    img: "assets/images/exams/honmen/2/K051.jpg",
    scenario: "You are driving along at 30 km/h. Check for potential hazards.",
    statements: [
      { text: "Vehicles or pedestrians may approach from intersecting roads.", correct: true },
      { text: "I should check all directions and be prepared to yield if necessary.", correct: true },
      { text: "If I have priority, I don't need to watch for other road users.", correct: false }
    ],
    explanation: "Even with right of way, always check all directions. Other road users may not yield as expected."
  },
  {
    id: "sit-10",
    img: "assets/images/exams/honmen/3/K071.jpg",
    scenario: "You are driving along at 50 km/h. Consider the speed and conditions.",
    statements: [
      { text: "At this speed, my stopping distance is significantly longer.", correct: true },
      { text: "I need to look further ahead and anticipate hazards earlier.", correct: true },
      { text: "Higher speed means I can pass through hazards more quickly.", correct: false }
    ],
    explanation: "Higher speeds require greater awareness. Stopping distance increases significantly, so anticipate hazards earlier."
  },
  {
    id: "sit-11",
    img: "assets/images/exams/honmen/3/K028.jpg",
    scenario: "You are driving along at 40 km/h. Watch for hidden dangers.",
    statements: [
      { text: "Blind spots may hide motorcycles, bicycles, or pedestrians.", correct: true },
      { text: "I should check mirrors and blind spots frequently.", correct: true },
      { text: "My mirrors show everything I need to see.", correct: false }
    ],
    explanation: "All vehicles have blind spots. Regular mirror checks and head turns are essential for safe driving."
  },
  {
    id: "sit-12",
    img: "assets/images/exams/honmen/3/K052.jpg",
    scenario: "You are driving along at 40 km/h. Observe the traffic flow.",
    statements: [
      { text: "Vehicles ahead may brake suddenly without warning.", correct: true },
      { text: "I should maintain sufficient following distance at all times.", correct: true },
      { text: "Following closely helps me react faster to the vehicle ahead.", correct: false }
    ],
    explanation: "Tailgating reduces reaction time. Always maintain at least a 2-second following distance."
  },
  {
    id: "sit-13",
    img: "assets/images/exams/honmen/4/K027.jpg",
    scenario: "You are driving along at 40 km/h. Watch for pedestrians.",
    statements: [
      { text: "Pedestrians may cross at unexpected locations.", correct: true },
      { text: "I should watch for pedestrians along the entire roadside.", correct: true },
      { text: "Pedestrians only cross at designated crosswalks.", correct: false }
    ],
    explanation: "Pedestrians may cross anywhere. Always scan for pedestrians along the entire road."
  },
  {
    id: "sit-14",
    img: "assets/images/exams/honmen/4/K073.jpg",
    scenario: "You are driving along at 40 km/h. Look for two-wheeled vehicles.",
    statements: [
      { text: "Motorcycles and bicycles may be harder to see than cars.", correct: true },
      { text: "I should take extra care to look for smaller vehicles.", correct: true },
      { text: "Motorcycles and bicycles are always clearly visible.", correct: false }
    ],
    explanation: "Motorcycles and bicycles are smaller and easily hidden. Always double-check before changing lanes."
  },
  {
    id: "sit-15",
    img: "assets/images/exams/honmen/4/K061.jpg",
    scenario: "You are driving along at 40 km/h. Observe traffic signs and markings.",
    statements: [
      { text: "Road signs may indicate hazards or restrictions I need to follow.", correct: true },
      { text: "I should always observe and follow road signs and markings.", correct: true },
      { text: "I only need to follow signs in unfamiliar areas.", correct: false }
    ],
    explanation: "Road signs provide critical safety information. Always observe them, even on familiar routes."
  },
  {
    id: "sit-16",
    img: "assets/images/exams/honmen/4/K081.jpg",
    scenario: "You are driving along at 40 km/h. Watch other drivers' behavior.",
    statements: [
      { text: "Other vehicles may change lanes without adequate signaling.", correct: true },
      { text: "I should anticipate unexpected movements and leave escape room.", correct: true },
      { text: "All drivers signal properly, so I'll always have warning.", correct: false }
    ],
    explanation: "Many drivers signal late or not at all. Always leave space to maneuver if needed."
  }
];
