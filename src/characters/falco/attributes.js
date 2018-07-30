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


setCharAttributes(CHARIDS.FALCO_ID, {
  dashFrameMin : 11,
  dashFrameMax : 21,
  dInitV : 1.82,
  dMaxV : 1.5,
  dAccA : 0.1,
  dAccB : 0.02,
  dTInitV : 1.9,
  traction : 0.08,
  maxWalk : 1.4,
  jumpSquat : 5,
  sHopInitV : 1.9,
  fHopInitV : 4.1,
  gravity : 0.17,
  groundToAir : 1,
  jumpHmaxV : 1.7,
  jumpHinitV : 0.7,
  airMobA : 0.05,
  airMobB : 0.02,
  aerialHmaxV : 0.83,
  airFriction : 0.02,
  fastFallV : 3.5,
  terminalV : 3.1,
  walkInitV : 0.2,
  walkAcc : 0.1,
  walkMaxV : 1.4,
  djMultiplier : 0.94,
  djMomentum : 0.94,
  shieldScale : 12.5,
  modelScale : 1.1,
  weight : 80,
  waitAnimSpeed : 1,
  walljump : true,
  hurtboxOffset : [4,18],
  ledgeSnapBoxOffset : [14,8,18],
  shieldOffset : [10,40],
  charScale : 0.47,
  miniScale : 0.3,
  runTurnBreakPoint : 9,
  airdodgeIntangible : 26,
  wallJumpVelX : 1.3,
  wallJumpVelY : 3.6,
  shieldBreakVel : 3.3,
  multiJump : false,
  //ecbScale : 2.3,
  ecbScale : 1,
  walkAnimSpeed : 1.5,
  runAnimSpeed : 0.7
});

// start, length
setIntangibility(CHARIDS.FALCO_ID, {
  "ESCAPEAIR" : [4,26],
  "ESCAPEB" : [4,16],
  "ESCAPEF" : [4,16],
  "ESCAPEN" : [2,14],
  "DOWNSTANDN" : [1,23],
  "DOWNSTANDB" : [12,18],
  "DOWNSTANDF" : [1,19],
  "TECHN" : [1,20],
  "TECHB" : [1,20],
  "TECHF" : [1,20],
});

setFrames(CHARIDS.FALCO_ID, {
  "WAIT" : 241,
  "DASH" : 21,
  "RUN" : 20,
  "RUNBRAKE" : 18,
  "RUNTURN" : 20,
  "WALK" : 31,
  "JUMPF" : 40,
  "JUMPB" : 40,
  "FALL" : 8,
  "FALLAERIAL" : 8,
  "FALLSPECIAL" : 8,
  "SQUAT" : 7,
  "SQUATWAIT" : 100,
  "SQUATRV" : 10,
  "JUMPAERIALF" : 50,
  "JUMPAERIALB" : 50,
  "PASS" : 29,
  "GUARDON" : 8,
  "GUARDOFF" : 15,
  "CLIFFCATCH" : 7,
  "CLIFFWAIT" : 50,
  "DAMAGEFLYN" : 29,
  "DAMAGEFALL" : 30,
  "DAMAGEN2" : 23,
  "LANDINGATTACKAIRF" : 22,
  "LANDINGATTACKAIRB" : 20,
  "LANDINGATTACKAIRU" : 18,
  "LANDINGATTACKAIRD" : 18,
  "LANDINGATTACKAIRN" : 15,
  "ESCAPEB" : 31,
  "ESCAPEF" : 31,
  "ESCAPEN" : 22,
  "DOWNBOUND" : 26,
  "DOWNWAIT" : 69,
  "DOWNSTANDN" : 30,
  "DOWNSTANDB" : 35,
  "DOWNSTANDF" : 35,
  "TECHN" : 26,
  "TECHB" : 40,
  "TECHF" : 40,
  "SHIELDBREAKFALL" : 30,
  "SHIELDBREAKDOWNBOUND" : 26,
  "SHIELDBREAKSTAND" : 30,
  "FURAFURA" : 109,
  "CAPTUREWAIT" : 80,
  "CATCHWAIT" : 30,
  "CAPTURECUT" : 30,
  "CATCHCUT" : 30,
  "CAPTUREDAMAGE" : 20,
  "WALLDAMAGE" : 41,
  "WALLTECH" : 26,
  "WALLJUMP" : 40,
  "OTTOTTO" : 12,
  "OTTOTTOWAIT" : 110,
  "THROWNMARTHUP" : 9,
  "THROWNMARTHBACK" : 5,
  "THROWNMARTHFORWARD" : 11,
  "THROWNMARTHDOWN" : 11,
  "THROWNPUFFUP" : 6,
  "THROWNPUFFBACK" : 19,
  "THROWNPUFFFORWARD" : 9,
  "THROWNPUFFDOWN" : 60,
  "THROWNFOXUP" : 6,
  "THROWNFOXBACK" : 7,
  "THROWNFOXFORWARD" : 10,
  "THROWNFOXDOWN" : 32,
  "THROWNFALCOUP" : 5,
  "THROWNFALCOBACK" : 7,
  "THROWNFALCOFORWARD" : 8,
  "THROWNFALCODOWN" : 26,
  "THROWNFALCONUP" : 14,
  "THROWNFALCONBACK" : 19,
  "THROWNFALCONFORWARD" : 17,
  "THROWNFALCONDOWN" : 14,
  "FURASLEEPSTART" : 30,
  "FURASLEEPLOOP" : 110,
  "FURASLEEPEND" : 60,
  "STOPCEIL" : 9,
  "TECHU" : 26,
  "REBOUND" : 15
});

setActionSounds(CHARIDS.FALCO_ID, {
  "JUMP" : [],
  "ESCAPEAIR" : [[4,"falcoairdodge"]],
  "JUMPAERIAL" : [[1,"falcodoublejump"]],
  "GUARDON" : [],
  "GUARDOFF" : [],
  "CLIFFCATCH" : [[1,"falcocliffcatch"],[1,"puffledgegrab"]],
  "DEAD" : [[1,"falcodeath"]],
  "FURAFURA" : [[28,"falcofura"]],
  "ESCAPEB" : [],
  "ESCAPEF" : [],
  "ESCAPEN" : [],
  "OTTOTTOWAIT" : [[0,"falcoairdodge"]],
  "TECH" : [[1,"falcotech"]]
});

// HITBOX OFFSETS

setOffsets(CHARIDS.FALCO_ID, {
  jab1 : {
    id0 : [new Vec2D(5.75,6.96),
    new Vec2D(17.80,9.37)],
    id1 : [new Vec2D(7.48,10.45),
    new Vec2D(10.31,8.90)]
  },
  jab2 : {
    id0 : [new Vec2D(10.56,8.06),
    new Vec2D(9.43,8.10)],
    id1 : [new Vec2D(2.95,7.01),
    new Vec2D(3.00,7.12)]
  },
  jab3_1 : {
    id0 : [new Vec2D(2.43,11.87),
    new Vec2D(2.34,11.57)],
    id1 : [new Vec2D(5.72,13.87),
    new Vec2D(5.50,13.34)],
    id2 : [new Vec2D(11.36,17.30),
    new Vec2D(10.92,16.35)]
  },
  jab3_2 : {
    id0 : [new Vec2D(2.64,11.09),
    new Vec2D(2.51,10.80)],
    id1 : [new Vec2D(6.30,12.31),
    new Vec2D(5.97,11.87)],
    id2 : [new Vec2D(12.55,14.41),
    new Vec2D(11.89,13.69)]
  },
  jab3_3 : {
    id0 : [new Vec2D(2.19,9.64),
    new Vec2D(2.18,9.48)],
    id1 : [new Vec2D(6.05,9.74),
    new Vec2D(5.95,9.44)],
    id2 : [new Vec2D(12.65,9.91),
    new Vec2D(12.41,9.37)]
  },
  jab3_4 : {
    id0 : [new Vec2D(2.67,8.81),
    new Vec2D(2.51,8.70)],
    id1 : [new Vec2D(6.16,7.98),
    new Vec2D(5.80,7.81)],
    id2 : [new Vec2D(12.12,6.57),
    new Vec2D(11.42,6.27)]
  },
  jab3_5 : {
    id0 : [new Vec2D(2.37,7.65),
    new Vec2D(2.33,7.71)],
    id1 : [new Vec2D(5.49,6.57),
    new Vec2D(5.24,6.43)],
    id2 : [new Vec2D(10.82,4.73),
    new Vec2D(10.22,4.25)]
  },
  downtilt : {
    id0 : [new Vec2D(2.35,3.55),
    new Vec2D(3.75,3.65),
    new Vec2D(1.64,3.77)],
    id1 : [new Vec2D(5.73,3.15),
    new Vec2D(8.63,3.43),
    new Vec2D(5.17,3.53)],
    id2 : [new Vec2D(9.12,2.76),
    new Vec2D(13.51,3.21),
    new Vec2D(8.70,3.30)]
  },
  uptilt : {
    id0 : [new Vec2D(0.53,9.39),
    new Vec2D(0.48,10.72),
    new Vec2D(1.18,11.71),
    new Vec2D(2.04,11.80),
    new Vec2D(2.05,11.70),
    new Vec2D(1.79,11.71),
    new Vec2D(1.54,11.68)],
    id1 : [new Vec2D(-4.40,5.42),
    new Vec2D(-6.56,12.34),
    new Vec2D(-2.13,18.63),
    new Vec2D(5.09,18.52),
    new Vec2D(5.26,17.63),
    new Vec2D(4.49,16.83),
    new Vec2D(3.49,16.29)]
  },
  forwardtilt : {
    id0 : [new Vec2D(1.60,6.04),
    new Vec2D(19.00,9.89),
    new Vec2D(19.23,9.98),
    new Vec2D(19.10,10.10),
    new Vec2D(18.70,10.20)],
    id1 : [new Vec2D(4.97,8.10),
    new Vec2D(12.68,9.91),
    new Vec2D(12.80,10.02),
    new Vec2D(12.59,10.09),
    new Vec2D(12.14,10.12)],
    id2 : [new Vec2D(3.62,8.80),
    new Vec2D(7.97,9.90),
    new Vec2D(8.04,10.02),
    new Vec2D(7.79,10.06),
    new Vec2D(7.32,10.05)]
  },
  dashattack1 : {
    id0 : [new Vec2D(7.99-1.84,8.58),
    new Vec2D(8.99-3.13,8.66),
    new Vec2D(9.92-4.36,8.67),
    new Vec2D(11.14-5.53,8.62)]
  },
  dashattack2 : {
    id0 : [new Vec2D(12.34-6.67,8.55),
    new Vec2D(13.51-7.76,8.46),
    new Vec2D(14.65-8.83,8.36),
    new Vec2D(15.78-9.88,8.24),
    new Vec2D(16.90-10.92,8.12),
    new Vec2D(18.01-11.95,7.99),
    new Vec2D(19.12-12.98,7.86),
    new Vec2D(20.23-14.02,7.75),
    new Vec2D(21.38-15.09,7.58),
    new Vec2D(22.57-16.17,7.25)]
  },
  grab : {
    id0 : [new Vec2D(9.45,7.73),
    new Vec2D(9.45,7.73)],
    id1 : [new Vec2D(5.16,7.73),
    new Vec2D(5.16,7.73)]
  },
  downspecialground : {
    id0 : [new Vec2D(-0.69,7.79)]
  },
  downspecialair : {
    id0 : [new Vec2D(0.04,13.89-5.19)]
  },
  reflector : {
    id0 : [new Vec2D(-0.60,6.80)]
  },
  downattack1 : {
    id0 : [new Vec2D(15.90,7.40),
    new Vec2D(16.18,7.27),
    new Vec2D(16.12,7.69)],
    id1 : [new Vec2D(8.79,7.24),
    new Vec2D(8.83,7.13),
    new Vec2D(8.82,7.31)],
    id2 : [new Vec2D(4.51,6.62),
    new Vec2D(4.51,6.62),
    new Vec2D(4.51,6.62)]
  },
  downattack2 : {
    id0 : [new Vec2D(-6.31,8.88),
    new Vec2D(-8.64,9.81),
    new Vec2D(-8.46,9.83)],
    id1 : [new Vec2D(-9.51,9.41),
    new Vec2D(-13.00,9.82),
    new Vec2D(-12.68,9.86)],
    id2 : [new Vec2D(-1.31,9.72),
    new Vec2D(-2.07,10.35),
    new Vec2D(-2.07,10.35)
    ]
  },
  ledgegetupquick : {
    id0 : [new Vec2D(6.07-0.04,7.72),
    new Vec2D(8.01-1.87,6.63),
    new Vec2D(10.44-4.07,6.31),
    new Vec2D(13.03-6.51,6.50),
    new Vec2D(15.73-9.04,5.74),
    new Vec2D(18.39-11.55,4.04),
    new Vec2D(20.88-13.90,2.91),
    new Vec2D(23.07-15.96,2.48),
    new Vec2D(24.83-17.59,2.36),
    new Vec2D(26.04-18.66,2.26)],
    id1 : [new Vec2D(5.98-0.04,6.37),
    new Vec2D(7.74-1.87,5.07),
    new Vec2D(10.34-4.07,4.37),
    new Vec2D(13.10-6.51,4.44),
    new Vec2D(15.77-9.04,5.19),
    new Vec2D(18.40-11.55,5.45),
    new Vec2D(20.88-13.90,4.75),
    new Vec2D(23.08-15.96,3.52),
    new Vec2D(24.38-17.59,2.58),
    new Vec2D(24.57-18.66,1.71)],
    id2 : [new Vec2D(-5.25-0.04,8.60),
    new Vec2D(-3.19-1.87,8.56),
    new Vec2D(-1.03-4.07,7.98),
    new Vec2D(1.36-6.51,6.89),
    new Vec2D(3.88-9.04,5.73),
    new Vec2D(6.42-11.55,4.20),
    new Vec2D(8.70-13.90,3.34),
    new Vec2D(10.94-15.96,3.33),
    new Vec2D(12.71-17.59,2.95),
    new Vec2D(13.92-18.66,2.69)],
  },
  ledgegetupslow : {
    id0 : [new Vec2D(8.29-1.33,11.47),
    new Vec2D(11.10-2.35,3.34),
    new Vec2D(10.66-2.76,2.26)],
    id1 : [new Vec2D(11.19-1.33,14.52),
    new Vec2D(15.34-2.35,1.47),
    new Vec2D(14.20-2.76,0.98)],
    id2 : [new Vec2D(1.18-1.33,10.52),
    new Vec2D(3.02-2.35,9.03),
    new Vec2D(4.57-2.76,7.51)]
  },
  downsmash : {
    id0 : [new Vec2D(-9.91,1.66),
    new Vec2D(-9.61,1.58),
    new Vec2D(-8.92,1.52),
    new Vec2D(-8.21,1.49),
    new Vec2D(-7.79,1.46)],
    id1 : [new Vec2D(10.43,2.11),
    new Vec2D(10.15,1.88),
    new Vec2D(9.47,1.72),
    new Vec2D(8.76,1.61),
    new Vec2D(8.34,1.54)],
    id2 : [new Vec2D(-5.33,1.67),
    new Vec2D(-5.18,1.63),
    new Vec2D(-4.84,1.60),
    new Vec2D(-4.48,1.59),
    new Vec2D(-4.28,1.58)],
    id3 : [new Vec2D(5.86,1.91),
    new Vec2D(5.72,1.80),
    new Vec2D(5.38,1.72),
    new Vec2D(5.03,1.67),
    new Vec2D(4.82,1.63)]
  },
  upsmash1 : {
    id0 : [new Vec2D(6.94,7.55),
    new Vec2D(8.22,10.84),
    new Vec2D(8.01,14.25),
    new Vec2D(6.50,18.17)],
    id1 : [new Vec2D(6.48,5.16),
    new Vec2D(10.52,9.71),
    new Vec2D(10.57,14.34),
    new Vec2D(8.99,18.74)]
  },
  upsmash2 : {
    id0 : [new Vec2D(4.92,20.33),
    new Vec2D(2.21,22.04),
    new Vec2D(-0.79,22.37),
    new Vec2D(-3.88,20.14),
    new Vec2D(-4.99,18.13)],
    id1 : [new Vec2D(6.42,22.40),
    new Vec2D(2.53,24.58),
    new Vec2D(-1.83,24.70),
    new Vec2D(-5.92,21.68),
    new Vec2D(-7.47,18.75)]
  },
  forwardsmash1 : {
    id0 : [new Vec2D(17.51-6.15,15.93),
    new Vec2D(21.59-7.69,13.95),
    new Vec2D(24.58-9.23,11.31),
    new Vec2D(25.94-10.37,8.85),
    new Vec2D(26.70-11.51,7.36)],
    id1 : [new Vec2D(15.15-6.15,11.83),
    new Vec2D(17.85-7.69,10.89),
    new Vec2D(19.78-9.23,9.74),
    new Vec2D(20.76-10.37,8.67),
    new Vec2D(21.46-11.51,8.01)],
    id2 : [new Vec2D(13.62-6.15,9.03),
    new Vec2D(14.86-7.69,9.01),
    new Vec2D(16.04-9.23,8.97),
    new Vec2D(16.76-10.37,8.91),
    new Vec2D(17.42-11.51,8.85)]
  },
  forwardsmash2 : {
    id0 : [new Vec2D(27.35-12.66,6.71),
    new Vec2D(27.89-13.80,6.30),
    new Vec2D(28.34-14.94,5.96),
    new Vec2D(28.65-16.08,5.51),
    new Vec2D(28.71-17.22,4.70)],
    id1 : [new Vec2D(22.08-12.66,7.71),
    new Vec2D(22.62-13.80,7.51),
    new Vec2D(23.08-14.94,7.33),
    new Vec2D(23.46-16.08,7.11),
    new Vec2D(23.77-17.22,6.92)],
    id2 : [new Vec2D(18.03-12.66,8.77),
    new Vec2D(18.56-13.80,8.67),
    new Vec2D(19.02-14.94,8.56),
    new Vec2D(19.41-16.08,8.44),
    new Vec2D(19.73-17.22,8.30)]
  },
  nair1 : {
    id0 : [],
    id1 : [],
    id2 : []
  },
  nair2 : {
    id0 : [],
    id1 : [],
    id2 : []
  },
  bair1 : {
    id0 : [],
    id1 : [new Vec2D(-9.22,10.99),
    new Vec2D(-9.22,10.96),
  new Vec2D(-9.24,10.89),
new Vec2D(-9.25,10.81)],
    id2 : [new Vec2D(3.06,4.81),
    new Vec2D(3.21,4.77),
    new Vec2D(3.30,4.78),
    new Vec2D(3.36,4.80)]
  },
  bair2 : {
    id0 : [],
    id1 : [new Vec2D(-9.06,10.76),
    new Vec2D(-8.83,10.58),
    new Vec2D(-8.56,10.42),
    new Vec2D(-8.26,10.27),
    new Vec2D(-7.97,10.13),
    new Vec2D(-7.69,9.99),
    new Vec2D(-7.42,9.86),
    new Vec2D(-7.15,9.71),
    new Vec2D(-6.90,9.56),
    new Vec2D(-6.63,9.38),
    new Vec2D(-6.36,9.17),
    new Vec2D(-6.05,8.94)],
    id2 : [new Vec2D(3.41,4.82),
    new Vec2D(3.44,4.82),
    new Vec2D(3.45,4.81),
    new Vec2D(3.43,4.77),
    new Vec2D(3.43,4.77),
    new Vec2D(3.43,4.77),
    new Vec2D(3.42,4.76),
    new Vec2D(3.38,4.72),
    new Vec2D(3.31,4.66),
    new Vec2D(3.25,4.61),
    new Vec2D(3.19,4.57),
    new Vec2D(3.12,4.53)]
  },
  fair1 : {
    id0 : [new Vec2D(3.01,10.01),
    new Vec2D(5.07,9.82),
    new Vec2D(5.13,9.71)],
    id1 : [new Vec2D(7.43,12.25),
    new Vec2D(9.88,11.27),
    new Vec2D(9.03,10.34)]
  },
  fair2 : {
    id0 : [new Vec2D(5.15,8.40),
    new Vec2D(3.26,7.74),
    new Vec2D(0.82,7.14)],
    id1 : [new Vec2D(10.19,7.93),
    new Vec2D(8.14,8.23),
    new Vec2D(3.96,7.08)]
  },
  fair3 : {
    id0 : [new Vec2D(3.09,10.19),
    new Vec2D(5.03,9.52),
    new Vec2D(5.14,9.66)],
    id1 : [new Vec2D(7.79,12.17),
    new Vec2D(9.86,10.63),
    new Vec2D(8.89,10.14)]
  },
  fair4 : {
    id0 : [new Vec2D(5.16,8.69),
    new Vec2D(5.15,8.39),
    new Vec2D(3.63,8.07)],
    id1 : [new Vec2D(5.72,8.37),
    new Vec2D(10.10,7.85),
    new Vec2D(8.62,8.65)]
  },
  fair5 : {
    id0 : [new Vec2D(5.17,8.84),
    new Vec2D(5.16,8.75),
    new Vec2D(4.98,8.60)],
    id1 : [new Vec2D(9.35,8.84),
    new Vec2D(9.20,8.56),
    new Vec2D(8.94,8.29)]
  },
  dair1 : {
    id0 : [new Vec2D(2.08,6.92),
    new Vec2D(2.30,7.04),
    new Vec2D(1.94,6.82),
    new Vec2D(1.25,6.41),
    new Vec2D(0.74,6.11),
    new Vec2D(0.77,6.13),
    new Vec2D(1.30,6.43),
    new Vec2D(1.96,6.81),
    new Vec2D(2.31,7.01),
    new Vec2D(2.14,6.92)],
    id1 : [new Vec2D(3.11,4.52),
    new Vec2D(3.35,4.64),
    new Vec2D(3.17,4.53),
    new Vec2D(2.72,4.27),
    new Vec2D(2.33,4.04),
    new Vec2D(2.28,4.01),
    new Vec2D(2.59,4.18),
    new Vec2D(3.03,4.43),
    new Vec2D(3.30,4.59),
    new Vec2D(3.25,4.56)]
  },
  dair2 : {
    id0 : [new Vec2D(1.61,6.61),
    new Vec2D(1.03,6.28),
    new Vec2D(0.70,6.08),
    new Vec2D(0.72,6.10),
    new Vec2D(1.04,6.29),
    new Vec2D(1.48,6.54),
    new Vec2D(1.89,6.79),
    new Vec2D(2.19,6.97),
    new Vec2D(2.32,7.04),
    new Vec2D(2.28,7.02)],
    id1 : [new Vec2D(2.94,4.38),
    new Vec2D(2.55,4.16),
    new Vec2D(2.29,4.01),
    new Vec2D(2.25,3.99),
    new Vec2D(2.42,4.09),
    new Vec2D(2.69,4.25),
    new Vec2D(2.98,4.42),
    new Vec2D(3.22,4.56),
    new Vec2D(3.35,4.64),
    new Vec2D(3.36,4.65)]
  },
  upair1 : {
    id0 : [new Vec2D(-1.42,11.45),
    new Vec2D(0.19,12.82)],
    id1 : [new Vec2D(-2.09,12.82),
    new Vec2D(0.32,14.52)],
    id2 : [new Vec2D(-0.02,9.81),
    new Vec2D(0.38,10.15)]
  },
  upair2 : {
    id0 : [new Vec2D(-1.41,14.05),
    new Vec2D(-0.35,15.11),
    new Vec2D(0.33,14.98),
    new Vec2D(0.59,14.30)],
    id1 : [new Vec2D(-1.20,16.43),
    new Vec2D(0.79,17.95),
    new Vec2D(2.03,17.09),
    new Vec2D(2.48,15.00)],
    id2 : [new Vec2D(0.70,10.19),
    new Vec2D(0.76,10.41),
    new Vec2D(0.74,10.42),
    new Vec2D(0.67,10.34)]
  },
  upspecial : {
    id0 : []
  },
  pummel : {
    id0 : [new Vec2D(7.87,8.50)]
  },
  throwforwardextra : {
    id0 : [new Vec2D(14.22-5.28,8.89)]
  },
  thrown : {
    id0 : [new Vec2D(0,12)]
  }
});

for (let k = 0; k < 22; k++) {
  offsets[CHARIDS.FALCO_ID].upspecial.id0.push(new Vec2D(1.35,12.39));
}

for (let k = 0; k < 4; k++) {
  offsets[CHARIDS.FALCO_ID].nair1.id0.push(new Vec2D(-1.10,7.48));
  offsets[CHARIDS.FALCO_ID].nair1.id1.push(new Vec2D(6.57,7.22));
  offsets[CHARIDS.FALCO_ID].nair1.id2.push(new Vec2D(0.57,4.49));
}
for (let k = 0; k < 23; k++) {
  offsets[CHARIDS.FALCO_ID].nair2.id0.push(new Vec2D(-1.10,7.48));
  offsets[CHARIDS.FALCO_ID].nair2.id1.push(new Vec2D(6.57,7.22));
  offsets[CHARIDS.FALCO_ID].nair2.id2.push(new Vec2D(0.57,4.49));
}
offsets[CHARIDS.FALCO_ID].nair2.id0.push(new Vec2D(-1.05,7.56));
offsets[CHARIDS.FALCO_ID].nair2.id1.push(new Vec2D(6.30,7.53));
offsets[CHARIDS.FALCO_ID].nair2.id2.push(new Vec2D(0.48,4.59));

for (let k = 0; k < 4; k++) {
  offsets[CHARIDS.FALCO_ID].bair1.id0.push(new Vec2D(-0.14,9.14));
}
for (let k = 0; k < 12; k++) {
  offsets[CHARIDS.FALCO_ID].bair2.id0.push(new Vec2D(-0.14,9.14));
}

setHitBoxes(CHARIDS.FALCO_ID, {
  fair1 : new createHitboxObject(new createHitbox(offsets[3].fair1.id0,5.156,9,361,100,10,0,0,0,1,1),new createHitbox(offsets[3].fair1.id1,5.156,9,361,100,10,0,0,0,1,1)),
  fair2 : new createHitboxObject(new createHitbox(offsets[3].fair2.id0,4.656,8,361,100,10,0,0,0,1,1),new createHitbox(offsets[3].fair2.id1,4.656,8,361,100,10,0,0,0,1,1)),
  fair3 : new createHitboxObject(new createHitbox(offsets[3].fair3.id0,4.656,7,361,100,10,0,0,0,1,1),new createHitbox(offsets[3].fair3.id1,4.656,7,361,100,10,0,0,0,1,1)),
  fair4 : new createHitboxObject(new createHitbox(offsets[3].fair4.id0,4.656,5,361,100,10,0,0,0,1,1),new createHitbox(offsets[3].fair4.id1,4.656,5,361,100,10,0,0,0,1,1)),
  fair5 : new createHitboxObject(new createHitbox(offsets[3].fair5.id0,4.656,3,361,100,50,0,0,0,1,1),new createHitbox(offsets[3].fair5.id1,4.656,3,361,100,50,0,0,0,1,1)),
  bair1 : new createHitboxObject(new createHitbox(offsets[3].bair1.id0,3.660,15,361,100,0,0,0,0,1,1),new createHitbox(offsets[3].bair1.id1,4.992,15,361,100,0,0,0,0,1,1),new createHitbox(offsets[3].bair1.id2,3.328,9,361,100,0,0,0,0,1,1)),
  bair2 : new createHitboxObject(new createHitbox(offsets[3].bair2.id0,3.328,9,361,100,0,0,0,0,1,1),new createHitbox(offsets[3].bair2.id1,3.992,9,361,100,0,0,0,0,1,1),new createHitbox(offsets[3].bair2.id2,3.328,9,361,100,0,0,0,0,1,1)),
  nair1 : new createHitboxObject(new createHitbox(offsets[3].nair1.id0,3.496,12,361,100,10,0,0,0,1,1),new createHitbox(offsets[3].nair1.id1,3.496,12,361,100,10,0,0,0,1,1),new createHitbox(offsets[3].nair1.id1,2.992,12,361,100,10,0,0,0,1,1)),
  nair2 : new createHitboxObject(new createHitbox(offsets[3].nair2.id0,3.496,9,361,100,0,0,0,0,1,1),new createHitbox(offsets[3].nair2.id1,3.496,9,361,100,0,0,0,0,1,1),new createHitbox(offsets[3].nair2.id1,2.992,9,361,100,0,0,0,0,1,1)),
  dair1 : new createHitboxObject(new createHitbox(offsets[3].dair1.id0,5.156,12,290,100,10,0,0,0,1,1),new createHitbox(offsets[3].dair1.id1,5.988,12,290,100,10,0,0,0,1,1)),
  dair2 : new createHitboxObject(new createHitbox(offsets[3].dair2.id0,5.156,9,290,100,20,0,0,0,1,1),new createHitbox(offsets[3].dair2.id1,5.988,9,290,100,20,0,0,0,1,1)),
  upair1 : new createHitboxObject(new createHitbox(offsets[3].upair1.id0,3.125,6,90,20,40,0,0,0,1,1),new createHitbox(offsets[3].upair1.id1,3.906,6,90,20,30,0,0,0,1,1),new createHitbox(offsets[3].upair1.id2,3.906,6,9,20,30,0,0,0,1,1)),
  upair2 : new createHitboxObject(new createHitbox(offsets[3].upair2.id0,3.660,10,70,120,22,0,0,0,1,1),new createHitbox(offsets[3].upair2.id1,5.468,10,70,120,22,0,0,0,1,1),new createHitbox(offsets[3].upair2.id2,3.906,10,90,20,30,0,0,0,1,1)),
  upspecial : new createHitboxObject(new createHitbox(offsets[3].upspecial.id0,4.000,16,80,60,80,0,3,0,1,1)),
  dtilt : new createHitboxObject(new createHitbox(offsets[3].downtilt.id0,1.953,13,75,125,25,0,0,1,1,1),new createHitbox(offsets[3].downtilt.id1,2.930,13,75,125,25,0,0,1,1,1),new createHitbox(offsets[3].downtilt.id2,3.125,13,75,125,25,0,0,1,1,1)),
  uptilt : new createHitboxObject(new createHitbox(offsets[3].uptilt.id0,3.906,9,97,120,30,0,0,1,1,1),new createHitbox(offsets[3].uptilt.id1,5.468,9,90,120,30,0,0,1,1,1)),
  ftilt : new createHitboxObject(new createHitbox(offsets[3].forwardtilt.id0,2.734,9,361,100,0,0,0,1,1,1),new createHitbox(offsets[3].forwardtilt.id1,3.125,9,361,100,0,0,0,1,1,1),new createHitbox(offsets[3].forwardtilt.id2,2.344,9,361,100,0,0,0,1,1,1)),
  dashattack1 : new createHitboxObject(new createHitbox(offsets[3].dashattack1.id0,4.297,9,72,90,35,0,0,1,1,1)),
  dashattack2 : new createHitboxObject(new createHitbox(offsets[3].dashattack2.id0,3.515,6,72,90,20,0,0,1,1,1)),
  jab1 : new createHitboxObject(new createHitbox(offsets[3].jab1.id0,3.515,4,70,100,0,0,0,1,1,1),new createHitbox(offsets[3].jab1.id1,3.515,4,70,100,0,0,0,1,1,1)),
  jab2 : new createHitboxObject(new createHitbox(offsets[3].jab2.id0,3.515,4,50,100,0,0,0,1,1,1),new createHitbox(offsets[3].jab2.id1,3.515,4,50,100,0,0,0,1,1,1)),
  jab3_1 : new createHitboxObject(new createHitbox(offsets[3].jab3_1.id0,3.515,1,80,80,10,0,0,1,1,1),new createHitbox(offsets[3].jab3_1.id1,3.515,1,80,80,10,0,0,1,1,1),new createHitbox(offsets[3].jab3_1.id2,3.515,1,80,80,10,0,0,1,1,1)),
  jab3_2 : new createHitboxObject(new createHitbox(offsets[3].jab3_2.id0,3.515,1,80,80,10,0,0,1,1,1),new createHitbox(offsets[3].jab3_2.id1,3.515,1,80,80,10,0,0,1,1,1),new createHitbox(offsets[3].jab3_2.id2,3.515,1,80,80,10,0,0,1,1,1)),
  jab3_3 : new createHitboxObject(new createHitbox(offsets[3].jab3_3.id0,3.515,1,80,80,10,0,0,1,1,1),new createHitbox(offsets[3].jab3_3.id1,3.515,1,80,80,10,0,0,1,1,1),new createHitbox(offsets[3].jab3_3.id2,3.515,1,80,80,10,0,0,1,1,1)),
  jab3_4 : new createHitboxObject(new createHitbox(offsets[3].jab3_4.id0,3.515,1,80,80,10,0,0,1,1,1),new createHitbox(offsets[3].jab3_4.id1,3.515,1,80,80,10,0,0,1,1,1),new createHitbox(offsets[3].jab3_4.id2,3.515,1,80,80,10,0,0,1,1,1)),
  jab3_5 : new createHitboxObject(new createHitbox(offsets[3].jab3_5.id0,3.515,1,80,80,10,0,0,1,1,1),new createHitbox(offsets[3].jab3_5.id1,3.515,1,80,80,10,0,0,1,1,1),new createHitbox(offsets[3].jab3_5.id2,3.515,1,80,80,10,0,0,1,1,1)),
  fsmash1 : new createHitboxObject(new createHitbox(offsets[3].forwardsmash1.id0,3.515,17,361,90,40,0,0,1,1,1),new createHitbox(offsets[3].forwardsmash1.id1,3.125,17,361,90,40,0,0,1,1,1),new createHitbox(offsets[3].forwardsmash1.id2,2.344,17,110,90,40,0,0,1,1,1)),
  fsmash2 : new createHitboxObject(new createHitbox(offsets[3].forwardsmash2.id0,3.515,14,361,105,10,0,0,1,1,1),new createHitbox(offsets[3].forwardsmash2.id1,3.125,14,361,105,10,0,0,1,1,1),new createHitbox(offsets[3].forwardsmash2.id2,2.344,14,361,105,10,0,0,1,1,1)),
  upsmash1 : new createHitboxObject(new createHitbox(offsets[3].upsmash1.id0,3.328,14,95,100,25,0,0,1,1,1),new createHitbox(offsets[3].upsmash1.id1,4.656,14,95,100,25,0,0,1,1,1)),
  upsmash2 : new createHitboxObject(new createHitbox(offsets[3].upsmash2.id0,3.328,12,361,100,10,0,0,1,1,1),new createHitbox(offsets[3].upsmash2.id1,3.828,12,361,100,10,0,0,1,1,1)),
  dsmash : new createHitboxObject(new createHitbox(offsets[3].downsmash.id0,4.687,16,25,70,20,0,0,1,1,1),new createHitbox(offsets[3].downsmash.id1,4.687,16,25,70,20,0,0,1,1,1),new createHitbox(offsets[3].downsmash.id2,3.515,13,80,70,20,0,0,1,1,1),new createHitbox(offsets[3].downsmash.id3,3.515,13,80,70,20,0,0,1,1,1)),
  grab : new createHitboxObject(new createHitbox(offsets[3].grab.id0,3.906,0,361,100,0,0,2,3,1,1),new createHitbox(offsets[3].grab.id1,2.734,0,361,100,0,0,2,3,1,1)),
  downattack1 : new createHitboxObject(new createHitbox(offsets[3].downattack1.id0,7.031,6,361,50,80,0,0,1,1,1),new createHitbox(offsets[3].downattack1.id1,3.906,6,361,50,80,0,0,1,1,1),new createHitbox(offsets[3].downattack1.id2,3.906,6,361,50,80,0,0,1,1,1)),
  downattack2 : new createHitboxObject(new createHitbox(offsets[3].downattack2.id0,4.687,6,361,50,80,0,0,1,1,1),new createHitbox(offsets[3].downattack2.id1,6.250,6,361,50,80,0,0,1,1,1),new createHitbox(offsets[3].downattack2.id2,6.250,6,361,50,80,0,0,1,1,1)),
  downspecial : new createHitboxObject(new createHitbox(offsets[3].downspecialair.id0,5.999,8,84,50,110,0,4,0,1,1)),
  reflector : new createHitboxObject(new createHitbox(offsets[3].reflector.id0,7.999,0,361,100,0,0,7,0,1,1)),
  ledgegetupquick : new createHitboxObject(new createHitbox(offsets[3].ledgegetupquick.id0,4.687,8,361,100,0,90,0,1,1,1),new createHitbox(offsets[3].ledgegetupquick.id1,4.687,8,361,100,0,90,0,1,1,1),new createHitbox(offsets[3].ledgegetupquick.id2,4.687,8,361,100,0,90,0,1,1,1)),
  ledgegetupslow : new createHitboxObject(new createHitbox(offsets[3].ledgegetupslow.id0,3.125,8,361,100,0,90,0,1,1,1),new createHitbox(offsets[3].ledgegetupslow.id1,4.687,8,361,100,0,90,0,1,1,1),new createHitbox(offsets[3].ledgegetupslow.id2,4.687,8,361,100,0,90,0,1,1,1)),
  pummel : new createHitboxObject(new createHitbox(offsets[3].pummel.id0,5.859,3,80,100,0,30,0,0,1,1)),
  throwup : new createHitboxObject(new createHitbox(new Vec2D(2.855,24.35-3.55+0.23),0,2,90,110,75,0,0,0,1,1)),
  throwdown : new createHitboxObject(new createHitbox(new Vec2D(0.57363,0),0,1,270,40,150,0,0,0,1,1)),
  throwback : new createHitboxObject(new createHitbox(new Vec2D(-9.36+1.90,7.24-2.81+0.23),0,2,124,85,80,0,0,0,1,1)),
  throwforward : new createHitboxObject(new createHitbox(new Vec2D(18.97-2.05,1.31),0,3,45,135,35,0,0,0,1,1)),
  throwforwardextra : new createHitboxObject(new createHitbox(offsets[3].throwforwardextra.id0,8.593,4,60,180,60,0,0,0,1,1)),
  thrown : new createHitboxObject(new createHitbox(offsets[3].thrown.id0,3.906,4,361,50,20,0,1,0,1,1))
});

for (let l = 0; l < 20; l++) {
  offsets[CHARIDS.FALCO_ID].thrown.id0.push(new Vec2D(0,12));
}

setChars(CHARIDS.FALCO_ID, new charObject(CHARIDS.FALCO_ID));
