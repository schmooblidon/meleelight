// @flow


export type Vec2DType = {
  x : number,
  y : number,
  dot : (vector : Vec2DType) => Vec2DType;
};

export function Vec2D(x : number, y : number) : Vec2DType {
  this.x = x;
  this.y = y;
  this.dot = function (vector : Vec2DType) {
    return this.x * vector.x + this.y * vector.y;
  };
};

export function getXOrYCoord(vec : Vec2DType, xOrY : number) : number {
  if (xOrY === 0) {
    return vec.x;
  }
  else {
    return vec.y;
  }
};