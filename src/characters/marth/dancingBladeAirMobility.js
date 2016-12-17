import {player} from "../../main/main";

export const dancingBladeAirMobility = function(p){
  player[p].phys.cVel.y -= 0.06;
  if (player[p].phys.cVel.y < -1.5){
    player[p].phys.cVel.y = -1.5;
  }
  if (player[p].phys.cVel.x > 0){
    player[p].phys.cVel.x -= 0.0025;
    if (player[p].phys.cVel.x < 0){
      player[p].phys.cVel.x = 0;
    }
  }
  else {
    player[p].phys.cVel.x += 0.0025;
    if (player[p].phys.cVel.x > 0){
      player[p].phys.cVel.x = 0;
    }
  }
};