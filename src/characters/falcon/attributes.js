import {    offsets,
    setCharAttributes
    , CHARIDS
    , charObject
    , setChars
    , setHitBoxes
    , setIntangibility
    , setActionSounds,setFrames, setOffsets
} from "main/characters";
import {Vec2D} from "../../main/util/Vec2D";
import {createHitboxObject} from "../../main/util/createHitboxObject";
import {createHitbox} from "../../main/util/createHitBox";
/* eslint-disable indent, camelcase */


setCharAttributes(CHARIDS.FALCON_ID, {
  dashFrameMin : 15,
  dashFrameMax : 28,
  dInitV : 2.16,
  dMaxV : 2.3,
  dAccA : 0.15,
  dAccB : 0.01,
  dTInitV : 2,
  traction : 0.08,
  maxWalk : 0.85,
  jumpSquat : 4,
  sHopInitV : 1.9,
  fHopInitV : 3.1,
  gravity : 0.13,
  groundToAir : 0.75,
  jumpHmaxV : 2.1,
  jumpHinitV : 0.95,
  airMobA : 0.04,
  airMobB : 0.02,
  aerialHmaxV : 1.12,
  airFriction : 0.01,
  fastFallV : 3.5,
  terminalV : 2.9,
  walkInitV : 0.15,
  walkAcc : 0.1,
  walkMaxV : 0.85,
  djMultiplier : 0.9,
  djMomentum : 0.9,
  shieldScale : 14.375,
  modelScale : 0.96,
  weight : 104,
  waitAnimSpeed : 1,
  walljump : true,
  hurtboxOffset : [5,17],
  ledgeSnapBoxOffset : [17,8,25],
  shieldOffset : [5,34],
  charScale : 0.485,
  miniScale : 0.3,
  runTurnBreakPoint : 16,
  airdodgeIntangible : 25,
  wallJumpVelX : 1.4,
  wallJumpVelY : 3.1,
  shieldBreakVel : 2.5,
  multiJump : false,
  ecbScale : 1.45,
  walkAnimSpeed : 1,
  runAnimSpeed : 1
});

// start, length
setIntangibility(CHARIDS.FALCON_ID, {
  "ESCAPEAIR" : [4,29],
  "ESCAPEB" : [4,19],
  "ESCAPEF" : [4,19],
  "ESCAPEN" : [3,20],
  "DOWNSTANDN" : [1,23],
  "DOWNSTANDB" : [12,18],
  "DOWNSTANDF" : [1,19],
  "TECHN" : [1,20],
  "TECHB" : [1,20],
  "TECHF" : [1,20],
});

setFrames(CHARIDS.FALCON_ID, {
  "WAIT" : 60,
  "DASH" : 28,
  "RUN" : 21,
  "RUNBRAKE" : 28,
  "RUNTURN" : 22,
  "WALK" : 20,
  "JUMPF" : 35,
  "JUMPB" : 50,
  "FALL" : 8,
  "FALLAERIAL" : 8,
  "FALLSPECIAL" : 8,
  "SQUAT" : 7,
  "SQUATWAIT" : 79,
  "SQUATRV" : 10,
  "JUMPAERIALF" : 50,
  "JUMPAERIALB" : 35,
  "PASS" : 30,
  "GUARDON" : 8,
  "GUARDOFF" : 16,
  "CLIFFCATCH" : 7,
  "CLIFFWAIT" : 50,
  "DAMAGEFLYN" : 29,
  "DAMAGEFALL" : 29,
  "DAMAGEN2" : 23,
  "LANDINGATTACKAIRF" : 19,
  "LANDINGATTACKAIRB" : 18,
  "LANDINGATTACKAIRU" : 15,
  "LANDINGATTACKAIRD" : 24,
  "LANDINGATTACKAIRN" : 15,
  "ESCAPEB" : 31,
  "ESCAPEF" : 31,
  "ESCAPEN" : 32,
  "DOWNBOUND" : 26,
  "DOWNWAIT" : 69,
  "DOWNSTANDN" : 30,
  "DOWNSTANDB" : 35,
  "DOWNSTANDF" : 35,
  "TECHN" : 26,
  "TECHB" : 40,
  "TECHF" : 40,
  "SHIELDBREAKFALL" : 29,
  "SHIELDBREAKDOWNBOUND" : 26,
  "SHIELDBREAKSTAND" : 30,
  "FURAFURA" : 100,
  "CAPTUREWAIT" : 35,
  "CATCHWAIT" : 30,
  "CAPTURECUT" : 30,
  "CATCHCUT" : 30,
  "CAPTUREDAMAGE" : 20,
  "WALLDAMAGE" : 51,
  "WALLTECH" : 26,
  "WALLJUMP" : 40,
  "OTTOTTO" : 8,
  "OTTOTTOWAIT" : 80,
  "THROWNMARTHUP" : 12,
  "THROWNMARTHBACK" : 7,
  "THROWNMARTHFORWARD" : 14,
  "THROWNMARTHDOWN" : 14,
  "THROWNPUFFUP" : 8,
  "THROWNPUFFBACK" : 26,
  "THROWNPUFFFORWARD" : 9,
  "THROWNPUFFDOWN" : 60,
  "THROWNFALCONUP" : 14,
  "THROWNFALCONBACK" : 19,
  "THROWNFALCONFORWARD" : 17,
  "THROWNFALCONDOWN" : 20,
  "THROWNFALCOUP" : 7,
  "THROWNFALCOBACK" : 9,
  "THROWNFALCOFORWARD" : 11,
  "THROWNFALCODOWN" : 34,
  "THROWNFOXUP" : 8,
  "THROWNFOXBACK" : 9,
  "THROWNFOXFORWARD" : 10,
  "THROWNFOXDOWN" : 32,
  "FURASLEEPSTART" : 30,
  "FURASLEEPLOOP" : 20,
  "FURASLEEPEND" : 60,
  "STOPCEIL" : 9,
  "TECHU" : 26,
  "REBOUND" : 17
});

setActionSounds(CHARIDS.FALCON_ID, {
  "JUMP" : [],
  "ESCAPEAIR" : [[4,"falconshout2"]],
  "JUMPAERIAL" : [[1,"falcondoublejump"]],
  "GUARDON" : [],
  "GUARDOFF" : [],
  "CLIFFCATCH" : [[1,"puffledgegrab"]],
  "DEAD" : [[1,"falcondeath"]],
  "FURAFURA" : [[29,"falconfura"]],
  "ESCAPEB" : [],
  "ESCAPEF" : [],
  "ESCAPEN" : [[3,"falconshout2"]],
  "OTTOTTOWAIT" : [],
  "TECH" : []
});


// HITBOX OFFSETS

setOffsets(CHARIDS.FALCON_ID, {
  ledgegetupquick : {
    id0 : [
      new Vec2D(-56.22+63.93,15.64),
      new Vec2D(-54.32+62.73,12.40),
      new Vec2D(-53.23+61.91,11.86),
      new Vec2D(-52.98+61.32,10.81),
      new Vec2D(-52.07+60.73,9.29),
      new Vec2D(-51.36+59.96,7.84)
    ],
    id1 : [
      new Vec2D(-56.83+63.93,20.04),
      new Vec2D(-47.56+62.73,11.97),
      new Vec2D(-46.83+61.91,12.04),
      new Vec2D(-46.65+61.32,11.88),
      new Vec2D(-45.98+60.73,9.83),
      new Vec2D(-45.65+59.96,6.97)
    ],
    id2 : [
      new Vec2D(-61.72+63.93,8.03),
      new Vec2D(-61.89+62.73,7.21),
      new Vec2D(-60.81+61.91,6.07),
      new Vec2D(-60.06+61.32,4.60),
      new Vec2D(-59.44+60.73,3.22),
      new Vec2D(-59.53+59.96,2.77)
    ],
  },
  ledgegetupslow : {
    id0 : [
      new Vec2D(-61.10+65.25,1.57),
      new Vec2D(-58.18+64.96,2.95),
      new Vec2D(-53.92+64.67,7.56),
      new Vec2D(-47.66+64.37,10.08)
    ],
    id1 : [
      new Vec2D(-60.56+65.25,5.08),
      new Vec2D(-59.25+64.96,6.34),
      new Vec2D(-56.84+64.67,8.18),
      new Vec2D(-51.19+64.37,10.12)
    ]
  },
  jab1 : {
    id0 : [
      new Vec2D(10.94,11.13),
      new Vec2D(10.94,11.13),
      new Vec2D(10.94,11.13)
    ],
    id1 : [
      new Vec2D(5.47,12.50),
      new Vec2D(5.47,12.50),
      new Vec2D(5.47,12.50)
    ],
    id2 : [
      new Vec2D(1.95,11.13),
      new Vec2D(1.95,11.13),
      new Vec2D(1.95,11.13)
    ]
  },
  jab2 : {
    id0 : [
      new Vec2D(15.62,11.52),
      new Vec2D(15.62,11.52),
      new Vec2D(15.62,11.52)
    ],
    id1 : [
      new Vec2D(9.77,11.52),
      new Vec2D(9.77,11.52),
      new Vec2D(9.77,11.52)
    ],
    id2 : [
      new Vec2D(3.91,11.52),
      new Vec2D(3.91,11.52),
      new Vec2D(3.91,11.52)
    ]
  },
  jab3Clean : {
    id0 : [
      new Vec2D(10.67-3.51,12.13),
      new Vec2D(7.34-0.01,12.16),
      new Vec2D(7.47-0.01,12.08),
      new Vec2D(7.53-0.006,11.91)
    ],
    id1 : [
      new Vec2D(1.53-3.51,9.81),
      new Vec2D(-1.90,9.88),
      new Vec2D(-1.83,9.97),
      new Vec2D(-1.76,10.06)
    ]
  },
  jab3Late : {
    id0 : [
      new Vec2D(7.51-0.004,11.68),
      new Vec2D(7.44-0.005,11.47),
      new Vec2D(7.33,10.95)
    ],
    id1 : [
      new Vec2D(-1.71,10.13),
      new Vec2D(-1.66,10.18),
      new Vec2D(-1.63,10.20)
    ]
  },
  dtilt : {
    id0 : [
      new Vec2D(15.50,3.41),
      new Vec2D(19.57,4.19),
      new Vec2D(19.52,6.27),
      new Vec2D(16.44,7.53),
      new Vec2D(15.47,8.09),
      new Vec2D(14.41,8.16)
    ],
    id1 : [
      new Vec2D(12.85,4.35),
      new Vec2D(13.32,4.26),
      new Vec2D(13.05,4.91),
      new Vec2D(11.89,5.43),
      new Vec2D(10.56,5.68),
      new Vec2D(9.77,5.67)
    ],
    id2 : [
      new Vec2D(4.89,2.56),
      new Vec2D(4.51,3.02),
      new Vec2D(4.57,3.00),
      new Vec2D(4.74,2.77),
      new Vec2D(4.85,2.75),
      new Vec2D(4.94,2.76)
    ]
  },
  uptilt : {
    id0 : [
      new Vec2D(3.48,25.13),
      new Vec2D(12.78,19.63),
      new Vec2D(16.05,12.56),
      new Vec2D(16.20,5.38),
      new Vec2D(15.88,1.13)
    ],
    id1 : [
      new Vec2D(3.63,16.92),
      new Vec2D(6.50,14.35),
      new Vec2D(7.92,11.41),
      new Vec2D(8.56,8.33),
      new Vec2D(9.05,5.66)
    ]
  },
  ftilt : {
    id0 : [
      new Vec2D(16.39,12.92),
      new Vec2D(16.90,12.88),
      new Vec2D(17.19,13.01)
    ],
    id1 : [
      new Vec2D(8.82,13.02),
      new Vec2D(9.30,13.18),
      new Vec2D(9.55,13.27)
    ],
    id2 : [
      new Vec2D(5.78,12.78),
      new Vec2D(6.14,12.89),
      new Vec2D(6.41,12.94)
    ]
  },
  dsmash1 : {
    id0 : [
      new Vec2D(18.17,11.26),
      new Vec2D(17.30,12.39),
      new Vec2D(16.59,13.22),
      new Vec2D(14.22,13.64)
    ],
    id1 : [
      new Vec2D(11.47,11.52),
      new Vec2D(10.98,12.49),
      new Vec2D(10.62,12.55),
      new Vec2D(9.60,12.73)
    ]
  },
  dsmash2 : {
    id0 : [
      new Vec2D(-15.15,7.87),
      new Vec2D(-15.55,7.86),
      new Vec2D(-15.82,7.78),
      new Vec2D(-15.70,7.94)
    ],
    id1 : [
      new Vec2D(-8.35,9.56),
      new Vec2D(-8.75,9.58),
      new Vec2D(-9.01,9.50),
      new Vec2D(-8.98,9.65)
    ]
  },
  upsmash1 : {
    id0 : [
      new Vec2D(3.39,15.57),
      new Vec2D(3.45,15.87)
    ],
    id1 : [
      new Vec2D(8.98,7.81),
      new Vec2D(8.98,7.81)
    ],
    id2 : [
      new Vec2D(4.46,27.16),
      new Vec2D(3.37,23.64)
    ],
    id3 : [
      new Vec2D(1.56,20.02),
      new Vec2D(1.21,19.56)
    ]
  },
  upsmash2 : {
    id0 : [
      new Vec2D(1.39,20.48),
      new Vec2D(1.79,18.94)
    ],
    id1 : [
      new Vec2D(3.42,15.82),
      new Vec2D(3.11,14.81)
    ],
    id2 : [
      new Vec2D(3.49,28.02),
      new Vec2D(5.59,24.65)
    ]
  },
  fsmash : {
    id0 : [
      new Vec2D(6.40-4.11,10.64),
      new Vec2D(10.18-6.22,10.23),
      new Vec2D(8.08-3.98,10.23),
      new Vec2D(5.43-1.33,10.25)
    ],
    id1 : [
      new Vec2D(3.81-4.11,10.42),
      new Vec2D(13.26-6.22,10.13),
      new Vec2D(11.22-3.98,10.22),
      new Vec2D(8.56-1.33,10.30)
    ]
  },
  downattack1 : {
    id0 : [
      new Vec2D(-6.61,10.65),
      new Vec2D(-6.08,11.00)
    ],
    id1 : [
      new Vec2D(4.91,11.10),
      new Vec2D(4.56,11.37)
    ],
    id2 : [
      new Vec2D(-12.28,10.60),
      new Vec2D(-11.57,10.94)
    ],
    id3 : [
      new Vec2D(10.56,11.47),
      new Vec2D(10.06,11.58)
    ]
  },
  downattack2 : {
    id0 : [
      new Vec2D(5.20,13.96),
      new Vec2D(4.87,14.64)
    ],
    id1 : [
      new Vec2D(-5.58,14.74),
      new Vec2D(-5.75,14.20)
    ],
    id2 : [
      new Vec2D(9.49,15.48),
      new Vec2D(9.71,16.73)
    ],
    id3 : [
      new Vec2D(-9.50,16.00),
      new Vec2D(-10.70,15.56)
    ]
  },
  grab : {
    id0 : [
      new Vec2D(7.03,10.16),
      new Vec2D(7.03,10.16)
    ],
    id1 : [
      new Vec2D(2.34,10.16),
      new Vec2D(2.34,10.16)
    ]
  },
  pummel : {
    id0 : [new Vec2D(11.72,9.77)]
  },
  nair1 : {
    id0 : [
      new Vec2D(12.52,8.75),
      new Vec2D(12.69,8.71),
      new Vec2D(12.65,8.39),
      new Vec2D(12.38,7.76),
      new Vec2D(11.86,6.93),
      new Vec2D(11.06,6.00)
    ],
    id1 : [
      new Vec2D(4.97,7.90),
      new Vec2D(4.96,7.80),
      new Vec2D(4.87,7.61),
      new Vec2D(4.71,7.32),
      new Vec2D(4.46,6.97),
      new Vec2D(4.11,6.60)
    ],
    id2 : [
      new Vec2D(0.87,7.44),
      new Vec2D(0.87,7.44),
      new Vec2D(0.87,7.45),
      new Vec2D(0.87,7.45),
      new Vec2D(0.87,7.45),
      new Vec2D(0.87,7.44)
    ]
  },
  nair2 : {
    id0 : [
      new Vec2D(12.19,11.61),
      new Vec2D(12.24,11.98),
      new Vec2D(12.24,12.29),
      new Vec2D(12.20,12.55),
      new Vec2D(12.12,12.75),
      new Vec2D(12.00,12.88),
      new Vec2D(11.85,12.96),
      new Vec2D(11.67,12.96),
      new Vec2D(11.45,12.90),
      new Vec2D(11.21,12.75)
    ],
    id1 : [
      new Vec2D(5.02,9.05),
      new Vec2D(5.04,9.20),
      new Vec2D(5.04,9.33),
      new Vec2D(5.02,9.44),
      new Vec2D(4.99,9.53),
      new Vec2D(4.95,9.59),
      new Vec2D(4.89,9.64),
      new Vec2D(4.82,9.66),
      new Vec2D(4.74,9.65),
      new Vec2D(4.65,9.62)
    ],
    id2 : [
      new Vec2D(0.99,7.69),
      new Vec2D(0.99,7.69),
      new Vec2D(0.99,7.69),
      new Vec2D(0.99,7.69),
      new Vec2D(0.99,7.69),
      new Vec2D(0.99,7.69),
      new Vec2D(0.99,7.69),
      new Vec2D(0.99,7.69),
      new Vec2D(0.99,7.69),
      new Vec2D(0.99,7.69)
    ]
  },
  bairClean : {
    id0 : [
      new Vec2D(-12.59,5.32),
      new Vec2D(-11.55,6.54),
      new Vec2D(-12.19,6.11),
      new Vec2D(-11.66,6.38)
    ],
    id1 : [
      new Vec2D(-8.85,7.95),
      new Vec2D(-8.33,8.56),
      new Vec2D(-8.66,8.34),
      new Vec2D(-8.44,8.43)
    ],
    id2 : [
      new Vec2D(-5.16,10.57),
      new Vec2D(-5.16,10.58),
      new Vec2D(-5.17,10.56),
      new Vec2D(-5.27,10.48)
    ],

  },
  bairLate : {
    id0 : [
      new Vec2D(-11.67,6.34),
      new Vec2D(-11.64,6.37),
      new Vec2D(-11.61,6.44),
      new Vec2D(-11.57,6.52)
    ],
    id1 : [
      new Vec2D(-8.46,8.39),
      new Vec2D(-8.42,8.40),
      new Vec2D(-8.38,8.44),
      new Vec2D(-8.34,8.48)
    ],
    id2 : [
      new Vec2D(-5.28,10.45),
      new Vec2D(-5.26,10.44),
      new Vec2D(-5.21,10.44),
      new Vec2D(-5.15,10.45)
    ]
  },
  fairClean : {
    id0 : [
      new Vec2D(5.27,7.16),
      new Vec2D(5.11,8.27),
      new Vec2D(5.87,7.89)
    ],
    id1 : [
      new Vec2D(2.65,9.46),
      new Vec2D(2.59,9.52),
      new Vec2D(3.35,9.47),
    ]
  },
  fairLate : {
    id0 : [
      new Vec2D(6.62,7.44),
      new Vec2D(6.03,7.35),
      new Vec2D(5.40,7.47),
      new Vec2D(5.69,7.45),
      new Vec2D(5.95,7.39),
      new Vec2D(6.19,7.32),
      new Vec2D(6.40,7.27),
      new Vec2D(6.58,7.23),
      new Vec2D(6.72,7.19),
      new Vec2D(6.84,7.16),
      new Vec2D(6.93,7.13),
      new Vec2D(6.98,7.09),
      new Vec2D(6.98,7.48),
      new Vec2D(6.88,7.98)
    ],
    id1 : [
      new Vec2D(4.18,9.34),
      new Vec2D(3.71,9.20),
      new Vec2D(3.15,9.11),
      new Vec2D(3.41,9.09),
      new Vec2D(3.65,9.05),
      new Vec2D(3.87,9.00),
      new Vec2D(4.05,8.95),
      new Vec2D(4.21,8.89),
      new Vec2D(4.32,8.85),
      new Vec2D(4.41,8.81),
      new Vec2D(4.45,8.80),
      new Vec2D(4.46,8.81),
      new Vec2D(4.42,8.86),
      new Vec2D(4.33,8.95)
    ]
  },
  upairClean : {
    id0 : [
      new Vec2D(5.40,10.91),
      new Vec2D(4.82,12.71),
      new Vec2D(3.49,14.37),
      new Vec2D(1.64,15.33),
    ],
    id1 : [
      new Vec2D(12.69,8.78),
      new Vec2D(12.15,14.82),
      new Vec2D(9.02,19.61),
      new Vec2D(4.30,22.46),
    ]

  },
  upairMid : {
    id0 : [
      new Vec2D(-0.60,15.54),
      new Vec2D(-2.76,14.95),
      new Vec2D(-4.45,13.72),
      new Vec2D(-5.38,12.31)
    ],
    id1 : [
      new Vec2D(-1.48,23.10),
      new Vec2D(-6.92,21.32),
      new Vec2D(-10.96,17.64),
      new Vec2D(-12.85,13.67)
    ]
  },
  dair : {
    id0 : [
      new Vec2D(-1.37,-3.36),
      new Vec2D(-1.18,-6.24),
      new Vec2D(-1.25,-5.06),
      new Vec2D(-1.22,-3.68),
      new Vec2D(-0.84,-2.31)
    ],
    id1 : [
      new Vec2D(-1.32,2.86),
      new Vec2D(-1.27,1.55),
      new Vec2D(-1.25,1.99),
      new Vec2D(-1.20,2.54),
      new Vec2D(0.13,2.27)
    ],
    id2 : [
      new Vec2D(0.03,9.01),
      new Vec2D(0.04,8.86),
      new Vec2D(0.04,8.75),
      new Vec2D(0.03,8.70),
      new Vec2D(0.02,8.68)
    ]
  },
  falconpunchair : {
    id0 : [
      new Vec2D(10.21-4.96,12.03),
      new Vec2D(13.46-1.40,10.31),
      new Vec2D(13.35-1.29,10.31),
      new Vec2D(13.25-1.18,10.31),
      new Vec2D(13.15-1.09,10.31)
    ],
    id1 : [
      new Vec2D(12.08-4.96,11.33),
      new Vec2D(8.79-1.40,10.60),
      new Vec2D(8.68-1.29,10.60),
      new Vec2D(8.58-1.18,10.60),
      new Vec2D(8.48-1.09,10.60)
    ],
    id2 : [
      new Vec2D(17.04-4.96,11.56),
      new Vec2D(20.89-1.40,7.97),
      new Vec2D(20.78-1.29,7.97),
      new Vec2D(20.67-1.18,7.97),
      new Vec2D(20.58-1.09,7.97)
    ]
  },
  falconpunchground : {
    id0 : [
      new Vec2D(4.01,10.20),
      new Vec2D(12.08,9.97),
      new Vec2D(13.54-1.45,9.92),
      new Vec2D(13.74-1.63,9.86),
      new Vec2D(13.83-1.71,9.81)
    ],
    id1 : [
      new Vec2D(8.47,10.78),
      new Vec2D(7.43,9.92),
      new Vec2D(8.89-1.45,9.88),
      new Vec2D(9.10-1.63,9.83),
      new Vec2D(9.19-1.71,9.78)
    ],
    id2 : [
      new Vec2D(10.51,9.75),
      new Vec2D(20.23,9.98),
      new Vec2D(21.70-1.45,9.94),
      new Vec2D(21.9-1.63,9.89),
      new Vec2D(22.00-1.71,9.84)
    ]
  },
  raptorboostair : {
    id0 : [
      new Vec2D(5.86,3.17),
    ],
    id1 : [
      new Vec2D(5.86,10.00)
    ],
    id2 : [
      new Vec2D(5.86,-4.83)
    ]
  },
  raptorboostairhit : {
    id0 : [
      new Vec2D(5.93,16.77),
      new Vec2D(10.57,14.87+0.2),
      new Vec2D(13.45,7.95+0.25),
      new Vec2D(11.81,1.41+0.3),
      new Vec2D(8.34,-2.01)
    ]
  },
  raptorboostground : {
    id0 : [
      new Vec2D(6.25,3.17),
    ],
    id1 : [
      new Vec2D(6.25,8.00)
    ],
    id2 : [
      new Vec2D(6.25,14.83)
    ]
  },
  raptorboostgroundhit : {
    id0 : [
      new Vec2D(9.94-0.31,5.12),
      new Vec2D(12.34-0.31,9.73),
      new Vec2D(6.58-0.31,20.72),
      new Vec2D(4.55-0.31,20.81),
      new Vec2D(3.60-0.31,20.83)
    ]
  },
  falconkickairClean : {
    id0 : [
      new Vec2D(64.38-70.03,65.73-59.05),
      new Vec2D(66.29-70.28,65.13-58.58),
      new Vec2D(67.53-71.55,61.17-54.64)
    ],
    id1 : [
      new Vec2D(76.73-77.92,65.90-57.65),
      new Vec2D(77.03-78.17,65.29-57.18),
      new Vec2D(78.28-79.44,61.34-53.24)
    ]
  },
  falconkickairMid : {
    id0 : [
      new Vec2D(68.78-72.81,57.22-50.70),
      new Vec2D(70.02-74.07,53.26-46.77),
      new Vec2D(71.26-75.34,49.30-42.83),
      new Vec2D(72.51-76.60,45.33-38.90),
      new Vec2D(73.75-77.86,41.36-34.96),
      new Vec2D(74.99-79.13,37.39-31.03),
      new Vec2D(76.24-80.39,33.41-27.09),
      new Vec2D(77.48-81.65,29.43-23.16)
    ],
    id1 : [
      new Vec2D(79.52-80.70,57.39-49.30),
      new Vec2D(80.77-81.96,53.43-45.37),
      new Vec2D(82.01-83.23,49.47-41.43),
      new Vec2D(83.25-84.49,45.51-37.50),
      new Vec2D(84.50-85.75,41.54-33.56),
      new Vec2D(85.74-87.02,37.57-29.63),
      new Vec2D(86.99-88.28,33.60-25.69),
      new Vec2D(88.23-89.54,29.63-21.76)
    ]
  },
  falconkickairLate : {
    id0 : [
      new Vec2D(78.72-82.92,25.45-19.22),
      new Vec2D(79.97-84.18,21.46-15.28),
      new Vec2D(81.21-85.44,17.47-11.35),
      new Vec2D(82.45-86.71,13.48-7.41)
    ],
    id1 : [
      new Vec2D(89.48-90.81,25.64-17.82),
      new Vec2D(90.72-92.07,21.66-13.88),
      new Vec2D(91.97-93.33,17.68-9.95),
      new Vec2D(93.21-94.60,13.69-6.01)
    ]
  },
  falconkickland : {
    id0 : [
      new Vec2D(8.80-1.77,0),
      new Vec2D(8.80-1.77,0)
    ],
    id1 : [
      new Vec2D(-5.26-1.77,0),
      new Vec2D(-5.26-1.77,0)
    ],
    id2 : [
      new Vec2D(0,0),
      new Vec2D(0,0)
    ]
  },
  falconkickgroundClean : {
    id0 : [
      new Vec2D(2.19-2.76,7.06),
      new Vec2D(2.29-2.76,7.45),
      new Vec2D(2.38-2.76,7.41)
    ],
    id1 : [
      new Vec2D(-2.89-2.76,7.17),
      new Vec2D(-2.79-2.76,7.13),
      new Vec2D(-2.70-2.76,7.09)
    ],
    id2 : [
      new Vec2D(9.98-2.76,6.76),
      new Vec2D(10.09-2.76,7.82),
      new Vec2D(10.18-2.76,7.79)
    ]
  },
  falconkickgroundMid : {
    id0 : [
      new Vec2D(2.47-2.76,7.40),
      new Vec2D(2.55-2.76,7.34),
      new Vec2D(2.64-2.76,7.31),
      new Vec2D(2.72-2.76,7.28),
      new Vec2D(2.79-2.76,7.28),
      new Vec2D(2.86-2.76,7.23),
      new Vec2D(2.94-2.76,7.20),
      new Vec2D(3.01-2.76,7.18)
    ],
    id1 : [
      new Vec2D(-2.61-2.76,7.05),
      new Vec2D(-2.53-2.76,7.02),
      new Vec2D(-2.44-2.76,6.99),
      new Vec2D(-2.36-2.76,6.96),
      new Vec2D(-2.29-2.76,6.93),
      new Vec2D(-2.21-2.76,6.91),
      new Vec2D(-2.14-2.76,6.88),
      new Vec2D(-2.07-2.76,6.86)
    ],
    id2 : [
      new Vec2D(10.27-2.76,7.81),
      new Vec2D(10.36-2.76,7.71),
      new Vec2D(10.44-2.76,7.68),
      new Vec2D(10.52-2.76,7.65),
      new Vec2D(10.59-2.76,7.68),
      new Vec2D(10.67-2.76,7.60),
      new Vec2D(10.74-2.76,7.58),
      new Vec2D(10.81-2.76,7.56)
    ]
  },
  falconkickgroundLate : {
    id0 : [
      new Vec2D(3.08-2.76,7.16),
      new Vec2D(3.15-2.76,7.14),
      new Vec2D(3.21-2.76,7.12),
      new Vec2D(3.28-2.76,7.11),
      new Vec2D(3.35-2.76,7.09),
      new Vec2D(3.41-2.76,7.07),
      new Vec2D(3.47-2.76,7.06),
      new Vec2D(3.53-2.76,7.06)
    ],
    id1 : [
      new Vec2D(-2.00-2.76,6.84),
      new Vec2D(-1.93-2.76,6.82),
      new Vec2D(-1.87-2.76,6.80),
      new Vec2D(-1.80-2.76,6.78),
      new Vec2D(-1.75-2.76,6.77),
      new Vec2D(-1.67-2.76,6.75),
      new Vec2D(-1.61-2.76,6.73),
      new Vec2D(-1.54-2.76,6.72)
    ],
    id2 : [
      new Vec2D(10.88-2.76,7.54),
      new Vec2D(10.95-2.76,7.52),
      new Vec2D(11.02-2.76,7.50),
      new Vec2D(11.08-2.76,7.48),
      new Vec2D(11.15-2.76,7.46),
      new Vec2D(11.21-2.76,7.45),
      new Vec2D(11.27-2.76,7.43),
      new Vec2D(11.33-2.76,7.47)
    ]
  },
  falcondive1 : {
    id0 : [
      new Vec2D(6.0,8.60)
    ],
    id1 : [
      new Vec2D(13.33,8.60)
    ]
  },
  falcondive2 : {
    id0 : []
  },
  falcondivethrowextra : {
    id0 : [
      new Vec2D(6.81-7.79,10.59),
      new Vec2D(6.86-7.79,10.35),
    ]
  },
  dashattackClean : {
    id0 : [
      new Vec2D(3.66-1.35,6.14),
      new Vec2D(3.47-1.35,6.18),
      new Vec2D(3.40-1.35,6.23),
    ]
  },
  dashattackLate : {
    id0 : [
      new Vec2D(3.37-1.35,6.29),
      new Vec2D(3.33-1.35,6.34),
      new Vec2D(3.29-1.35,6.38),
      new Vec2D(3.25-1.35,6.41),
      new Vec2D(3.20-1.35,6.43),
      new Vec2D(3.15-1.35,6.44),
      new Vec2D(3.09-1.35,6.46)
    ]
  },
  throwforwardextra : {
    id0 : [
      new Vec2D(5.92,8.41),
      new Vec2D(6.20,9.42),
      new Vec2D(6.21,9.62),
      new Vec2D(6.22,9.75),
      new Vec2D(6.25,9.80),
      new Vec2D(6.26,9.76),
      new Vec2D(6.24,9.62)
    ],
    id1 : [
      new Vec2D(1.76,10.35),
      new Vec2D(2.20,10.77),
      new Vec2D(2.12,10.86),
      new Vec2D(2.12,10.89),
      new Vec2D(2.15,10.96),
      new Vec2D(2.18,10.99),
      new Vec2D(2.19,10.94)
    ],
    id2 : [
      new Vec2D(2.62,12.93),
      new Vec2D(2.87,13.32),
      new Vec2D(2.92,13.35),
      new Vec2D(2.91,13.38),
      new Vec2D(2.88,13.44),
      new Vec2D(2.88,13.47),
      new Vec2D(2.91,13.42)
    ]
  },
  throwupextra : {
    id0 : [
      new Vec2D(6.98,11.76),
      new Vec2D(6.82,11.81),
      new Vec2D(6.78,11.82),
      new Vec2D(6.83,11.81),
      new Vec2D(6.92,11.82),
      new Vec2D(7.38,17.36),
      new Vec2D(7.39,18.21),
      new Vec2D(6.98,18.55),
      new Vec2D(6.73,17.90),
      new Vec2D(6.40,17.19),
      new Vec2D(6.40,17.98),
      new Vec2D(6.35,18.71),
      new Vec2D(6.29,18.12),
      new Vec2D(6.21,17.46),
      new Vec2D(6.43,17.87),
      new Vec2D(6.63,18.23),
      new Vec2D(6.75,17.89),
      new Vec2D(6.74,17.38)
    ],
    id1 : [
      new Vec2D(3.83,9.27),
      new Vec2D(3.87,9.10),
      new Vec2D(3.87,9.09),
      new Vec2D(3.87,9.11),
      new Vec2D(3.88,9.12),
      new Vec2D(6.10,12.47),
      new Vec2D(5.82,13.06),
      new Vec2D(5.69,13.27),
      new Vec2D(5.89,12.89),
      new Vec2D(5.98,12.51),
      new Vec2D(5.86,12.99),
      new Vec2D(5.63,13.42),
      new Vec2D(5.77,13.07),
      new Vec2D(5.83,12.68),
      new Vec2D(5.74,12.89),
      new Vec2D(5.62,13.08),
      new Vec2D(5.67,12.84),
      new Vec2D(5.73,12.48)
    ],
    id2 : [
      new Vec2D(2.60,11.69),
      new Vec2D(2.63,11.54),
      new Vec2D(2.62,11.52),
      new Vec2D(2.63,11.54),
      new Vec2D(2.65,11.55),
      new Vec2D(3.46,12.00),
      new Vec2D(3.38,11.94),
      new Vec2D(3.39,11.87),
      new Vec2D(3.30,12.10),
      new Vec2D(3.28,12.34),
      new Vec2D(3.28,12.17),
      new Vec2D(3.32,12.02),
      new Vec2D(3.21,12.15),
      new Vec2D(3.14,12.29),
      new Vec2D(3.13,12.16),
      new Vec2D(3.14,12.01),
      new Vec2D(3.09,12.00),
      new Vec2D(3.05,11.99)
    ]
  },
  throwbackextra : {
    id0 : [
      new Vec2D(-10.39,20.13),
      new Vec2D(-10.40,20.13),
      new Vec2D(-10.41,20.13),
      new Vec2D(-10.43,20.13),
      new Vec2D(-10.45,20.13),
      new Vec2D(-10.46,20.13),
      new Vec2D(-10.47,20.14),
      new Vec2D(-10.47,20.16)
    ],
    id1 : [
      new Vec2D(-3.82,15.88),
      new Vec2D(-3.82,15.89),
      new Vec2D(-3.83,15.90),
      new Vec2D(-3.84,15.91),
      new Vec2D(-3.85,15.92),
      new Vec2D(-3.85,15.93),
      new Vec2D(-3.86,15.95),
      new Vec2D(-3.87,15.97)
    ],
    id2 : [
      new Vec2D(-0.18,13.70),
      new Vec2D(-0.19,13.71),
      new Vec2D(-0.19,13.72),
      new Vec2D(-0.19,13.74),
      new Vec2D(-0.20,13.75),
      new Vec2D(-0.21,13.77),
      new Vec2D(-0.21,13.79),
      new Vec2D(-0.22,13.81)
    ]
  },
  thrown : {
    id0 : [new Vec2D(2.1,12.7)]
  }
});

for (let k = 0; k < 20; k++) {
  offsets[CHARIDS.FALCON_ID].falcondive2.id0.push(new Vec2D(6,8.6));
}

setHitBoxes(CHARIDS.FALCON_ID, {
  fairClean : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].fairClean.id0,5.078,18,32,100,24,0,4,0,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].fairClean.id1,3.515,18,32,100,24,0,4,0,1,1)
  ),
  fairLate : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].fairLate.id0,5.078,6,361,80,35,0,0,0,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].fairLate.id1,3.515,6,361,80,35,0,0,0,1,1)
  ),
  bairClean : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].bairClean.id0,4.687,14,361,100,20,0,0,0,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].bairClean.id1,4.687,14,361,100,0,0,0,0,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].bairClean.id2,3.906,14,361,100,0,0,0,0,1,1)
  ),
  bairLate : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].bairLate.id0,4.687,8,361,100,20,0,0,0,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].bairLate.id1,4.687,8,361,100,0,0,0,0,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].bairLate.id2,3.906,8,361,100,0,0,0,0,1,1)
  ),
  nair1 : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].nair1.id0,4.297,6,82,100,0,40,0,0,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].nair1.id1,5.468,5,78,100,0,40,0,0,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].nair1.id1,4.297,6,74,100,0,40,0,0,1,1)
  ),
  nair2 : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].nair2.id0,4.297,7,361,100,40,0,0,0,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].nair2.id1,4.297,7,361,100,40,0,0,0,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].nair2.id1,4.297,7,361,100,40,0,0,0,1,1)
  ),
  dair : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].dair.id0,6.640,16,270,100,40,0,0,0,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].dair.id1,5.859,16,270,100,40,0,0,0,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].dair.id2,5.468,16,290,100,40,0,0,0,1,1)
  ),
  upairClean : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].upairClean.id0,3.906,13,361,100,30,0,0,0,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].upairClean.id1,4.687,13,361,100,10,0,0,0,1,1),
  ),
  upairMid : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].upairMid.id0,3.906,12,30,80,8,0,0,0,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].upairMid.id1,4.687,10,30,80,8,0,0,0,1,1),
  ),
  /*
  doesnt actually exist
  upairLate : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].upairMid.id0,3.906,8,0,70,6,0,0,0,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].upairMid.id1,4.687,6,0,70,6,0,0,0,1,1),
  ),*/
  falcondive1 : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].falcondive1.id0,2.734,0,361,100,0,0,2,3,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].falcondive1.id0,4.297,0,361,100,0,0,2,3,1,1)
  ),
  falcondive2 : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].falcondive2.id0,2.734,0,361,100,0,0,2,3,1,1)
  ),
  ///
  falcondivethrow : new createHitboxObject(
    new createHitbox(new Vec2D(0,0),0,12,361,82,40,0,3,0,1,1)
  ),
  falcondivethrowextra : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].falcondivethrowextra.id0,7.812,6,0,50,70,0,0,0,1,1,true)
  ),
  dtilt : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].dtilt.id0,3.906,12,80,75,25,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].dtilt.id1,3.906,12,70,75,25,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].dtilt.id2,3.906,12,60,75,25,0,0,1,1,1)
  ),
  uptilt : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].uptilt.id0,4.687,13,361,80,50,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].uptilt.id1,3.125,13,361,80,50,0,0,1,1,1)
  ),
  ftilt : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].ftilt.id0,4.297,11,361,100,10,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].ftilt.id1,3.515,11,361,100,10,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].ftilt.id2,3.515,11,361,100,10,0,0,1,1,1)
  ),
  dashattackClean : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].dashattackClean.id0,5.859,10,361,90,22,0,0,1,1,1)
  ),
  dashattackLate : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].dashattackLate.id0,3.125,7,361,50,10,0,0,1,1,1)
  ),
  jab1 : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].jab1.id0,3.515,2,80,100,20,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].jab1.id1,3.515,2,80,100,20,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].jab1.id2,2.344,2,80,100,20,0,0,1,1,1)
  ),
  jab2 : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].jab2.id0,3.515,3,80,100,20,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].jab2.id1,3.515,3,80,100,20,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].jab2.id2,2.734,3,80,100,20,0,0,1,1,1)
  ),
  jab3Clean : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].jab3Clean.id0,5.079,8,361,100,20,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].jab3Clean.id1,3.515,8,361,100,20,0,0,1,1,1)
  ),
  jab3Late : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].jab3Late.id0,3.906,6,361,100,0,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].jab3Late.id1,3.125,6,361,100,0,0,0,1,1,1)
  ),
  fsmash : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].fsmash.id0,3.515,20,361,100,24,0,3,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].fsmash.id1,3.515,20,361,100,24,0,3,1,1,1)
  ),
  upsmash1 : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].upsmash1.id0,5.468,8,90,100,0,80,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].upsmash1.id1,4.687,8,100,100,0,100,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].upsmash1.id2,3.906,14,80,105,30,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].upsmash1.id3,3.906,14,90,105,30,0,0,1,1,1),
  ),
  upsmash2 : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].upsmash2.id0,3.906,13,90,128,30,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].upsmash2.id1,3.906,13,90,126,30,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].upsmash2.id2,3.906,12,80,110,30,0,0,1,1,1)
  ),
  dsmash1 : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].dsmash1.id0,3.906,18,361,100,30,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].dsmash1.id1,3.906,18,361,100,30,0,0,1,1,1)
  ),
  dsmash2 : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].dsmash2.id0,3.515,16,361,100,20,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].dsmash2.id1,3.515,16,361,100,20,0,0,1,1,1)
  ),
  grab : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].grab.id0,3.906,0,361,100,0,0,2,3,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].grab.id1,3.906,0,361,100,0,0,2,3,1,1)
  ),
  downattack1 : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].downattack1.id0,4.687,6,361,50,80,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].downattack1.id1,4.687,6,361,50,80,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].downattack1.id2,6.250,6,361,50,80,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].downattack1.id3,6.250,6,361,50,80,0,0,1,1,1)
  ),
  downattack2 : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].downattack2.id0,4.687,6,361,50,80,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].downattack2.id1,4.687,6,361,50,80,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].downattack2.id2,6.250,6,361,50,80,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].downattack1.id3,6.250,6,361,50,80,0,0,1,1,1)
  ),
  falconkickgroundClean : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconkickgroundClean.id0,3.906,15,361,70,50,0,3,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconkickgroundClean.id1,2.734,15,361,70,50,0,3,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconkickgroundClean.id2,4.297,15,361,70,50,0,3,1,1,1),
  ),
  //starts on 4
  falconkickgroundMid : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconkickgroundMid.id0,3.906,12,80,60,50,0,3,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconkickgroundMid.id1,2.734,12,80,60,50,0,3,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconkickgroundMid.id2,4.297,12,80,60,50,0,3,1,1,1),
  ),
  //starts on 12
  falconkickgroundLate : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconkickgroundLate.id0,3.906,9,90,50,50,0,3,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconkickgroundLate.id1,2.734,9,90,50,50,0,3,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconkickgroundLate.id2,4.297,9,90,50,50,0,3,1,1,1)
  ),
  falconkickairClean : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconkickairClean.id0,3.906,15,361,70,40,0,3,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconkickairClean.id1,4.687,15,361,70,40,0,3,1,1,1)
  ),
  falconkickairMid : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconkickairMid.id0,3.906,13,361,65,40,0,3,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconkickairMid.id1,4.687,13,361,65,40,0,3,1,1,1)
  ),
  falconkickairLate : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconkickairLate.id0,3.906,11,361,60,40,0,3,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconkickairLate.id1,4.687,11,361,60,40,0,3,1,1,1)
  ),
  falconkickland : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconkickland.id0,3.906,9,80,20,80,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconkickland.id1,3.906,9,80,20,80,0,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconkickland.id2,3.906,9,80,20,80,0,0,1,1,1),
  ),
  falconpunchground : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconpunchground.id0,3.906,27,361,102,30,0,3,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconpunchground.id1,3.515,25,361,102,30,0,3,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconpunchground.id2,4.883,23,361,102,30,0,3,1,1,1)
  ),
  falconpunchair : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconpunchair.id0,5.273,27,361,102,40,0,3,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconpunchair.id1,4.687,25,361,102,40,0,3,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].falconpunchair.id2,4.883,23,361,102,40,0,3,1,1,1)
  ),
  raptorboostground : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].raptorboostground.id0,4.000,0,361,0,0,0,8,0,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].raptorboostground.id1,4.000,0,361,0,0,0,8,0,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].raptorboostground.id2,4.000,0,361,0,0,0,8,0,1,1)
  ),
  raptorboostair : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].raptorboostair.id0,4.000,0,361,0,0,0,8,0,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].raptorboostair.id1,4.000,0,361,0,0,0,8,0,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].raptorboostair.id2,4.000,0,361,0,0,0,8,0,1,1)
  ),
  raptorboostgroundhit : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].raptorboostgroundhit.id0,7.500,7,90,80,78,0,3,1,1,1)
  ),
  raptorboostairhit : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].raptorboostairhit.id0,7.500,7,270,70,60,0,3,0,1,1)
  ),
  ledgegetupquick : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].ledgegetupquick.id0,4.687,10,361,100,0,90,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].ledgegetupquick.id1,6.250,10,361,100,0,90,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].ledgegetupquick.id2,4.687,10,361,100,0,90,0,1,1,1)
  ),
  ledgegetupslow : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].ledgegetupslow.id0,6.250,8,361,100,0,90,0,1,1,1),
    new createHitbox(offsets[CHARIDS.FALCON_ID].ledgegetupslow.id1,4.687,8,361,100,0,90,0,1,1,1)
  ),
  pummel : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].pummel.id0,5.078,3,80,100,0,30,0,0,1,1)
  ),
  throwup : new createHitboxObject(
    new createHitbox(new Vec2D(8.63,11.15),0,3,85,105,70,0,0,0,1,1)
  ),
  throwdown : new createHitboxObject(
    new createHitbox(new Vec2D(8.58,3.25),0,7,65,34,75,0,0,0,1,1)
  ),
  throwback : new createHitboxObject(
    new createHitbox(new Vec2D(-11.36,22.23),0,4,135,130,30,0,0,0,1,1)
  ),
  throwforward : new createHitboxObject(
    new createHitbox(new Vec2D(7.54,12.51),0,4,45,105,45,0,0,0,1,1)
  ),
  throwforwardextra : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].throwforwardextra.id0,3.906,5,361,110,0,0,0,0,1,1,true),
    new createHitbox(offsets[CHARIDS.FALCON_ID].throwforwardextra.id1,1.953,5,361,110,0,0,0,0,1,1,true),
    new createHitbox(offsets[CHARIDS.FALCON_ID].throwforwardextra.id2,1.953,5,361,110,0,0,0,0,1,1,true)
  ),
  throwupextra : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].throwupextra.id0,3.515,4,361,100,0,0,0,0,1,1,true),
    new createHitbox(offsets[CHARIDS.FALCON_ID].throwupextra.id1,3.125,4,361,100,0,0,0,0,1,1,true),
    new createHitbox(offsets[CHARIDS.FALCON_ID].throwupextra.id2,2.734,4,361,100,0,0,0,0,1,1,true)
  ),
  throwbackextra : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].throwbackextra.id0,3.906,5,361,0,0,0,0,0,1,1,true),
    new createHitbox(offsets[CHARIDS.FALCON_ID].throwbackextra.id1,3.515,5,361,0,0,0,0,0,1,1,true),
    new createHitbox(offsets[CHARIDS.FALCON_ID].throwbackextra.id2,2.734,5,361,0,0,0,0,0,1,1,true)
  ),
  thrown : new createHitboxObject(
    new createHitbox(offsets[CHARIDS.FALCON_ID].thrown.id0,3.906,4,361,50,20,0,1,0,1,1)
  )
});

for (let l = 0; l < 20; l++) {
  offsets[CHARIDS.FALCON_ID].thrown.id0.push(new Vec2D(0,12));
}

setChars(CHARIDS.FALCON_ID, new charObject(CHARIDS.FALCON_ID));
