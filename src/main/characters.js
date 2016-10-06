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
charAttributes = [];

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
}

hitboxes = [];

chars = [];

/*
char id:
0 - marth
1 - jiggs
2 - fox
*/
