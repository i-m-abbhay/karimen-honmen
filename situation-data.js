// Situation-Based Test Data
// Each question has an image, scenario, and multiple statements to evaluate
// Users must identify ALL correct statements (multiple correct answers possible)

const SITUATION_QUESTIONS = [
  {
    id: "sit-1",
    img: "assets/images/exams/honmen/1/K044.jpg",
    scenario: "You are driving along at 40 km/h on a road with parked cars on the left.",
    statements: [
      { text: "A pedestrian may suddenly appear from between the parked cars.", correct: true },
      { text: "A car door may suddenly open from one of the parked vehicles.", correct: true },
      { text: "You can maintain your current speed since the road ahead is clear.", correct: false }
    ],
    explanation: "When passing parked cars, always anticipate pedestrians stepping out and doors opening unexpectedly. Reduce speed and leave safe distance."
  },
  {
    id: "sit-2",
    img: "assets/images/exams/honmen/1/K085.jpg",
    scenario: "While driving on an expressway at 80 km/h, the hazard lights of the vehicle ahead begin to flash.",
    statements: [
      { text: "Traffic may be congested or stopped ahead.", correct: true },
      { text: "You should begin slowing down and prepare to stop.", correct: true },
      { text: "You can continue at current speed since the vehicle ahead is still moving.", correct: false }
    ],
    explanation: "Hazard lights on expressways warn of danger ahead. Begin decelerating immediately and increase following distance."
  },
  {
    id: "sit-3",
    img: "assets/images/exams/honmen/1/K069.jpg",
    scenario: "You are driving along at 35 km/h. The road is covered with steel plates due to construction.",
    statements: [
      { text: "Steel plates become very slippery when wet.", correct: true },
      { text: "You should avoid sudden braking or steering on the steel plates.", correct: true },
      { text: "Steel plates provide better grip than regular asphalt.", correct: false }
    ],
    explanation: "Steel plates are extremely slippery, especially when wet. Reduce speed before reaching them and avoid sudden maneuvers."
  },
  {
    id: "sit-4",
    img: "assets/images/exams/honmen/1/K026.jpg",
    scenario: "You are driving along at 40 km/h approaching a crosswalk with a pedestrian waiting.",
    statements: [
      { text: "The pedestrian may begin crossing at any moment.", correct: true },
      { text: "You should be prepared to stop before the crosswalk.", correct: true },
      { text: "If the pedestrian is waiting, you can pass without stopping.", correct: false }
    ],
    explanation: "When pedestrians are waiting at a crosswalk, they have right of way. Be prepared to stop and let them cross safely."
  },
  {
    id: "sit-5",
    img: "assets/images/exams/honmen/1/K057.jpg",
    scenario: "You are driving along at 25 km/h in a residential area with children playing nearby.",
    statements: [
      { text: "Children may suddenly run into the road without looking.", correct: true },
      { text: "You should reduce speed further and be ready to stop.", correct: true },
      { text: "Since you're already driving slowly, no extra caution is needed.", correct: false }
    ],
    explanation: "Children are unpredictable and may dash into the road. Always drive very slowly near playing children and be ready to stop instantly."
  },
  {
    id: "sit-6",
    img: "assets/images/exams/honmen/2/K025.jpg",
    scenario: "You are driving along at 30 km/h on a narrow road with a bicycle ahead.",
    statements: [
      { text: "The bicycle may wobble or suddenly change direction.", correct: true },
      { text: "You should maintain safe distance and wait for a safe opportunity to pass.", correct: true },
      { text: "You can pass closely since bicycles move predictably.", correct: false }
    ],
    explanation: "Bicycles can be unstable and may swerve unexpectedly. Keep safe distance and only pass when there's adequate space."
  },
  {
    id: "sit-7",
    img: "assets/images/exams/honmen/2/K012.jpg",
    scenario: "You are turning left at 15 km/h at an intersection where the pedestrian light has begun to flash.",
    statements: [
      { text: "Pedestrians may try to rush across before the light changes.", correct: true },
      { text: "You should watch carefully for pedestrians in the crosswalk.", correct: true },
      { text: "Since the light is flashing, pedestrians will wait and not cross.", correct: false }
    ],
    explanation: "A flashing pedestrian light means some people will rush to cross. Always give way to pedestrians when turning."
  },
  {
    id: "sit-8",
    img: "assets/images/exams/honmen/2/K048.jpg",
    scenario: "You are driving along at 40 km/h and a bus ahead has stopped at a bus stop.",
    statements: [
      { text: "Passengers getting off may walk around the bus into your lane.", correct: true },
      { text: "The bus may pull out suddenly without warning.", correct: true },
      { text: "You can pass the bus at full speed since it's stopped.", correct: false }
    ],
    explanation: "Stopped buses pose multiple hazards: passengers may emerge, and the bus may depart. Slow down and pass carefully."
  },
  {
    id: "sit-9",
    img: "assets/images/exams/honmen/2/K033.jpg",
    scenario: "You are driving along at 30 km/h approaching a curve with limited visibility.",
    statements: [
      { text: "There may be oncoming traffic hidden by the curve.", correct: true },
      { text: "You should reduce speed before entering the curve.", correct: true },
      { text: "You can maintain speed if you stay in your lane.", correct: false }
    ],
    explanation: "Blind curves hide potential hazards. Always slow down before curves and be prepared for oncoming vehicles or obstacles."
  },
  {
    id: "sit-10",
    img: "assets/images/exams/honmen/2/K051.jpg",
    scenario: "You are driving along at 30 km/h on a rainy day with wet roads.",
    statements: [
      { text: "Braking distance is longer on wet roads.", correct: true },
      { text: "You should increase following distance.", correct: true },
      { text: "Wet roads have the same grip as dry roads if you drive carefully.", correct: false }
    ],
    explanation: "Wet roads significantly reduce tire grip. Increase following distance and reduce speed to account for longer braking distances."
  },
  {
    id: "sit-11",
    img: "assets/images/exams/honmen/3/K001.jpg",
    scenario: "You are driving at 40 km/h and see a truck ahead making a wide right turn.",
    statements: [
      { text: "The truck's rear may swing out into your lane.", correct: true },
      { text: "You should wait until the truck completes its turn.", correct: true },
      { text: "You can pass on the left while the truck turns right.", correct: false }
    ],
    explanation: "Large vehicles have significant rear overhang when turning. Never try to pass on the inside of a turning truck."
  },
  {
    id: "sit-12",
    img: "assets/images/exams/honmen/3/K015.jpg",
    scenario: "You are approaching a railway crossing with the warning lights flashing.",
    statements: [
      { text: "A train is approaching and you must stop.", correct: true },
      { text: "You should stop before the stop line and wait.", correct: true },
      { text: "If you don't see a train yet, you can cross quickly.", correct: false }
    ],
    explanation: "Flashing lights mean a train is approaching. Always stop completely and wait until the lights stop and barriers rise."
  },
  {
    id: "sit-13",
    img: "assets/images/exams/honmen/4/K023.jpg",
    scenario: "You are driving at night at 50 km/h with oncoming traffic.",
    statements: [
      { text: "Your vision may be impaired by oncoming headlights.", correct: true },
      { text: "Pedestrians between vehicles may be hard to see.", correct: true },
      { text: "Night driving is safe as long as you use high beams.", correct: false }
    ],
    explanation: "Night driving reduces visibility and oncoming lights cause glare. Watch carefully for pedestrians and avoid staring at headlights."
  },
  {
    id: "sit-14",
    img: "assets/images/exams/honmen/5/K032.jpg",
    scenario: "You are driving at 35 km/h and see an elderly person walking on the roadside.",
    statements: [
      { text: "Elderly pedestrians may have slower reactions and move unpredictably.", correct: true },
      { text: "You should slow down and give them extra space.", correct: true },
      { text: "Elderly people always stay on the sidewalk, so no caution needed.", correct: false }
    ],
    explanation: "Elderly pedestrians may have mobility issues or hearing impairment. Always slow down and be prepared for unexpected movements."
  },
  {
    id: "sit-15",
    img: "assets/images/exams/honmen/6/K041.jpg",
    scenario: "You are driving at 40 km/h and a motorcycle is in your blind spot.",
    statements: [
      { text: "The motorcycle may be difficult to see in mirrors.", correct: true },
      { text: "You should check blind spots before changing lanes.", correct: true },
      { text: "Motorcycles always stay visible, so mirrors are sufficient.", correct: false }
    ],
    explanation: "Motorcycles can easily hide in blind spots. Always do a head check before changing lanes or merging."
  },
  {
    id: "sit-16",
    img: "assets/images/exams/honmen/7/K055.jpg",
    scenario: "You are driving at 30 km/h in foggy conditions with limited visibility.",
    statements: [
      { text: "Vehicles ahead may be closer than they appear.", correct: true },
      { text: "You should use fog lights and reduce speed significantly.", correct: true },
      { text: "High beam headlights improve visibility in fog.", correct: false }
    ],
    explanation: "Fog drastically reduces visibility. Use low beams or fog lights (high beams reflect off fog), reduce speed, and increase following distance."
  },
  {
    id: "sit-17",
    img: "assets/images/exams/honmen/8/K062.jpg",
    scenario: "You are driving at 50 km/h and approaching a school zone during school hours.",
    statements: [
      { text: "Children may cross the road unexpectedly.", correct: true },
      { text: "You should reduce speed even if no children are visible.", correct: true },
      { text: "School zones only require caution during dismissal time.", correct: false }
    ],
    explanation: "School zones require extra caution during all school hours. Children may appear suddenly from various directions."
  },
  {
    id: "sit-18",
    img: "assets/images/exams/honmen/9/K071.jpg",
    scenario: "You are driving at 40 km/h and see a ball roll into the road ahead.",
    statements: [
      { text: "A child may run into the road chasing the ball.", correct: true },
      { text: "You should immediately slow down and prepare to stop.", correct: true },
      { text: "Since it's just a ball, you can swerve around it and continue.", correct: false }
    ],
    explanation: "A ball in the road often means a child will follow. This is a classic hazard pattern - always stop and wait."
  },
  {
    id: "sit-19",
    img: "assets/images/exams/honmen/10/K078.jpg",
    scenario: "You are merging onto an expressway at the acceleration lane.",
    statements: [
      { text: "You should match the speed of traffic on the main road.", correct: true },
      { text: "You must yield to vehicles already on the expressway.", correct: true },
      { text: "Vehicles on the expressway must slow down to let you merge.", correct: false }
    ],
    explanation: "When merging, accelerate to match traffic speed and yield to vehicles on the main road. They have right of way."
  },
  {
    id: "sit-20",
    img: "assets/images/exams/honmen/11/K088.jpg",
    scenario: "You are driving at 30 km/h and see a delivery truck double-parked ahead.",
    statements: [
      { text: "The delivery person may walk around the truck unexpectedly.", correct: true },
      { text: "You should check for oncoming traffic before passing.", correct: true },
      { text: "Double-parked vehicles are always stationary, so you can pass quickly.", correct: false }
    ],
    explanation: "Double-parked vehicles create hazards: people may appear, and you may need to enter oncoming lane to pass. Check carefully."
  }
];

// Export for use in special-tests.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SITUATION_QUESTIONS };
}
