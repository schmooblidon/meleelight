import {Vec2D} from "main/util/Vec2D";
import {Box2D} from "../../main/util/Box2D";
export default {
  startingPoint: new Vec2D(-179.7, -74.4),
  box: [new Box2D([-150.2, -126.3], [-115.8, 39.8]), new Box2D([-18.6, -128.6], [16.7, 36.5]), new Box2D([109.7, -143.2], [144.0, 36.4]), new Box2D([-25.2, 71.3], [-11.9, 129.1]), new Box2D([11.4, 70.6], [24.1, 163.1])],
  ground: [[new Vec2D(-150.2, 39.8), new Vec2D(-115.8, 39.8)], [new Vec2D(-18.6, 36.5), new Vec2D(16.7, 36.5)], [new Vec2D(109.7, 36.4), new Vec2D(144.0, 36.4)], [new Vec2D(-25.2, 129.1), new Vec2D(-11.9, 129.1)], [new Vec2D(11.4, 163.1), new Vec2D(24.1, 163.1)]],
  ceiling: [[new Vec2D(-150.2, -126.3), new Vec2D(-115.8, -126.3)], [new Vec2D(-18.6, -128.6), new Vec2D(16.7, -128.6)], [new Vec2D(109.7, -143.2), new Vec2D(144.0, -143.2)], [new Vec2D(-25.2, 71.3), new Vec2D(-11.9, 71.3)], [new Vec2D(11.4, 70.6), new Vec2D(24.1, 70.6)]],
  wallL: [[new Vec2D(-150.2, 39.8), new Vec2D(-150.2, -126.3)], [new Vec2D(-18.6, 36.5), new Vec2D(-18.6, -128.6)], [new Vec2D(109.7, 36.4), new Vec2D(109.7, -143.2)], [new Vec2D(-25.2, 129.1), new Vec2D(-25.2, 71.3)], [new Vec2D(11.4, 163.1), new Vec2D(11.4, 70.6)]],
  wallR: [[new Vec2D(-115.8, 39.8), new Vec2D(-115.8, -126.3)], [new Vec2D(16.7, 36.5), new Vec2D(16.7, -128.6)], [new Vec2D(144.0, 36.4), new Vec2D(144.0, -143.2)], [new Vec2D(-11.9, 129.1), new Vec2D(-11.9, 71.3)], [new Vec2D(24.1, 163.1), new Vec2D(24.1, 70.6)]],
  platform: [[new Vec2D(-181.1, -53.9), new Vec2D(-82.6, -53.9)], [new Vec2D(-170.4, -20.2), new Vec2D(-92.7, -20.2)], [new Vec2D(-187.3, -84.5), new Vec2D(-75.2, -84.5)], [new Vec2D(-158.9, 8.0), new Vec2D(-106.5, 8.0)], [new Vec2D(-148.1, 65.9), new Vec2D(-118.9, 65.9)], [new Vec2D(-141.2, 90.4), new Vec2D(-126.6, 90.4)], [new Vec2D(-29.3, -85.5), new Vec2D(27.4, -85.5)], [new Vec2D(-36.2, -53.6), new Vec2D(34.4, -53.6)], [new Vec2D(-47.9, -20.7), new Vec2D(46.0, -20.7)], [new Vec2D(70.6, -86.6), new Vec2D(184.7, -86.6)], [new Vec2D(80.8, -53.8), new Vec2D(174.5, -53.8)], [new Vec2D(89.8, -21.3), new Vec2D(165.1, -21.3)], [new Vec2D(100.8, 8.9), new Vec2D(152.9, 8.9)], [new Vec2D(118.8, 86.3), new Vec2D(133.4, 86.3)], [new Vec2D(111.7, 64.2), new Vec2D(141.6, 64.2)], [new Vec2D(-58.9, 9.6), new Vec2D(55.7, 9.6)]],
  ledge: [[0.0, 1.0], [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [2.0, 1.0], [2.0, 0.0]],
  target: [new Vec2D(-133.7, 111.2), new Vec2D(-103.1, -104.0), new Vec2D(-31.8, -36.6), new Vec2D(-0.6, 125.0), new Vec2D(29.8, -73.3), new Vec2D(93.3, -38.0), new Vec2D(-1.6, 53.3), new Vec2D(125.8, 105.9), new Vec2D(162.0, -38.1), new Vec2D(160.2, -107.7)],
  scale: 3,
  blastzone: new Box2D([-250, -250], [250, 250]),
  offset: [600, 375]
};