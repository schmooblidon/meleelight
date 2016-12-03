import {Vec2D} from "main/util/Vec2D";
import {Box2D} from "../../main/util/Box2D";
export default {
  startingPoint: new Vec2D(-175.0, 45.0),
  box: [new Box2D([-45.0, -55.0], [150.0, -20.0]), new Box2D([-185.0, 5.0], [-135.0, 30.0]), new Box2D([-112.5, -12.5], [-67.5, 12.5]), new Box2D([24.5, -19.5], [59.5, 65.5])],
  ground: [[new Vec2D(-45.0, -20.0), new Vec2D(150.0, -20.0)], [new Vec2D(-185.0, 30.0), new Vec2D(-135.0, 30.0)], [new Vec2D(-112.5, 12.5), new Vec2D(-67.5, 12.5)], [new Vec2D(24.5, 65.5), new Vec2D(59.5, 65.5)]],
  ceiling: [[new Vec2D(-45.0, -55.0), new Vec2D(150.0, -55.0)], [new Vec2D(-185.0, 5.0), new Vec2D(-135.0, 5.0)], [new Vec2D(-112.5, -12.5), new Vec2D(-67.5, -12.5)], [new Vec2D(24.5, -19.5), new Vec2D(59.5, -19.5)]],
  wallL: [[new Vec2D(-45.0, -20.0), new Vec2D(-45.0, -55.0)], [new Vec2D(-185.0, 30.0), new Vec2D(-185.0, 5.0)], [new Vec2D(-112.5, 12.5), new Vec2D(-112.5, -12.5)], [new Vec2D(24.5, 65.5), new Vec2D(24.5, -19.5)]],
  wallR: [[new Vec2D(150.0, -20.0), new Vec2D(150.0, -55.0)], [new Vec2D(-135.0, 30.0), new Vec2D(-135.0, 5.0)], [new Vec2D(-67.5, 12.5), new Vec2D(-67.5, -12.5)], [new Vec2D(59.5, 65.5), new Vec2D(59.5, -19.5)]],
  platform: [[new Vec2D(-82.5, 60.0), new Vec2D(2.5, 60.0)], [new Vec2D(59.5, 11.0), new Vec2D(84.5, 11.0)], [new Vec2D(149.5, -55.0), new Vec2D(208.5, -55.0)], [new Vec2D(-185.0, -35.0), new Vec2D(-135.0, -35.0)]],
  ledge: [],
  target: [new Vec2D(160.0, 100.0), new Vec2D(-160.0, -15.0), new Vec2D(175.0, -102.0), new Vec2D(175.0, -40.0), new Vec2D(42.0, 99.0), new Vec2D(-90.0, 25.0), new Vec2D(-56.0, -37.0), new Vec2D(-41.0, 78.0), new Vec2D(72.0, -5.0), new Vec2D(-160.0, 92.0)],
  scale: 3,
  blastzone: new Box2D([-250, -250], [250, 250]),
  offset: [600, 375]
};