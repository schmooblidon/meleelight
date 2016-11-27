/* globals player, Vec2D */

export default {
  name : "THROWNFOXDOWN",
  canEdgeCancel : false,
  reverseModel : true,
  canGrabLedge : [false,false],
  canBeGrabbed : false,
  ignoreCollision : true,
  offset : [[-4.73,-1.04],[-2.33,-2.27],[-1.90,-2.37],[-1.84,-2.24],[-1.84,-1.78],[-1.98,0.41],[-1.04,3.44],[-0.05,4.15],[0.82,4.32],[1.03,4.03],[1.07,3.56],[1.07,3.82],[1.07,4.00],[0.85,4.14],[-0.45,6.59],[-0.78,-4.04],[-0.82,-4.75],[-0.81,-3.89],[-0.78,-3.11],[-0.72,-3.45],[-0.65,-4.18],[-0.57,-4.29],[-0.50,-2.78],[-0.50,-5.04],[-0.50,-4.74],[-0.50,-4.44],[-0.50,-4.15],[-0.50,-3.88],[-0.50,-3.63],[-0.50,-3.40],[-0.50,-3.20],[-0.50,-3.04],[-0.50,-3.04]],
  init : function(p){
    player[p].actionState = "THROWNFOXDOWN";
    if (player[p].phys.grabbedBy < p){
      player[p].timer = -1;
    }
    else {
      player[p].timer = 0;
    }
    player[p].phys.grounded = false;
    player[p].phys.face *= -1;
    player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x,player[player[p].phys.grabbedBy].phys.pos.y);
    this.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!this.interrupt(p)){
      if (player[p].timer > 0){
        player[p].phys.pos = new Vec2D(player[player[p].phys.grabbedBy].phys.pos.x+this.offset[player[p].timer-1][0]*player[p].phys.face*-1,player[player[p].phys.grabbedBy].phys.pos.y+this.offset[player[p].timer-1][1]);
      }
    }
  },
  interrupt : function(p){
    return false;
  }
};
