export function Vec2D(x, y) {
  this.x = x;
  this.y = y;
  this.dot = function (vector) {
    return this.x * vector.x + this.y * vector.y;
  };
}

export function getXOrYCoord(vec, xOrY) {
  if (xOrY === 0) {
    return vec.x;
  }
  else {
    return vec.y;
  }
};