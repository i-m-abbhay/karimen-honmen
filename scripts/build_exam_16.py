"""Build exam JSON from browser-extracted raw data."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

RAW = [
  {"n":1,"q":"When an obstacle blocks one side of the road, vehicles on that side must yield by stopping or slowing down for oncoming traffic.","img":None,"expl":None},
  {"n":2,"q":"The traffic sign in the figure prohibits trucks with a capacity of 2 tons or more and heavy special vehicles.","img":"https://karimen-honmen.com/karimen/exams/16/%E7%B7%B4%E7%BF%92%E5%95%8F%E9%A1%8C%E7%94%BB%E9%9D%A2_files/A305-4.gif","expl":None},
  {"n":3,"q":"Overtaking requires changing lanes to pass a vehicle ahead, a complex action that drivers should avoid whenever possible.","img":None,"expl":None},
  {"n":4,"q":"Overtaking a vehicle that is passing a general sarguson moped is considered double overtaking.","img":None,"expl":"This is not classified as double overtaking in Japan."},
  {"n":5,"q":"When turning right on a one-way street, a vehicle must first approach the right edge of the road and decelerate near the intersection's center, adhering to any arrow markings (except at roundabouts).","img":None,"expl":None},
  {"n":6,"q":"The three traffic signals in the figure provide identical instructions for vehicles approaching from either direction.","img":"https://karimen-honmen.com/karimen/exams/16/%E7%B7%B4%E7%BF%92%E5%95%8F%E9%A1%8C%E7%94%BB%E9%9D%A2_files/C003-1.gif","expl":None},
  {"n":7,"q":"When overtaking a bicycle to turn left, a driver may sound the horn to warn the cyclist and proceed.","img":None,"expl":"Drivers must slow down or stop to allow the bicycle to pass first."},
  {"n":8,"q":"A vehicle can pass a stopped streetcar if no passengers are boarding or alighting in the safety zone.","img":None,"expl":"Vehicles must reduce speed in a safety zone with a stopped streetcar, even without passengers."},
  {"n":9,"q":"When a police officer at an intersection raises their arms vertically after extending them horizontally in an east-west direction, vehicles traveling east or west must stop at the designated spot.","img":None,"expl":None},
  {"n":10,"q":"At a pedestrian or bicycle crossing, vehicles must stop immediately before the thick white line, if present.","img":None,"expl":None},
  {"n":11,"q":"The traffic sign in the figure forbids vehicles from making right turns or proceeding straight through the intersection.","img":"https://karimen-honmen.com/karimen/exams/16/%E7%B7%B4%E7%BF%92%E5%95%8F%E9%A1%8C%E7%94%BB%E9%9D%A2_files/A311-2.gif","expl":None},
  {"n":12,"q":"Vehicles must reduce speed on both steep uphill and downhill slopes.","img":None,"expl":"There is no mandatory speed reduction for steep uphill slopes."},
  {"n":13,"q":"A vehicle experiences a wheelbase differential when making left or right turns.","img":None,"expl":None},
  {"n":14,"q":"On a road with two lanes per direction, ordinary vehicles must use the right-hand lane for travel.","img":None,"expl":"Vehicles must generally use the left-hand lane, except when overtaking or in specific circumstances."},
  {"n":15,"q":"The traffic sign in the figure indicates a student pedestrian crossing ahead.","img":"https://karimen-honmen.com/karimen/exams/16/%E7%B7%B4%E7%BF%92%E5%95%8F%E9%A1%8C%E7%94%BB%E9%9D%A2_files/A208.gif","expl":"This sign warns of nearby schools, kindergartens, or nurseries."},
  {"n":16,"q":"No signal is required when a driver reverses their vehicle.","img":None,"expl":"Drivers must use reverse lights or hand signals when backing up."},
  {"n":17,"q":"To overtake, a driver should first signal with the turn indicator and then check for safety behind.","img":None,"expl":"Safety behind must be checked before signaling to overtake."},
  {"n":18,"q":"A single driver or pedestrian ignoring traffic rules can cause confusion and potential accidents.","img":None,"expl":None},
  {"n":19,"q":"When driving in rain or feeling fatigued, a driver should increase the following distance due to extended stopping distances.","img":None,"expl":None},
  {"n":20,"q":"General mopeds in Japan are restricted to a maximum speed of 30 km/h.","img":None,"expl":None},
  {"n":21,"q":"The traffic sign shown in the figure alerts drivers to an upcoming intersection.","img":"https://karimen-honmen.com/karimen/exams/16/%E7%B7%B4%E7%BF%92%E5%95%8F%E9%A1%8C%E7%94%BB%E9%9D%A2_files/A201-1-1.gif","expl":None},
  {"n":22,"q":"Drivers must stop or reduce speed to ensure safe passage for people using wheelchairs, guide dogs, or white/yellow canes, indicating physical disabilities.","img":None,"expl":None},
  {"n":23,"q":"In the lanes depicted in the figure, vehicles in lane A may move to lane B, but vehicles in lane B cannot move to lane A.","img":"https://karimen-honmen.com/karimen/exams/16/%E7%B7%B4%E7%BF%92%E5%95%8F%E9%A1%8C%E7%94%BB%E9%9D%A2_files/ev001.png","expl":None},
  {"n":24,"q":"On a lightly trafficked road, changing lanes only requires signaling without a safety check.","img":None,"expl":"A safety check is mandatory when changing lanes, regardless of traffic volume."},
  {"n":25,"q":"Overtaking is not permitted at or within 30 meters before a pedestrian crossing.","img":None,"expl":None},
  {"n":26,"q":"Vehicles are allowed to cross sidewalks or bicycle paths to enter or exit roadside areas.","img":None,"expl":None},
  {"n":27,"q":"A flashing red traffic light mandates a stop at the designated line, with vehicles proceeding only after confirming safety.","img":None,"expl":None},
  {"n":28,"q":"At an intersection with the traffic signal shown in the figure, vehicles can freely choose to go straight, turn left, or turn right.","img":"https://karimen-honmen.com/karimen/exams/16/%E7%B7%B4%E7%BF%92%E5%95%8F%E9%A1%8C%E7%94%BB%E9%9D%A2_files/C001.gif","expl":"Mopeds or light vehicles using the two-step right turn method are not allowed to make a right turn at this signal."},
  {"n":29,"q":"In Japan, operating a vehicle while wearing sandals without heel straps or high-heeled shoes is not allowed.","img":None,"expl":None},
  {"n":30,"q":"A driver in Japan must carry a valid driver's license or an Individual Number Card with license details at all times while driving.","img":None,"expl":None},
  {"n":31,"q":"A standard Japanese driver's license allows the operation of both ordinary mopeds and small special vehicles.","img":None,"expl":None},
  {"n":32,"q":"Japanese traffic law requires that children under 6 years old be secured in an approved child restraint system when riding in a vehicle.","img":None,"expl":None},
  {"n":33,"q":"If there is enough space on the left side of a vehicle ahead, overtaking can be performed by passing on the left.","img":None,"expl":"Overtaking must generally be done on the right side of the vehicle being overtaken, as per Japanese traffic rules."},
  {"n":34,"q":"If a pedestrian is crossing near an intersection without a crosswalk, a vehicle should use the horn to warn them and continue.","img":None,"expl":"Vehicles must slow down or stop to allow pedestrians to cross safely, without using the horn."},
  {"n":35,"q":"When seeing the traffic sign shown in the figure, a driver is required to stop their vehicle completely, even if no vehicles or pedestrians are present on either side.","img":"https://karimen-honmen.com/karimen/exams/16/%E7%B7%B4%E7%BF%92%E5%95%8F%E9%A1%8C%E7%94%BB%E9%9D%A2_files/A330.gif","expl":None},
  {"n":36,"q":"In Japan, it is illegal to operate a vehicle while holding and using a mobile phone for calls or texting.","img":None,"expl":None},
  {"n":37,"q":"The pavement marking shown in the figure designates a zone where entry is prohibited.","img":"https://karimen-honmen.com/karimen/exams/16/%E7%B7%B4%E7%BF%92%E5%95%8F%E9%A1%8C%E7%94%BB%E9%9D%A2_files/b107.gif","expl":"This marking indicates a zone where stopping is prohibited."},
  {"n":38,"q":"The default speed limit for passenger cars on Japanese expressways, unless otherwise indicated, is 100 km/h.","img":None,"expl":None},
  {"n":39,"q":"A yellow traffic light allows vehicles to proceed with caution while monitoring other traffic.","img":None,"expl":"Vehicles must stop at the stop line when the light is yellow, unless stopping safely is not feasible."},
  {"n":40,"q":"After changing lanes, a driver should stop signaling about 3 seconds after completing the maneuver.","img":None,"expl":"Signaling must cease immediately after the lane change is complete."},
  {"n":41,"q":"In Japan, drivers must ensure that all passengers, including those in the rear seats, wear seatbelts during vehicle operation.","img":None,"expl":None},
  {"n":42,"q":"Worn tires shorten braking distance due to a larger contact area with the road.","img":None,"expl":"Worn tires reduce traction, resulting in a longer braking distance."},
  {"n":43,"q":"Following the arrow in the figure is the correct way to enter a gas station on the right side of the road.","img":"https://karimen-honmen.com/karimen/exams/16/%E7%B7%B4%E7%BF%92%E5%95%8F%E9%A1%8C%E7%94%BB%E9%9D%A2_files/ev005.png","expl":"Vehicles must first move toward the road's center before turning right."},
  {"n":44,"q":"The traffic sign shown in the figure prohibits vehicles from making U-turns.","img":"https://karimen-honmen.com/karimen/exams/16/%E7%B7%B4%E7%BF%92%E5%95%8F%E9%A1%8C%E7%94%BB%E9%9D%A2_files/A312.gif","expl":"This sign prohibits vehicles from crossing the road."},
  {"n":45,"q":"The traffic sign shown permits non-bus vehicles to use the lane when no buses are nearby or traffic is low, except for special light vehicles, mopeds, and light vehicles.","img":"https://karimen-honmen.com/karimen/exams/16/%E7%B7%B4%E7%BF%92%E5%95%8F%E9%A1%8C%E7%94%BB%E9%9D%A2_files/A327-4.gif","expl":"Non-bus vehicles may use the bus lane only in unavoidable cases, such as road construction or left turns."},
  {"n":46,"q":"The pavement marking shown in the figure marks the end of a 50 km/h speed limit zone.","img":"https://karimen-honmen.com/karimen/exams/16/%E7%B7%B4%E7%BF%92%E5%95%8F%E9%A1%8C%E7%94%BB%E9%9D%A2_files/B115-1.gif","expl":None},
  {"n":47,"q":"In the situation shown in the figure, vehicle B may pass before vehicle A.","img":"https://karimen-honmen.com/karimen/exams/16/%E7%B7%B4%E7%BF%92%E5%95%8F%E9%A1%8C%E7%94%BB%E9%9D%A2_files/C103-2.gif","expl":"Vehicle A has priority, so vehicle B must wait."},
  {"n":48,"q":"The traffic sign in the figure bans all traffic from passing through the road.","img":"https://karimen-honmen.com/karimen/exams/16/%E7%B7%B4%E7%BF%92%E5%95%8F%E9%A1%8C%E7%94%BB%E9%9D%A2_files/A302.gif","expl":"This sign prohibits vehicle passage, but pedestrians and small remote-controlled vehicles are permitted."},
  {"n":49,"q":"The traffic sign in the figure mandates that general mopeds use a two-step right turn method.","img":"https://karimen-honmen.com/karimen/exams/16/%E7%B7%B4%E7%BF%92%E5%95%8F%E9%A1%8C%E7%94%BB%E9%9D%A2_files/a327-9.gif","expl":"This sign requires general mopeds to make a direct right turn, like automobiles."},
  {"n":50,"q":"If a local bus at a stop signals to merge, other vehicles can pass by using the horn to alert it.","img":None,"expl":"Other vehicles must slow down to avoid obstructing the bus merging into traffic."},
]

if __name__ == "__main__":
    import urllib.parse
    import urllib.request

    exam_type, number = "karimen", 16
    questions = []
    for item in RAW:
        q = {"q": item["q"], "answer": 0 if item["expl"] else 1}
        if item["expl"]:
            q["explanation"] = item["expl"]
        if item["img"]:
            name = Path(urllib.parse.urlparse(item["img"]).path).name
            dest = ROOT / "assets" / "images" / "exams" / exam_type / str(number) / name
            dest.parent.mkdir(parents=True, exist_ok=True)
            if not dest.exists():
                req = urllib.request.Request(item["img"], headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, timeout=60) as resp:
                    dest.write_bytes(resp.read())
                print("downloaded", name)
            q["img"] = str(dest.relative_to(ROOT)).replace("\\", "/")
        questions.append(q)

    exam = {
        "id": f"{exam_type}-{number}",
        "title": f"Karimen Practice Test {number}",
        "type": exam_type,
        "number": number,
        "source": f"https://karimen-honmen.com/en/exam/{exam_type}/{number}",
        "passScore": 90,
        "pointsPerQuestion": 2,
        "timeLimitMinutes": 30,
        "questionCount": len(questions),
        "questions": questions,
    }

    (ROOT / "exams").mkdir(exist_ok=True)
    (ROOT / "exams" / f"{exam['id']}.json").write_text(
        json.dumps(exam, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    catalog = [{
        "id": exam["id"],
        "title": exam["title"],
        "type": exam["type"],
        "number": exam["number"],
        "file": f"exams/{exam['id']}.json",
        "questionCount": exam["questionCount"],
        "passScore": exam["passScore"],
        "timeLimitMinutes": exam["timeLimitMinutes"],
    }]
    (ROOT / "exams-catalog.json").write_text(json.dumps(catalog, indent=2), encoding="utf-8")

    out = ROOT / "exams-data.js"
    out.write_text(
        "const EXAM_CATALOG = " + json.dumps(catalog, indent=2)
        + ";\n\nconst EXAMS = " + json.dumps({exam["id"]: exam}, indent=2, ensure_ascii=False)
        + ";\n",
        encoding="utf-8",
    )
    print("done", len(questions), "questions")
