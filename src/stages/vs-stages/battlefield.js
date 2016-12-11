import {Box2D} from "../../main/util/Box2D";
import {Vec2D} from "../../main/util/Vec2D";

export default {
  box: [new Box2D([-68.4, -9], [68.4, 0])],
  platform: [[new Vec2D(-57.6, 27.2), new Vec2D(-20, 27.2)], [new Vec2D(20, 27.2), new Vec2D(57.6, 27.2)], [new Vec2D(-18.8, 54.4), new Vec2D(18.8, 54.4)]],
  ground: [[new Vec2D(-68.4, 0), new Vec2D(68.4, 0)]],
  ceiling: [[ new Vec2D (-65, -6), new Vec2D (-36, -19)], [ new Vec2D (-29, -35), new Vec2D (-10, -40)], [new Vec2D (-10, -30), new Vec2D (10, -30)], [ new Vec2D (65, -6), new Vec2D (36, -19)], [ new Vec2D (29, -35), new Vec2D (10, -40)]],
  wallL: [[ new Vec2D( -68.4, 0), new Vec2D (-65, -6) ], [ new Vec2D (-36, -19), new Vec2D (-39, -21 )  ], [ new Vec2D (-39, -21 ), new Vec2D (-33, -25)  ], [ new Vec2D (-33, -25), new Vec2D (-30, -29)  ], [ new Vec2D (-30, -29), new Vec2D (-29, -35)  ], [ new Vec2D (10, -30), new Vec2D (10, -40) ]],
  wallR: [[ new Vec2D( 68.4, 0), new Vec2D (65, -6) ], [ new Vec2D (36, -19), new Vec2D (39, -21 )  ], [ new Vec2D (39, -21 ), new Vec2D (33, -25)  ], [ new Vec2D (33, -25), new Vec2D (30, -29)  ], [ new Vec2D (30, -29), new Vec2D (29, -35)  ], [ new Vec2D (-10, -30), new Vec2D (-10, -40)  ]],
  startingPoint: [new Vec2D(-50, 50), new Vec2D(50, 50), new Vec2D(-25, 5), new Vec2D(25, 5)],
  startingFace: [1, -1, 1, -1],
  respawnPoints: [new Vec2D(-50, 50), new Vec2D(50, 50), new Vec2D(-25, 35), new Vec2D(25, 35)],
  respawnFace: [1, -1, 1, -1],
  blastzone: new Box2D([-224, -108.8], [224, 200]),
  ledge: [[0, 0], [0, 1]],
  ledgePos: [new Vec2D(-68.4, 0), new Vec2D(68.4, 0)],
  scale: 4.5,
  offset: [600, 480],
  connected: [[false, [["l",4], ["l",3], ["l",2], ["l",1]]], [false, [["r",1], ["r",2], ["r",3], ["r",4]]]],
  movingPlatforms: function () {
  }
};



