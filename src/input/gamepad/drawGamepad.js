// @flow

import {Vec2D} from "../../main/util/Vec2D";
import {nullInput} from "../input";

// eslint-disable-next-line no-duplicate-imports
import type {Input} from "../input";

// controller colours
export type ControllerColour = "purple" | "orange" | "black" | "white" | "red" | "blue" | "green";
type Swatch = { light : string, medium : string, dark : string, fade : [string, string, string, string] };
const swatches = {  purple : { light: "#503e8aff", medium: "#48387dff", dark:"#362a5eff", fade : ["#312656ff", "#5a50b1ff", "#665db7ff", "#7169bcff"] }
                 ,  orange : { light: "#d69a1fff", medium: "#cd9005ff", dark:"#876114ff", fade : ["#cd9005ff", "#aa7704ff", "#b88104ff", "#c38905ff"] }
                 ,  black  : { light: "#2b2b2bff", medium: "#3f3f3fff", dark:"#000000ff", fade : ["#717171ff", "#595959ff", "#6e6e6eff", "#8d8d8dff"] }
                 ,  white  : { light: "#f4f4f4ff", medium: "#e1e1e1ff", dark:"#5e5e5eff", fade : ["#717171ff", "#595959ff", "#6e6e6eff", "#8d8d8dff"] }
                 ,  red    : { light: "#b41e1eff", medium: "#a11212ff", dark:"#7e0e0eff", fade : ["#650b0bff", "#7d0e0eff", "#8a0f0fff", "#921010ff"] }
                 ,  blue   : { light: "#293061ff", medium: "#374080ff", dark:"#293061ff", fade : ["#3f3f3fff", "#4b64b7ff", "#5a6dbdff", "#6577c3ff"] }
                 ,  green  : { light: "#63b11aff", medium: "#5c9e1fff", dark:"#375815ff", fade : ["#416d14ff", "#4c7f17ff", "#548d1aff", "#5d9b1cff"] } };

// fixed colours
const grey = "#cdcdcdff";
const midGrey = "#b0b0b0ff";
const darkGrey = "#919191ff";
const aColour = "#29a9a1ff";
const darkAColour = "#1c736dff";
const bColour = "#e73148ff";
const darkBColour = "#9a1223ff";
const zColour = "#4e40b5ff";
const darkZColour = "#3b3280ff";
const cColour = "#e7c518ff";
const darkCColour = "#b68e0bff";

// button/stick/trigger movement constants
const lsXScale = 20;
const lsYScale = -20;
const csXScale = 10;
const csYScale = -10;
const triggerScale = -10;
const buttonOffset = -5;
