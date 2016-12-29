// @flow

/*eslint indent:0*/
/*eslint prefer-const:0*/

import {inverseMatrix, multMatVect} from "../main/linAlg";
import {Vec2D} from "../main/util/Vec2D";

import type {GamepadInfo, StickCardinals} from "./gamepad/gamepadInfo";

// ----------------------------------------------------------------------------------------------------
// Melee input simulation

function fromCardinals([origx, origy], l, r, d,u) {
    return [[origx, origy], [l,origy], [r,origy], [origx,d], [origx, u]];
};

// parameters for GC controller simulation
// the following function gives an approximation to the extreme raw axis data for a given controller
// of course, this varies between controllers, but this serves as a useful first approximation
// function output: [[origx, origy], [lx, ly], [rx, ry], [dx, dy], [ux, uy]]
function stickExtremePoints(stickCardinals : StickCardinals | null) : any {
  if (stickCardinals === null || stickCardinals === undefined) {
    return ( fromCardinals ( [0, 0], -1, 1, 1, -1) );
  }
  else {
    return ( fromCardinals ( [stickCardinals.center.x, stickCardinals.center.y]
                           , stickCardinals.left
                           , stickCardinals.right
                           , stickCardinals.down
                           , stickCardinals.up
                           ) );
  }
};

// The following function renormalises axis input,
// so that corners (l = left, r = right, d=down, u=up) are mapped to the respective corners of the unit square.
// This function assumes that ALL coordinates have already been centered.
// Return type: [xnew,ynew]
function renormaliseAxisInput([lx, ly], [rx, ry], [dx, dy], [ux, uy], [x, y]) : [number, number] {
  if ((x * ry - y * rx <= 0) && (x * uy - y * ux >= 0)) // quadrant 1
  {
    const invMat = inverseMatrix([
      [rx, ux],
      [ry, uy]
    ]);
    return multMatVect(invMat, [x, y]);
  } else if ((x * uy - y * ux <= 0) && (x * ly - y * lx >= 0)) // quadrant 2
  {
    const invMat = inverseMatrix([
      [-lx, ux],
      [-ly, uy]
    ]);
    return multMatVect(invMat, [x, y]);
  } else if ((x * ly - y * lx <= 0) && (x * dy - y * dx >= 0)) // quadrant 3
  {
    const invMat = inverseMatrix([
      [-lx, -dx],
      [-ly, -dy]
    ]);
    return multMatVect(invMat, [x, y]);
  } else // quadrant 4
  {
    const invMat = inverseMatrix([
      [rx, -dx],
      [ry, -dy]
    ]);
    return multMatVect(invMat, [x, y]);
  }
};

// clamps a value between -1 and 1
function toInterval (x : number)  : number{
  if (x < -1) {
    return -1;
  }
  else if (x > 1) {
    return 1;
  }
  else {
    return x;
  }
};

// Analog triggers.

// t = trigger input
export function scaleToGCTrigger ( t : number, offset : number, scale : number)  : number{
    const tnew = scale*(t + offset);
    if (tnew > 1){
      return 1;
    }
    else if (tnew < 0.3){
      return 0;
    }
    else {
      return tnew;
    }
};



// ---------------------------
// GC controller simulation

const steps = 80;
const deadzoneConst = 0.28;
const leniency = 10;

const meleeOrig = 128;
const meleeMin  = meleeOrig - (steps+leniency) ; // lowest  0 -- 255 input the controller will give
const meleeMax  = meleeOrig + (steps+leniency) ; // highest 0 -- 255 input the controller will give

// rescales -1 -- 0 -- 1 to min -- orig -- max, and rounds to nearest integer
function discretise (x : number, min : number, orig : number, max : number) : number {
  if (x < 0) {
    return Math.round((x*(orig-min)+orig));
  }
  else if (x > 0) {
    return Math.round((x*(max-orig)+orig));
  }
  else {
    return orig;
  }
};


// Rescales controller input to -1 -- 0 -- 1 in both axes
export function scaleToUnitAxes ( x : number, y : number
                                , stickCardinals : null | StickCardinals
                                , customCenterX : number, customCenterY : number ) : [number,number] {
    let [[origx, origy], [lx, ly], [rx, ry], [dx, dy], [ux, uy]] = stickExtremePoints(stickCardinals);
    origx += customCenterX;
    origy += customCenterY;
    const [xnew, ynew] = renormaliseAxisInput([lx-origx, ly-origy], [rx-origx, ry-origy], [dx-origx, dy-origy], [ux-origx, uy-origy], [x-origx, y-origy]);
    return [toInterval(xnew), toInterval(ynew)];
};

// Rescales -1 -- 1 input to 0 -- 255 values to simulate a GC controller
function scaleUnitToGCAxes (x: number, y: number) : [number, number] {
  const xnew = discretise(x, meleeMin, meleeOrig, meleeMax);
  const ynew = discretise(y, meleeMin, meleeOrig, meleeMax);
  return ([xnew, ynew]);
};

// Rescales controller input to 0 -- 255 values to simulate a GC controller
function scaleToGCAxes ( x: number, y: number
                       , stickCardinals : null | StickCardinals
                       , customCenterX: number, customCenterY: number) : [number, number] {
  const [xnew, ynew] = scaleToUnitAxes (x, y, stickCardinals, customCenterX, customCenterY);
  return scaleUnitToGCAxes(xnew, ynew);
}


// ---------------------------------
// Melee input rescaling functions


// basic mapping from 0 -- 255 back to -1 -- 1 done by Melee
// boolean value: true = deadzones, false = no deadzones
function axisRescale ( x : number, orig : number = meleeOrig) {
  return (x-orig) / steps;
};

function unitRetract ( [x : number,y : number] ) : [number, number] {
  const norm = Math.sqrt(x*x + y*y);
  if (norm < 1) {
    return ([x,y]);
  }
  else {
    return ( [x/norm, y/norm]);
  }
};

function meleeRound (x : number)  : number{
  return Math.round(steps*x)/steps;
};

function meleeAxesRescale ( [x: number,y: number], isDeadzoned : bool ) : [number, number] {
  const xnew = axisRescale (x, meleeOrig, isDeadzoned);
  const ynew = axisRescale (y, meleeOrig, isDeadzoned);
  let [xnew2, ynew2] = unitRetract( [xnew, ynew] );
  if (isDeadzoned) {
    if (Math.abs(xnew2) < deadzoneConst) {
       xnew2 = 0;
    }
    if (Math.abs(ynew2) < deadzoneConst) {
      ynew2 = 0;
    }
  }
  return ([xnew2, ynew2].map(meleeRound));
}

// this is the main input rescaling function
// it scales raw input data to the data Melee uses for the simulation
// number : controller ID, to rescale axes dependent on controller raw input
// bool == false means no deadzone, bool == true means deadzone
export function scaleToMeleeAxes ( x: number, y: number
                                 , isGC : bool
                                 , stickCardinals : null | StickCardinals
                                 , isDeadzoned : bool = false
                                 , customCenterX : number = 0, customCenterY : number = 0 ) : [number, number] {
  let xnew = x;
  let ynew = y;
  if (isGC) { // gamecube controllers, don't mess up the raw data
       xnew = ( x-customCenterX+1)*255/2; // convert raw input to 0 -- 255 values in obvious way
       ynew = (-y+customCenterY+1)*255/2; // y incurs a sign flip
       //console.log("You are using raw GC controller data.");
  }
  else { // convert raw input to 0 -- 255 by GC controller simulation
    [xnew, ynew] = scaleToGCAxes(x, y, stickCardinals, customCenterX, customCenterY);
    //console.log("You are using GC controller simulation.");
  }
  return meleeAxesRescale ( [xnew,ynew], isDeadzoned );
};

// scales -1 -- 1 data to the data Melee uses for the simulation
export function meleeRescale ( x: number, y: number, isDeadzoned : bool = false) : [number, number] {
  const [xnew, ynew] = scaleUnitToGCAxes (x, y);
  return meleeAxesRescale ( [xnew, ynew], isDeadzoned );
};
