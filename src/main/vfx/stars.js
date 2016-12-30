import {randomAnnulusPoint} from "../util/randomAnnulusPoint";
import {drawStar} from "./drawStar";

export function stars(tX, tY, rMin, rMax, m, theta, n, minSpread, maxSpread) {
  
  for (let i = 0; i < n; i++) {
    const [deltaX, deltaY] = randomAnnulusPoint(0, 0, minSpread, maxSpread);
    drawStar(tX + deltaX, tY + deltaY, rMin, rMax, m, theta );
  }
 
}
