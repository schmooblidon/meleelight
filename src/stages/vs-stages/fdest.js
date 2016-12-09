import {Box2D} from "../../main/util/Box2D";
import {Vec2D} from "../../main/util/Vec2D";

export default {
  box: [new Box2D([-85.6, -10], [85.6, 0])],
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
  ledge: [[0, 0], [0, 1]],
  ledgePos: [new Vec2D(-68.4, 0), new Vec2D(68.4, 0)],
  scale: 4.5,
  offset: [600, 400],
  connected: [ [ true, ["g",0], ["r",4], ["r",3], ["r",2], ["r",1], ["r",0], ["c",2], ["c",1], ["c",0], ["l",4], ["l",3], ["l",2], ["l",1], ["l",0], true] ],
  movingPlat: -1,
  movingPlatforms: function () {
  }
};