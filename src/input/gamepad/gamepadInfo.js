// @flow

import type {Vec2D} from "../../main/util/Vec2D";

export type StickCardinals = { center : Vec2D, left : number, right : number, up : number, down : number };

type ButtonInfo  = null 
                 | { kind : "pressed", index : number }
                 | { kind : "value", index : number, threshold : number }
                 | { kind : "axis", index : number, threshold : number }
type StickInfo   = null 
                 | { kind : "axes", xIndex : number, yIndex : number, cardinals : null | StickCardinals }
                 | { kind : "value", xIndex : number, yIndex : number, cardinals : null | StickCardinals }
type TriggerInfo = null 
                 | { kind : "axis", index : number, min : number, max : number }
                 | { kind : "value", index : number, min : number, max : number }
                 | { kind : "light", index : number }
type DPadInfo    =  null
                 | { kind : "buttons", upIndex : number, downIndex : number, leftIndex : number, rightIndex : number }
                 | { kind : "axis", index : number }
                 | { kind : "2axes", xIndex : number, yIndex : number, xFlip : bool, yFlip : bool }

export type GamepadID = { name : string, id? : string, vendor? : string, product? : string }

export type GamepadInfo = { a  : ButtonInfo
                          , b  : ButtonInfo
                          , x  : ButtonInfo
                          , y  : ButtonInfo
                          , s  : ButtonInfo
                          , l  : ButtonInfo
                          , r  : ButtonInfo
                          , r  : ButtonInfo
                          , lA : TriggerInfo
                          , rA : TriggerInfo
                          , dpad : DPadInfo
                          , ls : StickInfo
                          , cs : StickInfo
                          , isGC : bool
                          , ids : Array<GamepadID>
                          }