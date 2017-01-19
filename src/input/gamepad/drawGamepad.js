
import {Vec2D} from "../../main/util/Vec2D";
import {multMatVect, norm, scalarProd} from "../../main/linAlg";
import {nullInput} from "../input";

// eslint-disable-next-line no-duplicate-imports
import type {Input} from "../input";

// controller colours
const controllerColours = ["purple", "orange", "black", "white", "red", "blue", "green"];
export type ControllerColour = "purple" | "orange" | "black" | "white" | "red" | "blue" | "green";
type Swatch = { light : string, base : string, medium : string, dark : string, fade : [string, string, string, string] };
const swatches = {  purple : { light: "#5d4d96", base: "#503e8a", medium: "#48387d", dark:"#362a5e", fade : ["#312656", "#5a50b1", "#665db7", "#7169bc"] }
                 ,  orange : { light: "#d9a63e", base: "#d69a1f", medium: "#cd930e", dark:"#876114", fade : ["#876114", "#aa7704", "#b88104", "#c38905"] }
                 ,  black  : { light: "#373737", base: "#2b2b2b", medium: "#242424", dark:"#000000", fade : ["#717171", "#595959", "#6e6e6e", "#8d8d8d"] }
                 ,  white  : { light: "#f5f5f5", base: "#eeeeee", medium: "#e1e1e1", dark:"#b3b3b3", fade : ["#717171", "#595959", "#6e6e6e", "#8d8d8d"] }
                 ,  red    : { light: "#c92f2f", base: "#b41e1e", medium: "#ad0d0d", dark:"#7e0e0e", fade : ["#650b0b", "#7d0e0e", "#8a0f0f", "#921010"] }
                 ,  blue   : { light: "#49549c", base: "#3c468c", medium: "#374080", dark:"#293061", fade : ["#2d346a", "#4b64b7", "#5a6dbd", "#6577c3"] }
                 ,  green  : { light: "#68bb1b", base: "#63b11a", medium: "#5ea120", dark:"#375815", fade : ["#416d14", "#4c7f17", "#548d1a", "#5d9b1c"] } };


function cycleColour( colour : ControllerColour, forward : bool) : ControllerColour {
  const lg = controllerColours.length;
  let newColour = "purple";
  for (let i = 0; i < lg; i++) {
    if (controllerColours[i] === colour) {
      if (forward) {
        newColour = i === (lg-1) ? controllerColours[0] : controllerColours[i+1];
        break;
      }
      else {
        newColour = i === 0 ? controllerColours[lg-1] : controllerColours[i-1];
        break;
      }
    }
  }
  return newColour;
};


function nullGamepadState () {
  return  { colour : "purple"
          , a : false, b : false, x : false, y : false, z : false, s : false
          , lsCentered : true, csCentered : true, dPadCentered : true
          , lCentered : true, rCentered : true };
}

const gamepadStates = [nullGamepadState(), nullGamepadState(), nullGamepadState(), nullGamepadState()];

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

export function updateGamepadSVGColour(i : number, id : string, colour : ControllerColour) : void {
  const svgObject = document.getElementById(id);
  if (svgObject === null || svgObject === undefined) {
    console.log("error in 'updateGamepadSVGColour': gamepad SVG not found.");
    return void 0;
  }
  const svg = svgObject.contentDocument;

  const light  = swatches[colour].light;
  const base   = swatches[colour].base;
  const medium = swatches[colour].medium;
  const dark   = swatches[colour].dark;
  const fade   = swatches[colour].fade;

  gamepadStates[i].colour = colour;

  const main  = svg.getElementById("main");
  const lobeL = svg.getElementById("lobeL");
  const lobeR = svg.getElementById("lobeR");
  main.style.fill = base;
  main.style.stroke = dark;
  lobeL.style.fill = base;
  lobeL.style.stroke = dark;
  lobeR.style.fill = base;
  lobeR.style.stroke = dark;
  svg.getElementById("lsHighlight").style.fill = light;
  svg.getElementById("aHighlight").style.fill = light;
  svg.getElementById("lsOctagon").style.stroke = colour === "white"? fade[2] : dark;
  svg.getElementById("csOctagon").style.stroke = colour === "white"? fade[3] : dark;
  svg.getElementById("dPadInset").style.fill = medium;  
  svg.getElementById("marth" ).style.fill = fade[0];
  svg.getElementById("slash1").style.fill = fade[1];
  svg.getElementById("slash2").style.fill = fade[2];
  svg.getElementById("slash3").style.fill = fade[3];
};

export function cycleGamepadColour( i : number, id : string, forward : bool) : void {
  updateGamepadSVGColour(i, id, cycleColour(gamepadStates[i].colour, forward)); 
}

export function updateGamepadSVGState(i : number, id : string, maybeInput : ?Input) : void {
  let input = maybeInput;
  if (input === null || input === undefined) {
    input = nullInput();
  }

  const svgObject = document.getElementById(id);
  if (svgObject === null || svgObject === undefined) {
    console.log("error in 'updateGamepadSVGState': gamepad SVG not found.");
    return void 0;
  }
  const svg = svgObject.contentDocument;

  if (gamepadStates[i].z === false && input.z) {
    gamepadStates[i].z = true;
    svg.getElementById("ZPressed").style.opacity = 1;
    svg.getElementById("ZUnpressed").style.opacity = 0;
  }
  else if (gamepadStates[i].z === true && !input.z ) {
    gamepadStates[i].z = false;
    svg.getElementById("ZPressed").style.opacity = 0;
    svg.getElementById("ZUnpressed").style.opacity = 1;
  }
  if (gamepadStates[i].a === false &&input.a ) {
    gamepadStates[i].a = true;
    svg.getElementById("ABase").style.fill = darkAColour;
    svg.getElementById("AText").style.fill = highlight;
  }
  else if (gamepadStates[i].a === true && !input.a ) {
    gamepadStates[i].a = false;
    svg.getElementById("ABase").style.fill = aColour;
    svg.getElementById("AText").style.fill = darkAColour;
  }
  if (gamepadStates[i].b === false && input.b ) {
    gamepadStates[i].b = true;
    svg.getElementById("BBase").style.fill = darkBColour;
    svg.getElementById("BText").style.fill = highlight;
  }
  else if (gamepadStates[i].b === true && !input.b ) {
    gamepadStates[i].b = false;
    svg.getElementById("BBase").style.fill = bColour;
    svg.getElementById("BText").style.fill = darkBColour;
  }
  if (gamepadStates[i].x === false && input.x ) {
    gamepadStates[i].x = true;
    svg.getElementById("XBase").style.fill = darkGrey;
    svg.getElementById("XText").style.fill = highlight;
  }
  else if (gamepadStates[i].x === true && !input.x ){
    gamepadStates[i].x = false;
    svg.getElementById("XBase").style.fill = grey;
    svg.getElementById("XText").style.fill = darkGrey;
  }
  if (gamepadStates[i].y === false && input.y ) {
    gamepadStates[i].y = true;
    svg.getElementById("YBase").style.fill = darkGrey;
    svg.getElementById("YText").style.fill = highlight;
  }
  else if (gamepadStates[i].y === true && !input.y ) {
    gamepadStates[i].y = false;
    svg.getElementById("YBase").style.fill = grey;
    svg.getElementById("YText").style.fill = darkGrey;
  }
  if (gamepadStates[i].s === false && input.s) {
    gamepadStates[i].s = true;
    svg.getElementById("startBase").style.fill = darkGrey;
  }
  else if (gamepadStates[i].s === true && !input.s) {
    gamepadStates[i].s = false;
    svg.getElementById("startBase").style.fill = grey;
  }

  const dpadU = svg.getElementById("du");
  const dpadD = svg.getElementById("dd");
  const dpadL = svg.getElementById("dl");
  const dpadR = svg.getElementById("dr");
  const dPadAxes = new Vec2D(0,0);

  const anyDPadInput = input.du || input.dd || input.dl || input.dr;

  if (!gamepadStates[i].dPadCentered || anyDPadInput ) {
    if (input.du) {
      dPadAxes.y++;
      dpadU.style.fill = highlight;
      dpadU.style.stroke = highlight;
    }
    else {
      dpadU.style.fill = midGrey;
      dpadU.style.stroke = midGrey;
    }
    if (input.dd) {
      dPadAxes.y--;
      dpadD.style.fill = highlight;
      dpadD.style.stroke = highlight;
    }
    else {
      dpadD.style.fill = midGrey;
      dpadD.style.stroke = midGrey;
    }
    if (input.dl) {
      dPadAxes.x--;
      dpadL.style.fill = highlight;
      dpadL.style.stroke = highlight;
    }
    else {
      dpadL.style.fill = midGrey;
      dpadL.style.stroke = midGrey;
    }
    if (input.dr) {
      dPadAxes.x++;
      dpadR.style.fill = highlight;
      dpadR.style.stroke = highlight;
    }
    else {
      dpadR.style.fill = midGrey;
      dpadR.style.stroke = midGrey;
    }
    // setting the value for dPadCentered later
  }

  const dPadNorm = Math.sqrt(Math.pow(dPadAxes.x,2)+Math.pow(dPadAxes.y,2));
  if (dPadNorm > 0.1) {
    dPadAxes.x *= 1/dPadNorm;
    dPadAxes.y *= 1/dPadNorm;
  }


  if (!gamepadStates[i].rCentered || input.rA > 0.01) {
    svg.getElementById("r").setAttribute("transform", "translate(0,"+(40*Math.pow(input.rA,2))+")");
    if (input.rA > 0.01) {
      gamepadStates[i].rCentered = false;
    }
    else {
      gamepadStates[i].rCentered = true;
    }
  }
  if (!gamepadStates[i].lCentered || input.lA > 0.01) {
    svg.getElementById("l").setAttribute("transform", "translate(0,"+(40*Math.pow(input.lA,2))+")");
    if (input.lA > 0.01) {
      gamepadStates[i].lCentered = false;
    }
    else {
      gamepadStates[i].lCentered = true;
    }
  }

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

  let lStickSquashVector = new Vec2D(input.rawX, input.rawY);
  const lStickSquashVectorNorm = norm(lStickSquashVector);
  if (lStickSquashVectorNorm > 1) {
    lStickSquashVector = scalarProd(1/(1.5*lStickSquashVectorNorm), lStickSquashVector);
  }
  else {
    lStickSquashVector = scalarProd(1/1.5, lStickSquashVector);
  }

  let cStickSquashVector = new Vec2D(input.rawcsX, input.rawcsY);
  const cStickSquashVectorNorm = norm(cStickSquashVector);
  if (cStickSquashVectorNorm > 1) {
    cStickSquashVector = scalarProd(1/(1.6*cStickSquashVectorNorm), cStickSquashVector);
  }
  else {
    cStickSquashVector = scalarProd(1/1.6, cStickSquashVector);
  }
 
  const lStickSquash = stickSquash ( lStickSquashVector, new Vec2D (lsCenterX, lsCenterY) );
  const cStickSquash = stickSquash ( cStickSquashVector, new Vec2D (csCenterX, csCenterY) );
  const dPadSquash   = stickSquash ( new Vec2D(dPadAxes.x/2.5, dPadAxes.y/2.5), new Vec2D ( dCenterX,  dCenterY));

  const lSM = lStickSquash.scalingMatrix;
  const cSM = cStickSquash.scalingMatrix;
  const dSM = dPadSquash.scalingMatrix;
  const lNC = lStickSquash.newCenter;
  const cNC = cStickSquash.newCenter;
  const dNC = dPadSquash.newCenter  ;

  const cStickAngle = 180/Math.PI*Math.atan2(-input.rawcsY, input.rawcsX);
  const cRectScale = 20* norm (new Vec2D (input.rawcsX, input.rawcsY));

  const anyLSInput = Math.abs(input.rawX) > 0.01 || Math.abs(input.rawY) > 0.01;

  if (!gamepadStates[i].lsCentered || anyLSInput) {
    svg.getElementById("ls").setAttribute("transform", "matrix("+lSM[0][0]+","+lSM[0][1]+","+lSM[1][0]+","+lSM[1][1]+","+(lNC.x+(lScale*input.rawX))+","+(lNC.y+(-lScale*input.rawY))+")");
    svg.getElementById("lStickShadow").setAttribute("transform", "translate("+ (-0.6*lScale*input.rawX)+","+(0.6*lScale*input.rawY)+")");
    svg.getElementById("lStickDepth").setAttribute("transform", "translate("+ (-0.15*lScale*input.rawX)+","+(0.15*lScale*input.rawY)+")");
    svg.getElementById("lStickCircle1").setAttribute("transform", "translate("+ (0.19*lScale*input.rawX)+","+(-0.19*lScale*input.rawY)+")");
    svg.getElementById("lStickCircle2").setAttribute("transform", "translate("+ (0.13*lScale*input.rawX)+","+(-0.13*lScale*input.rawY)+")");
    svg.getElementById("lStickCircle3").setAttribute("transform", "translate("+ (0.05*lScale*input.rawX)+","+(-0.05*lScale*input.rawY)+")");
    if (anyLSInput) {
      gamepadStates[i].lsCentered = false;
    }
    else {
      gamepadStates[i].lsCentered = true;
    }
  }

  const anyCSInput = Math.abs(input.rawcsX) > 0.01 || Math.abs(input.rawcsY) > 0.01;

  if (!gamepadStates[i].csCentered || anyCSInput) {
    svg.getElementById("cs").setAttribute("transform", "matrix("+cSM[0][0]+","+cSM[0][1]+","+cSM[1][0]+","+cSM[1][1]+","+(cNC.x+(cScale*input.rawcsX))+","+(cNC.y+(-cScale*input.rawcsY))+")");
    svg.getElementById("cStickShadow").setAttribute("transform", "translate("+(-0.45*cScale*input.rawcsX)+","+(0.45*cScale*input.rawcsY)+")");
    svg.getElementById("cStickShadowRect").setAttribute("transform", "rotate("+cStickAngle+","+(csCenterX) +","+(csCenterY)+") translate("+((1-cRectScale)*csCenterX)+",0) scale("+cRectScale+",1)");
    if (anyCSInput) {
      gamepadStates[i].csCentered = false;
    }
    else {
      gamepadStates[i].csCentered = true;
    }
  }

  if (!gamepadStates[i].dPadCentered || anyDPadInput) {
    svg.getElementById("dpad").setAttribute("transform", "matrix("+dSM[0][0]+","+dSM[0][1]+","+dSM[1][0]+","+dSM[1][1]+","+(dNC.x+(dScale*dPadAxes.x))+","+(dNC.y+(-dScale*dPadAxes.y))+")");
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
    if (!anyDPadInput) {
      gamepadStates[i].dPadCentered = true;
    }
    else {
      gamepadStates[i].dPadCentered = false;
    }
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