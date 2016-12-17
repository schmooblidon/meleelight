import {player} from "../../main/main";
export function puffMultiJumpDrift(p, input) {
  let tempMax;
  if (Math.abs(input[p][0].lsX) < 0.3) {
    tempMax = 0;
  }
  else {
    tempMax = 1.08 * input[p][0].lsX;
  }

  if ((tempMax < 0 && player[p].phys.cVel.x < tempMax) || (tempMax > 0 && player[p].phys.cVel.x > tempMax)) {
    if (player[p].phys.cVel.x > 0) {
      player[p].phys.cVel.x -= player[p].charAttributes.airFriction;
      if (player[p].phys.cVel.x < 0) {
        player[p].phys.cVel.x = 0;
      }
    }
    else {
      player[p].phys.cVel.x += player[p].charAttributes.airFriction;
      if (player[p].phys.cVel.x > 0) {
        player[p].phys.cVel.x = 0;
      }
    }
  }
  else if (Math.abs(input[p][0].lsX) > 0.3 && ((tempMax < 0 && player[p].phys.cVel.x > tempMax) || (tempMax > 0 && player[p].phys.cVel.x < tempMax))) {
    player[p].phys.cVel.x += (0.072 * input[p][0].lsX);
  }


  if (Math.abs(input[p][0].lsX) < 0.3) {
    if (player[p].phys.cVel.x > 0) {
      player[p].phys.cVel.x -= player[p].charAttributes.airFriction;
      if (player[p].phys.cVel.x < 0) {
        player[p].phys.cVel.x = 0;
      }
    }
    else {
      player[p].phys.cVel.x += player[p].charAttributes.airFriction;
      if (player[p].phys.cVel.x > 0) {
        player[p].phys.cVel.x = 0;
      }
    }
  }
}
