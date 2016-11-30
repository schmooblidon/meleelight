/* eslint-disable */
export const CHARIDS = {
    MARTH_ID : 0,
    PUFF_ID : 1,
    FOX_ID : 2
};


export function Vec2D(x, y) {
  this.x = x;
  this.y = y;
  this.dot = function (vector) {
    return this.x * vector.x + this.y * vector.y;
  }
}
export function Segment2D(x, y, vecx, vecy) {
  this.x = x;
  this.y = y;
  this.vecx = vecx;
  this.vecy = vecy;
  this.segLength = function() {
    var dx = this.vecx;
    var dy = this.vecy;
    return Math.sqrt(dx * dx + dy * dy);
  }
  this.project = function(seg_onto) {
    var vec = new Vec2D(this.vecx, this.vecy);
    var onto = new Vec2D(seg_onto.vecx, seg_onto.vecy);
    var d = onto.dot(onto);
    if (0 < d) {
      var dp = vec.dot(onto);
      var multiplier = dp / d;
      var rx = onto.x * multiplier;
      var ry = onto.y * multiplier;
      return new Vec2D(rx, ry);
    }
    return new Vec2D(0, 0);
  }
}
export function Box2D(min, max) {
  this.min = new Vec2D(min[0], min[1]);
  this.max = new Vec2D(max[0], max[1]);
}
export const offsets = [];
export function setOffsets(charId,val){
  offsets[charId] = val;
}
export const charAttributes = [];
export function setCharAttributes(charId,val){
  charAttributes[charId] = val;
}
export const intangibility = [];
export function setIntangibility(charId,val){
  intangibility[charId] =val;
}
export const framesData = [];
export function setFrames(charId,val){
  framesData[charId] = val;
}
export const actionSounds = [];
export function setActionSounds(charId,val){
  actionSounds[charId] =val;
}

export function charObject(num) {
  this.attributes = charAttributes[num];
  this.animations = 0;
  this.hitboxes = hitboxes[num];
}
export function createHitboxObject(id0, id1, id2, id3) {
  this.id0 = id0;
  this.id1 = id1;
  this.id2 = id2;
  this.id3 = id3;
}
export function createHitbox(offset, size, dmg, angle, kg, bk, sk, type, clank, hG, hA) {
  this.offset = offset;
  this.size = size;
  this.dmg = dmg;
  this.angle = angle;
  this.kg = kg;
  this.bk = bk;
  this.sk = sk;
  this.type = type;
  // 0:normal , 1:slash ,2:grab , 3:fire , 4:eletric , 5:sleep, 6:reactOnClank, 7:reflect
  this.clank = clank;
  this.hitGrounded = hG;
  this.hitAirborne = hA;
}
export const hitboxes = [];
export function setHitBoxes(index,val){
    hitboxes[index] = val;
}
export let chars = [];
export function setChars(index,val){
  chars[index] = val;
}

/*
 char id:
 0 - marth
 1 - jiggs
 2 - fox
 */
