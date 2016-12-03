import {Vec2D} from "main/util/Vec2D";
import {Box2D} from "../../main/util/Box2D";

export default {
  startingPoint: new Vec2D(0.0, 0.0),
  box: [new Box2D([-150.6, 70.2], [-16.1, 88.2]), new Box2D([-56.6, -21.8], [55.6, -14.0]), new Box2D([114.7, -78.7], [143.4, 17.0]), new Box2D([82.3, -78.8], [143.5, -20.6]), new Box2D([-172.0, -118.1], [-159.2, -13.6]), new Box2D([-133.1, -48.8], [-111.6, -27.1]), new Box2D([37.6, -78.7], [143.4, -50.9])],
  ground: [[new Vec2D(-150.6, 88.2), new Vec2D(-16.1, 88.2)], [new Vec2D(-56.6, -14.0), new Vec2D(55.6, -14.0)], [new Vec2D(114.7, 17.0), new Vec2D(143.4, 17.0)], [new Vec2D(82.3, -20.6), new Vec2D(143.5, -20.6)], [new Vec2D(-172.0, -13.6), new Vec2D(-159.2, -13.6)], [new Vec2D(-133.1, -27.1), new Vec2D(-111.6, -27.1)], [new Vec2D(37.6, -50.9), new Vec2D(143.4, -50.9)]],
  ceiling: [[new Vec2D(-150.6, 70.2), new Vec2D(-16.1, 70.2)], [new Vec2D(-56.6, -21.8), new Vec2D(55.6, -21.8)], [new Vec2D(114.7, -78.7), new Vec2D(143.4, -78.7)], [new Vec2D(82.3, -78.8), new Vec2D(143.5, -78.8)], [new Vec2D(-172.0, -118.1), new Vec2D(-159.2, -118.1)], [new Vec2D(-133.1, -48.8), new Vec2D(-111.6, -48.8)], [new Vec2D(37.6, -78.7), new Vec2D(143.4, -78.7)]],
  wallL: [[new Vec2D(-150.6, 88.2), new Vec2D(-150.6, 70.2)], [new Vec2D(-56.6, -14.0), new Vec2D(-56.6, -21.8)], [new Vec2D(114.7, 17.0), new Vec2D(114.7, -78.7)], [new Vec2D(82.3, -20.6), new Vec2D(82.3, -78.8)], [new Vec2D(-172.0, -13.6), new Vec2D(-172.0, -118.1)], [new Vec2D(-133.1, -27.1), new Vec2D(-133.1, -48.8)], [new Vec2D(37.6, -50.9), new Vec2D(37.6, -78.7)]],
  wallR: [[new Vec2D(-16.1, 88.2), new Vec2D(-16.1, 70.2)], [new Vec2D(55.6, -14.0), new Vec2D(55.6, -21.8)], [new Vec2D(143.4, 17.0), new Vec2D(143.4, -78.7)], [new Vec2D(143.5, -20.6), new Vec2D(143.5, -78.8)], [new Vec2D(-159.2, -13.6), new Vec2D(-159.2, -118.1)], [new Vec2D(-111.6, -27.1), new Vec2D(-111.6, -48.8)], [new Vec2D(143.4, -50.9), new Vec2D(143.4, -78.7)]],
  platform: [[new Vec2D(143.4, -21.5), new Vec2D(169.5, -21.5)], [new Vec2D(143.4, -50.6), new Vec2D(168.6, -50.6)], [new Vec2D(-95.2, -63.9), new Vec2D(-5.3, -63.9)], [new Vec2D(-140.1, 29.9), new Vec2D(-84.6, 29.9)], [new Vec2D(-193.1, 70.1), new Vec2D(-149.5, 70.1)]],
  ledge: [[3.0, 0.0], [2.0, 0.0], [4.0, 1.0]],
  target: [new Vec2D(-48.6, 0.7), new Vec2D(48.4, 0.7), new Vec2D(157.0, -66.3), new Vec2D(-15.1, -43.2), new Vec2D(-186.4, -87.0), new Vec2D(-113.2, 47.7), new Vec2D(-128.9, 103.6), new Vec2D(53.1, 103.6), new Vec2D(154.0, -7.2), new Vec2D(-51.9, 103.9)],
  scale: 3,
  blastzone: new Box2D([-250, -250], [250, 250]),
  offset: [600, 375]
};