import {Box2D} from "../../main/util/Box2D";
import {Vec2D} from "../../main/util/Vec2D";

export default {
  box: [new Box2D([-68.4, -9], [68.4, 0]), new Box2D([-29.3, -34], [-13.68, -9]), new Box2D([13.68, -34], [29.3, -9]), new Box2D([-13.68, -20], [13.68, -9])],
  platform: [[new Vec2D(-57.6, 27.2), new Vec2D(-20, 27.2)], [new Vec2D(20, 27.2), new Vec2D(57.6, 27.2)], [new Vec2D(-18.8, 54.4), new Vec2D(18.8, 54.4)]],
  ground: [[new Vec2D(-68.4, 0), new Vec2D(68.4, 0)]],
  ceiling: [[new Vec2D(-68.4, -9), new Vec2D(-29.3, -9)], [new Vec2D(-29.3, -34), new Vec2D(-13.68, -34)], [new Vec2D(13.68, -34), new Vec2D(29.3, -34)], [new Vec2D(29.3, -9), new Vec2D(68.4, -9)], [new Vec2D(-13.68, -20), new Vec2D(13.68, -20)]],
  wallL: [[new Vec2D(-68.4, 0), new Vec2D(-68.4, -9)], [new Vec2D(-29.3, -9), new Vec2D(-29.3, -34)], [new Vec2D(13.68, -20), new Vec2D(13.68, -34)]],
  wallR: [[new Vec2D(68.4, 0), new Vec2D(68.4, -9)], [new Vec2D(29.3, -9), new Vec2D(29.3, -34)], [new Vec2D(-13.68, -20), new Vec2D(-13.68, -34)]],
  startingPoint: [new Vec2D(-50, 50), new Vec2D(50, 50), new Vec2D(-25, 5), new Vec2D(25, 5)],
  startingFace: [1, -1, 1, -1],
  respawnPoints: [new Vec2D(-50, 50), new Vec2D(50, 50), new Vec2D(-25, 35), new Vec2D(25, 35)],
  respawnFace: [1, -1, 1, -1],
  blastzone: new Box2D([-224, -108.8], [224, 200]),
  ledge: [[0, 0], [0, 1]],
  ledgePos: [new Vec2D(-68.4, 0), new Vec2D(68.4, 0)],
  scale: 4.5,
  offset: [600, 480],
  movingPlat: -1,
  movingPlatforms: function () {
  }
};