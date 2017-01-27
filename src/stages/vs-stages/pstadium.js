import {Box2D} from "../../main/util/Box2D";
import {Vec2D} from "../../main/util/Vec2D";

/*eslint indent:0*/ 

export default {
  name : "pstadium",
  box: [],
  polygon : [[ new Vec2D(-87.75, 0), new Vec2D(87.75, 0), new Vec2D(87.75, -4), new Vec2D(73.75, -15)
             , new Vec2D(73.75, -17.75), new Vec2D(60, -17.75), new Vec2D(60, -38), new Vec2D(15, -60)
             , new Vec2D(15, -112), new Vec2D(-15, -112)
             , new Vec2D(-15, -60), new Vec2D(-60, -38), new Vec2D(-60, -17.75), new Vec2D(-73.75, -17.75)
             , new Vec2D(-73.75, -15), new Vec2D(-87.75, -4)
             ]],
  platform: [[new Vec2D(-55, 25), new Vec2D(-25, 25)], [new Vec2D(25, 25), new Vec2D(55, 25)]],
  ground: [[new Vec2D(-87.75, 0), new Vec2D(87.75, 0)]],
  ceiling: [[new Vec2D(-73.75, -17.75), new Vec2D(-60, -17.75)], [new Vec2D(-60, -38), new Vec2D(-15, -60)],  [new Vec2D(-15, -112), new Vec2D(15, -112)], [new Vec2D(15, -60), new Vec2D(60, -38)], [new Vec2D(60, -17.75), new Vec2D(73.75, -17.75)] ],
  wallL: [[new Vec2D(-87.75, 0),new Vec2D(-87.75, -4)],[new Vec2D(-87.75, -4),new Vec2D(-73.75, -15)],[new Vec2D(-73.75, -15),new Vec2D(-73.75, -17.75)],[new Vec2D(-60, -17.75), new Vec2D(-60, -38)],[new Vec2D(-15, -60), new Vec2D(-15, -112)]],
  wallR: [[new Vec2D(87.75, 0),new Vec2D(87.75, -4)],[new Vec2D(87.75, -4),new Vec2D(73.75, -15)],[new Vec2D(73.75, -15),new Vec2D(73.75, -17.75)],[new Vec2D(60, -17.75), new Vec2D(60, -38)],[new Vec2D(15, -60), new Vec2D(15, -112)]],
  startingPoint: [new Vec2D(-45, 44), new Vec2D(45, 44), new Vec2D(-25, 44), new Vec2D(25, 44)],
  startingFace: [1, -1, 1, -1],
  respawnPoints: [new Vec2D(-45, 44), new Vec2D(45, 44), new Vec2D(-25, 44), new Vec2D(25, 44)],
  respawnFace: [1, -1, 1, -1],
  blastzone: new Box2D([-230, -111], [230, 180]),
  ledge: [["ground", 0, 0], ["ground", 0, 1]],
  ledgePos: [new Vec2D(-87.75, 0), (new Vec2D(87.75, 0))],
  scale: 4.2,
  offset: [600, 500],
  movingPlats: [],
  movingPlatforms: function () {
  }
};