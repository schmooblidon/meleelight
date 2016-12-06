/* eslint-disable */

/*
 Use http://keycode.info/ to find keycodes
 0 = disabled
 Modifier item goes [ Keycode , X/L scale , Y/R scale ]
*/
export const keyMap = {
  "lstick" : {
    "up" : [87,0],
    "right" : [68,0],
    "left" : [65,0],
    "down" : [83,0],
    "ranges" : [1,1,1,1],
    "modifiers" : [[32,0.7,0.7],[0,0.5,0.5],[0,0.5,0.5],[0,0.5,0.5],[0,0.5,0.5]]
  },
  "cstick" : {
    "up" : [38,0],
    "right" : [39,0],
    "left" : [37,0],
    "down" : [40,0],
    "ranges" : [1,1,1,1]
  },
  "shoulders" : {
    "lAnalog" : [111,0],
    "rAnalog" : [106,0],
    "ranges" : [1,1],
    "modifiers" : [[0,0.5,0.5],[0,0.5,0.5],[0,0.5,0.5],[0,0.5,0.5],[0,0.5,0.5]]
  },
  "a" : [76,101],
  "b" : [75,100],
  "x" : [186,102],
  "y" : [79,104],
  "z" : [192,107],
  "l" : [73,103],
  "r" : [80,105],
  "s" : [219,109],
  "du" : [71],
  "dr" : [78],
  "dd" : [66],
  "dl" : [86],
};

export const gameSettings = {
  turbo : 0,
  lCancelType : 0, // 0- normal | 1 - Auto | 2 - smash 64
  blastzoneWrapping : 0,
  flashOnLCancel : 0,
  dustLessPerfectWavedash : 0,
  phantomThreshold : 0.01,
  everyCharWallJump : 0, //0 - off | 1 - on
};
