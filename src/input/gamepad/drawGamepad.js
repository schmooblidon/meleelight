// @flow

import {fg2} from "../../main/main";
import {Vec2D} from "../../main/util/Vec2D";
import {nullInput} from "../input";

// eslint-disable-next-line no-duplicate-imports
import type {Input} from "../input";

// controller colours
export type ControllerColour = "purple" | "orange" | "black" | "white" | "red" | "blue" | "green";
type Swatch = { light : string, medium : string, dark : string, fade : [string, string, string, string] };
const swatches = {  purple : { light: "#503e8aff", medium: "#48387dff", dark:"#362a5eff", fade : ["#312656ff", "#5a50b1ff", "#665db7ff", "#7169bcff"] }
                 ,  orange : { light: "#d69a1fff", medium: "#cd9005ff", dark:"#876114ff", fade : ["#cd9005ff", "#aa7704ff", "#b88104ff", "#c38905ff"] }
                 ,  black  : { light: "#2b2b2bff", medium: "#3f3f3fff", dark:"#000000ff", fade : ["#717171ff", "#595959ff", "#6e6e6eff", "#8d8d8dff"] }
                 ,  white  : { light: "#f4f4f4ff", medium: "#e1e1e1ff", dark:"#5e5e5eff", fade : ["#717171ff", "#595959ff", "#6e6e6eff", "#8d8d8dff"] }
                 ,  red    : { light: "#b41e1eff", medium: "#a11212ff", dark:"#7e0e0eff", fade : ["#650b0bff", "#7d0e0eff", "#8a0f0fff", "#921010ff"] }
                 ,  blue   : { light: "#293061ff", medium: "#374080ff", dark:"#293061ff", fade : ["#3f3f3fff", "#4b64b7ff", "#5a6dbdff", "#6577c3ff"] }
                 ,  green  : { light: "#63b11aff", medium: "#5c9e1fff", dark:"#375815ff", fade : ["#416d14ff", "#4c7f17ff", "#548d1aff", "#5d9b1cff"] }
                 };

// fixed colours
const grey = "#cdcdcdff";
const midGrey = "#b0b0b0ff";
const darkGrey = "#919191ff";
const aColour = "#29a9a1ff";
const darkAColour = "#1c736dff";
const bColour = "#e73148ff";
const darkBColour = "#9a1223ff";
const zColour = "#4e40b5ff";
const darkZColour = "#3b3280ff";
const cColour = "#e7c518ff";
const darkCColour = "#b68e0bff";

const strokeWidth = 4;

// path information
const baseShape = "m 616.63658,582.96965 c 14.40804,41.89003 64.08591,49.66889 83.87203,-10.63167 12.40361,-37.80148 21.66045,-84.61353 5.31583,-279.96718 C 689.93825,102.49642 359.90089,104.24938 359.90089,104.24938 c 0,0 -330.03737,-1.75296 -345.92356,188.12142 -16.34462,195.35365 -7.08778,242.1657 5.31583,279.96718 19.78612,60.30056 69.46399,52.5217 83.87203,10.63167 31.89499,-92.73175 -2.95325,-245.7096 256.7357,-246.8909 259.68894,1.1813 224.8407,154.15915 256.73569,246.8909 z";
const leftLobe = "m 276.4973,295.41336 c -2.76465,-71.45188 -57.96655,-129.4719 -129.4719,-129.47189 -71.50535,0 -129.47189,57.96654 -129.47189,129.47189 0,71.50535 49.58485,115.69615 98.14963,126.05033 30.39146,6.47956 36.32601,27.52071 40.39654,44.2119 10.04435,41.18684 40.81253,75.41679 92.25025,75.41679 51.43772,0 92.40239,-41.70374 93.13623,-93.13623 0.59065,-41.3967 -12.76165,-55.54833 -41.1592,-86.04845 -21.07174,-22.63192 -23.17545,-49.58634 -23.82966,-66.49434 z";
const rightLobe = "m 443.30447,295.41336 c 2.76465,-71.45188 57.96655,-129.4719 129.4719,-129.47189 71.50535,0 129.47189,57.96654 129.47189,129.47189 0,71.50535 -49.58485,115.69615 -98.14963,126.05033 -30.39146,6.47956 -36.32601,27.52071 -40.39654,44.2119 -10.04435,41.18684 -40.81253,75.41679 -92.25025,75.41679 -51.43772,0 -92.40239,-41.70374 -93.13623,-93.13623 -0.59065,-41.3967 12.76165,-55.54833 41.1592,-86.04845 21.07174,-22.63192 23.17545,-49.58634 23.82966,-66.49434 z";
const aButton = { radius : 41.556301, center : new Vec2D (572.59851,295.63635) };
const bButton = { radius : 25.7679, center : new Vec2D (491.51929,336.27927) };
const xButton = "m 632.6395,259.11017 c -0.92165,-4.68776 1.28721,-14.64996 16.42393,-16.97602 15.08404,-2.31779 24.21634,21.70988 26.6596,36.45621 2.44321,14.74674 1.54812,40.43557 -13.47738,43.1063 -15.07801,2.68006 -20.38184,-6.03735 -21.02142,-10.77189 -0.63945,-4.73462 2.49739,-10.65173 -0.1441,-26.59469 -2.64148,-15.94303 -7.51897,-20.53216 -8.44063,-25.21991 z";
const yButton = "m 526.01197,243.45415 c -4.46112,1.70967 -14.65431,1.23681 -19.53443,-13.2792 -4.86298,-14.46541 17.2492,-27.57193 31.36056,-32.5008 14.11176,-4.92886 39.57529,-8.43958 44.776,5.90791 5.21888,14.39766 -2.46321,21.11397 -7.01864,22.55366 -4.55554,1.43968 -10.9219,-0.63912 -26.17834,4.68964 -15.25655,5.32876 -18.94404,10.91915 -23.40515,12.62879 z";
const startButton = { radius : 16.079573, center : new Vec2D (359.90088,294.66632) };
const lTrigger = "M 184.51437,131.09074 C 130.21971,82.852018 62.3217,132.65746 63.25399,194.92407 Z";
const rTrigger = "m 535.2874,131.09074 c 54.29466,-48.238722 122.19267,1.56672 121.26038,63.83333 z";
const zUnpressed = "m 524.67323,133.45493 4.354,-6.18763 c 55.81061,-5.247 95.32054,15.29986 122.95771,37.34506 l -17.09925,21.58268 z";
const zPressed = "m 524.67323,133.45493 4.354,-6.18763 c 55.81061,-5.247 91.32054,22.29986 117.70771,45.34506 l -11.84925,13.58268 z";
const lsOctagon = "m 80.226121,297.63988 18.074647,-43.63607 43.636062,-18.07465 43.63606,18.07465 18.07465,43.63606 -18.07464,43.63607 -43.63607,18.07465 -43.636058,-18.07465 z";
const csOctagon = "m 416.07682,448.25513 16.69067,-40.29485 40.29485,-16.69068 40.29486,16.69067 16.69067,40.29485 -16.69067,40.29486 -40.29485,16.69067 -40.29485,-16.69067 z";
const lStick = { radius : 43.773998, center : new Vec2D (141.93683,297.63986) };
const cStick = { radius : 25.7679, center : new Vec2D (473.06235,448.25513) };
const dPadShape = "m 202.81348,436.56071 32.36779,0.0403 -0.0403,-32.36779 23.38883,0 -0.0403,32.3678 32.36778,-0.0403 0,23.38884 -32.36778,-0.0403 0.0403,32.36778 -23.38883,0 0.0403,-32.36778 -32.36778,0.0403 z";
const dPadInset = { radius : 56.422726, center : new Vec2D (246.83537,448.25513) };
const dPadDisk = { radius : 11.875, center : new Vec2D (246.83537,448.25513) };
const dPadUp = "m 246.83538,409.4543 7.89066,13.44202 -15.78133,0 z";
const dPadDown = "m 246.83538,487.05596 -7.89066,-13.44202 15.78133,0 z";
const dPadLeft = "m 208.03455,448.25513 13.44202,-7.89066 0,15.78133 z";
const dPadRight = "m 285.63621,448.25513 -13.44202,7.89066 0,-15.78133 z";

// button/stick/trigger movement constants
const lsXScale = 20;
const lsYScale = -20;
const csXScale = 10;
const csYScale = -10;
const triggerScale = -10;
const buttonOffset = -5;

export function drawGCController( colour : ControllerColour, maybeInput : ?Input ) : void {

  const base = swatches[colour].light;
  const mediumBase = swatches[colour].medium;
  const darkBase = swatches[colour].dark;

  let input = maybeInput;
  if (maybeInput === null || maybeInput === undefined) {
    input = nullInput();
  }
  drawSVGPath(rTrigger, input.r ? midGrey : grey, strokeWidth, darkGrey, new Vec2D( 0, triggerScale*input.rA));
  drawSVGPath(lTrigger, input.l ? midGrey : grey, strokeWidth, darkGrey, new Vec2D( 0, triggerScale*input.lA));
  drawSVGPath(input.z ? zPressed : zUnpressed, input.z ? darkZColour : zColour, strokeWidth, darkZColour, null);

  drawGCControllerBase();

  // left analog stick
  fg2.beginPath();
  fg2.arc(lStick.center.x + lsXScale * input.lsX, lStick.center.y + lsYScale * input.lsY, lStick.radius, 0, 2 * Math.PI, false);
  fg2.fillStyle = grey;
  fg2.fill();

  // c-stick
  fg2.beginPath();
  fg2.arc(cStick.center.x + csXScale * input.csX, cStick.center.y + csYScale * input.csY, cStick.radius, 0, 2 * Math.PI, false);
  fg2.fillStyle = cColour;
  fg2.fill();
  fg2.strokeStyle = darkCColour;
  fg2.lineWidth = strokeWidth;
  fg2.stroke();

  // A button
  fg2.beginPath();
  fg2.arc(aButton.center.x, aButton.center.y + (input.a? buttonOffset : 0), aButton.radius, 0, 2 * Math.PI, false);
  fg2.fillStyle = input.a ? darkAColour : aColour;
  fg2.fill();

  // B button
  fg2.beginPath();
  fg2.arc(bButton.center.x, bButton.center.y + (input.b? buttonOffset : 0), bButton.radius, 0, 2 * Math.PI, false);
  fg2.fillStyle = input.b ? darkBColour : bColour;
  fg2.fill();

  drawSVGPath(xButton, input.x ? midGrey : grey, null, null, new Vec2D( 0, input.x ? buttonOffset : 0));
  drawSVGPath(yButton, input.y ? midGrey : grey, null, null, new Vec2D( 0, input.y ? buttonOffset : 0));

  // start button
  fg2.beginPath();
  fg2.arc(startButton.center.x, startButton.center.y + (input.s ? buttonOffset : 0), startButton.radius, 0, 2 * Math.PI, false);
  fg2.fillStyle = input.s ? midGrey : grey;
  fg2.fill();

  drawSVGPath(dPadShape, grey, strokeWidth, grey, null);

  // d-pad center disk
  fg2.beginPath();
  fg2.arc(dPadDisk.center.x, dPadDisk.center.y, dPadDisk.radius, 0, 2 * Math.PI, false);
  fg2.fillStyle = darkGrey;
  fg2.fill();

  // d-pad arrows
  drawSVGPath(dPadUp, input.du ? darkGrey : midGrey, strokeWidth, midGrey, null);
  drawSVGPath(dPadDown, input.dd ? darkGrey : midGrey, strokeWidth, midGrey, null);
  drawSVGPath(dPadLeft, input.dl ? darkGrey : midGrey, strokeWidth, midGrey, null);
  drawSVGPath(dPadRight, input.dr ? darkGrey : midGrey, strokeWidth, midGrey, null);
}

function drawGCControllerBase () : void {
  let svgPaths = "";
  svgPaths += makeIntoSVGPath(baseShape, base, strokeWidth, darkBase);
  svgPaths += makeIntoSVGPath(leftLobe, base, strokeWidth, darkBase);
  svgPaths += makeIntoSVGPath(rightLobe, base, strokeWidth, darkBase);
  svgPaths += makeIntoSVGPath(lsOctagon, darkGrey, strokeWidth, darkBase);
  svgPaths += makeIntoSVGPath(csOctagon, cColour, strokeWidth, darkBasz);

  drawSVGPaths(svgPaths, null);

  // d-pad inset
  fg2.beginPath();
  fg2.arc(dPadInset.center.x, dPadInset.center.y, dPadInset.radius, 0, 2 * Math.PI, false);
  fg2.fillStyle = mediumBase;
  fg2.fill();

};


function makeIntoSVGPath ( path : string, fillColour : string, stroke : ?number, strokeColour : ?string) : string {
  let strokeStyle = "";
  if (stroke !== null && stroke !== undefined && strokeColour !== null && strokeColour !== undefined) {
    strokeStyle = "stroke:"+strokeColour.substring(0,7)+";stroke-width:"+stroke+";stroke-linecap:round;stroke-linejoin:round;";
  }
  const style = "opacity:1;fill:"+fillColour.substring(0,7)+";fill-rule=evenodd;fill-opacity:1;"+strokeStyle+"";
  return "<path style=\x22"+style+"\x22 d=\x22"+path+"\x22 />";
}


function drawSVGPaths( svgPaths : string, offset : ?Vec2D ) : void {
  const svg = "<svg xmlns=\x22http://www.w3.org/2000/svg\x22 width=\x22720\x22 height=\x22720\x22 viewBox=\x220 0 720 720\x22> "+svgPaths+" </svg>";
  const image = new Image();
  const svgBlob = new Blob([svg], {type : 'image/svg+xml'});
  const DOMURL = window.URL || window.webkitURL || window;
  const url = DOMURL.createObjectURL(svgBlob);
  image.src = url;

  if (offset === null || offset === undefined) {
    fg2.drawImage(image, 0, 0);
  }
  else {
    fg2.drawImage(image, offset.x, offset.y);
  }
}

function drawSVGPath( path : string, fillColour : string, stroke : ?number, strokeColour : ?string, offset : ?Vec2D ) : void {
  const svgPath = makeIntoSVGPath(path, fillColour, stroke, strokeColour);
  drawSVGPaths(svgPath, offset);
}