// @flow

export type Stage = {
  box           : Array< Box2D >,
  platform      : Array< [Vec2D, Vec2D] >,
  ground        : Array< [Vec2D, Vec2D] >,
  ceiling       : Array< [Vec2D, Vec2D] >,
  wallL         : Array< [Vec2D, Vec2D] >,
  wallR         : Array< [Vec2D, Vec2D] >,
  startingPoint : [Vec2D, Vec2D, Vec2D, Vec2D],
  startingFace  : [number, number, number, number],
  respawnPoints : [Vec2D, Vec2D, Vec2D, Vec2D],
  respawnFace   : [number, number, number, number],
  blastzone     : Box2D,
  ledge         : Array< [number, number] >,
  ledgePos      : Array< Vec2D >,
  scale         : number,
  offset        : [number, number],
  connected?    : Array< [boolean, Array< [ string, number] > ] >
}