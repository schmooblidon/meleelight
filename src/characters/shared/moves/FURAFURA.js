export default {
  name : "FURAFURA",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "FURAFURA";
    player[p].timer = 0;
    player[p].phys.stuckTimer = 490;
    drawVfx("furaFura",new Vec2D(player[p].phys.pos.x+(4+Math.random()*2)*player[p].phys.face,player[p].phys.pos.y+11+Math.random()*3),player[p].phys.face);
    player[p].furaLoopID = sounds.furaloop.play();
    aS[cS[p]].FURAFURA.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].FURAFURA.interrupt(p)){
      if (player[p].timer % 100 == 65){
        sounds[actionSounds[cS[p]].FURAFURA[0][1]].play();
      }
      reduceByTraction(p,true);
      if (player[p].timer % 49 == 0){
        drawVfx("furaFura",new Vec2D(player[p].phys.pos.x+(3+Math.random()*2)*player[p].phys.face,player[p].phys.pos.y+11+Math.random()*3),player[p].phys.face);
      }
      if (player[p].timer % 49 == 20){
        drawVfx("furaFura",new Vec2D(player[p].phys.pos.x+(5+Math.random()*2)*player[p].phys.face,player[p].phys.pos.y+8+Math.random()*3),player[p].phys.face);
      }
      if (player[p].phys.shieldHP > 30){
        player[p].phys.shieldHP = 30;
      }
      player[p].phys.stuckTimer--;
      if (mashOut(p)){
        player[p].phys.stuckTimer -= 3;
      }
    }
  },
  interrupt : function(p){
    if (player[p].phys.stuckTimer <= 0){
      sounds.furaloop.stop(player[p].furaLoopID);
      aS[cS[p]].WAIT.init(p);
      return true;
    }
    else if (player[p].timer > frames[cS[p]].FURAFURA){
      player[p].timer = 1;
      return false;
    }
    else {
      return false;
    }
  }
};

