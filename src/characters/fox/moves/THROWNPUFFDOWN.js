/* globals player, Vec2D */

export default {
  name : "THROWNPUFFDOWN",
  canEdgeCancel : false,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-10.26,0.98],[-7.67,-0.31],[-4.94,-1.56],[-3.10,-2.50],[-0.94,-3.59],[-0.90,-3.57],[-1.00,-3.52],[-1.01,-3.56],[-0.94,-3.62],[-0.97,-3.60],[-1.02,-3.58],[-1.04,-3.56],[-1.00,-3.57],[-0.93,-3.58],[-0.91,-3.61],[-0.92,-3.64],[-0.91,-3.63],[-0.92,-3.60],[-0.92,-3.57],[-0.97,-3.57],[-1.00,-3.59],[-0.98,-3.62],[-0.96,-3.62],[-0.92,-3.59],[-0.89,-3.55],[-0.91,-3.54],[-0.96,-3.57],[-0.95,-3.62],[-0.93,-3.67],[-0.93,-3.65],[-0.95,-3.58],[-0.89,-3.52],[-0.84,-3.53],[-0.89,-3.59],[-0.94,-3.60],[-0.96,-3.59],[-0.96,-3.56],[-0.90,-3.54],[-0.86,-3.58],[-0.88,-3.63],[-0.88,-3.61],[-0.90,-3.58],[-0.92,-3.56],[-0.97,-3.56],[-1.00,-3.58],[-1.00,-3.62],[-0.98,-3.63],[-0.94,-3.60],[-0.91,-3.55],[-0.94,-3.53],[-0.99,-3.55],[-0.98,-3.59],[-0.98,-3.62],[-0.96,-3.61],[-0.95,-3.58],[-0.91,-3.53],[-0.90,-3.53],[-0.94,-3.59],[-0.93,-3.61],[-0.90,-3.65],[-0.93,-3.64],[-0.98,-3.62],[-0.98,-3.62]],
  init : function(p){
    player[p].actionState = "THROWNPUFFDOWN";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;

    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!this.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+this.offset[player[p].timer-1][0]*player[p].phys.face,player[player[p].phys.grabbedBy].phys.pos.y+this.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
};
