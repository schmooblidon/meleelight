import {vfxQueue} from "main/vfx/vfxQueue";
import {sounds} from "main/sfx";
import {fg2, getStartTimer} from "main/main";
import {makeColour} from "main/vfx/makeColour";
export default(j)=> {
  // hack method to ensure sounds are played in 30fps mode
  // index 3 and 5 are unoccupied so i've made them say if the sound has played
  if (vfxQueue[j][3] === undefined) {
    sounds.ready.play();
    vfxQueue[j][3] = true;
  }
  if (vfxQueue[j][1] >= 90) {
    if (vfxQueue[j][5] === undefined) {
      sounds.go.play();
      vfxQueue[j][5] = true;
    }
  }
  if (vfxQueue[j][1] < 90) {
    let textGrad = fg2.createLinearGradient(0, 200, 0, 500);
    textGrad.addColorStop(0, "rgb(255, 51, 51)");
    textGrad.addColorStop(0.6, "rgb(255, 51, 51)");
    textGrad.addColorStop(1, "rgb(121, 0, 0)");
    fg2.save();
    fg2.fillStyle = textGrad;
    fg2.textAlign = "start";
    fg2.lineWidth = 20;
    fg2.strokeStyle = "black";
    fg2.font = "italic 900 200px Arial";
    fg2.strokeText("Ready", 240, 420);
    fg2.lineWidth = 10;
    fg2.strokeStyle = "white";
    fg2.strokeText("Ready", 240, 420);
    fg2.fillText("Ready", 240, 420);
    fg2.fillStyle = "rgb(" + Math.round(vfxQueue[j][1] * 2.6) + "," + Math.round(140 - (vfxQueue[j][1] * 1.5)) +
        "," + Math.round(255 - (vfxQueue[j][1] * 2.6)) + ")";
    fg2.font = "italic 700 70px Arial";
    const milli = ((getStartTimer() * 2) % 1).toFixed(2);
    fg2.strokeStyle = "black";
    fg2.strokeText(Math.floor(getStartTimer() * 2) + " " + milli[2] + milli[3], 900, 500);
    fg2.fillText(Math.floor(getStartTimer() * 2) + " " + milli[2] + milli[3], 900, 500);
    fg2.fillStyle = makeColour(255, 0, 0, 0.2);
    fg2.fillRect(240, 450, 520, 15);
    textGrad = fg2.createLinearGradient(240 + (500 * (vfxQueue[j][1] / 90)), 450, 760 + (500 * (vfxQueue[j][1] /
        90)), 465);
    textGrad.addColorStop(0, "#ff0000");
    textGrad.addColorStop(0.16, "#ff00ff");
    textGrad.addColorStop(0.33, "#0000ff");
    textGrad.addColorStop(0.49, "#00ffff");
    textGrad.addColorStop(0.66, "#00ff00");
    textGrad.addColorStop(0.83, "#ffff00");
    textGrad.addColorStop(1, "#ff0000");
    fg2.fillStyle = textGrad;
    fg2.fillRect(240 + (500 * (vfxQueue[j][1] / 90)), 450, 520 - (500 * (vfxQueue[j][1] / 90)), 15);
    fg2.restore();
  } else {
    const textGrad = fg2.createLinearGradient(0, 200, 0, 480);
    textGrad.addColorStop(0, "black");
    textGrad.addColorStop(0.6, "black");
    textGrad.addColorStop(1, "rgb(221, 145, 57)");
    fg2.save();
    fg2.fillStyle = textGrad;
    fg2.textAlign = "start";
    fg2.lineWidth = 40;
    fg2.strokeStyle = "black";
    fg2.font = "900 400px Arial";
    fg2.strokeText("Go!", 240, 470);
    fg2.lineWidth = 20;
    fg2.strokeStyle = "white";
    fg2.strokeText("Go!", 240, 470);
    fg2.fillText("Go!", 240, 470);
    fg2.restore();
  }
};