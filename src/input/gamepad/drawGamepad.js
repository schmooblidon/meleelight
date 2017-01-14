
import {Vec2D} from "../../main/util/Vec2D";
import {multMatVect} from "../../main/linAlg";
import {nullInput} from "../input";

// eslint-disable-next-line no-duplicate-imports
import type {Input} from "../input";

// controller colours
export type ControllerColour = "purple" | "orange" | "black" | "white" | "red" | "blue" | "green";
type Swatch = { light : string, medium : string, dark : string, fade : [string, string, string, string] };
const swatches = {  purple : { light: "#503e8a", medium: "#48387d", dark:"#362a5e", fade : ["#312656", "#5a50b1", "#665db7", "#7169bc"] }
                 ,  orange : { light: "#d69a1f", medium: "#cd9005", dark:"#876114", fade : ["#cd9005", "#aa7704", "#b88104", "#c38905"] }
                 ,  black  : { light: "#2b2b2b", medium: "#3f3f3f", dark:"#000000", fade : ["#717171", "#595959", "#6e6e6e", "#8d8d8d"] }
                 ,  white  : { light: "#f4f4f4", medium: "#e1e1e1", dark:"#5e5e5e", fade : ["#717171", "#595959", "#6e6e6e", "#8d8d8d"] }
                 ,  red    : { light: "#b41e1e", medium: "#a11212", dark:"#7e0e0e", fade : ["#650b0b", "#7d0e0e", "#8a0f0f", "#921010"] }
                 ,  blue   : { light: "#293061", medium: "#374080", dark:"#293061", fade : ["#3f3f3f", "#4b64b7", "#5a6dbd", "#6577c3"] }
                 ,  green  : { light: "#63b11a", medium: "#5c9e1f", dark:"#375815", fade : ["#416d14", "#4c7f17", "#548d1a", "#5d9b1c"] } };

// fixed colours
const grey = "#cdcdcd";
const midGrey = "#b0b0b0";
const darkGrey = "#919191";
const aColour = "#29a9a1";
const darkAColour = "#1c736d";
const bColour = "#e73148";
const darkBColour = "#9a1223";
const zColour = "#4e40b5";
const darkZColour = "#3b3280";
const cColour = "#e7c518";
const darkCColour = "#b68e0b";
const highlight = "#fafe90";

export function updateGamepadSVGColour(i : number, colour : ControllerColour) {
  const svg = document.getElementById("gamepadSVG"); // not yet using per-player gamepads
  const light  = swatches[colour].light;
  const medium = swatches[colour].medium;
  const dark   = swatches[colour].dark;
  const fade   = swatches[colour].fade;

  const main  = svg.getElementById("main");
  const lobeL = svg.getElementById("lobeL");
  const lobeR = svg.getElementById("lobeR");
  main.style.fill = light;
  main.style.stroke = dark;
  lobeL.style.fill = light;
  lobeL.stile.stroke = dark;
  lobeR.style.fill = light;
  lobeR.style.stroke = dark;
  svg.getElementById("lsOctagon").style.stroke = dark;
  svg.getElementById("csOctagon").style.stroke = dark;
  svg.getElementById("dPadInset").style.fill = medium;  
  svg.getElementById("marth" ).style.fill = fade[0];
  svg.getElementById("slash1").style.fill = fade[1];
  svg.getElementById("slash2").style.fill = fade[2];
  svg.getElementById("slash3").style.fill = fade[3];
};

export function updateGamepadSVGState(i : number, maybeInput : ?Input) {
  let input = maybeInput;
  if (input === null || input === undefined) {
    input = nullInput();
  }
  const svg = document.getElementById("gamepadSVG"); // not yet using per-player gamepads

  if (input.z) {
    svg.getElementById("ZPressed").style.opacity = 1;
    svg.getElementById("ZUnpressed").style.opacity = 0;
  }
  else {
    svg.getElementById("ZPressed").style.opacity = 0;
    svg.getElementById("ZUnpressed").style.opacity = 1;
  }
  if (input.a) {
    svg.getElementById("ABase").style.fill = darkAColour;
    svg.getElementById("AText").style.fill = highlight;
  }
  else {
    svg.getElementById("ABase").style.fill = aColour;
    svg.getElementById("AText").style.fill = darkAColour;
  }
  if (input.b) {
    svg.getElementById("BBase").style.fill = darkBColour;
    svg.getElementById("BText").style.fill = highlight;
  }
  else {
    svg.getElementById("BBase").style.fill = bColour;
    svg.getElementById("BText").style.fill = darkBColour;
  }
  if (input.x) {
    svg.getElementById("XBase").style.fill = darkGrey;
    svg.getElementById("XText").style.fill = highlight;
  }
  else {
    svg.getElementById("XBase").style.fill = grey;
    svg.getElementById("XText").style.fill = darkGrey;
  }
  if (input.y) {
    svg.getElementById("YBase").style.fill = darkGrey;
    svg.getElementById("YText").style.fill = highlight;
  }
  else {
    svg.getElementById("YBase").style.fill = grey;
    svg.getElementById("YText").style.fill = darkGrey;
  }
  if (input.s) {
    svg.getElementById("startBase").style.fill = darkGrey;
  }
  else {
    svg.getElementById("startBase").style.fill = grey;
  }

  const dpadU = svg.getElementById("du");
  const dpadD = svg.getElementById("dd");
  const dpadL = svg.getElementById("dl");
  const dpadR = svg.getElementById("dr");
  const dPadAxes = new Vec2D(0,0);

  if (input.du) {
    dPadAxes.y = 1;
    dpadU.style.fill = highlight;
    dpadU.style.stroke = highlight;
  }
  else {
    dpadU.style.fill = midGrey;
    dpadU.style.stroke = midGrey;
  }
  if (input.dd) {
    dPadAxes.y = -1;
    dpadD.style.fill = highlight;
    dpadD.style.stroke = highlight;
  }
  else {
    dpadD.style.fill = midGrey;
    dpadD.style.stroke = midGrey;
  }
  if (input.dl) {
    dPadAxes.x = -1;
    dpadL.style.fill = highlight;
    dpadL.style.stroke = highlight;
  }
  else {
    dpadL.style.fill = midGrey;
    dpadL.style.stroke = midGrey;
  }
  if (input.dr) {
    dPadAxes.x = 1;
    dpadR.style.fill = highlight;
    dpadR.style.stroke = highlight;
  }
  else {
    dpadR.style.fill = midGrey;
    dpadR.style.stroke = midGrey;
  }

  const dPadNorm = Math.sqrt(Math.pow(dPadAxes.x,2)+Math.pow(dPadAxes.y,2));
  if (dPadNorm > 0.1) {
    dPadAxes.x *= 1/dPadNorm;
    dPadAxes.y *= 1/dPadNorm;
  }
  
  svg.getElementById("R").setAttribute("transform", "translate(0,"+(40*Math.pow(input.rA,4))+")");
  svg.getElementById("L").setAttribute("transform", "translate(0,"+(40*Math.pow(input.lA,4))+")");

  // now some 3D effects

  const lsCenterX = 141.93683;
  const lsCenterY = 297.63986;
  const csCenterX = 473.06235;
  const csCenterY = 448.25513;
  const dCenterX = 246.83537;
  const dCenterY = 448.25513;

  const lScale = 57;
  const cScale = 47;
  const dScale = 5;
 
  const lStickSquash = stickSquash ( new Vec2D(input.lsX /1.5, input.lsY /1.5), new Vec2D (lsCenterX, lsCenterY) );
  const cStickSquash = stickSquash ( new Vec2D(input.csX /1.6, input.csY /1.6), new Vec2D (csCenterX, csCenterY) );
  const dPadSquash   = stickSquash ( new Vec2D(dPadAxes.x/2.5, dPadAxes.y/2.5), new Vec2D ( dCenterX,  dCenterY));

  const lSM = lStickSquash.scalingMatrix;
  const cSM = cStickSquash.scalingMatrix;
  const dSM = dPadSquash.scalingMatrix;
  const lNC = lStickSquash.newCenter;
  const cNC = cStickSquash.newCenter;
  const dNC = dPadSquash.newCenter  ;

  const cStickAngle = 180/Math.PI*Math.atan2(-input.csY, input.csX);
  const cRectScale = 20*Math.sqrt(Math.pow(input.csX,2)+Math.pow(input.csY,2));

  svg.getElementById("lStick").setAttribute("transform", "matrix("+lSM[0][0]+","+lSM[0][1]+","+lSM[1][0]+","+lSM[1][1]+","+(lNC.x+(lScale*input.lsX))+","+(lNC.y+(-lScale*input.lsY))+")");
  svg.getElementById("lStickShadow").setAttribute("transform", "translate("+ (-0.6*lScale*input.lsX)+","+(0.6*lScale*input.lsY)+")");
  svg.getElementById("lStickDepth").setAttribute("transform", "translate("+ (-0.15*lScale*input.lsX)+","+(0.15*lScale*input.lsY)+")");
  svg.getElementById("lStickCircle1").setAttribute("transform", "translate("+ (0.19*lScale*input.lsX)+","+(-0.19*lScale*input.lsY)+")");
  svg.getElementById("lStickCircle2").setAttribute("transform", "translate("+ (0.13*lScale*input.lsX)+","+(-0.13*lScale*input.lsY)+")");
  svg.getElementById("lStickCircle3").setAttribute("transform", "translate("+ (0.05*lScale*input.lsX)+","+(-0.05*lScale*input.lsY)+")");
  svg.getElementById("cStick").setAttribute("transform", "matrix("+cSM[0][0]+","+cSM[0][1]+","+cSM[1][0]+","+cSM[1][1]+","+(cNC.x+(cScale*input.csX))+","+(cNC.y+(-cScale*input.csY))+")");
  svg.getElementById("cStickShadow").setAttribute("transform", "translate("+(-0.45*cScale*input.csX)+","+(0.45*cScale*input.csY)+")");
  svg.getElementById("cStickShadowRect").setAttribute("transform", "rotate("+cStickAngle+","+(csCenterX) +","+(csCenterY)+") translate("+((1-cRectScale)*csCenterX)+",0) scale("+cRectScale+",1)");
  svg.getElementById("dPad").setAttribute("transform", "matrix("+dSM[0][0]+","+dSM[0][1]+","+dSM[1][0]+","+dSM[1][1]+","+(dNC.x+(dScale*dPadAxes.x))+","+(dNC.y+(-dScale*dPadAxes.y))+")");
  svg.getElementById("dPadShapeDepth1").setAttribute("transform", "translate("+ (-1.4*dScale*dPadAxes.x)+","+(1.4*dScale*dPadAxes.y)+")");
  svg.getElementById("dPadShapeDepth2").setAttribute("transform", "translate("+ (-0.7*dScale*dPadAxes.x)+","+(0.7*dScale*dPadAxes.y)+")");
  if (dPadAxes !== 0 || dPadAxes.y !== 0) {
    svg.getElementById("dPadShapeDepth1").style.opacity = 1;
  }
  else {
    svg.getElementById("dPadShapeDepth1").style.opacity = 0;
  }
  if (dPadAxes.x !== 0 && dPadAxes.y !== 0) {
    svg.getElementById("dPadShapeDepth2").style.opacity = 1;
  }
  else {
    svg.getElementById("dPadShapeDepth2").style.opacity = 0;
  }


}

function stickSquash (pos : Vec2D, center : Vec2D) : { scalingMatrix : [[number, number], [number, number]], newCenter : Vec2D } {
  const x = pos.x;
  const y = -pos.y;
  const r = Math.sqrt(x*x+y*y);  
  if (r < 0.01) {
    return { scalingMatrix : [[1,0],[0,1]], newCenter : new Vec2D(0,0) };
  }
  else {
    const f = Math.max(0,1-r); // scaling factor
    const scalingMatrix = [[1+(f-1)*x*x/r*r, (f-1)*x*y/r*r], [(f-1)*x*y/r*r, (1+(f-1)*y*y/r*r)]];
    const mult = multMatVect(scalingMatrix, [center.x, center.y]);
    return { scalingMatrix : scalingMatrix, newCenter : new Vec2D( center.x - mult[0], center.y - mult[1]) };
  }
}