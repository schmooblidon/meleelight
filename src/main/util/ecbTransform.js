// @flow
/*eslint indent:1*/

import {Vec2D} from "./Vec2D";
import {add} from "../linAlg";

export type ECB = [Vec2D, Vec2D, Vec2D, Vec2D];
export type SquashDatum = { factor : number, location : null | number };

export function moveECB (ecb : ECB, vec : Vec2D) : ECB {
  return ( [ new Vec2D (ecb[0].x+vec.x,ecb[0].y+vec.y)
           , new Vec2D (ecb[1].x+vec.x,ecb[1].y+vec.y)
           , new Vec2D (ecb[2].x+vec.x,ecb[2].y+vec.y)
           , new Vec2D (ecb[3].x+vec.x,ecb[3].y+vec.y) ] );
};

export function squashECBAt (ecb : ECB, squashDatum : SquashDatum) : ECB {
  const pos = ecbFocusFromAngularParameter(ecb, squashDatum.location);
  const t   = squashDatum.factor;
  return ( [ new Vec2D ( t*ecb[0].x + (1-t)*pos.x, t*ecb[0].y + (1-t)*pos.y)
           , new Vec2D ( t*ecb[1].x + (1-t)*pos.x, t*ecb[1].y + (1-t)*pos.y)
           , new Vec2D ( t*ecb[2].x + (1-t)*pos.x, t*ecb[2].y + (1-t)*pos.y)
           , new Vec2D ( t*ecb[3].x + (1-t)*pos.x, t*ecb[3].y + (1-t)*pos.y) ] );
};

export function ecbFocusFromAngularParameter( ecb : ECB, t : null | number ) : Vec2D {
  let focus = null;
  if (t === null) {
    focus = new Vec2D( ecb[0].x, (ecb[0].y + ecb[2].y)/2 );
  }
  else if (t <= 1) {
    focus = new Vec2D ( (1 - t    )*ecb[0].x + t    *ecb[1].x, (1 - t    )*ecb[0].y + t    *ecb[1].y );
  }
  else if (t <= 2) {
    focus = new Vec2D ( (1 - (t-1))*ecb[1].x + (t-1)*ecb[2].x, (1 - (t-1))*ecb[1].y + (t-1)*ecb[2].y );
  }
  else if (t <= 3) {
    focus = new Vec2D ( (1 - (t-2))*ecb[2].x + (t-2)*ecb[3].x, (1 - (t-2))*ecb[2].y + (t-2)*ecb[3].y );
  }
  else {
    focus = new Vec2D ( (1 - (t-3))*ecb[3].x + (t-3)*ecb[0].x, (1 - (t-3))*ecb[3].y + (t-3)*ecb[0].y );
  }
  return focus;
}
 
export function interpolateECB( srcECB : ECB, tgtECB : ECB, s : number) : ECB {
  return [ new Vec2D( (1-s)*srcECB[0].x + s*tgtECB[0].x, (1-s)*srcECB[0].y + s*tgtECB[0].y )
         , new Vec2D( (1-s)*srcECB[1].x + s*tgtECB[1].x, (1-s)*srcECB[1].y + s*tgtECB[1].y )
         , new Vec2D( (1-s)*srcECB[2].x + s*tgtECB[2].x, (1-s)*srcECB[2].y + s*tgtECB[2].y )
         , new Vec2D( (1-s)*srcECB[3].x + s*tgtECB[3].x, (1-s)*srcECB[3].y + s*tgtECB[3].y ) ];
}

export function makeECB (pos : Vec2D, halfWidth : number, height : number ) : ECB {
  return [ pos
         , add (pos, new Vec2D(halfWidth, 0))
         , add (pos, new Vec2D(0, height))
         , add (pos, new Vec2D(-halfWidth, 0))
  ];
}