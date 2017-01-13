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
                 ,  green  : { light: "#63b11aff", medium: "#5c9e1fff", dark:"#375815ff", fade : ["#416d14ff", "#4c7f17ff", "#548d1aff", "#5d9b1cff"] } };

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
const marth = "m 335.88416,178.50859 c 0,0 7.33285,-5.23102 7.33285,-5.23102 1.94105,-1.69793 0.82348,-3.11352 4.82321,-4.43892 0,0 3.26253,4.70556 3.26253,4.70556 0,0 2.22732,3.92132 2.22732,3.92132 0.0941,-1.047 0.16861,-1.75675 0.59995,-2.74493 1.45481,-3.33311 4.62715,-3.93306 7.6348,-2.21161 1.18031,0.67839 1.55676,1.20777 2.51748,2.03908 0.78034,0.67054 1.94497,1.30188 2.3567,2.25083 0.79995,1.86262 -0.16077,4.83105 -0.95287,6.54859 4.07032,0.98818 6.329,-0.30586 11.76393,1.07052 2.45866,0.62349 3.84681,0.38821 4.31344,3.24292 1.56069,-2.19593 1.07445,-2.84295 1.85871,-3.7527 1.63518,-1.90183 3.14097,-0.51369 3.63113,1.39992 0,0 -2.35279,0 -2.35279,0 1.09405,2.32925 3.1488,2.32533 5.48983,2.35278 0,0 17.25376,1.1764 17.25376,1.1764 2.65865,0.004 6.39173,0.44703 8.62688,1.96066 0,0 -5.0977,0.63916 -5.0977,0.63916 0,0 -14.50885,-0.67446 -14.50885,-0.67446 0,0 -4.70557,-0.35684 -4.70557,-0.35684 0,0 -6.10939,0.39997 -6.10939,0.39997 0,0 -0.94896,1.56069 -0.94896,1.56069 0,0 2.35279,0 2.35279,0 0,0 -0.70976,1.05483 -0.70976,1.05483 -0.46271,0.49409 -0.93327,0.78034 -1.62342,0.80387 -2.13319,0.0706 -2.02732,-2.38024 -2.50964,-3.38409 -0.34115,-0.70191 -0.52154,-0.73721 -1.03915,-1.21953 0,0 0,0.78426 0,0.78426 -3.53701,-0.36076 -3.09783,-0.96072 -4.72126,-1.16462 -1.31363,-0.16471 -2.21553,0.34899 -3.51349,0 -1.38423,-0.36469 -2.19985,-1.38815 -4.93301,-1.65088 -2.52532,-0.24312 -3.67427,0.58427 -5.2624,0.7176 0,0 -3.52918,0 -3.52918,0 -4.60362,0.2392 -4.35266,1.196 -7.84263,4.05856 0,0 1.56853,0.39213 1.56853,0.39213 0,0 -0.78426,1.56852 -0.78426,1.56852 2.27436,0.78819 6.11725,4.15659 7.22698,6.2741 0.77642,1.48225 0.97641,3.68211 -0.61957,4.71341 -0.68231,0.43919 -1.88223,0.62349 -2.6861,0.77642 0,0 0.9568,9.80328 0.9568,9.80328 0,0 1.00386,5.48984 1.00386,5.48984 0,0 3.92131,0.99601 3.92131,0.99601 2.63904,0.59604 3.70172,-0.75681 4.70557,2.53317 0,0 -4.70557,1.56068 -4.70557,1.56068 0,0 -3.02725,0.69799 -3.02725,0.69799 -1.28619,0.45488 -3.70172,1.58813 -5.05458,1.03131 -1.30971,-0.54114 -2.34102,-3.937 -2.60766,-5.25064 0,0 -1.00387,-4.70557 -1.00387,-4.70557 0,0 0,-3.36448 0,-3.36448 0,0 -0.3882,-2.12927 -0.3882,-2.12927 -0.16078,-1.35286 0.0706,-2.60767 -0.47056,-3.9174 -1.34501,-3.26253 -2.8704,-1.18423 -5.09379,-2.74492 0,0 -1.8587,7.39559 -1.8587,7.39559 0,0 -1.67047,1.2313 -1.67047,1.2313 -1.97243,-3.60369 -1.59598,-4.59186 -2.1881,-8.23475 -0.48624,-2.99196 -1.58812,-4.286 1.79597,-5.88197 0,0 -0.39214,-1.56852 -0.39214,-1.56852 -2.59591,1.49402 -7.2505,5.23495 -9.80328,7.22305 -3.14096,2.4469 -3.71347,3.71741 -7.84261,3.75662 0.5529,-3.31743 2.25475,-4.04288 4.70557,-6.04667 0,0 10.8738,-8.96803 10.8738,-8.96803 1.0509,-1.15287 1.29402,-2.43906 1.94889,-3.80759 0,0 3.13704,-7.84263 3.13704,-7.84263 0.4588,-2.0979 -0.33723,-1.50578 0.9019,-5.48983 0,0 -7.05836,5.0977 -7.05836,5.0977 0,0 1.1764,1.56852 1.1764,1.56852 0,0 -4.1213,-2.18809 -4.1213,-2.18809 0,0 -2.93707,1.0117 -2.93707,1.0117 0.99602,-4.18404 2.18026,-3.30566 4.70558,-4.8389 z";
const slash1 = "m 416.82907,190.81748 -29.24485,-1.3615 -6.57325,-20.42357 9.45108,-28.37436";
const slash2 = "m 381.10805,169.12947 -35.64595,-6.86228 -30.11607,-8.74018 75.11819,-12.86328";
const slash3 = "m 345.5479,162.19855 -10.46981,17.61143 4.02155,11.92597 -23.69294,-38.22107 z";

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
  const fade = swatches[colour].fade;

  let input = maybeInput;
  if (input === null || input === undefined) {
    input = nullInput();
  }

  let svgObjects = "";

  svgObjects += makeIntoSVGPath(rTrigger, "R", input.r ? midGrey : grey, strokeWidth, darkGrey, new Vec2D(0, triggerScale*input.rA));
  svgObjects += makeIntoSVGPath(lTrigger, "L", input.l ? midGrey : grey, strokeWidth, darkGrey, new Vec2D(0, triggerScale*input.lA));
  svgObjects += makeIntoSVGPath(zPressed , "ZPressed", darkZColour , strokeWidth, darkZColour, null);
  svgObjects += makeIntoSVGPath(zUnpressed, "ZUnpressed", zColour, strokeWidth, darkZColour, null);

  svgObjects += gcControllerBase(base, mediumBase, darkBase);

  svgObjects += makeIntoSVGCircle(lStick.center, lStick.radius, "lStick", grey, null, null, new Vec2D(lsXScale * input.lsX, lsYScale * input.lsY) );
  svgObjects += makeIntoSVGCircle(cStick.center, cStick.radius, "cStick", cColour, strokeWidth, darkCColour, new Vec2D(csXScale * input.csX, csYScale * input.csY)  );
  svgObjects += makeIntoSVGCircle(aButton.center, aButton.radius, "A", aColour, null, null, null );
  svgObjects += makeIntoSVGCircle(bButton.center, bButton.radius, "B", bColour, null, null, null );
  svgObjects += makeIntoSVGCircle(startButton.center, startButton.radius, "start", grey, null, null, null );
  svgObjects += makeIntoSVGPath(xButton, "X", input.x ? midGrey : grey, null, null, null);
  svgObjects += makeIntoSVGPath(yButton, "Y", input.y ? midGrey : grey, null, null, null);
  svgObjects += makeIntoSVGPath(dPadShape, "dPadShape",  grey, strokeWidth, grey, null);
  svgObjects += makeIntoSVGCircle( dPadDisk.center, dPadDisk.radius, "dPadDisk", darkGrey, null, null, null );
  svgObjects += makeIntoSVGPath(dPadUp   , "du", input.du ? darkGrey : midGrey, strokeWidth, midGrey, null);
  svgObjects += makeIntoSVGPath(dPadDown , "dd", input.dd ? darkGrey : midGrey, strokeWidth, midGrey, null);
  svgObjects += makeIntoSVGPath(dPadLeft , "dl", input.dl ? darkGrey : midGrey, strokeWidth, midGrey, null);
  svgObjects += makeIntoSVGPath(dPadRight, "dr", input.dr ? darkGrey : midGrey, strokeWidth, midGrey, null);


  svgObjects += makeIntoSVGPath(slash1, "slash1", fade[1], null, null, null);
  svgObjects += makeIntoSVGPath(slash2, "slash2", fade[2], null, null, null);
  svgObjects += makeIntoSVGPath(slash3, "slash3", fade[3], null, null, null);
  svgObjects += makeIntoSVGPath(marth , "marth" , fade[0], null, null, null);

  drawSVGObjects( svgObjects );
}

function gcControllerBase (base, mediumBase, darkBase) : string {
  let svgObjects = "";
  svgObjects += makeIntoSVGPath(baseShape, "base", base, strokeWidth, darkBase, null);
  svgObjects += makeIntoSVGPath(leftLobe, "lobeL", base, strokeWidth, darkBase, null);
  svgObjects += makeIntoSVGPath(rightLobe, "lobeR", base, strokeWidth, darkBase, null);
  svgObjects += makeIntoSVGPath(lsOctagon, "lsOctagon", darkGrey, strokeWidth, darkBase, null);
  svgObjects += makeIntoSVGPath(csOctagon, "csOctagon", cColour, strokeWidth, darkBase, null);
  svgObjects += makeIntoSVGCircle( dPadInset.center, dPadInset.radius, "dPadInset", mediumBase, null, null, null);
  return svgObjects;
};


function makeIntoSVGPath ( path : string, id : string,  fillColour : string, stroke : ?number, strokeColour : ?string, offset : ?Vec2D) : string {
  let strokeStyle = "";
  if (stroke !== null && stroke !== undefined && strokeColour !== null && strokeColour !== undefined) {
    strokeStyle = "stroke:"+strokeColour.substring(0,7)+";stroke-width:"+stroke+";stroke-linecap:round;stroke-linejoin:round;";
  }
  const style = "opacity:1;fill:"+fillColour.substring(0,7)+";fill-rule=evenodd;fill-opacity:1;"+strokeStyle+"";
  let transform = "";
  if (offset !== null && offset !== undefined) {
    transform = " transform=\x22translate("+offset.x+","+offset.y+")\x22";
  }
  return "<path id=\x22"+id+"\x22 style=\x22"+style+"\x22 d=\x22"+path+"\x22"+transform+"/>";
}

function makeIntoSVGCircle ( center : Vec2D, radius : number, id : string, fillColour : string, stroke : ?number, strokeColour : ?string, offset : ?Vec2D) : string {
  let strokeStyle = "";
  if (stroke !== null && stroke !== undefined && strokeColour !== null && strokeColour !== undefined) {
    strokeStyle = "stroke:"+strokeColour.substring(0,7)+";stroke-width:"+stroke+";stroke-linecap:round;stroke-linejoin:round;";
  }
  const style = "opacity:1;fill:"+fillColour.substring(0,7)+";fill-rule=evenodd;fill-opacity:1;"+strokeStyle+"";
  let transform = "";
  if (offset !== null && offset !== undefined) {
    transform = " transform=\x22translate("+offset.x+","+offset.y+")\x22";
  }
  return "<circle id=\x22"+id+"\x22 style=\x22"+style+"\x22 cx=\x22"+center.x+"\x22 cy=\x22"+center.y+"\x22 r=\x22"+radius+"\x22"+transform+"/>";
}


function drawSVGObjects( svgObjects : string, offset : ?Vec2D ) : void {
  const svg = "<svg version=\x221.1\x22 id=\x22trajectory\x22 xmlns=\x22http://www.w3.org/2000/svg\x22 xmlns:xlink=\x22http://www.w3.org/1999/xlink\x22 x=\x220px\x22 y=\x220px\x22 width=\x22720px\x22 height=\x22720px\x22 viewBox=\x220 0 720 720\x22 enable-background=\x22new 0 0 720 720\x22 xml:space=\x22preserve\x22 style=\x22position:absolute\x22>"+svgObjects+"</svg>";
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