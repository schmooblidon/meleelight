import {Vec2D} from "main/util/Vec2D";
import {Box2D} from "../../main/util/Box2D";
export default {
  startingPoint: new Vec2D(-159.5, -73.8),
  box: [new Box2D([-200.0, -103.0], [-48.9, -88.3]), new Box2D([-200.0, -51.3], [-49.8, -36.8]), new Box2D([-145.4, -37.0], [-111.6, 20.8]), new Box2D([-76.0, 6.7], [10.4, 19.9]), new Box2D([141.3, -44.6], [155.8, 60.9]), new Box2D([181.6, -43.5], [195.2, 61.0])],
  ground: [[new Vec2D(-200.0, -88.3), new Vec2D(-48.9, -88.3)], [new Vec2D(-200.0, -36.8), new Vec2D(-49.8, -36.8)], [new Vec2D(-145.4, 20.8), new Vec2D(-111.6, 20.8)], [new Vec2D(-76.0, 19.9), new Vec2D(10.4, 19.9)], [new Vec2D(141.3, 60.9), new Vec2D(155.8, 60.9)], [new Vec2D(181.6, 61.0), new Vec2D(195.2, 61.0)]],
  ceiling: [[new Vec2D(-200.0, -103.0), new Vec2D(-48.9, -103.0)], [new Vec2D(-200.0, -51.3), new Vec2D(-49.8, -51.3)], [new Vec2D(-145.4, -37.0), new Vec2D(-111.6, -37.0)], [new Vec2D(-76.0, 6.7), new Vec2D(10.4, 6.7)], [new Vec2D(141.3, -44.6), new Vec2D(155.8, -44.6)], [new Vec2D(181.6, -43.5), new Vec2D(195.2, -43.5)]],
  wallL: [[new Vec2D(-200.0, -88.3), new Vec2D(-200.0, -103.0)], [new Vec2D(-200.0, -36.8), new Vec2D(-200.0, -51.3)], [new Vec2D(-145.4, 20.8), new Vec2D(-145.4, -37.0)], [new Vec2D(-76.0, 19.9), new Vec2D(-76.0, 6.7)], [new Vec2D(141.3, 60.9), new Vec2D(141.3, -44.6)], [new Vec2D(181.6, 61.0), new Vec2D(181.6, -43.5)]],
  wallR: [[new Vec2D(-48.9, -88.3), new Vec2D(-48.9, -103.0)], [new Vec2D(-49.8, -36.8), new Vec2D(-49.8, -51.3)], [new Vec2D(-111.6, 20.8), new Vec2D(-111.6, -37.0)], [new Vec2D(10.4, 19.9), new Vec2D(10.4, 6.7)], [new Vec2D(155.8, 60.9), new Vec2D(155.8, -44.6)], [new Vec2D(195.2, 61.0), new Vec2D(195.2, -43.5)]],
  platform: [[new Vec2D(-43.6, -69.7), new Vec2D(-0.3, -69.7)], [new Vec2D(-139.2, 47.2), new Vec2D(-118.0, 47.2)], [new Vec2D(-134.8, 72.0), new Vec2D(-122.9, 72.0)], [new Vec2D(12.9, 33.6), new Vec2D(48.3, 33.6)], [new Vec2D(53.3, 39.2), new Vec2D(90.9, 39.2)], [new Vec2D(95.6, 32.9), new Vec2D(134.6, 32.9)], [new Vec2D(155.6, 82.9), new Vec2D(182.9, 82.9)]],
  ledge: [[2.0, 1.0], [2.0, 0.0]],
  target: [new Vec2D(-185.1, -75.1), new Vec2D(-178.3, -19.2), new Vec2D(-129.0, 95.2), new Vec2D(72.2, 22.7), new Vec2D(70.7, 76.4), new Vec2D(168.4, 5.5), new Vec2D(185.2, 114.2), new Vec2D(170.1, -97.0), new Vec2D(-25.3, -44.8), new Vec2D(-67.6, 28.9)],
  scale: 3,
  blastzone: new Box2D([-250, -250], [250, 250]),
  offset: [600, 375]
};