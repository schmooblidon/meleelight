// @flow

import {Vec2D} from "./Vec2D";

import type {Vec2DType} from "./Vec2D";

export type ECB = [Vec2DType, Vec2DType, Vec2DType, Vec2DType];

export function moveECB (ecb : ECB, vec : Vec2DType) : ECB {
  return ( [ new Vec2D (ecb[0].x+vec.x,ecb[0].y+vec.y)
           , new Vec2D (ecb[1].x+vec.x,ecb[1].y+vec.y)
           , new Vec2D (ecb[2].x+vec.x,ecb[2].y+vec.y)
           , new Vec2D (ecb[3].x+vec.x,ecb[3].y+vec.y) ] );
};

export function squashDownECB (ecb : ECB, factor : number) : ECB {
  return ( [ ecb[0]
           , new Vec2D ( factor * (ecb[1].x-ecb[0].x) + ecb[0].x , factor * (ecb[1].y-ecb[0].y) + ecb[0].y )
           , new Vec2D ( ecb[2].x                                , factor * (ecb[2].y-ecb[0].y) + ecb[0].y )
           , new Vec2D ( factor * (ecb[3].x-ecb[0].x) + ecb[0].x , factor * (ecb[3].y-ecb[0].y) + ecb[0].y ) ] );
};