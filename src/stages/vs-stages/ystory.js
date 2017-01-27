
import {activeStage} from "stages/activeStage";
import {player} from "main/main";
import {Box2D} from "../../main/util/Box2D";
import {Vec2D} from "../../main/util/Vec2D";

/*eslint indent:0*/ 

export default {
  name : "ystory",
  box: [],
  polygon : [ [new Vec2D(-56, -3.5), new Vec2D(-39, 0), new Vec2D(39, 0), new Vec2D(56, -3.5), new Vec2D(56, -7)
              , new Vec2D(55, -8), new Vec2D(54, -11), new Vec2D(53, -12), new Vec2D(53, -27)
              , new Vec2D(54, -28), new Vec2D(54, -30), new Vec2D(53, -31), new Vec2D(53, -46)
              , new Vec2D(54, -47), new Vec2D(54, -100), new Vec2D(-54, -100), new Vec2D(-54, -47)
              , new Vec2D(-53, -46), new Vec2D(-53, -31), new Vec2D(-54, -30), new Vec2D(-54, -28)
              , new Vec2D(-53, -27), new Vec2D(-53, -12), new Vec2D(-54, -11), new Vec2D(-55, -8)
              , new Vec2D(-56, -7), new Vec2D(-56, -3.5)
              ]
            ],
  platform: [[new Vec2D(-103.6, -33.25), new Vec2D(-91.7, -33.25)], [new Vec2D(-59.5, 23.45), new Vec2D(-28, 23.45)], [new Vec2D(28, 23.45), new Vec2D(59.5, 23.45)], [new Vec2D(-15.75, 42), new Vec2D(15.75, 42)]],
  ground: [[new Vec2D(-56, -3.5), new Vec2D(-39, 0)],[new Vec2D(-39, 0), new Vec2D(39, 0)],[new Vec2D(39, 0), new Vec2D(56, -3.5)]],
  ceiling: [],
  wallL: [[new Vec2D(-56, -3.5),new Vec2D(-56, -7)], [new Vec2D(-56, -7), new Vec2D(-55, -8) ], [new Vec2D(-55, -8),new Vec2D(-54, -11) ], [new Vec2D(-54, -11), new Vec2D(-53, -12)], [new Vec2D(-53, -12),new Vec2D(-53, -27) ]
         , [new Vec2D(-53, -27),new Vec2D(-54, -28) ], [new Vec2D(-54, -28), new Vec2D(-54, -30)], [new Vec2D(-54, -30), new Vec2D(-53, -31)], [new Vec2D(-53, -31), new Vec2D(-53, -46)], [new Vec2D(-53, -46), new Vec2D(-54, -47)]
         , [new Vec2D(-54, -47), new Vec2D(-54, -100)]],
  wallR: [[new Vec2D(56, -3.5),new Vec2D(56, -7)], [new Vec2D(56, -7), new Vec2D(55, -8) ], [new Vec2D(55, -8),new Vec2D(54, -11) ], [new Vec2D(54, -11), new Vec2D(53, -12)], [new Vec2D(53, -12),new Vec2D(53, -27) ]
         , [new Vec2D(53, -27),new Vec2D(54, -28) ], [new Vec2D(54, -28), new Vec2D(54, -30)], [new Vec2D(54, -30), new Vec2D(53, -31)], [new Vec2D(53, -31), new Vec2D(53, -46)], [new Vec2D(53, -46), new Vec2D(54, -47)]
         , [new Vec2D(54, -47), new Vec2D(54, -100)]],
  startingPoint: [new Vec2D(-42, 30), new Vec2D(42, 30), new Vec2D(-15, 15), new Vec2D(15, 15)],
  startingFace: [1, -1, 1, -1],
  respawnPoints: [new Vec2D(-42, 30), new Vec2D(42, 30), new Vec2D(-20, 30), new Vec2D(-20, 30)],
  respawnFace: [1, -1, 1, -1],
  blastzone: new Box2D([-175.7, -91], [173.6, 168]),
  ledge: [["ground", 0, 0], ["ground", 2, 1]],
  ledgePos: [new Vec2D(-56, -3.5), new Vec2D(56, -3.5)],
  scale: 5,
  offset: [600, 430],
  connected : [ [[null, ["g",1]], [["g",0], ["g",2]], [["g",1], null]], [[null,null],[null,null],[null,null],[null,null] ]],
  movingPlats: [0],
  movingPlatforms: function () {
    const plat = activeStage.platform[0];
    let move = [0, 0];
    if (plat[0].x <= -103.6 && plat[0].y > -33.25) {
      plat[0].x = -103.6;
      plat[1].x = -91.7;
      plat[0].y -= 0.354845;
      plat[1].y -= 0.354845;
      move = [0, -0.354845];
    }
    if (plat[0].x >= 91.35 && plat[0].y < -13.65) {
      plat[0].x = 91.35;
      plat[1].x = 103.25;
      plat[0].y += 0.354845;
      plat[1].y += 0.354845;
      move = [0, 0.354845];
    }
    if (plat[0].y <= -33.25) {
      plat[0].y = -33.25;
      plat[1].y = -33.25;
      plat[0].x += 0.354845;
      plat[1].x += 0.354845;
      move = [0.354845, 0];
    }
    if (plat[0].y >= -13.65) {
      plat[0].y = -13.65;
      plat[1].y = -13.65;
      plat[0].x -= 0.354845;
      plat[1].x -= 0.354845;
      move = [-0.354845, 0];
    }

    for (let j = 0; j < 4; j++) {
      if (player[j].phys.onSurface[0] === 1 && player[j].phys.onSurface[1] === 0 && player[j].phys.grounded) {
        player[j].phys.pos.x += move[0];
        //player[j].phys.pos.y += move[1];
        player[j].phys.pos.y = plat[0].y;
      }
    }
  }
};