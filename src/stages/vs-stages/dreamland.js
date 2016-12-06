import {Box2D} from "../../main/util/Box2D";
import {Vec2D} from "../../main/util/Vec2D";

export default {
  box: [new Box2D([-77.27, -36], [77.27, 0])],
  platform: [[new Vec2D(-61.393, 30.142), new Vec2D(-31.725, 30.142)], [new Vec2D(-19.018, 51.425), new Vec2D(19.017, 51.425)], [new Vec2D(31.704, 30.243), new Vec2D(63.075, 30.243)]],
  ground: [[new Vec2D(-77.27, 0), new Vec2D(77.27, 0)]],
  ceiling: [[new Vec2D(-77.27, -36), new Vec2D(77.27, -36)]],
  wallL: [[new Vec2D(-77.27, 0), new Vec2D(-77.27, -36)]],
  wallR: [[new Vec2D(77.27, 0), new Vec2D(77.27, -36)]],
  startingPoint: [new Vec2D(-60, 50), new Vec2D(60, 50), new Vec2D(-40, 50), new Vec2D(40, 50)],
  startingFace: [1, -1, 1, -1],
  respawnPoints: [new Vec2D(-60, 50), new Vec2D(60, 50), new Vec2D(-40, 50), new Vec2D(40, 50)],
  respawnFace: [1, -1, 1, -1],
  blastzone: new Box2D([-255, -123], [255, 250]),
  ledge: [[0, 0], [0, 1]],
  ledgePos: [new Vec2D(-77.27, 0), new Vec2D(77.27, 0)],
  scale: 3.5,
  offset: [600, 500],
  movingPlat: -1,
  movingPlatforms: function () {
  }
};