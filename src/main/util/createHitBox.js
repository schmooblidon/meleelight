
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
