export class Vec2D {
  x;
  y;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  };
}