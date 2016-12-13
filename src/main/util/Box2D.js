// @flow

import {Vec2D} from "./Vec2D";

import type {Vec2DType} from "./Vec2D";


export type Box2DType = {
	min : Vec2DType,
	max : Vec2DType
};

export function Box2D(min : [number,number], max : [number,number]) : Box2DType {
  this.min = new Vec2D(min[0], min[1]);
  this.max = new Vec2D(max[0], max[1]);
}

