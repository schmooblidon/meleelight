import {Box2D} from "../../main/util/Box2D";
import {Vec2D} from "../../main/util/Vec2D";

export default {
  name : "fdest",
  box: [],
  polygon : [ [ new Vec2D(-85.6, 0), new Vec2D(85.6, 0), new Vec2D(85.6, -10), new Vec2D(65, -20), new Vec2D(65, -30)
              , new Vec2D(60, -47), new Vec2D(50, -55), new Vec2D(45, -56), new Vec2D(-45, -56), new Vec2D(-50, -55)
              , new Vec2D(-60, -47), new Vec2D(-65, -30), new Vec2D(-65, -20), new Vec2D(-85.6, -10) ]],
  platform: [],
  ground: [[new Vec2D(-85.6, 0), new Vec2D(85.6, 0)]],
  ceiling: [[new Vec2D(-50, -55), new Vec2D(-45, -56)], [new Vec2D(-45, -56), new Vec2D(45, -56)], [new Vec2D(45, -56), new Vec2D(50, -55)]],  
  wallL: [[new Vec2D(-85.6, 0), new Vec2D(-85.6, -10)],[new Vec2D(-85.6, -10), new Vec2D(-65, -20)],[new Vec2D(-65, -20), new Vec2D(-65, -30)], [new Vec2D(-65, -30), new Vec2D(-60, -47)],[new Vec2D(-60, -47), new Vec2D(-50, -55)] ],
  wallR: [[new Vec2D(85.6, 0), new Vec2D(85.6, -10)],[new Vec2D(85.6, -10), new Vec2D(65, -20)],[new Vec2D(65, -20), new Vec2D(65, -30)], [new Vec2D(65, -30), new Vec2D(60, -47)],[new Vec2D(60, -47), new Vec2D(50, -55)] ],
  startingPoint: [new Vec2D(-60, 10), new Vec2D(60, 10), new Vec2D(-20, 10), new Vec2D(20, 10)],
  startingFace: [1, -1, 1, -1],
  respawnPoints: [new Vec2D(16, 45), new Vec2D(-16, 45), new Vec2D(50, 45), new Vec2D(-50, 45)],
  respawnFace: [1, -1, 1, -1],
  blastzone: new Box2D([-246, -140], [246, 188]),
  ledge: [["ground", 0, 0], ["ground", 0, 1]],
  ledgePos: [new Vec2D(-68.4, 0), new Vec2D(68.4, 0)],
  scale: 4.5,
  offset: [600, 400],
  movingPlats: [],
  movingPlatforms: function () {
  }
};