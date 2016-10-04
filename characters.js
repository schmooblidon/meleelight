function Vec2D(x,y){
  this.x = x;
  this.y = y;
  this.dot = function(vector){
    return this.x * vector.x + this.y * vector.y;
  }
}

function Segment2D(x,y,vecx,vecy){
  this.x = x;
  this.y = y;
  this.vecx = vecx;
  this.vecy = vecy;
  this.segLength = function(){
    var dx = this.vecx;
    var dy = this.vecy;
    return Math.sqrt(dx*dx+dy*dy);
  }
  this.project = function(seg_onto){
    var vec = new Vec2D(this.vecx,this.vecy);
    var onto = new Vec2D(seg_onto.vecx,seg_onto.vecy);
    var d = onto.dot(onto);
    if (0 < d){
      var dp = vec.dot(onto);
      var multiplier = dp/d;
      var rx = onto.x * multiplier;
      var ry = onto.y * multiplier;
      return new Vec2D(rx,ry);
    }
    return new Vec2D(0,0);
  }
}

function Box2D(min,max){
  this.min = new Vec2D(min[0],min[1]);
  this.max = new Vec2D(max[0],max[1]);
}

offsets = [];
offsets[0] = {
  fair : {
    id0 : [new Vec2D(9.26,16.34),
    new Vec2D(11.15,9.93),
  new Vec2D(9.19,5.23),
new Vec2D(3.87,2.43)],
id1 : [new Vec2D(5.46,13.21),
  new Vec2D(6.26,10.84),
  new Vec2D(5.82,8.63),
  new Vec2D(3.93,6.98)],
id2 : [new Vec2D(0.88,13.20),
new Vec2D(1.14,12.76),
new Vec2D(1.20,12.41),
new Vec2D(1.21,12.14)],
id3 : [new Vec2D(11.10,21.41),
new Vec2D(16.53,9.67),
new Vec2D(13.15,1.64),
new Vec2D(5.34,-2.18)]
  },
bair : {
id0 : [new Vec2D(-11.71,6.43),
new Vec2D(-13.16,13.32),
new Vec2D(-9.65,17.03),
new Vec2D(-4.29,17.32),
new Vec2D(-3.64,17.13)],
id1 : [new Vec2D(-7.88,9.56),
new Vec2D(-8.73,11.06),
new Vec2D(-7.80,12.38),
new Vec2D(-5.82,12.95),
new Vec2D(-5.42,12.91)],
id2 : [new Vec2D(-2.84,13.05),
new Vec2D(-2.76,13.05),
new Vec2D(-2.71,13.05),
new Vec2D(-2.69,13.06),
new Vec2D(-2.68,13.06)],
id3 : [new Vec2D(-13.71,1.75),
new Vec2D(-18.52,13.41),
new Vec2D(-12.25,21.73),
new Vec2D(-2.71,22.27),
new Vec2D(-2.02,22.08)]
},
dair : {
id0 : [new Vec2D(10.13,-0.93),
  new Vec2D(-1.89,-4.63),
  new Vec2D(-9.24,0.37),
  new Vec2D(-12.98,8.16)],
id1 : [new Vec2D(6.38,0.55),
new Vec2D(-1.68,-0.60),
new Vec2D(-6.75,3.33),
new Vec2D(-9.01,8.90)],
id2 : [new Vec2D(2.96,4.21),
new Vec2D(0.04,4.02),
new Vec2D(-2.94,6.59),
new Vec2D(-4.13,8.61)],
id3 : [new Vec2D(2.66,10.54),
new Vec2D(2.71,10.14),
new Vec2D(2.46,9.84),
new Vec2D(1.93,9.66)]
},
upair : {
id0 : [new Vec2D(12.14,14.60),
new Vec2D(7.42,23.27),
new Vec2D(-1.33,26.74),
new Vec2D(-10.99,23.29)],
id1 : [new Vec2D(7.46,16.76),
new Vec2D(2.70,20.80),
new Vec2D(-2.77,21.56),
new Vec2D(-8.30,18.63)],
id2 : [new Vec2D(2.63,15.58),
new Vec2D(-0.33,16.52),
new Vec2D(-2.60,16.32),
new Vec2D(-4.92,14.73)],
id3 : [new Vec2D(0.43,11.46),
new Vec2D(0.25,12.43),
new Vec2D(0.07,12.93),
new Vec2D(-0.42,13.26)]
},
nair1 : {
id0 : [new Vec2D(14.63,8.71),
new Vec2D(6.37,12.57)],
id1 : [new Vec2D(8.65,10.24),
new Vec2D(6.42,11.23)],
id2 : [new Vec2D(0.07,13.43),
new Vec2D(0.67,13.40)],
id3 : [new Vec2D(-0.47,7.74),
new Vec2D(-0.47,7.74)]
},
nair2 : {
id0 : [new Vec2D(12.35,4.38),
new Vec2D(0.52,9.91),
new Vec2D(-12.86,19.45),
new Vec2D(-7.52,17.11),
new Vec2D(5.76,10.14),
new Vec2D(12.26,5.79),
new Vec2D(11.80,5.33)],
id1 : [new Vec2D(7.18,7.89),
new Vec2D(-1.38,11.67),
new Vec2D(-7.63,16.29),
new Vec2D(-3.81,14.73),
new Vec2D(3.67,11.08),
new Vec2D(6.86,8.92),
new Vec2D(6.69,8.52)],
id2 : [new Vec2D(0.70,13.51),
new Vec2D(0.26,13.43),
new Vec2D(1.01,12.94),
new Vec2D(0.80,13.13),
new Vec2D(-0.01,13.41),
new Vec2D(-0.68,13.66),
new Vec2D(-0.46,13.68)],
id3 : [new Vec2D(-0.47,7.74),
new Vec2D(-0.47,7.74),
new Vec2D(-0.47,7.74),
new Vec2D(-0.47,7.74),
new Vec2D(-0.48,7.74),
new Vec2D(-0.48,7.74),
new Vec2D(-0.48,7.74)]
},
upb1 : {
id0 : [new Vec2D(9.74,4.31)],
id1 : [new Vec2D(6.39,6.58)],
id2 : [new Vec2D(-0.53,5.88)]
},
upb2 : {
id0 : [new Vec2D(13.85,13.53),
new Vec2D(10.60,24.21),
new Vec2D(8.68,26.72),
new Vec2D(6.97,27.35),
new Vec2D(4.78,27.94)],
id1 : [new Vec2D(9.83,13.99),
new Vec2D(7.55,21.56),
new Vec2D(5.85,23.84),
new Vec2D(4.32,24.33),
new Vec2D(2.61,24.55)],
id2 : [new Vec2D(0.01,8.80),
new Vec2D(0.07,10.68),
new Vec2D(0.07,11.68),
new Vec2D(0.07,11.68),
new Vec2D(0.09,11.67)]
},
dtilt : {
id0 : [new Vec2D(18.90,2.38),
new Vec2D(18.96,2.87),
new Vec2D(18.81,2.94)],
id1 : [new Vec2D(13.12,4.02),
new Vec2D(13.17,4.45),
new Vec2D(13.07,4.69)],
id2 : [new Vec2D(8.81,7.67),
new Vec2D(8.72,7.77),
new Vec2D(8.64,7.85)],
id3 : [new Vec2D(23.60,0.88),
new Vec2D(23.72,1.55),
new Vec2D(23.57,1.62)]
},
uptilt1 : {
id0 : [new Vec2D(14.64,13.62),
new Vec2D(12.78,21.24),
new Vec2D(7.78,23.94)],
id1 : [new Vec2D(9.86,15.22),
new Vec2D(8.52,17.26),
new Vec2D(6.52,18.25)],
id2 : [new Vec2D(3.56,13.40),
new Vec2D(4.28,13.19),
new Vec2D(5.37,12.98)],
id3 : [new Vec2D(16.87,10.48),
new Vec2D(16.18,23.26),
new Vec2D(9.25,27.69)]
},
uptilt2 : {
id0 : [new Vec2D(3.50,23.34),
new Vec2D(0.18,20.96),
new Vec2D(-2.00,16.58),
new Vec2D(-2.09,12.08)],
id1 : [new Vec2D(4.81,17.71),
new Vec2D(3.27,16.16),
new Vec2D(2.75,13.91),
new Vec2D(2.98,11.92)],
id2 : [new Vec2D(7.18,13.37),
new Vec2D(8.38,12.76),
new Vec2D(8.69,12.45),
new Vec2D(8.67,12.40)],
id3 : [new Vec2D(3.11,27.30),
new Vec2D(-0.87,24.71),
new Vec2D(-4.29,19.86),
new Vec2D(-5.30,14.32)]
},
ftilt : {
id0 : [new Vec2D(8.54,4.11),
new Vec2D(16.17,9.33),
new Vec2D(18.10,13.45),
new Vec2D(14.84,18.26)],
id1 : [new Vec2D(9.39,8.39),
new Vec2D(11.99,12.21),
new Vec2D(13.09,11.90),
new Vec2D(12.10,13.63)],
id2 : [new Vec2D(4.58,12.75),
new Vec2D(5.70,11.87),
new Vec2D(7.10,10.66),
new Vec2D(8.58,9.60)],
id3 : [new Vec2D(4.12,1.46),
new Vec2D(18.41,4.48),
new Vec2D(23.49,13.65),
new Vec2D(18.61,22.11)]
},
dashattack : {
id0 : [new Vec2D(11.03,3.26),
new Vec2D(15.21,6.22),
new Vec2D(15.05,7.87),
new Vec2D(13.97,12.26)],
id1 : [new Vec2D(9.54,5.43),
new Vec2D(10.63,7.23),
new Vec2D(10.13,8.36),
new Vec2D(9.47,10.73)],
id2 : [new Vec2D(5.49,9.14),
new Vec2D(6.38,7.95),
new Vec2D(7.27,7.04),
new Vec2D(7.26,6.89)],
id3 : [new Vec2D(6.48,1.06),
new Vec2D(19.59,2.77),
new Vec2D(21.26,6.96),
new Vec2D(20.08,13.48)]
},
jab1 : {
id0 : [new Vec2D(13.68,7.34),
new Vec2D(16.64,10.96),
new Vec2D(15.79,15.10),
new Vec2D(12.70,18.69)],
id1 : [new Vec2D(10.22,9.87),
new Vec2D(12.21,11.53),
new Vec2D(11.63,13.74),
new Vec2D(10.03,15.89)],
id2 : [new Vec2D(5.18,12.23),
new Vec2D(5.58,12.10),
new Vec2D(5.96,12.11),
new Vec2D(6.75,12.65)],
id3 : [new Vec2D(16.45,1.88),
new Vec2D(22.52,8.98),
new Vec2D(21.85,16.40),
new Vec2D(18.57,20.40)]
},
jab2 : {
id0 : [new Vec2D(16.61,8.05),
new Vec2D(16.65,13.43),
new Vec2D(13.12,17.59),
new Vec2D(7.91,18.53),
new Vec2D(3.47,16.83)],
id1 : [new Vec2D(12.87,10.31),
new Vec2D(12.38,13.23),
new Vec2D(10.27,15.37),
new Vec2D(7.70,15.82),
new Vec2D(5.58,15.06)],
id2 : [new Vec2D(7.04,13.09),
new Vec2D(6.30,13.75),
new Vec2D(5.20,13.28),
new Vec2D(5.26,12.96),
new Vec2D(5.59,13.11)],
id3 : [new Vec2D(19.38,3.39),
new Vec2D(22.57,12.52),
new Vec2D(17.07,19.43),
new Vec2D(9.85,21.01),
new Vec2D(4.67,18.33)]
},
sidespecial : {
id0 : [new Vec2D(11.97,19.81),
new Vec2D(18.79,12.44),
new Vec2D(16.47,5.00)],
id1 : [new Vec2D(9.62,25.13),
new Vec2D(23.82,15.40),
new Vec2D(21.42,1.90)],
id2 : [new Vec2D(11.60,14.07),
new Vec2D(13.01,11.51),
new Vec2D(12.41,9.36)],
id3 : [new Vec2D(5.43,14.48),
new Vec2D(7.02,14.17),
new Vec2D(9.50,11.87)]
},
fsmash : {
id0 : [new Vec2D(14.73,20.43),
new Vec2D(23.35,12.45),
new Vec2D(18.63,0.49),
new Vec2D(18.83,0.19)],
id1 : [new Vec2D(14.85,15.44),
new Vec2D(18.30,10.69),
new Vec2D(15.87,4.03),
new Vec2D(15.37,3.52)],
id2 : [new Vec2D(9.32,8.08),
new Vec2D(10.74,6.82),
new Vec2D(12.01,5.69),
new Vec2D(12.01,5.08)],
id3 : [new Vec2D(10.98,24.89),
new Vec2D(28.11,15.83),
new Vec2D(24.45,0.79),
new Vec2D(24.65,0.33)]
},
upsmash : {
id0 : [new Vec2D(6.29,7.64),
new Vec2D(6.29,7.64),
new Vec2D(6.29,7.64),
new Vec2D(6.29,7.64)],
id1 : [new Vec2D(-6.29,7.64),
new Vec2D(-6.29,7.64),
new Vec2D(-6.29,7.64),
new Vec2D(-6.29,7.64)],
id2 : [new Vec2D(0.91,21.71),
new Vec2D(0.82,21.13),
new Vec2D(0.78,20.56),
new Vec2D(0.78,20.87)],
id3 : [new Vec2D(0.19,26.06),
new Vec2D(0.03,25.46),
new Vec2D(-0.04,24.89),
new Vec2D(-0.03,25.20)]
},
dsmash1 : {
id0 : [new Vec2D(13.69,4.12),
new Vec2D(19.33,5.53),
new Vec2D(15.33,6.20)],
id1 : [new Vec2D(12.67,7.34),
new Vec2D(14.83,8.08),
new Vec2D(12.92,8.48)],
id2 : [new Vec2D(6.48,6.94),
new Vec2D(7.05,6.49),
new Vec2D(6.79,6.43)],
id3 : [new Vec2D(11.96,2.87),
new Vec2D(24.08,3.30),
new Vec2D(19.09,3.90)]
},
dsmash2 : {
id0 : [new Vec2D(-9.69,3.24),
new Vec2D(-12.61,2.91),
new Vec2D(-10.56,3.43)],
id1 : [new Vec2D(-6.68,4.54),
new Vec2D(-8.18,4.30),
new Vec2D(-7.89,4.30)],
id2 : [new Vec2D(-0.35,5.31),
new Vec2D(-0.65,5.17),
new Vec2D(-0.63,5.09)],
id3 : [new Vec2D(-10.28,2.16),
new Vec2D(-17.91,2.01),
new Vec2D(-14.94,2.54)]
},
grab : {
id0 : [new Vec2D(14.82,9.43),
new Vec2D(14.82,9.43)],
id1 : [new Vec2D(11.23,8.98),
new Vec2D(11.23,8.98)],
id2 : [new Vec2D(8.09,8.53),
new Vec2D(8.09,8.53)]
},
downattack1 : {
id0 : [new Vec2D(-11.59,7.12),
new Vec2D(-11.57,7.18),
new Vec2D(-11.59,7.20),
new Vec2D(-11.61,7.26)],
id1 : [new Vec2D(-7.46,8.54),
new Vec2D(-7.43,8.59),
new Vec2D(-7.43,8.56),
new Vec2D(-7.43,8.57)],
id2 : [new Vec2D(-3.85,11.23),
new Vec2D(-3.84,11.27),
new Vec2D(-3.84,11.21),
new Vec2D(-3.83,11.17)],
id3 : [new Vec2D(-17.85,7.02),
new Vec2D(-17.84,7.07),
new Vec2D(-17.86,7.15),
new Vec2D(-17.89,7.30)]
},
downattack2 : {
id0 : [new Vec2D(17.65,9.84),
new Vec2D(18.77,10.73)],
id1 : [new Vec2D(13.16,10.31),
new Vec2D(14.52,10.42)],
id2 : [new Vec2D(6.59,11.20),
new Vec2D(8.36,10.74)],
id3 : [new Vec2D(23.38,8.95),
new Vec2D(25.05,10.63)]
},
pummel : {
id0 : [new Vec2D(8.87,10.75)]
},
thrown : {
id0 : [new Vec2D(0,12)]
}
}


// PUFF ---------------------------------------------

offsets[1] = {
  fair1 : {
    id0 : [new Vec2D(6.14,3.93),
    new Vec2D(9.40,3.66)],
    id1 : [new Vec2D(1.84,1.84),
    new Vec2D(1.84,1.84)]
  },
  fair2 : {
    id0 : [new Vec2D(9.03,3.69),
new Vec2D(8.30,3.66),
new Vec2D(8.42,3.66),
new Vec2D(8.30,3.74),
new Vec2D(8.04,3.78),
new Vec2D(7.75,3.84),
new Vec2D(7.55,3.81),
new Vec2D(7.42,3.66),
new Vec2D(7.26,3.48),
new Vec2D(7.07,3.28),
new Vec2D(6.86,3.11),
new Vec2D(6.63,2.94),
new Vec2D(6.37,2.86),
new Vec2D(6.11,2.78)],
    id1 : [new Vec2D(1.84,1.84),
new Vec2D(1.84,1.84),
new Vec2D(1.84,1.84),
new Vec2D(1.84,1.84),
new Vec2D(1.84,1.84),
new Vec2D(1.84,1.84),
new Vec2D(1.84,1.84),
new Vec2D(1.84,1.84),
new Vec2D(1.84,1.84),
new Vec2D(1.84,1.84),
new Vec2D(1.84,1.84),
new Vec2D(1.84,1.84),
new Vec2D(1.84,1.84),
new Vec2D(1.84,1.84)]
  },
  nair1 : {
    id0 : [new Vec2D(0.50,4.03),
    new Vec2D(0.50,4.03)],
    id1 : [new Vec2D(8.63,1.75),
    new Vec2D(7.83,1.89)]
  },
  nair2 : {
    id0 : [new Vec2D(0.50,4.03),
new Vec2D(0.50,4.03),
new Vec2D(0.49,4.03),
new Vec2D(0.49,4.03),
new Vec2D(0.48,4.03),
new Vec2D(0.48,4.04),
new Vec2D(0.47,4.04),
new Vec2D(0.47,4.04),
new Vec2D(0.46,4.04),
new Vec2D(0.46,4.04),
new Vec2D(0.45,4.04),
new Vec2D(0.45,4.04),
new Vec2D(0.44,4.04),
new Vec2D(0.44,4.04),
new Vec2D(0.44,4.04),
new Vec2D(0.44,4.04),
new Vec2D(0.44,4.04),
new Vec2D(0.45,4.04),
new Vec2D(0.45,4.04),
new Vec2D(0.46,4.04),
new Vec2D(0.47,4.04)],
    id1 : [new Vec2D(6.90,1.88),
new Vec2D(6.88,1.85),
new Vec2D(6.89,1.90),
new Vec2D(6.93,2.02),
new Vec2D(6.93,1.99),
new Vec2D(6.96,2.02),
new Vec2D(6.99,2.05),
new Vec2D(7.04,2.15),
new Vec2D(7.07,2.17),
new Vec2D(7.10,2.17),
new Vec2D(7.12,2.17),
new Vec2D(7.12,2.09),
new Vec2D(7.14,2.09),
new Vec2D(7.18,2.15),
new Vec2D(7.18,2.14),
new Vec2D(7.16,2.05),
new Vec2D(7.15,2.02),
new Vec2D(7.14,2.06),
new Vec2D(7.10,2.01),
new Vec2D(7.02,1.88),
new Vec2D(6.94,1.81)]
  },
  dair : {
    id0 : [new Vec2D(3.13,-2.20),
    new Vec2D(3.13,-2.20)],
    id1 : [new Vec2D(1.88,0),
    new Vec2D(1.88,0)],
    id2 : [new Vec2D(3.13,-2.20),
    new Vec2D(3.13,-2.20)],
    id3 : [new Vec2D(1.88,0),
    new Vec2D(1.88,0)]
  },
  bair : {
    id0 : [new Vec2D(-9.47,2.84),
    new Vec2D(-14.59,3.60),
  new Vec2D(-12.72,3.79),
new Vec2D(-9.58,3.51)],
    id1 : [new Vec2D(-6.29,3.09),
    new Vec2D(-8.01,3.59),
  new Vec2D(-7.08,3.69),
new Vec2D(-5.56,3.56)],
    id2 : [new Vec2D(-4.20,3.31),
    new Vec2D(-4.28,3.73),
  new Vec2D(-3.99,3.80),
new Vec2D(-3.47,3.74)]
  },
  upair : {
    id0 : [new Vec2D(-3.89,10.98),
    new Vec2D(0.21,13.08),
  new Vec2D(1.52,12.73),
new Vec2D(2.67,12.23)]
  },
  sidespecial : {
    id0 : [new Vec2D(3.68,4.77),
    new Vec2D(3.68,4.77),
  new Vec2D(3.68,4.77),
new Vec2D(3.68,4.77),
new Vec2D(3.68,4.77),
new Vec2D(3.68,4.77),
new Vec2D(3.68,4.77),
new Vec2D(3.68,4.77),
new Vec2D(3.68,4.77),
new Vec2D(3.68,4.77),
new Vec2D(3.68,4.77),
new Vec2D(3.68,4.77),
new Vec2D(3.68,4.77),
new Vec2D(3.68,4.77),
new Vec2D(3.68,4.77),
new Vec2D(3.68,4.77)],
    id1 : [new Vec2D(14.32-2.02,1.92),
    new Vec2D(11.83-1.86,2.68),
  new Vec2D(10.92-3.58,3.57),
new Vec2D(9.07-1.58,3.31),
new Vec2D(9.73-1.45,2.85),
new Vec2D(10.96-2.78,2.95),
new Vec2D(12.19-4.01,3.00),
new Vec2D(9.32-1.13,3.09),
new Vec2D(9.25-1.04,3.21),
new Vec2D(9.19-0.96,3.33),
new Vec2D(10.08-1.83,3.44),
new Vec2D(9.08-0.81,3.59),
new Vec2D(9.86-1.55,3.73),
new Vec2D(10.54-2.24,3.83),
new Vec2D(11.16-2.87,3.91),
new Vec2D(8.89-0.58,4.03)]
  },
  fsmash1 : {
    id0 : [new Vec2D(4.88-1.45,6.16),
    new Vec2D(5.48-2.08,6.32),
  new Vec2D(3.98-0.62,6.44),
new Vec2D(4.55-1.22,6.54)],
    id1 : [new Vec2D(9.20-1.45,6.61),
    new Vec2D(9.92-2.08,6.69),
  new Vec2D(10.58-2.70,6.67),
new Vec2D(8.50-0.60,6.68)]
  },
  fsmash2 : {
    id0 : [new Vec2D(3.89-0.59,6.61),
new Vec2D(4.47-1.17,6.60),
new Vec2D(5.04-1.74,6.55),
new Vec2D(5.59-2.29,6.47),
new Vec2D(3.87-0.55,6.31)],
    id1 : [new Vec2D(9.08-1.19,6.72),
new Vec2D(9.63-1.77,6.60),
new Vec2D(10.15-2.34,6.52),
new Vec2D(8.30-0.56,6.48),
new Vec2D(8.78-1.10,6.29)]
  },
  dsmash : {
    id0 : [new Vec2D(-9.24,0.88),
    new Vec2D(-8.79,1.03)],
    id1 : [new Vec2D(9.51,0.69),
    new Vec2D(9.08,0.74)],
    id2 : [new Vec2D(-3.71,1.66),
    new Vec2D(-3.59,1.39)],
    id3 : [new Vec2D(3.97,1.46),
    new Vec2D(3.90,1.28)]
  },
  upsmash : {
    id0 : [new Vec2D(-5.95,10.98),
    new Vec2D(-0.33,14.92),
  new Vec2D(2.75,12.00),
new Vec2D(4.02,7.87)],
    id1 : [new Vec2D(-7.19,10.20),
    new Vec2D(-1.64,15.18),
  new Vec2D(1.87,12.54),
new Vec2D(3.58,9.02)]
  },
  jab1 : {
    id0 : [new Vec2D(4.56,4.85),
    new Vec2D(4.97,4.77)],
    id1 : [new Vec2D(8.10,4.80),
    new Vec2D(8.20,4.66)],
    id2 : [new Vec2D(11.64,4.75),
    new Vec2D(11.43,4.55)]
  },
  jab2 : {
    id0 : [new Vec2D(4.88,4.00),
    new Vec2D(5.00,3.90)],
    id1 : [new Vec2D(8.84,4.09),
    new Vec2D(8.56,3.94)],
    id2 : [new Vec2D(12.80,4.18),
    new Vec2D(12.13,3.98)]
  },
  dtilt : {
    id0 : [new Vec2D(13.60,3.31),
    new Vec2D(16.01,4.28),
  new Vec2D(15.76,4.49)],
    id1 : [new Vec2D(9.31,3.46),
    new Vec2D(10.72,4.21),
  new Vec2D(10.64,4.36)],
    id2 : [new Vec2D(5.73,3.67),
    new Vec2D(6.20,4.25),
  new Vec2D(6.25,4.34)]
  },
  uptilt1 : {
    id0 : [new Vec2D(-1.40,2.87),
    new Vec2D(-4.40,6.63)],
    id1 : [new Vec2D(-0.32,0.53),
    new Vec2D(-7.45,9.39)]
  },
  uptilt2 : {
    id0 : [new Vec2D(-2.22,10.56),
new Vec2D(-1.44,11.15),
new Vec2D(-1.11,11.32),
new Vec2D(-1.31,11.21),
new Vec2D(-1.69,10.95)],
    id1 : [new Vec2D(-0.61,15.97),
new Vec2D(1.07,16.19),
new Vec2D(1.84,16.13),
new Vec2D(1.53,16.00),
new Vec2D(0.89,15.79)]
  },
  ftilt : {
    id0 : [new Vec2D(3.19,3.01),
    new Vec2D(5.79,4.39),
  new Vec2D(5.13,4.62),
new Vec2D(3.34,4.70)],
    id1 : [new Vec2D(7.60,3.46),
    new Vec2D(11.12,4.57),
  new Vec2D(9.89,4.64),
new Vec2D(6.52,4.68)]
  },
  dashattack1 : {
    id0 : [new Vec2D(7.07-2.44,8.73),
    new Vec2D(9.25-4.35,8.49),
  new Vec2D(10.63-5.75,8.47),
new Vec2D(11.97-7.11,8.47),
new Vec2D(13.29-8.44,8.46)]
  },
  dashattack2 : {
    id0:[new Vec2D(6.14-1.30,8.46),
new Vec2D(7.42-2.58,8.43),
new Vec2D(8.67-3.82,8.38),
new Vec2D(6.08-1.22,8.30),
new Vec2D(7.28-2.42,8.17),
new Vec2D(6.04-1.17,7.99)]
  },
  downspecial : {
    id0 : [new Vec2D(0.13,5.26)]
  },
  upspecial1 : {
    id0 : [new Vec2D(-0.76,4.94),
    new Vec2D(-0.92,5.06),
  new Vec2D(-1.08,5.18),
new Vec2D(-1.25,5.29),
new Vec2D(-1.41,5.41),
new Vec2D(-1.58,5.52),
new Vec2D(-1.74,5.63),
new Vec2D(-1.90,5.74)]
  },
  upspecial2 : {
    id0 : [new Vec2D(1.22,4.91),
    new Vec2D(1.33,5.06),
  new Vec2D(1.44,5.20),
new Vec2D(1.56,5.35),
new Vec2D(1.67,5.50),
new Vec2D(1.77,5.64),
new Vec2D(1.88,5.78),
new Vec2D(1.99,5.90)]
  },
  upspecial3 : {
    id0 : [new Vec2D(-0.10,4.25),
    new Vec2D(-0.15,4.35),
  new Vec2D(-0.19,4.46),
new Vec2D(-0.23,4.60),
new Vec2D(-0.27,4.74),
new Vec2D(-0.30,4.90),
new Vec2D(-0.33,5.06),
new Vec2D(-0.36,5.23),
new Vec2D(-0.39,5.39),
new Vec2D(-0.41,5.56),
new Vec2D(-0.43,5.71),
new Vec2D(-0.45,5.86),
new Vec2D(-0.46,5.99)]
  },
  grab : {
    id0 : [new Vec2D(10.28,4.77),
    new Vec2D(10.28,4.77)],
    id1 : [new Vec2D(4.77,4.77),
    new Vec2D(4.77,4.77)]
  },
  downattack1 : {
    id0 : [new Vec2D(-12.01,2.37),
    new Vec2D(-14.19,2.83)],
    id1 : [new Vec2D(-5.72,3.29),
    new Vec2D(-6.78,4.03)],
    id2 : [new Vec2D(-1.74,1.75),
    new Vec2D(-1.87,2.05)],
    id3 : [new Vec2D(-2.12,5.46),
    new Vec2D(-2.82,6.01)]
  },
  downattack2 : {
    id0 : [new Vec2D(13.03,3.30),
    new Vec2D(14.14,2.60)],
    id1 : [new Vec2D(6.22,4.52),
    new Vec2D(6.79,4.06)],
    id2 : [new Vec2D(2.69,2.08),
    new Vec2D(1.94,1.96)],
    id3 : [new Vec2D(2.68,6.15),
    new Vec2D(2.82,6.01)]
  },
  pummel : {
    id0 : [new Vec2D(11.75,5.51),
    new Vec2D(11.75,5.51)]
  },
  downspecial : {
    id0 : [new Vec2D(0.13,5.26)]
  },
  ledgegetupquick : {
    id0 : [new Vec2D(2.43-4.90,12.50),
    new Vec2D(5.14-5.78,12.50),
    new Vec2D(7.92-6.37,11.52),
  new Vec2D(10.85-6.59,7.79),
new Vec2D(10.79-6.41,5.19)],
    id1 : [new Vec2D(-5.23-1.10,13.25),
    new Vec2D(-2.16-1.99,14.24),
  new Vec2D(1.32-2.58,15.56),
new Vec2D(10.49-2.79,12.57),
new Vec2D(12.69-2.61,6.71)]
  },
  ledgegetupslow : {
    id0 : [new Vec2D(-5.01-2.03,1.55),
    new Vec2D(-4.24-3.12,1.24),
  new Vec2D(1.98-4.14,1.09),
new Vec2D(11.82-4.99,0.88),
new Vec2D(13.03-5.57,0.73),
new Vec2D(-0.23-5.79,0.39),
new Vec2D(-2.47-5.72,0.34),
new Vec2D(7.68-5.53,0.45),
new Vec2D(14.17-5.22,0.61),
new Vec2D(13.51-4.82,0.80),
new Vec2D(7.98-4.35,0.98),
new Vec2D(1.51-3.83,1.07),
new Vec2D(-3.20-3.26,1.10),
new Vec2D(-5.69-2.67,1.10),
new Vec2D(-6.50-2.08,1.08),
new Vec2D(-6.37-1.50,1.05),
new Vec2D(-5.90-0.96,0.99)],
    id1 : [new Vec2D(9.32-2.03,1.31),
    new Vec2D(8.20-3.12,1.28),
  new Vec2D(4.70-4.14,0.63),
new Vec2D(0.04-4.99,0.98),
new Vec2D(-2.99-5.57,1.15),
new Vec2D(10.66-5.79,0.44),
new Vec2D(14.68-5.72,0.17),
new Vec2D(4.89-5.53,0.19),
new Vec2D(-2.99-5.22,0.39),
new Vec2D(-4.44-4.82,0.64),
new Vec2D(-0.88-4.35,0.89),
new Vec2D(4.14-3.83,1.02),
new Vec2D(8.09-3.26,1.05),
new Vec2D(10.01-2.67,1.04),
new Vec2D(10.26-2.08,1.02),
new Vec2D(9.45-1.50,0.99),
new Vec2D(8.18-0.96,0.97)]
  },
  thrown : {
    id0 : [new Vec2D(0,12)]
  },
  throwdownextra : {
    id0 : [new Vec2D(2.94,3.67)]
  },
  throwforwardextra : {
    id0 : [new Vec2D(1.41,7.43)]
  }
}

offsets[2] = {
  ledgegetupquick : {
    id0 : [new Vec2D(-58.14+63.41,6.74),
    new Vec2D(-56.45+61.81,5.82),
  new Vec2D(-54.31+59.89,5.57),
new Vec2D(-52.04+57.77,5.73),
new Vec2D(-49.69+55.56,4.80),
new Vec2D(-47.38+55.37,3.23),
new Vec2D(-45.21+51.32,2.38),
new Vec2D(-43.30+49.52,2.14),
new Vec2D(-41.76+48.1,2.07),
new Vec2D(-40.70+47.16,1.98)],
    id1 : [new Vec2D(-58.22+63.41,5.54),
    new Vec2D(-56.68+61.81,4.39),
  new Vec2D(-54.41+59.89,3.78),
new Vec2D(-52.00+57.77,3.90),
new Vec2D(-49.66+55.56,4.75),
new Vec2D(-47.36+55.37,4.86),
new Vec2D(-45.20+51.32,4.10),
new Vec2D(-43.29+49.52,3.16),
new Vec2D(-42.15+48.10,2.32),
new Vec2D(-42.07+47.16,1.52)],
    id2 : [new Vec2D(-67.70+63.41,7.60),
    new Vec2D(-65.97+61.81,7.17),
  new Vec2D(-63.95+59.89,-6.29),
new Vec2D(-61.74+57.77,5.24),
new Vec2D(-59.47+55.56,4.49),
new Vec2D(-57.18+55.37,3.90),
new Vec2D(-54.99+51.32,3.30),
new Vec2D(-52.97+49.52,2.97),
new Vec2D(-51.42+48.1,2.61),
new Vec2D(-50.37+47.16,2.37)]
  },
  ledgegetupslow : {
    id0 : [new Vec2D(-58.61,9.98),
    new Vec2D(-56.18,2.92),
  new Vec2D(-56.57)],
    id1 : [new Vec2D(-56.05,12.62),
    new Vec2D(-52.49,1.28),
  new Vec2D(-53.49,0.83)],
    id2 : [new Vec2D(-65.09,8.36),
    new Vec2D(-63.62,7.10),
  new Vec2D(-56.57,1.96)]
  },
  downspecial : {
    id0 : [new Vec2D(-0.60,6.80)]
  },
  jab1 : {
    id0 : [new Vec2D(5.49,5.97),
    new Vec2D(15.53,8.15)],
    id1 : [new Vec2D(6.20,9.12),
    new Vec2D(9.00,7.76)]
  },
  jab2 : {
    id0 : [new Vec2D(12.90-3.36,6.93),
    new Vec2D(8.57,6.99)],
    id1 : [new Vec2D(6.26-3.36,6.03),
    new Vec2D(2.96,6.14)]
  },
  jab3_1 : {
    id0 : [new Vec2D(2.12,10.36),
    new Vec2D(2.04,10.10)],
    id1 : [new Vec2D(4.99,12.11),
    new Vec2D(4.80,11.65)],
    id2 : [new Vec2D(10.81,15.64),
    new Vec2D(10.39,14.75)]
  },
  jab3_2 : {
    id0 : [new Vec2D(2.30,9.68),
    new Vec2D(2.19,9.42)],
    id1 : [new Vec2D(5.49,10.75),
    new Vec2D(5.21,10.35)],
    id2 : [new Vec2D(11.94,12.91),
    new Vec2D(11.31,12.24)]
  },
  jab3_3 : {
    id0 : [new Vec2D(1.91,8.41),
    new Vec2D(1.90,8.27)],
    id1 : [new Vec2D(5.28,8.50),
    new Vec2D(5.20,8.24)],
    id2 : [new Vec2D(12.09,8.68),
    new Vec2D(11.86,8.17)]
  },
  jab3_4 : {
    id0 : [new Vec2D(2.33,7.69),
    new Vec2D(2.19,7.60)],
    id1 : [new Vec2D(5.38,6.97),
    new Vec2D(5.06,6.81)],
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
new Vec2D(8.49,2.90)],
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


}
for (var k=0;k<4;k++){
  offsets[2].nair1.id0.push(new Vec2D(-0.96,6.53));
  offsets[2].nair1.id1.push(new Vec2D(5.72,6.28));
  offsets[2].nair1.id2.push(new Vec2D(0.39,3.88));
}
for (var k=0;k<23;k++){
  offsets[2].nair2.id0.push(new Vec2D(-0.96,6.53));
  offsets[2].nair2.id1.push(new Vec2D(5.72,6.28));
  offsets[2].nair2.id2.push(new Vec2D(0.39,3.88));
}
offsets[2].nair2.id0.push(new Vec2D(-0.91,6.6));
offsets[2].nair2.id1.push(new Vec2D(5.50,6.57));
offsets[2].nair2.id2.push(new Vec2D(0.42,4.01));

for (var k=0;k<4;k++){
  offsets[2].bair1.id0.push(new Vec2D(-0.02,8.00));
}
for (var k=0;k<12;k++){
  offsets[2].bair2.id0.push(new Vec2D(-0.02,8.00));
}

charAttributes = [];
charAttributes[0] = {
  dFrameMin : 15,
  dFrameMax : 27,
  dInitV : 1.56,
  dMaxV : 1.8,
  dAccA : 0.06,
  dAccB : 0,
  dTInitV : 1.5,
  traction : 0.06,
  maxWalk : 1.6,
  jumpSquat : 4,
  sHopInitV : 1.5,
  fHopInitV : 2.4,
  gravity : 0.085,
  groundToAir : 0.8,
  jumpHmaxV : 1.2,
  jumpHinitV : 1,
  airMobA : 0.03,
  airMobB : 0.02,
  aerialHmaxV : 0.9,
  airFriction : 0.005,
  terminalV : 2.2,
  fastFallV : 2.5,
  walkInitV : 0.15,
  walkAcc : 0,
  walkMaxV : 1.6,
  djMultiplier : 0.88,
  shieldScale : 11.75,
  modelScale : 1.15,
  weight : 87,
  waitAnimSpeed : 1,
  walljump : true,
  hurtboxOffset : [4,18],
  ledgeSnapBoxOffset : [14,12,22],
  shieldOffset : [5,40],
  charScale : 0.2,
  miniScale : 0.14
}

charAttributes[1] = {
  dFrameMin : 12,
  dFrameMax : 23,
  dInitV : 1.31,
  dMaxV : 1.1,
  dAccA : 0.065,
  dAccB : 0.02,
  dTInitV : 1.4,
  traction : 0.09,
  maxWalk : 0.7,
  jumpSquat : 5,
  sHopInitV : 1.05,
  fHopInitV : 1.6,
  gravity : 0.064,
  groundToAir : 1,
  jumpHmaxV : 1.35,
  jumpHinitV : 0.7,
  airMobA : 0.09,
  airMobB : 0.19,
  aerialHmaxV : 1.35,
  airFriction : 0.05,
  fastFallV : 1.6,
  terminalV : 1.3,
  walkInitV : 0.16,
  walkAcc : 0.1,
  walkMaxV : 0.7,
  djMultiplier : 0,
  shieldScale : 13.125,
  modelScale : 0.94,
  weight : 60,
  waitAnimSpeed : 1,
  walljump : false,
  hurtboxOffset : [6,13],
  ledgeSnapBoxOffset : [14,8,18],
  shieldOffset : [0,22],
  charScale : 0.24,
  miniScale : 0.168
}

charAttributes[2] = {
  dFrameMin : 11,
  dFrameMax : 21,
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
  shieldScale : 14.375,
  modelScale : 0.96,
  weight : 75,
  waitAnimSpeed : 1,
  walljump : true,
  hurtboxOffset : [6,13],
  ledgeSnapBoxOffset : [14,8,18],
  shieldOffset : [5,34],
  charScale : 0.35,
  miniScale : 0.3
}

function charObject(num){
  this.attributes = charAttributes[num];
  this.animations = 0;
  this.hitboxes = hitboxes[num];
}

function hitboxObject(id0,id1,id2,id3){
  this.id0 = id0;
  this.id1 = id1;
  this.id2 = id2;
  this.id3 = id3;
}

function hitbox(offset,size,dmg,angle,kg,bk,sk,type,clank,hG,hA){
  this.offset = offset;
  this.size = size;
  this.dmg = dmg;
  this.angle = angle;
  this.kg = kg;
  this.bk = bk;
  this.sk = sk;
  this.type = type;
  this.clank = clank;
  this.hitGrounded = hG;
  this.hitAirborne = hA;
  //this.aF = activeFrames;
}

function actionState(totalFrames,name,hb){
  this.totalFrames = totalFrames;
  this.timer = 0;
  this.name = name;
  this.hb = hb;
}

hitboxes = [];
hitboxes[0] = {
  fair : new hitboxObject(new hitbox(offsets[0].fair.id0,3.906,10,361,70,30,0,1,0,1,1),new hitbox(offsets[0].fair.id1,3.906,9,361,70,20,0,1,0,1,1),new hitbox(offsets[0].fair.id2,3.906,9,361,70,20,0,1,0,1,1),new hitbox(offsets[0].fair.id3,3.906,13,67,70,42,0,1,0,1,1)),
  bair : new hitboxObject(new hitbox(offsets[0].bair.id0,3.906,10,361,70,30,0,1,0,1,1),new hitbox(offsets[0].bair.id1,3.906,9,361,70,25,0,1,0,1,1),new hitbox(offsets[0].bair.id2,3.906,9,361,70,10,0,1,0,1,1),new hitbox(offsets[0].bair.id3,3.906,13,361,70,30,0,1,0,1,1)),
  nair1 : new hitboxObject(new hitbox(offsets[0].nair1.id0,3.906,4,100,40,30,0,1,0,1,1),new hitbox(offsets[0].nair1.id1,3.906,4,100,40,30,0,1,0,1,1),new hitbox(offsets[0].nair1.id2,3.906,4,100,40,30,0,1,0,1,1),new hitbox(offsets[0].nair1.id3,3.906,4,90,40,30,0,0,0,1,1)),
  nair2 : new hitboxObject(new hitbox(offsets[0].nair2.id0,3.906,10,361,80,50,0,1,0,1,1),new hitbox(offsets[0].nair2.id1,3.906,10,361,80,50,0,1,0,1,1),new hitbox(offsets[0].nair2.id2,3.906,10,361,80,50,0,1,0,1,1),new hitbox(offsets[0].nair2.id3,3.906,10,361,80,50,0,0,0,1,1)),
  dair : new hitboxObject(new hitbox(offsets[0].dair.id0,3.515,13,290,70,40,0,1,0,1,1),new hitbox(offsets[0].dair.id1,3.515,10,80,70,40,0,1,0,1,1),new hitbox(offsets[0].dair.id2,3.515,9,361,70,30,0,1,0,1,1),new hitbox(offsets[0].dair.id3,3.515,9,361,70,20,0,1,0,1,1)),
  upair : new hitboxObject(new hitbox(offsets[0].upair.id0,3.906,13,90,70,40,0,1,0,1,1),new hitbox(offsets[0].upair.id1,3.906,10,80,70,30,0,1,0,1,1),new hitbox(offsets[0].upair.id2,3.906,9,80,70,20,0,1,0,1,1),new hitbox(offsets[0].upair.id3,3.906,9,80,70,18,0,1,0,1,1)),
  upb1 : new hitboxObject(new hitbox(offsets[0].upb1.id0,3.906,13,361,70,80,0,1,2,1,1),new hitbox(offsets[0].upb1.id1,3.906,10,74,70,60,0,1,2,1,1),new hitbox(offsets[0].upb1.id2,3.906,10,74,70,60,0,1,2,1,1)),
  upb2 : new hitboxObject(new hitbox(offsets[0].upb2.id0,3.906,7,361,90,20,0,1,0,1,1),new hitbox(offsets[0].upb2.id1,3.906,7,74,90,20,0,1,0,1,1),new hitbox(offsets[0].upb2.id2,3.125,6,74,90,20,0,0,0,1,1)),
  dtilt : new hitboxObject(new hitbox(offsets[0].dtilt.id0,3.906,9,30,40,30,0,1,1,1,1),new hitbox(offsets[0].dtilt.id1,2.734,8,30,40,25,0,1,1,1,1),new hitbox(offsets[0].dtilt.id2,3.047,8,30,40,20,0,1,1,1,1),new hitbox(offsets[0].dtilt.id3,3.906,10,30,40,50,0,1,1,1,1)),
  uptilt1 : new hitboxObject(new hitbox(offsets[0].uptilt1.id0,3.906,9,110,120,40,0,1,1,1,1),new hitbox(offsets[0].uptilt1.id1,3.125,9,361,118,40,0,1,1,1,1),new hitbox(offsets[0].uptilt1.id2,3.047,8,361,116,40,0,1,1,1,1),new hitbox(offsets[0].uptilt1.id3,3.906,12,110,100,50,0,1,1,1,1)),
  uptilt2 : new hitboxObject(new hitbox(offsets[0].uptilt2.id0,3.906,10,85,120,40,0,1,1,1,1),new hitbox(offsets[0].uptilt2.id1,2.734,9,361,118,30,0,1,1,1,1),new hitbox(offsets[0].uptilt2.id2,2.265,9,361,116,30,0,1,1,1,1),new hitbox(offsets[0].uptilt2.id3,3.906,13,85,100,50,0,1,1,1,1)),
  ftilt : new hitboxObject(new hitbox(offsets[0].ftilt.id0,3.906,9,361,70,30,0,1,1,1,1),new hitbox(offsets[0].ftilt.id1,2.734,9,361,70,30,0,1,1,1,1),new hitbox(offsets[0].ftilt.id2,3.047,9,361,70,30,0,1,1,1,1),new hitbox(offsets[0].ftilt.id3,3.906,13,361,70,60,0,1,1,1,1)),
  dashattack : new hitboxObject(new hitbox(offsets[0].dashattack.id0,3.906,11,110,55,70,0,1,1,1,1),new hitbox(offsets[0].dashattack.id1,3.125,9,361,60,35,0,0,1,1,1),new hitbox(offsets[0].dashattack.id2,2.344,9,361,60,35,0,0,1,1,1),new hitbox(offsets[0].dashattack.id3,3.906,12,110,55,70,0,1,1,1,1)),
  jab1 : new hitboxObject(new hitbox(offsets[0].jab1.id0,3.906,4,361,50,20,0,1,1,1,1),new hitbox(offsets[0].jab1.id1,3.125,4,361,50,20,0,1,1,1,1),new hitbox(offsets[0].jab1.id2,2.344,4,361,50,20,0,1,1,1,1),new hitbox(offsets[0].jab1.id3,3.906,6,361,60,30,0,1,1,1,1)),
  jab2 : new hitboxObject(new hitbox(offsets[0].jab2.id0,3.906,4,361,50,20,0,1,1,1,1),new hitbox(offsets[0].jab2.id1,3.125,4,361,50,20,0,1,1,1,1),new hitbox(offsets[0].jab2.id2,2.344,4,361,50,20,0,1,1,1,1),new hitbox(offsets[0].jab2.id3,3.906,6,361,60,30,0,1,1,1,1)),
  sidespecial : new hitboxObject(new hitbox(offsets[0].sidespecial.id0,3.906,4,85,25,55,0,1,0,1,1),new hitbox(offsets[0].sidespecial.id1,3.125,4,96,25,55,0,1,0,1,1),new hitbox(offsets[0].sidespecial.id2,3.125,4,80,25,55,0,1,0,1,1),new hitbox(offsets[0].sidespecial.id3,2.344,4,76,25,55,0,1,0,1,1)),
  fsmash : new hitboxObject(new hitbox(offsets[0].fsmash.id0,3.906,14,361,70,60,0,1,1,1,1),new hitbox(offsets[0].fsmash.id1,3.125,14,361,70,60,0,1,1,1,1),new hitbox(offsets[0].fsmash.id2,3.515,14,361,70,60,0,1,1,1,1),new hitbox(offsets[0].fsmash.id3,3.906,20,361,70,80,0,1,1,1,1)),
  upsmash : new hitboxObject(new hitbox(offsets[0].upsmash.id0,4.297,8,70,100,0,100,0,1,1,1),new hitbox(offsets[0].upsmash.id1,4.297,8,70,100,0,100,0,1,1,1),new hitbox(offsets[0].upsmash.id2,4.687,15,90,80,30,0,1,1,1,1),new hitbox(offsets[0].upsmash.id3,4.297,18,90,80,60,0,1,1,1,1)),
  dsmash1 : new hitboxObject(new hitbox(offsets[0].dsmash1.id0,4.297,11,75,72,70,0,1,1,1,1),new hitbox(offsets[0].dsmash1.id1,3.125,11,361,100,20,0,1,1,1,1),new hitbox(offsets[0].dsmash1.id2,3.515,11,361,100,16,0,1,1,1,1),new hitbox(offsets[0].dsmash1.id3,3.906,16,70,100,70,0,1,1,1,1)),
  dsmash2 : new hitboxObject(new hitbox(offsets[0].dsmash2.id0,3.906,11,75,72,70,0,1,1,1,1),new hitbox(offsets[0].dsmash2.id1,3.125,11,361,100,30,0,1,1,1,1),new hitbox(offsets[0].dsmash2.id2,3.515,11,361,100,15,0,1,1,1,1),new hitbox(offsets[0].dsmash2.id3,3.906,16,75,100,70,0,1,1,1,1)),
  grab : new hitboxObject(new hitbox(offsets[0].grab.id0,3.906,0,361,100,0,0,2,3,1,1),new hitbox(offsets[0].grab.id1,3.906,0,361,100,0,0,2,3,1,1),new hitbox(offsets[0].grab.id2,3.906,0,361,100,0,0,2,3,1,1)),
  downattack1 : new hitboxObject(new hitbox(offsets[0].downattack1.id0,5.468,6,361,50,80,0,1,1,1,1),new hitbox(offsets[0].downattack1.id1,3.906,6,361,50,80,0,1,1,1,1),new hitbox(offsets[0].downattack1.id2,3.906,6,361,50,80,0,1,1,1,1),new hitbox(offsets[0].downattack1.id3,4.687,6,361,50,80,0,1,1,1,1)),
  downattack2 : new hitboxObject(new hitbox(offsets[0].downattack2.id0,5.468,6,361,50,80,0,1,1,1,1),new hitbox(offsets[0].downattack2.id1,3.906,6,361,50,80,0,1,1,1,1),new hitbox(offsets[0].downattack2.id2,3.906,6,361,50,80,0,1,1,1,1),new hitbox(offsets[0].downattack2.id3,4.687,6,361,50,80,0,1,1,1,1)),
  pummel : new hitboxObject(new hitbox(offsets[0].pummel.id0,4.687,3,80,100,0,30,0,0,1,1)),
  throwup : new hitboxObject(new hitbox(new Vec2D(5.02334,15.9095),0,4,93,130,60,0,0,0,1,1)),
  throwdown : new hitboxObject(new hitbox(new Vec2D(3.57509,0),0,5,135,50,65,0,0,0,1,1)),
  throwback : new hitboxObject(new hitbox(new Vec2D(-1.29306,0),0,4,117,60,70,0,0,0,1,1)),
  throwforward : new hitboxObject(new hitbox(new Vec2D(7.69851,0),0,4,50,45,70,0,0,0,1,1)),
  thrown : new hitboxObject(new hitbox(offsets[0].thrown.id0,3.906,4,361,50,20,0,1,0,1,1))
};

hitboxes[1] = {
  fair1 : new hitboxObject(new hitbox(offsets[1].fair1.id0,3.515,12,361,100,10,0,0,0,1,1),new hitbox(offsets[1].fair1.id1,4.687,10,361,100,10,0,0,0,1,1)),
  fair2 : new hitboxObject(new hitbox(offsets[1].fair2.id0,3.515,7,361,80,10,0,0,0,1,1),new hitbox(offsets[1].fair2.id1,4.687,7,361,80,10,0,0,0,1,1)),
  bair : new hitboxObject(new hitbox(offsets[1].bair.id0,3.906,12,361,100,10,0,0,0,1,1),new hitbox(offsets[1].bair.id1,3.906,12,361,100,10,0,0,0,1,1),new hitbox(offsets[1].bair.id2,4.297,12,361,100,10,0,0,0,1,1)),
  nair1 : new hitboxObject(new hitbox(offsets[1].nair1.id0,5.078,12,361,70,10,0,0,0,1,1),new hitbox(offsets[1].nair1.id1,3.906,12,361,70,10,0,0,0,1,1)),
  nair2 : new hitboxObject(new hitbox(offsets[1].nair2.id0,4.687,9,361,80,10,0,0,0,1,1),new hitbox(offsets[1].nair2.id1,3.515,9,361,80,10,0,0,0,1,1)),
  dair : new hitboxObject(new hitbox(offsets[1].dair.id0,5.078,2,270,100,20,0,0,0,1,0),new hitbox(offsets[1].dair.id1,4.297,2,270,100,20,0,0,0,1,0),new hitbox(offsets[1].dair.id2,5.078,2,30,100,10,0,0,0,0,1),new hitbox(offsets[1].dair.id3,4.297,2,30,100,10,0,0,0,0,1)),
  upair : new hitboxObject(new hitbox(offsets[1].upair.id0,5.468,12,90,100,30,0,0,0,1,1)),
  upb1 : new hitboxObject(new hitbox(offsets[1].upspecial1.id0,10.937,0,361,100,0,0,5,0,1,0)),
  upb2 : new hitboxObject(new hitbox(offsets[1].upspecial2.id0,10.937,0,361,100,0,0,5,0,1,0)),
  upb3 : new hitboxObject(new hitbox(offsets[1].upspecial3.id0,12.890,0,361,100,0,0,5,0,1,0)),
  dtilt : new hitboxObject(new hitbox(offsets[1].dtilt.id0,3.515,10,20,30,40,0,0,1,1,1),new hitbox(offsets[1].dtilt.id1,3.515,10,20,30,40,0,0,1,1,1),new hitbox(offsets[1].dtilt.id2,3.906,10,20,30,40,0,0,1,1,1)),
  uptilt1 : new hitboxObject(new hitbox(offsets[1].uptilt1.id0,3.125,9,96,120,40,0,0,1,1,1),new hitbox(offsets[1].uptilt1.id1,4.297,9,96,120,40,0,0,1,1,1)),
  uptilt2 : new hitboxObject(new hitbox(offsets[1].uptilt2.id0,3.125,8,88,120,40,0,0,1,1,1),new hitbox(offsets[1].uptilt2.id1,3.515,8,88,120,40,0,0,1,1,1)),
  ftilt : new hitboxObject(new hitbox(offsets[1].ftilt.id0,2.734,10,361,100,8,0,0,1,1,1),new hitbox(offsets[1].ftilt.id1,3.125,10,361,100,8,0,0,1,1,1)),
  dashattack1 : new hitboxObject(new hitbox(offsets[1].dashattack1.id0,4.687,12,361,100,16,0,0,1,1,1)),
  dashattack2 : new hitboxObject(new hitbox(offsets[1].dashattack2.id0,4.687,8,361,100,8,0,0,1,1,1)),
  jab1 : new hitboxObject(new hitbox(offsets[1].jab1.id0,3.515,3,361,50,8,0,0,1,1,1),new hitbox(offsets[1].jab1.id1,3.515,3,361,50,8,0,0,1,1,1),new hitbox(offsets[1].jab1.id2,3.515,3,361,50,8,0,0,1,1,1)),
  jab2 : new hitboxObject(new hitbox(offsets[1].jab2.id0,3.515,3,361,50,16,0,0,1,1,1),new hitbox(offsets[1].jab2.id1,3.515,3,361,50,16,0,0,1,1,1),new hitbox(offsets[1].jab2.id2,3.515,3,361,50,16,0,0,1,1,1)),
  sidespecial : new hitboxObject(new hitbox(offsets[1].sidespecial.id0,3.515,13,90,75,52,0,0,0,1,1),new hitbox(offsets[1].sidespecial.id1,3.515,13,120,75,52,0,0,0,1,1)),
  fsmash1 : new hitboxObject(new hitbox(offsets[1].fsmash1.id0,4.297,17,361,118,10,0,0,1,1,1),new hitbox(offsets[1].fsmash1.id1,4.297,17,361,118,10,0,0,1,1,1)),
  fsmash2 : new hitboxObject(new hitbox(offsets[1].fsmash2.id0,3.515,13,361,105,6,0,0,1,1,1),new hitbox(offsets[1].fsmash2.id1,3.515,13,361,105,6,0,0,1,1,1)),
  upsmash : new hitboxObject(new hitbox(offsets[1].upsmash.id0,5.859,14,90,110,20,0,0,1,1,1),new hitbox(offsets[1].upsmash.id1,3.906,14,90,110,20,0,0,1,1,1)),
  dsmash : new hitboxObject(new hitbox(offsets[1].dsmash.id0,3.906,12,0,66,34,0,0,1,1,1),new hitbox(offsets[1].dsmash.id1,3.906,12,0,66,34,0,0,1,1,1),new hitbox(offsets[1].dsmash.id2,4.687,12,0,66,34,0,0,1,1,1),new hitbox(offsets[1].dsmash.id3,4.687,12,0,66,34,0,0,1,1,1)),
  grab : new hitboxObject(new hitbox(offsets[1].grab.id0,3.906,0,361,100,0,0,2,3,1,1),new hitbox(offsets[1].grab.id1,3.125,0,361,100,0,0,2,3,1,1)),
  downattack1 : new hitboxObject(new hitbox(offsets[1].downattack1.id0,4.687,8,361,50,80,0,0,1,1,1),new hitbox(offsets[1].downattack1.id1,2.344,6,361,50,80,0,0,1,1,1),new hitbox(offsets[1].downattack1.id2,2.344,6,361,50,80,0,0,1,1,1),new hitbox(offsets[1].downattack1.id3,2.344,6,361,50,80,0,0,1,1,1)),
  downattack2 : new hitboxObject(new hitbox(offsets[1].downattack2.id0,4.687,8,361,50,80,0,0,1,1,1),new hitbox(offsets[1].downattack2.id1,2.344,6,361,50,80,0,0,1,1,1),new hitbox(offsets[1].downattack2.id2,2.344,6,361,50,80,0,0,1,1,1),new hitbox(offsets[1].downattack2.id3,2.344,6,361,50,80,0,0,1,1,1)),
  downspecial : new hitboxObject(new hitbox(offsets[1].downspecial.id0,1.953,28,361,120,78,0,3,0,1,1)),
  ledgegetupquick : new hitboxObject(new hitbox(offsets[1].ledgegetupquick.id0,3.906,6,361,100,0,90,0,1,1,1),new hitbox(offsets[1].ledgegetupquick.id1,4.687,6,361,100,0,90,0,1,1,1)),
  ledgegetupslow : new hitboxObject(new hitbox(offsets[1].ledgegetupslow.id0,5.859,6,361,100,0,90,0,1,1,1),new hitbox(offsets[1].ledgegetupslow.id1,5.859,6,361,100,0,90,0,1,1,1)),
  pummel : new hitboxObject(new hitbox(offsets[1].pummel.id0,4.687,3,361,100,0,30,0,0,1,1)),
  throwup : new hitboxObject(new hitbox(new Vec2D(-4.44533,0.66545),0,11,90,25,130,0,0,0,1,1)),
  throwdown : new hitboxObject(new hitbox(new Vec2D(0.56941,0),0,2,80,45,100,0,0,0,1,1)),
  throwdownextra : new hitboxObject(new hitbox(offsets[1].throwdownextra.id0,3.515,1,361,100,0,30,0,0,1,1)),
  throwback : new hitboxObject(new hitbox(new Vec2D(-14.20273+7.52,0),0,10,135,25,90,0,0,0,1,1)),
  throwforward : new hitboxObject(new hitbox(new Vec2D(10.8537,0.01),0,5,55,30,100,0,0,0,1,1)),
  throwforwardextra : new hitboxObject(new hitbox(offsets[1].throwforwardextra.id0,8.593,7,361,110,40,0,0,0,1,1)),
  thrown : new hitboxObject(new hitbox(offsets[1].thrown.id0,3.906,4,361,50,20,0,1,0,1,1))
}

hitboxes[2] = {
  sidespecial : new hitboxObject(new hitbox(offsets[1].sidespecial.id0,3.515,13,90,75,52,0,0,0,1,1),new hitbox(offsets[1].sidespecial.id1,3.515,13,120,75,52,0,0,0,1,1)),
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
  ledgegetupquick : new hitboxObject(new hitbox(offsets[2].ledgegetupquick.id0,4.687,8,361,100,0,90,0,1,1,1),new hitbox(offsets[2].ledgegetupquick.id1,4.687,8,361,100,0,90,0,1,1,1),new hitbox(offsets[2].ledgegetupquick.id2,4.687,8,361,100,0,90,0,1,1,1)),
  ledgegetupslow : new hitboxObject(new hitbox(offsets[2].ledgegetupslow.id0,3.125,8,361,100,0,90,0,1,1,1),new hitbox(offsets[2].ledgegetupslow.id1,4.687,8,361,100,0,90,0,1,1,1),new hitbox(offsets[2].ledgegetupslow.id2,4.687,8,361,100,0,90,0,1,1,1)),
  pummel : new hitboxObject(new hitbox(offsets[2].pummel.id0,5.859,3,361,100,0,30,0,0,1,1)),
  throwup : new hitboxObject(new hitbox(new Vec2D(-4.44533,0.66545),0,2,90,110,75,0,0,0,1,1)),
  throwdown : new hitboxObject(new hitbox(new Vec2D(0.56941,0),0,1,270,40,150,0,0,0,1,1)),
  throwback : new hitboxObject(new hitbox(new Vec2D(-14.20273+7.52,0),0,2,124,85,80,0,0,0,1,1)),
  throwforward : new hitboxObject(new hitbox(new Vec2D(10.8537,0.01),0,3,45,130,35,0,0,0,1,1)),
  throwforwardextra : new hitboxObject(new hitbox(offsets[2].throwforwardextra.id0,8.593,7,361,110,40,0,0,0,1,1)),
  thrown : new hitboxObject(new hitbox(offsets[2].thrown.id0,3.906,4,361,50,20,0,1,0,1,1))
}


for (var l=0;l<20;l++){
  offsets[0].thrown.id0.push(new Vec2D(0,12));
  offsets[1].thrown.id0.push(new Vec2D(0,12));
  offsets[2].thrown.id0.push(new Vec2D(0,12));
}

chars = [
   new charObject(0),
   new charObject(1),
   new charObject(2)
];
/*
char id:
0 - marth
1 - jiggs
*/
