// @flow

import {Vec2D} from "../main/util/Vec2D";
import {Box2D} from "../main/util/Box2D";

import type {DamageType} from "../physics/damageTypes";

export type SurfaceProperties = { damageType : DamageType };

export type Surface = [Vec2D, Vec2D, void | SurfaceProperties];
type SurfaceLabel = [string, number];
export type LabelledSurface = {surface : Surface, label : SurfaceLabel};

export type Connected = [ Array< [ null | SurfaceLabel, null | SurfaceLabel ] >, Array< [ null | SurfaceLabel, null | SurfaceLabel ] >];

export type Ledge = [ "ground" | "platform", number, 0 | 1];

export type Stage = {
  box?           : Array< Box2D >,
  polygon?       : Array< Array< Vec2D > >,
  platform       : Array< Surface >,
  ground         : Array< Surface >,
  ceiling        : Array< Surface >,
  wallL          : Array< Surface >,
  wallR          : Array< Surface >,
  startingPoint  : Array< Vec2D >,
  startingFace?  : Array< 1 | -1 >,
  respawnPoints? : Array< Vec2D >,
  respawnFace?   : Array< 1 | -1 >,
  blastzone      : Box2D,
  ledge          : Array< Ledge >,
  ledgePos       : Array< Vec2D >,
  scale          : number,
  offset         : [number, number],
  target?        : Array< Vec2D >,
  connected?     : Connected,
  background?    : { line : Array<[Vec2D, Vec2D]>, polygon : Array< Array< Vec2D > > },
  polygonMap?    : Array< null | Array< [string, number] > >
}

export function getSurfaceFromStage ( surfaceTypeAndIndex : [string, number], stage : Stage) : Surface {
  const surfaceType  = surfaceTypeAndIndex[0];
  const surfaceIndex = surfaceTypeAndIndex[1];
  switch (surfaceType) {
    case "l":
      return stage.wallL   [surfaceIndex];
    case "r":
      return stage.wallR   [surfaceIndex];
    case "p":
      return stage.platform[surfaceIndex];
    case "g":
    default:
      return stage.ground  [surfaceIndex];
    case "c":
      return stage.ceiling [surfaceIndex];
  }
};