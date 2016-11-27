/* eslint-disable indent, camelcase */

/* globals charAttributes, intangibility, frames, actionSounds, offsets,
hitboxes, chars, Vec2D, hitbox, hitboxObject, charObject */

charAttributes[2] = {
  dashFrameMin : 11,
  dashFrameMax : 21,
  dInitV : 2.02,
  dMaxV : 2.2,
  dAccA : 0.1,
  dAccB : 0.02,
  dTInitV : 1.9,
  traction : 0.08,
  maxWalk : 1.6,
  jumpSquat : 3,
  sHopInitV : 2.1,
  fHopInitV : 3.68,
  gravity : 0.23,
  groundToAir : 0.83,
  jumpHmaxV : 1.7,
  jumpHinitV : 0.72,
  airMobA : 0.06,
  airMobB : 0.02,
  aerialHmaxV : 0.83,
  airFriction : 0.02,
  fastFallV : 3.4,
  terminalV : 2.8,
  walkInitV : 0.16,
  walkAcc : 0.2,
  walkMaxV : 1.6,
  djMultiplier : 1.2,
  djMomentum : 0.9,
  shieldScale : 14.375,
  modelScale : 0.96,
  weight : 75,
  waitAnimSpeed : 1,
  walljump : true,
  hurtboxOffset : [6,13],
  ledgeSnapBoxOffset : [14,8,18],
  shieldOffset : [5,34],
  charScale : 0.35,
  miniScale : 0.3,
  runTurnBreakPoint : 16,
  airdodgeIntangible : 25,
  wallJumpVelX : 1.4,
  wallJumpVelY : 3.3,
  shieldBreakVel : 2.5,
  multiJump : false,
  ecbScale : 2.5,
};

// start, length
intangibility[2] = {
  "ESCAPEAIR" : [4,25],
  "ESCAPEB" : [4,16],
  "ESCAPEF" : [4,16],
  "ESCAPEN" : [2,14],
  "DOWNSTANDN" : [1,23],
  "DOWNSTANDB" : [12,18],
  "DOWNSTANDF" : [1,19],
  "TECHN" : [1,20],
  "TECHB" : [1,20],
  "TECHF" : [1,20],
};

frames[2] = {
  "WAIT" : 120,
  "DASH" : 21,
  "RUN" : 25,
  "RUNBRAKE" : 18,
  "RUNTURN" : 20,
  "WALK" : 26,
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
  "DOWNWAIT" : 70,
  "DOWNSTANDN" : 30,
  "DOWNSTANDB" : 35,
  "DOWNSTANDF" : 35,
  "TECHN" : 26,
  "TECHB" : 40,
  "TECHF" : 40,
  "SHIELDBREAKFALL" : 30,
  "SHIELDBREAKDOWNBOUND" : 26,
  "SHIELDBREAKSTAND" : 30,
  "FURAFURA" : 110,
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
  "THROWNMARTHFORWARD" : 9,
  "THROWNMARTHDOWN" : 10,
  "THROWNPUFFUP" : 5,
  "THROWNPUFFBACK" : 18,
  "THROWNPUFFFORWARD" : 9,
  "THROWNPUFFDOWN" : 60,
  "THROWNFOXUP" : 5,
  "THROWNFOXBACK" : 6,
  "THROWNFOXFORWARD" : 10,
  "THROWNFOXDOWN" : 32,
  "FURASLEEPSTART" : 30,
  "FURASLEEPLOOP" : 110,
  "FURASLEEPEND" : 60,
  "STOPCEIL" : 9,
  "TECHU" : 26,
};

actionSounds[2] = {
  "JUMP" : [],
  "ESCAPEAIR" : [[4,"foxairdodge"]],
  "JUMPAERIAL" : [[1,"foxjump"]],
  "GUARDON" : [[1,"swordsheath"]],
  "GUARDOFF" : [[6,"sworddraw"]],
  "CLIFFCATCH" : [[1,"foxcliffcatch"],[1,"puffledgegrab"]],
  "DEAD" : [[1,"foxdeath"]],
  "FURAFURA" : [[0,"foxfura"]],
  "ESCAPEB" : [],
  "ESCAPEF" : [],
  "ESCAPEN" : [],
  "OTTOTTOWAIT" : [[0,"foxairdodge"]],
};

// HITBOX OFFSETS

offsets[2] = {
  ledgegetupquick : {
    id0 : [
      new Vec2D(-58.14+63.41,6.74),
      new Vec2D(-56.45+61.81,5.82),
      new Vec2D(-54.31+59.89,5.57),
      new Vec2D(-52.04+57.77,5.73),
      new Vec2D(-49.69+55.56,4.80),
      new Vec2D(-47.38+55.37,3.23),
      new Vec2D(-45.21+51.32,2.38),
      new Vec2D(-43.30+49.52,2.14),
      new Vec2D(-41.76+48.1,2.07),
      new Vec2D(-40.70+47.16,1.98),
    ],
    id1 : [
      new Vec2D(-58.22+63.41,5.54),
      new Vec2D(-56.68+61.81,4.39),
      new Vec2D(-54.41+59.89,3.78),
      new Vec2D(-52.00+57.77,3.90),
      new Vec2D(-49.66+55.56,4.75),
      new Vec2D(-47.36+55.37,4.86),
      new Vec2D(-45.20+51.32,4.10),
      new Vec2D(-43.29+49.52,3.16),
      new Vec2D(-42.15+48.10,2.32),
      new Vec2D(-42.07+47.16,1.52),
    ],
    id2 : [
      new Vec2D(-67.70+63.41,7.60),
      new Vec2D(-65.97+61.81,7.17),
      new Vec2D(-63.95+59.89,6.29),
      new Vec2D(-61.74+57.77,5.24),
      new Vec2D(-59.47+55.56,4.49),
      new Vec2D(-57.18+55.37,3.90),
      new Vec2D(-54.99+51.32,3.30),
      new Vec2D(-52.97+49.52,2.97),
      new Vec2D(-51.42+48.1,2.61),
      new Vec2D(-50.37+47.16,2.37),
    ],
  },
  ledgegetupslow : {
    id0 : [
      new Vec2D(-58.61+64.71,9.98),
      new Vec2D(-56.18+63.82,2.92),
      new Vec2D(-56.57+63.46,1.96),
    ],
    id1 : [
      new Vec2D(-56.05+64.71,12.62),
      new Vec2D(-52.49+63.82,1.28),
      new Vec2D(-53.49+63.46,0.83),
    ],
    id2 : [
      new Vec2D(-65.09+64.71,8.36),
      new Vec2D(-63.62+63.82,7.10),
      new Vec2D(-56.57+63.46,1.96),
    ],
  },
  downspecial : {
    id0 : [new Vec2D(-0.60,6.80)]
  },
  reflector : {
    id0 : [new Vec2D(-0.60,6.80)]
  },
  jab1 : {
    id0 : [
      new Vec2D(5.49,5.97),
      new Vec2D(15.53,8.15),
    ],
    id1 : [
      new Vec2D(6.20,9.12),
      new Vec2D(9.00,7.76),
    ],
  },
  jab2 : {
    id0 : [
      new Vec2D(12.90-3.36,6.93),
      new Vec2D(8.57,6.99),
    ],
    id1 : [
      new Vec2D(6.26-3.36,6.03),
      new Vec2D(2.96,6.14),
    ],
  },
  jab3_1 : {
    id0 : [
      new Vec2D(2.12,10.36),
      new Vec2D(2.04,10.10),
    ],
    id1 : [
      new Vec2D(4.99,12.11),
      new Vec2D(4.80,11.65),
    ],
    id2 : [
      new Vec2D(10.81,15.64),
      new Vec2D(10.39,14.75),
    ],
  },
  jab3_2 : {
    id0 : [
      new Vec2D(2.30,9.68),
      new Vec2D(2.19,9.42),
    ],
    id1 : [
      new Vec2D(5.49,10.75),
      new Vec2D(5.21,10.35),
    ],
    id2 : [
      new Vec2D(11.94,12.91),
      new Vec2D(11.31,12.24),
    ],
  },
  jab3_3 : {
    id0 : [
      new Vec2D(1.91,8.41),
      new Vec2D(1.90,8.27),
    ],
    id1 : [
      new Vec2D(5.28,8.50),
      new Vec2D(5.20,8.24),
    ],
    id2 : [
      new Vec2D(12.09,8.68),
      new Vec2D(11.86,8.17),
    ],
  },
  jab3_4 : {
    id0 : [
      new Vec2D(2.33,7.69),
      new Vec2D(2.19,7.60),
    ],
    id1 : [
      new Vec2D(5.38,6.97),
      new Vec2D(5.06,6.81),
    ],
    id2 : [new Vec2D(11.53,5.51),
    new Vec2D(10.86,5.23)]
  },
  jab3_5 : {
    id0 : [new Vec2D(2.07,6.67),
    new Vec2D(2.03,6.73)],
    id1 : [new Vec2D(4.79,5.73),
    new Vec2D(4.57,5.62)],
    id2 : [new Vec2D(10.29,3.84),
    new Vec2D(9.71,3.36)]
  },
  dtilt : {
    id0 : [new Vec2D(8.94,1.69),
      new Vec2D(10.26,2.59),
      new Vec2D(7.21,2.72)],
    id1 : [new Vec2D(10.70,0.96),
    new Vec2D(13.98,2.57),
  new Vec2D(9.94,2.73)],
    id2 : [new Vec2D(12.47,0.24),
    new Vec2D(17.69,2.54),
  new Vec2D(12.67,2.75)]
  },
  uptilt : {
    id0 : [new Vec2D(-3.84,4.75),
    new Vec2D(-5.71,10.79),
  new Vec2D(-1.74,16.29),
new Vec2D(4.51,16.13),
new Vec2D(4.68,15.32),
new Vec2D(4.00,14.60),
new Vec2D(3.12,14.13)],
    id1 : [new Vec2D(-3.84,4.75),
    new Vec2D(-5.71,10.79),
    new Vec2D(-1.74,16.29),
  new Vec2D(4.51,16.13),
  new Vec2D(4.68,15.32),
  new Vec2D(4.00,14.60),
  new Vec2D(3.12,14.13)],
    id2 : [new Vec2D(-3.83,4.71),
    new Vec2D(-5.72,10.77),
  new Vec2D(-1.82,16.27),
new Vec2D(4.42,16.18),
new Vec2D(4.60,15.38),
new Vec2D(3.93,14.69),
new Vec2D(3.06,14.22)],
    id3 : [new Vec2D(0.47,8.19),
    new Vec2D(0.42,9.35),
  new Vec2D(1.03,10.22),
new Vec2D(1.78,10.30),
new Vec2D(1.79,10.21),
new Vec2D(1.57,10.22),
new Vec2D(1.35,10.20)]
  },
  ftilt : {
    id0 : [new Vec2D(1.40,5.27),
    new Vec2D(16.59,8.63),
  new Vec2D(16.79,8.71),
new Vec2D(16.68,8.81)],
    id1 : [new Vec2D(4.33,7.07),
    new Vec2D(11.07,8.65),
  new Vec2D(11.17,8.75),
new Vec2D(10.99,8.81)],
    id2 : [new Vec2D(3.16,7.68),
    new Vec2D(6.95,8.64),
  new Vec2D(7.02,8.74),
new Vec2D(6.80,8.78)]
  },
  dsmash : {
    id0 : [new Vec2D(-8.65,1.45),
    new Vec2D(-8.38,1.38),
  new Vec2D(-7.79,1.33),
new Vec2D(-7.16,1.30),
new Vec2D(-6.80,1.28)],
    id1 : [new Vec2D(9.11,1.84),
    new Vec2D(8.85,1.64),
  new Vec2D(8.27,1.50),
new Vec2D(7.64,1.40),
new Vec2D(7.28,1.34)],
    id2 : [new Vec2D(-4.65,1.46),
    new Vec2D(-4.52,1.43),
  new Vec2D(-4.22,1.40),
new Vec2D(-3.91,1.39),
new Vec2D(-3.73,1.38)],
    id3 : [new Vec2D(5.11,1.67),
    new Vec2D(4.99,1.57),
  new Vec2D(4.70,1.50),
new Vec2D(4.39,1.45),
new Vec2D(4.21,1.42)]
  },
  upsmash1 : {
    id0 : [new Vec2D(6.37,7.58),
    new Vec2D(7.20,11.13),
  new Vec2D(6.07,15.54)],
    id1 : [new Vec2D(5.97,5.39),
    new Vec2D(9.32,10.43),
  new Vec2D(8.29,15.80)]
  },
  upsmash2 : {
    id0 : [new Vec2D(3.18,18.46),
new Vec2D(0.03,19.23),
new Vec2D(-2.46,18.31),
new Vec2D(-3.94,16.49),
new Vec2D(-4.53,14.60),
new Vec2D(-4.72,13.03),
new Vec2D(-4.65,11.56),
new Vec2D(-4.42,10.17)],
    id1 : [new Vec2D(3.66,20.65),
new Vec2D(-0.97,21.23),
new Vec2D(-4.18,19.72),
new Vec2D(-6.02,17.30),
new Vec2D(-6.74,14.90),
new Vec2D(-6.95,13.04),
new Vec2D(-6.88,11.39),
new Vec2D(-6.63,9.84)]
  },
  fsmash1 : {
    id0 : [new Vec2D(11.25-1.34,13.90),
    new Vec2D(13.48-1.34,12.14),
  new Vec2D(14.61-1.34,9.86),
new Vec2D(13.55,7.76),
new Vec2D(13.27,6.51)],
    id1 : [new Vec2D(9.20-1.34,10.32),
    new Vec2D(10.21-1.34,9.50),
  new Vec2D(10.51-1.34,8.50),
new Vec2D(9.05,7.57),
new Vec2D(8.68,7.02)],
    id2 : [new Vec2D(7.86-1.34,7.88),
    new Vec2D(7.60-1.34,7.86),
  new Vec2D(7.29-1.34,7.83),
new Vec2D(5.57,7.78),
new Vec2D(5.16,7.72)]
  },
  fsmash2 : {
    id0 : [new Vec2D(12.84,5.93),
      new Vec2D(12.30,5.54),
      new Vec2D(11.68,5.20),
      new Vec2D(10.96,4.79),
      new Vec2D(10.02,4.09),
      new Vec2D(8.49,2.90),
    ],
    id1 : [new Vec2D(8.22,6.75),
new Vec2D(7.70,6.56),
new Vec2D(7.10,6.39),
new Vec2D(6.44,6.19),
new Vec2D(5.71,6.04),
new Vec2D(4.92,5.88)],
    id2 : [new Vec2D(4.68,7.65),
new Vec2D(4.15,7.57),
new Vec2D(3.56,7.47),
new Vec2D(2.90,7.36),
new Vec2D(2.18,7.24),
new Vec2D(1.38,7.11)]
  },
  downattack1 : {
    id0 : [new Vec2D(13.62,6.43),
    new Vec2D(13.02,6.40),
  new Vec2D(13.40,6.44)],
    id1 : [new Vec2D(7.95,6.30),
    new Vec2D(7.17,6.20),
  new Vec2D(7.57,6.37)],
    id2 : [new Vec2D(3.93,5.78),
    new Vec2D(3.11,5.78),
  new Vec2D(3.52,5.78)]
  },
  downattack2 : {
    id0 : [new Vec2D(-5.48,7.78),
    new Vec2D(-7.54,8.56),
  new Vec2D(-8.09,8.60)],
    id1 : [new Vec2D(-8.47,8.12),
    new Vec2D(-11.34,8.56),
  new Vec2D(-11.79,8.65)],
    id2 : [new Vec2D(-1.00,8.69),
    new Vec2D(-1.81,9.03),
  new Vec2D(-2.50,9.01)]
  },
  grab : {
    id0 : [new Vec2D(8.25,6.75),
    new Vec2D(8.25,6.75)],
    id1 : [new Vec2D(4.50,6.75),
    new Vec2D(4.50,6.75)]
  },
  pummel : {
    id0 : [new Vec2D(6.83,7.59)]
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
    id1 : [new Vec2D(-8.04,9.59),
    new Vec2D(-8.05,9.56),
  new Vec2D(-8.06,9.51),
new Vec2D(-8.07,9.43)],
    id2 : [new Vec2D(2.66,4.20),
    new Vec2D(2.80,4.16),
  new Vec2D(2.87,4.17),
new Vec2D(2.93,4.19)]
  },
  bair2 : {
    id0 : [],
    id1 : [new Vec2D(-7.91,9.39),
    new Vec2D(-7.71,9.23),
    new Vec2D(-7.47,9.10),
    new Vec2D(-7.21,8.97),
    new Vec2D(-6.96,8.84),
    new Vec2D(-6.71,8.72),
    new Vec2D(-6.47,8.60),
    new Vec2D(-6.24,8.48),
    new Vec2D(-6.02,8.34),
    new Vec2D(-5.79,8.19),
    new Vec2D(-5.55,8.00),
    new Vec2D(-5.28,7.80)],
    id2 : [new Vec2D(2.97,4.20),
    new Vec2D(3.00,4.21),
    new Vec2D(3.01,4.20),
    new Vec2D(2.99,4.17),
    new Vec2D(2.99,4.16),
    new Vec2D(2.99,4.16),
    new Vec2D(2.98,4.15),
    new Vec2D(2.95,4.11),
    new Vec2D(2.87,4.05),
    new Vec2D(2.83,4.01),
    new Vec2D(2.78,3.98),
    new Vec2D(2.71,3.94)]
  },
  fair1 : {
    id0 : [new Vec2D(2.63,8.74),
    new Vec2D(4.43,8.57),
  new Vec2D(4.48,8.48)],
    id1 : [new Vec2D(6.48,10.69),
    new Vec2D(8.52,9.84),
  new Vec2D(7.88,9.02)]
  },
  fair2 : {
    id0 : [new Vec2D(4.49,7.33),
    new Vec2D(2.84,6.75),
  new Vec2D(0.72,6.23)],
    id1 : [new Vec2D(8.90,6.92),
    new Vec2D(7.11,7.19),
  new Vec2D(3.46,6.18)]
  },
  fair3 : {
    id0 : [new Vec2D(2.70,8.89),
    new Vec2D(4.39,8.31),
  new Vec2D(4.49,8.43)],
    id1 : [new Vec2D(6.80,10.62),
    new Vec2D(8.61,9.27),
  new Vec2D(7.76,8.85)]
  },
  fair4 : {
    id0 : [new Vec2D(4.51,7.57),
    new Vec2D(4.50,7.32),
  new Vec2D(3.17,7.04)],
    id1 : [new Vec2D(4.99,7.31),
    new Vec2D(8.81,6.85),
  new Vec2D(7.52,7.55)]
  },
  fair5 : {
    id0 : [new Vec2D(4.51,7.72),
    new Vec2D(4.50,7.64),
  new Vec2D(4.35,7.51)],
    id1 : [new Vec2D(8.16,7.72),
    new Vec2D(8.03,7.47),
  new Vec2D(7.81,7.23)]
  },
  upair1 : {
    id0 : [new Vec2D(-3.72,12.50),
    new Vec2D(-0.03,15.77)],
    id1 : [new Vec2D(-5.04,13.52),
    new Vec2D(-0.18,18.00)],
    id2 : [new Vec2D(-2.07,12.78),
    new Vec2D(0.77,14.05)]
  },
  upair2 : {
    id0 : [new Vec2D(-1.22,12.27),
    new Vec2D(-0.30,13.19),
  new Vec2D(0.29,13.07),
new Vec2D(0.52,12.48)],
    id1 : [new Vec2D(-1.67,14.42),
    new Vec2D(0.07,15.69),
  new Vec2D(1.13,14.87),
new Vec2D(1.49,13.01)],
    id2 : [new Vec2D(0.61,8.89),
    new Vec2D(0.66,9.08),
  new Vec2D(0.65,9.10),
new Vec2D(0.58,9.02)]
  },
  dair : {
    id0 : [new Vec2D(1.82,6.05),
    new Vec2D(2.02,6.16)],
    id1 : [new Vec2D(2.72,3.95),
    new Vec2D(2.94,4.08)]
  },
  upb1 : {
    id0 : [new Vec2D(0,7.50)]
  },
  upb2 : {
    id0 : [new Vec2D(2.93,11.72),
    new Vec2D(2.31,11.72),
  new Vec2D(2.65,11.72),
new Vec2D(2.87,11.72),
new Vec2D(2.30,11.72),
new Vec2D(2.57,11.72),
new Vec2D(2.94,11.72),
new Vec2D(2.51,11.72),
new Vec2D(2.28,11.72),
new Vec2D(2.70,11.72),
new Vec2D(2.94,11.72),
new Vec2D(2.62,11.72),
new Vec2D(2.28,11.72),
new Vec2D(2.37,11.72),
new Vec2D(2.72,11.72),
new Vec2D(2.94,11.72),
new Vec2D(2.86,11.72),
new Vec2D(2.60,11.72),
new Vec2D(2.36,11.72),
new Vec2D(2.26,11.72),
new Vec2D(2.32,11.72),
new Vec2D(2.47,11.72),
new Vec2D(2.63,11.72),
new Vec2D(2.77,11.72),
new Vec2D(2.87,11.72),
new Vec2D(2.92,11.72),
new Vec2D(2.94,11.72),
new Vec2D(2.94,11.72),
new Vec2D(2.94,11.72),
new Vec2D(2.93,11.72)]
  },
  dashattack1 : {
    id0 : [new Vec2D(11.44-1.61,7.16),
    new Vec2D(10.33-1.12,7.23),
  new Vec2D(9.63-1.07,7.25),
new Vec2D(9.62-1.03,7.18)],
    id1 : [new Vec2D(6.98-1.61,7.49),
    new Vec2D(6.24-1.12,7.56),
  new Vec2D(5.92-1.07,7.57),
new Vec2D(5.92-1.03,7.53)]
  },
  dashattack2 : {
    id0 : [new Vec2D(8.89-0.99,7.17),
    new Vec2D(8.91-0.96,7.07),
    new Vec2D(8.95-0.93,6.96),
    new Vec2D(9.00-0.91,6.84),
    new Vec2D(9.05-0.90,6.70),
    new Vec2D(9.12-0.90,6.56),
    new Vec2D(9.19-0.90,6.43),
    new Vec2D(9.27-0.91,6.34),
    new Vec2D(9.36-0.93,6.15),
    new Vec2D(9.46-0.95,5.76)],
    id1 : [new Vec2D(5.94-0.99,7.47),
    new Vec2D(5.97-0.96,7.39),
    new Vec2D(6.01-0.93,7.31),
    new Vec2D(6.06-0.91,7.20),
    new Vec2D(6.12-0.90,7.09),
    new Vec2D(6.19-0.90,6.97),
    new Vec2D(6.26-0.90,6.86),
    new Vec2D(6.33-0.91,6.76),
    new Vec2D(6.41-0.93,6.61),
    new Vec2D(6.53-0.95,6.32)]
  },
  throwforwardextra : {
    id0 : [new Vec2D(7.74,8.13)]
  },
  thrown : {
    id0 : [new Vec2D(0,12)]
  }
};

for (let k = 0; k < 4; k++) {
  offsets[2].nair1.id0.push(new Vec2D(-0.96,6.53));
  offsets[2].nair1.id1.push(new Vec2D(5.72,6.28));
  offsets[2].nair1.id2.push(new Vec2D(0.39,3.88));
}
for (let k = 0; k < 23; k++) {
  offsets[2].nair2.id0.push(new Vec2D(-0.96,6.53));
  offsets[2].nair2.id1.push(new Vec2D(5.72,6.28));
  offsets[2].nair2.id2.push(new Vec2D(0.39,3.88));
}
offsets[2].nair2.id0.push(new Vec2D(-0.91,6.6));
offsets[2].nair2.id1.push(new Vec2D(5.50,6.57));
offsets[2].nair2.id2.push(new Vec2D(0.42,4.01));

for (let k = 0; k < 4; k++) {
  offsets[2].bair1.id0.push(new Vec2D(-0.02,8.00));
}
for (let k = 0; k < 12; k++) {
  offsets[2].bair2.id0.push(new Vec2D(-0.02,8.00));
}

hitboxes[2] = {
  fair1 : new hitboxObject(new hitbox(offsets[2].fair1.id0,5.156,7,361,100,10,0,0,0,1,1),new hitbox(offsets[2].fair1.id1,5.156,7,361,100,10,0,0,0,1,1)),
  fair2 : new hitboxObject(new hitbox(offsets[2].fair2.id0,4.656,5,361,100,10,0,0,0,1,1),new hitbox(offsets[2].fair2.id1,4.656,5,361,100,10,0,0,0,1,1)),
  fair3 : new hitboxObject(new hitbox(offsets[2].fair3.id0,4.656,6,361,100,10,0,0,0,1,1),new hitbox(offsets[2].fair3.id1,4.656,6,361,100,10,0,0,0,1,1)),
  fair4 : new hitboxObject(new hitbox(offsets[2].fair4.id0,4.656,4,361,100,10,0,0,0,1,1),new hitbox(offsets[2].fair4.id1,4.656,4,361,100,10,0,0,0,1,1)),
  fair5 : new hitboxObject(new hitbox(offsets[2].fair5.id0,4.656,3,361,100,10,0,0,0,1,1),new hitbox(offsets[2].fair5.id1,4.656,3,361,100,10,0,0,0,1,1)),
  bair1 : new hitboxObject(new hitbox(offsets[2].bair1.id0,3.660,15,361,100,10,0,0,0,1,1),new hitbox(offsets[2].bair1.id1,4.992,15,361,100,10,0,0,0,1,1),new hitbox(offsets[2].bair1.id2,3.328,9,361,100,10,0,0,0,1,1)),
  bair2 : new hitboxObject(new hitbox(offsets[2].bair2.id0,3.328,9,361,100,10,0,0,0,1,1),new hitbox(offsets[2].bair2.id1,3.992,9,361,100,10,0,0,0,1,1),new hitbox(offsets[2].bair2.id2,3.328,9,361,100,10,0,0,0,1,1)),
  nair1 : new hitboxObject(new hitbox(offsets[2].nair1.id0,3.496,12,361,100,10,0,0,0,1,1),new hitbox(offsets[2].nair1.id1,3.496,12,361,100,10,0,0,0,1,1),new hitbox(offsets[2].nair1.id1,2.992,12,361,100,10,0,0,0,1,1)),
  nair2 : new hitboxObject(new hitbox(offsets[2].nair2.id0,3.496,9,361,100,10,0,0,0,1,1),new hitbox(offsets[2].nair2.id1,3.496,9,361,100,10,0,0,0,1,1),new hitbox(offsets[2].nair2.id1,2.922,9,361,100,10,0,0,0,1,1)),
  dair : new hitboxObject(new hitbox(offsets[2].dair.id0,5.156,3,290,100,0,30,0,0,1,1),new hitbox(offsets[2].dair.id1,5.988,2,290,100,0,30,0,0,1,1)),
  upair1 : new hitboxObject(new hitbox(offsets[2].upair1.id0,4.297,5,92,120,0,30,0,0,1,1),new hitbox(offsets[2].upair1.id1,4.297,5,92,120,0,30,0,0,1,1),new hitbox(offsets[2].upair1.id2,4.297,5,92,120,0,30,0,0,1,1)),
  upair2 : new hitboxObject(new hitbox(offsets[2].upair2.id0,3.660,13,85,116,40,0,0,0,1,1),new hitbox(offsets[2].upair2.id1,4.883,13,85,116,40,0,0,0,1,1),new hitbox(offsets[2].upair2.id2,4.883,13,85,116,40,0,0,0,1,1)),
  upb1 : new hitboxObject(new hitbox(offsets[2].upb1.id0,8.203,2,70,40,40,0,3,0,1,1)),
  upb2 : new hitboxObject(new hitbox(offsets[2].upb2.id0,4.000,14,80,60,60,0,3,0,1,1)),
  dtilt : new hitboxObject(new hitbox(offsets[2].dtilt.id0,2.734,10,70,125,25,0,0,1,1,1),new hitbox(offsets[2].dtilt.id1,2.734,10,80,125,25,0,0,1,1,1),new hitbox(offsets[2].dtilt.id2,3.125,10,90,125,25,0,0,1,1,1)),
  uptilt : new hitboxObject(new hitbox(offsets[2].uptilt.id0,5.078,12,110,140,18,0,0,1,1,1),new hitbox(offsets[2].uptilt.id1,5.078,9,84,140,18,0,0,1,1,1),new hitbox(offsets[2].uptilt.id2,3.515,9,80,140,18,0,0,1,1,1),new hitbox(offsets[2].uptilt.id3,3.125,9,80,140,18,0,0,1,1,1)),
  ftilt : new hitboxObject(new hitbox(offsets[2].ftilt.id0,2.734,9,361,100,0,0,0,1,1,1),new hitbox(offsets[2].ftilt.id1,3.125,9,361,100,0,0,0,1,1,1),new hitbox(offsets[2].ftilt.id2,2.344,9,361,100,0,0,0,1,1,1)),
  dashattack1 : new hitboxObject(new hitbox(offsets[2].dashattack1.id0,3.828,7,72,90,35,0,0,1,1,1),new hitbox(offsets[2].dashattack1.id1,3.828,7,72,90,35,0,0,1,1,1)),
  dashattack2 : new hitboxObject(new hitbox(offsets[2].dashattack2.id0,2.734,5,72,90,20,0,0,1,1,1),new hitbox(offsets[2].dashattack2.id1,2.734,5,72,90,20,0,0,1,1,1)),
  jab1 : new hitboxObject(new hitbox(offsets[2].jab1.id0,3.328,4,70,100,0,0,0,1,1,1),new hitbox(offsets[2].jab1.id1,3.328,4,70,100,0,0,0,1,1,1)),
  jab2 : new hitboxObject(new hitbox(offsets[2].jab2.id0,3.328,4,70,100,0,0,0,1,1,1),new hitbox(offsets[2].jab2.id1,3.328,4,70,100,0,0,0,1,1,1)),
  jab3_1 : new hitboxObject(new hitbox(offsets[2].jab3_1.id0,3.328,1,78,80,10,0,0,1,1,1),new hitbox(offsets[2].jab3_1.id1,3.328,1,78,80,10,0,0,1,1,1),new hitbox(offsets[2].jab3_1.id2,3.328,1,78,80,10,0,0,1,1,1)),
  jab3_2 : new hitboxObject(new hitbox(offsets[2].jab3_2.id0,3.328,1,78,80,10,0,0,1,1,1),new hitbox(offsets[2].jab3_2.id1,3.328,1,78,80,10,0,0,1,1,1),new hitbox(offsets[2].jab3_2.id2,3.328,1,78,80,10,0,0,1,1,1)),
  jab3_3 : new hitboxObject(new hitbox(offsets[2].jab3_3.id0,3.328,1,78,80,10,0,0,1,1,1),new hitbox(offsets[2].jab3_3.id1,3.328,1,78,80,10,0,0,1,1,1),new hitbox(offsets[2].jab3_3.id2,3.328,1,78,80,10,0,0,1,1,1)),
  jab3_4 : new hitboxObject(new hitbox(offsets[2].jab3_4.id0,3.328,1,78,80,10,0,0,1,1,1),new hitbox(offsets[2].jab3_4.id1,3.328,1,78,80,10,0,0,1,1,1),new hitbox(offsets[2].jab3_4.id2,3.328,1,78,80,10,0,0,1,1,1)),
  jab3_5 : new hitboxObject(new hitbox(offsets[2].jab3_5.id0,3.328,1,78,80,10,0,0,1,1,1),new hitbox(offsets[2].jab3_5.id1,3.328,1,78,80,10,0,0,1,1,1),new hitbox(offsets[2].jab3_5.id2,3.328,1,78,80,10,0,0,1,1,1)),
  fsmash1 : new hitboxObject(new hitbox(offsets[2].fsmash1.id0,3.515,15,361,105,10,0,0,1,1,1),new hitbox(offsets[2].fsmash1.id1,3.125,15,361,105,10,0,0,1,1,1),new hitbox(offsets[2].fsmash1.id2,2.344,15,361,105,10,0,0,1,1,1)),
  fsmash2 : new hitboxObject(new hitbox(offsets[2].fsmash2.id0,3.515,12,361,105,2,0,0,1,1,1),new hitbox(offsets[2].fsmash2.id1,3.125,12,361,105,2,0,0,1,1,1),new hitbox(offsets[2].fsmash2.id2,2.344,12,361,105,2,0,0,1,1,1)),
  upsmash1 : new hitboxObject(new hitbox(offsets[2].upsmash1.id0,3.328,18,80,112,30,0,0,1,1,1),new hitbox(offsets[2].upsmash1.id1,4.656,18,80,112,30,0,0,1,1,1)),
  upsmash2 : new hitboxObject(new hitbox(offsets[2].upsmash2.id0,3.328,13,361,100,10,0,0,1,1,1),new hitbox(offsets[2].upsmash2.id1,3.828,13,361,100,10,0,0,1,1,1)),
  dsmash : new hitboxObject(new hitbox(offsets[2].dsmash.id0,4.687,15,25,65,20,0,0,1,1,1),new hitbox(offsets[2].dsmash.id1,4.687,15,25,65,20,0,0,1,1,1),new hitbox(offsets[2].dsmash.id2,3.515,12,361,65,20,0,0,1,1,1),new hitbox(offsets[2].dsmash.id3,3.515,12,361,65,20,0,0,1,1,1)),
  grab : new hitboxObject(new hitbox(offsets[2].grab.id0,3.906,0,361,100,0,0,2,3,1,1),new hitbox(offsets[2].grab.id1,2.734,0,361,100,0,0,2,3,1,1)),
  downattack1 : new hitboxObject(new hitbox(offsets[2].downattack1.id0,7.031,6,361,50,80,0,0,1,1,1),new hitbox(offsets[2].downattack1.id1,3.906,6,361,50,80,0,0,1,1,1),new hitbox(offsets[2].downattack1.id2,3.906,6,361,50,80,0,0,1,1,1)),
  downattack2 : new hitboxObject(new hitbox(offsets[2].downattack2.id0,4.687,6,361,50,80,0,0,1,1,1),new hitbox(offsets[2].downattack2.id1,6.250,6,361,50,80,0,0,1,1,1),new hitbox(offsets[2].downattack2.id2,8.694,6,361,50,80,0,0,1,1,1)),
  downspecial : new hitboxObject(new hitbox(offsets[2].downspecial.id0,7.999,5,0,100,0,80,4,0,1,1)),
  reflector : new hitboxObject(new hitbox(offsets[2].reflector.id0,7.999,0,361,100,0,0,7,0,1,1)),
  ledgegetupquick : new hitboxObject(new hitbox(offsets[2].ledgegetupquick.id0,4.687,8,361,100,0,90,0,1,1,1),new hitbox(offsets[2].ledgegetupquick.id1,4.687,8,361,100,0,90,0,1,1,1),new hitbox(offsets[2].ledgegetupquick.id2,4.687,8,361,100,0,90,0,1,1,1)),
  ledgegetupslow : new hitboxObject(new hitbox(offsets[2].ledgegetupslow.id0,3.125,8,361,100,0,90,0,1,1,1),new hitbox(offsets[2].ledgegetupslow.id1,4.687,8,361,100,0,90,0,1,1,1),new hitbox(offsets[2].ledgegetupslow.id2,4.687,8,361,100,0,90,0,1,1,1)),
  pummel : new hitboxObject(new hitbox(offsets[2].pummel.id0,5.859,3,361,100,0,30,0,0,1,1)),
  throwup : new hitboxObject(new hitbox(new Vec2D(-0.067,17.54),0,2,90,110,75,0,0,0,1,1)),
  throwdown : new hitboxObject(new hitbox(new Vec2D(0.50063,0),0,1,270,40,150,0,0,0,1,1)),
  throwback : new hitboxObject(new hitbox(new Vec2D(-6.59,5.66),0,2,124,85,80,0,0,0,1,1)),
  throwforward : new hitboxObject(new hitbox(new Vec2D(14.19-4.61,2.805),0,3,45,130,35,0,0,0,1,1)),
  throwforwardextra : new hitboxObject(new hitbox(offsets[2].throwforwardextra.id0,8.593,7,361,110,40,0,0,0,1,1)),
  thrown : new hitboxObject(new hitbox(offsets[2].thrown.id0,3.906,4,361,50,20,0,1,0,1,1))
};

for (let l = 0; l < 20; l++) {
  offsets[2].thrown.id0.push(new Vec2D(0,12));
}

chars[2] = new charObject(2);
