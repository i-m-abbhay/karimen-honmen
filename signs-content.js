const CHAPTER_IMAGES = {
  "safety-zone": [
    {
      "img": "assets/images/shiji11.jpg",
      "alt": "Safety Zone Sign",
      "caption": "Safety Zone Sign"
    },
    {
      "img": "assets/images/p16.jpg",
      "alt": "When passing through a safety zone",
      "caption": "When passing through a safety zone"
    }
  ],
  "horn-usage": [
    {
      "img": "assets/images/kisei43m.jpg",
      "alt": "Honk sign",
      "caption": "Honk sign"
    },
    {
      "img": "assets/images/kisei44m.jpg",
      "alt": "Horn-required area sign",
      "caption": "Horn-required area sign"
    }
  ],
  "no-space-parking": [
    {
      "img": "assets/images/kisei20.jpg",
      "alt": "Parking space requirement sign",
      "caption": "Parking space requirement sign"
    }
  ],
  "priority-intersections": [
    {
      "img": "assets/images/shiji05.jpg",
      "alt": "Priority road sign",
      "caption": "Priority road sign"
    },
    {
      "img": "assets/images/p27_01.jpg",
      "alt": "Centerline extending into intersection",
      "caption": "Centerline extending into intersection"
    },
    {
      "img": "assets/images/p27_02.jpg",
      "alt": "Priority by direction of travel",
      "caption": "Priority by direction of travel"
    }
  ]
};

const TRAFFIC_SIGN_CATEGORIES = [
  {
    "name": "Prohibition signs (regulations)",
    "signs": [
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei01.jpg",
        "title": "No Passage",
        "desc": "No passage is allowed for all pedestrians, vehicles, and trams."
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei02.jpg",
        "title": "No Vehicle Passage",
        "desc": "Vehicles (automobiles, motorized bicycles, and light vehicles) are not allowed to pass."
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei03.jpg",
        "title": "No Vehicle Entry",
        "desc": "Vehicles are not allowed to enter (often placed at the exit of one-way roads)."
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei04.jpg",
        "title": "No Passage for Non-Motorcycle Vehicles",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei05.jpg",
        "title": "No Passage for Large Cargo Vehicles, etc.",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei06.jpg",
        "title": "No Passage for Cargo Vehicles Exceeding Specified Maximum Load",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei07.jpg",
        "title": "No Passage for Large Passenger Vehicles, etc.",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei08.jpg",
        "title": "No Passage for Motorcycles and Motorized Bicycles",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei09.jpg",
        "title": "No Passage for Light Vehicles Except Bicycles",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei10.jpg",
        "title": "No Bicycle Passage",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei11.jpg",
        "title": "No Passage for Specified Vehicle Combinations",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei12.png",
        "title": "No Two-Person Riding on Large and Standard Motorcycles",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei13.jpg",
        "title": "No Travel Except in Designated Direction",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei14.jpg",
        "title": "No Vehicle Crossing",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei15.jpg",
        "title": "No U-Turn",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei16.jpg",
        "title": "No Overtaking by Crossing Right Side",
        "desc": "Vehicles must not cross to the right side of the road to overtake (overtaking without crossing to the right side is allowed)."
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei17.jpg",
        "title": "No Overtaking",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei18.jpg",
        "title": "No Parking or Stopping",
        "desc": "Vehicles are not allowed to park or stop (numbers indicate prohibited hours)."
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei19.jpg",
        "title": "No Parking",
        "desc": "Vehicles are not allowed to park (stopping briefly is allowed)."
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei20.jpg",
        "title": "Parking Space Requirement",
        "desc": "Vehicles must not park unless there is the parking space indicated by the supplementary sign on the right side."
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei21.jpg",
        "title": "Time-Restricted Parking Zone",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei22.jpg",
        "title": "No Passage for Vehicles Carrying Hazardous Materials",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei23.jpg",
        "title": "Weight Limit",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei24.jpg",
        "title": "Height Limit",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei25.jpg",
        "title": "Width Limit",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei26.jpg",
        "title": "Maximum Speed",
        "desc": "Vehicles must not exceed the maximum speed indicated. Motorized bicycles follow legal limit if sign exceeds it."
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei27.jpg",
        "title": "Maximum Speed for Specific Vehicle Types",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei28.jpg",
        "title": "Minimum Speed",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei29.jpg",
        "title": "Motor Vehicles Only",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei30.jpg",
        "title": "Bicycles Only",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei31.jpg",
        "title": "Bicycles and Pedestrians Only",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei32.jpg",
        "title": "Pedestrians Only",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei33.jpg",
        "title": "One-Way Traffic",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei34.jpg",
        "title": "Vehicle Lane Designation",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei35.jpg",
        "title": "Lane Designation for Specific Vehicle Types",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei36.jpg",
        "title": "Lane Designation for Towed Vehicles on Highways",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei37.jpg",
        "title": "Dedicated Lane",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei38.jpg",
        "title": "Priority Lane for Route Buses, etc.",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei39.jpg",
        "title": "Designated First Lane for Towed Vehicles on Motor Vehicle Roads",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei40.jpg",
        "title": "Directional Lane Designation",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei41.jpg",
        "title": "Two-Stage Right Turn for Motorized Bicycles",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei42.jpg",
        "title": "Small Right Turn for Motorized Bicycles",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei43.jpg",
        "title": "Sound Horn",
        "desc": "Indicates a location where vehicles and trams must sound their horn."
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei44.jpg",
        "title": "Horn Use Zone",
        "desc": "Indicates a zone where vehicles and trams must sound their horn."
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei45.jpg",
        "title": "Proceed Slowly",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei46.jpg",
        "title": "Priority Road Ahead",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei47.jpg",
        "title": "Stop",
        "desc": "Vehicles must stop immediately before the stop line, or before the intersection if no stop line."
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei48.jpg",
        "title": "Priority Road Ahead and Stop",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei49.jpg",
        "title": "No Pedestrian Passage",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei50.jpg",
        "title": "No Pedestrian Crossing",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei51.jpg",
        "title": "Time-Restricted Parking Zone for Elderly Drivers, etc.",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei52.jpg",
        "title": "Clockwise Traffic at Roundabout",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/kisei/images/kisei53.jpg",
        "title": "One-Way Bicycle Traffic",
        "desc": ""
      }
    ]
  },
  {
    "name": "Guide signs",
    "signs": [
      {
        "img": "assets/images/hyoushiki/shiji/images/shiji01.jpg",
        "title": "Bicycles May Ride Side by Side",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/shiji/images/shiji02.jpg",
        "title": "Vehicles Permitted on Tram Tracks",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/shiji/images/shiji03.jpg",
        "title": "Parking Permitted",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/shiji/images/shiji04.jpg",
        "title": "Stopping Permitted",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/shiji/images/shiji05.jpg",
        "title": "Priority Road",
        "desc": "Indicates that the road with the sign is a priority road."
      },
      {
        "img": "assets/images/hyoushiki/shiji/images/shiji06.jpg",
        "title": "Center Line",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/shiji/images/shiji07.jpg",
        "title": "Stop Line",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/shiji/images/shiji08.jpg",
        "title": "Pedestrian Crossing",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/shiji/images/shiji09.jpg",
        "title": "Bicycle Crossing",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/shiji/images/shiji10.jpg",
        "title": "Pedestrian and Bicycle Crossing",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/shiji/images/shiji11.jpg",
        "title": "Safety Zone",
        "desc": "Indicates a safety zone for pedestrians where vehicles are not allowed to pass."
      },
      {
        "img": "assets/images/hyoushiki/shiji/images/shiji12.jpg",
        "title": "Advance Notice of Regulation",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/shiji/images/shiji13.jpg",
        "title": "Stopping Permitted for Elderly Driver Designated Vehicles",
        "desc": ""
      }
    ]
  },
  {
    "name": "Warning signs",
    "signs": [
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai01.jpg",
        "title": "Crossroad Intersection Ahead",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai02.jpg",
        "title": "T-Shaped Intersection Ahead",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai03.jpg",
        "title": "T-Shaped Intersection Ahead",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai04.jpg",
        "title": "Y-Shaped Intersection Ahead",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai05.jpg",
        "title": "Roundabout Ahead",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai06.jpg",
        "title": "Right (Left) Curve Ahead",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai07.jpg",
        "title": "Right (Left) Sharp Turn Ahead",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai08.jpg",
        "title": "Right (Left) Reverse Curve Ahead",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai09.jpg",
        "title": "Right (Left) Reverse Sharp Turn Ahead",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai10.jpg",
        "title": "Right (Left) Hairpin Curve Ahead",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai11.jpg",
        "title": "Railway Crossing Ahead",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai12.jpg",
        "title": "School, Kindergarten, Nursery, etc. Ahead",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai13.jpg",
        "title": "Traffic Signal Ahead",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai14.jpg",
        "title": "Slippery Road",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai15.jpg",
        "title": "Falling Rocks Hazard",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai16.jpg",
        "title": "Uneven Road Surface",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai17.jpg",
        "title": "Merging Traffic Ahead",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai18.jpg",
        "title": "Lane Reduction Ahead",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai19.jpg",
        "title": "Road Narrows Ahead",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai20.jpg",
        "title": "Two-Way Traffic",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai21.jpg",
        "title": "Steep Uphill Grade Ahead",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai22.jpg",
        "title": "Steep Downhill Grade Ahead",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai23.jpg",
        "title": "Road Work in Progress",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai24.jpg",
        "title": "Crosswind Caution",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai25.jpg",
        "title": "Animal Crossing Hazard",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/keikai/images/keikai26.jpg",
        "title": "Other Hazards",
        "desc": ""
      }
    ]
  },
  {
    "name": "Guide signs (instructions)",
    "signs": [
      {
        "img": "assets/images/hyoushiki/annai/images/annai01.png",
        "title": "Municipality",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai02.png",
        "title": "Prefecture",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai03.png",
        "title": "Prefecture",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai04.jpg",
        "title": "Entrance Direction",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai05.jpg",
        "title": "Entrance Advance Notice",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai06.jpg",
        "title": "Designated Road with Relaxed Gross Weight Limit",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai07.png",
        "title": "Designated Road with Relaxed Height Limit",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai08.jpg",
        "title": "Direction and Distance",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai09.jpg",
        "title": "Direction and Lane",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai10.gif",
        "title": "Exit Advance Notice",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai11.jpg",
        "title": "Direction and Orientation Advance Notice",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai12.jpg",
        "title": "Direction and Orientation",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai13.png",
        "title": "Direction, Orientation, and Distance",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai14.jpg",
        "title": "Direction, Orientation, and Road Nickname Advance Notice",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai15.jpg",
        "title": "Direction, Orientation, and Road Nickname",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai16.png",
        "title": "Direction and Exit Advance Notice",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai17.jpg",
        "title": "Direction, Lane, and Exit Advance Notice",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai18.jpg",
        "title": "Direction and Exit",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai19.jpg",
        "title": "Exit",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai20.jpg",
        "title": "Notable Location",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai21.png",
        "title": "Major Location",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai22.gif",
        "title": "Toll Booth",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai23.gif",
        "title": "Service Area Advance Notice",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai24.gif",
        "title": "Service Area",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai25.jpg",
        "title": "Emergency Telephone",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai26.jpg",
        "title": "Pull-off Area",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai27.jpg",
        "title": "Emergency Parking Strip",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai28.jpg",
        "title": "Parking Lot",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai29.jpg",
        "title": "Climbing Lane",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai30.jpg",
        "title": "National Highway Number",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai31.jpg",
        "title": "Prefectural Road Number",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai32.jpg",
        "title": "Road Nickname",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai33.png",
        "title": "Detour",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai34.jpg",
        "title": "Sloped Road",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai35.jpg",
        "title": "Bus Stop",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/annai/images/annai36.jpg",
        "title": "Tram Stop",
        "desc": ""
      }
    ]
  },
  {
    "name": "Auxiliary signs (supplementary information)",
    "signs": [
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo01.jpg",
        "title": "Distance/Area",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo02.jpg",
        "title": "Day/Time",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo03.jpg",
        "title": "Vehicle Type",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo04.gif",
        "title": "Parking Space",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo05.jpg",
        "title": "Start",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo06.jpg",
        "title": "Within Section/Area",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo07.jpg",
        "title": "End",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo08.gif",
        "title": "No Overtaking",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo09.jpg",
        "title": "School Route",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo10.jpg",
        "title": "Railway Crossing Caution",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo11.jpg",
        "title": "Crosswind Caution",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo12.jpg",
        "title": "Animal Caution",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo13.jpg",
        "title": "Caution",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo14.jpg",
        "title": "Caution Notes",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo15.jpg",
        "title": "Reason for Restriction",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo16.jpg",
        "title": "Direction",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo17.jpg",
        "title": "Place Name",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo18.gif",
        "title": "Priority Road Ahead",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo19.jpg",
        "title": "Starting Point",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo20.jpg",
        "title": "Endpoint",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/hojo/images/hojo21.jpg",
        "title": "Designated Vehicle Only",
        "desc": ""
      }
    ]
  },
  {
    "name": "Other",
    "signs": [
      {
        "img": "assets/images/hyoushiki/etc/images/etc01.jpg",
        "title": "Novice Driver Sign",
        "desc": "Required within one year of obtaining a license. Surrounding drivers must protect these vehicles."
      },
      {
        "img": "assets/images/hyoushiki/etc/images/etc02.jpg",
        "title": "Elderly Driver Sign",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/etc/images/etc03.jpg",
        "title": "Physically Disabled Driver Sign",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/etc/images/etc04.jpg",
        "title": "Hearing-Impaired Driver Sign",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/etc/images/etc05.jpg",
        "title": "Provisional License Practice Sign",
        "desc": "Required to be displayed by provisional license holders when practicing on the road."
      },
      {
        "img": "assets/images/hyoushiki/etc/images/etc06.jpg",
        "title": "Left Turn Permitted",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/etc/images/etc07.jpg",
        "title": "Wheel Clamp Zone",
        "desc": ""
      },
      {
        "img": "assets/images/hyoushiki/etc/images/etc08.jpg",
        "title": "Designated Fire Hydrant",
        "desc": ""
      }
    ]
  }
];
