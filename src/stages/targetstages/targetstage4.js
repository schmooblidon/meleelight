import {Vec2D} from "main/util/Vec2D";
import {Box2D} from "../../main/util/Box2D";
export default {
  startingPoint: new Vec2D(-131.8, 61.4),
  box: [new Box2D([-154.9, -125.0], [-108.6, 47.3]), new Box2D([-67.6, -46.8], [-42.4, 83.0]), new Box2D([6.8, -47.5], [29.8, 28.6]), new Box2D([30.0, 7.9], [89.7, 28.6]), new Box2D([77.5, -131.5], [100.2, -43.3]), new Box2D([136.4, -125.0], [156.7, -67.2])],
  ground: [[new Vec2D(-154.9, 47.3), new Vec2D(-108.6, 47.3)], [new Vec2D(-67.6, 83.0), new Vec2D(-42.4, 83.0)], [new Vec2D(6.8, 28.6), new Vec2D(29.8, 28.6)], [new Vec2D(30.0, 28.6), new Vec2D(89.7, 28.6)], [new Vec2D(77.5, -43.3), new Vec2D(100.2, -43.3)], [new Vec2D(136.4, -67.2), new Vec2D(156.7, -67.2)]],
  ceiling: [[new Vec2D(-154.9, -125.0), new Vec2D(-108.6, -125.0)], [new Vec2D(-67.6, -46.8), new Vec2D(-42.4, -46.8)], [new Vec2D(6.8, -47.5), new Vec2D(29.8, -47.5)], [new Vec2D(30.0, 7.9), new Vec2D(89.7, 7.9)], [new Vec2D(77.5, -131.5), new Vec2D(100.2, -131.5)], [new Vec2D(136.4, -125.0), new Vec2D(156.7, -125.0)]],
  wallL: [[new Vec2D(-154.9, 47.3), new Vec2D(-154.9, -125.0)], [new Vec2D(-67.6, 83.0), new Vec2D(-67.6, -46.8)], [new Vec2D(6.8, 28.6), new Vec2D(6.8, -47.5)], [new Vec2D(30.0, 28.6), new Vec2D(30.0, 7.9)], [new Vec2D(77.5, -43.3), new Vec2D(77.5, -131.5)], [new Vec2D(136.4, -67.2), new Vec2D(136.4, -125.0)]],
  wallR: [[new Vec2D(-108.6, 47.3), new Vec2D(-108.6, -125.0)], [new Vec2D(-42.4, 83.0), new Vec2D(-42.4, -46.8)], [new Vec2D(29.8, 28.6), new Vec2D(29.8, -47.5)], [new Vec2D(89.7, 28.6), new Vec2D(89.7, 7.9)], [new Vec2D(100.2, -43.3), new Vec2D(100.2, -131.5)], [new Vec2D(156.7, -67.2), new Vec2D(156.7, -125.0)]],
  platform: [[new Vec2D(-108.4, 9.1), new Vec2D(-67.6, 9.1)], [new Vec2D(-108.5, -13.1), new Vec2D(-67.6, -13.1)], [new Vec2D(-108.6, -40.1), new Vec2D(-67.5, -40.1)], [new Vec2D(-108.2, -90.0), new Vec2D(-40.9, -90.0)], [new Vec2D(5.8, -90.0), new Vec2D(66.9, -90.0)], [new Vec2D(-30.1, -57.8), new Vec2D(-3.8, -57.8)], [new Vec2D(30.0, -18.0), new Vec2D(64.9, -18.0)], [new Vec2D(110.3, 41.8), new Vec2D(143.4, 41.8)], [new Vec2D(150.3, 67.5), new Vec2D(181.2, 67.5)], [new Vec2D(100.1, -111.1), new Vec2D(132.8, -111.1)]],
  ledge: [[1.0, 1.0], [1.0, 0.0], [5.0, 1.0], [4.0, 1.0], [4.0, 0.0], [3.0, 1.0], [2.0, 0.0]],
  target: [new Vec2D(-88.3, -26.7), new Vec2D(-16.4, -69.7), new Vec2D(-16.4, 5.1), new Vec2D(-30.0, 73.8), new Vec2D(45.4, -5.4), new Vec2D(75.7, 41.9), new Vec2D(188.2, 95.9), new Vec2D(188.2, -10.3), new Vec2D(188.2, -102.0), new Vec2D(111.3, -91.7)],
  scale: 3,
  blastzone: new Box2D([-250, -250], [250, 250]),
  offset: [600, 375]
};