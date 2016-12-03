import {Box2D} from "../../main/util/Box2D";
import {Vec2D} from "../../main/util/Vec2D";

export default {
  box: [new Box2D([-87.7, -17.75], [87.7, 0]), new Box2D([-62, -38], [62, -17.75]), new Box2D([-15, -112], [15, -38])],
  platform: [[new Vec2D(-55, 25), new Vec2D(-25, 25)], [new Vec2D(25, 25), new Vec2D(55, 25)]],
  ground: [[new Vec2D(-87.7, 0), new Vec2D(87.7, 0)]],
  ceiling: [[new Vec2D(-87.7, -17.75), new Vec2D(-62, -17.75)], [new Vec2D(-62, -38), new Vec2D(-15, -38)], [new Vec2D(-15, -112), new Vec2D(15, -112)], [new Vec2D(62, -17.75), new Vec2D(87.7, -17.75)], [new Vec2D(15, -38), new Vec2D(62, -38)]],
  wallL: [[new Vec2D(-87.7, 0), new Vec2D(-87.7, -17.75)], [new Vec2D(-62, -17.75), new Vec2D(-62, -38)], [new Vec2D(-15, -38), new Vec2D(-15, -112)]],
  wallR: [[new Vec2D(87.7, 0), new Vec2D(87.7, -17.75)], [new Vec2D(62, -17.75), new Vec2D(62, -38)], [new Vec2D(15, -38), new Vec2D(15, -112)]],
  startingPoint: [new Vec2D(-45, 44), new Vec2D(45, 44), new Vec2D(-25, 44), new Vec2D(25, 44)],
  startingFace: [1, -1, 1, -1],
  respawnPoints: [new Vec2D(-45, 44), new Vec2D(45, 44), new Vec2D(-25, 44), new Vec2D(25, 44)],
  respawnFace: [1, -1, 1, -1],
  blastzone: new Box2D([-230, -111], [230, 180]),
  ledge: [[0, 0], [0, 1]],
  ledgePos: [new Vec2D(-87.7, 0), (new Vec2D(87.7, 0))],
  scale: 4.2,
  offset: [600, 500],
  movingPlat: -1,
  movingPlatforms: function () {
  }
};