// @flow

import {Vec2D} from "../../main/util/Vec2D";

import type {StickCardinals} from "./gamepadInfo";

export const defaultCardinals   : StickCardinals = { center : new Vec2D(0,0), left : -1, right : 1, down : 1, up : -1 };
export const invertedYCardinals : StickCardinals = { center : new Vec2D(0,0), left : -1, right : 1, down : -1, up : 1 };
export const gamecubeCardinals  : StickCardinals = { center : new Vec2D(0,0), left : -0.75, right : 0.75, down : 0.75, up : -0.75 }; 