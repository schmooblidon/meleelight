import {
  player,
  playing,
  playerType,
  startGame,
  characterSelections,
  setCS
  , addPlayer
  , stageSelect
  , setStageSelect
  , endGame
  , finishGame
  , ports
  , starting
  , pause
  , gameEnd
} from "./main";
import {deepCopyObject} from "./util/deepCopyObject";
import pako from "pako";
import $ from 'jquery';
import localforage from 'localforage';
import {aiInputBank, nullInput} from "./input";
const fullGameState = {};
fullGameState.inputs = [];
fullGameState.playerData = [];
let frameCount = 0;
let snapShot = [];
export let replayActive = false;
const result = [];
let playingFrame = 0;
const replayInputs = [];
const replayPlayerData = [];
const replayFrameData = [];
let lastFrametime = performance.now();
export let gameTickDelay = 0;
export let replaysOn = localStorage.getItem('replayson') || false;
export let playingReplay = false;
$("#replayson").on("click", () => {
  replaysOn = !replaysOn;
  localStorage.setItem('replayson', replaysOn);
  $("#replayson").attr('checked', replaysOn);


});


$("#replayson").attr('checked', replaysOn);

export function updateGameTickDelay(val) {
  gameTickDelay = val;
}
const prevFramePlayer = [];


function compressObject(obj) {
  return pako.deflate(JSON.stringify(obj));
}
function decompressObject(obj) {
  return JSON.parse(pako.inflate(obj, {to: "string"}));
}
export function saveGameState(input) {
  if (!playingReplay) {
    if (playing && replaysOn && !starting && !pause[0][0]) {
      const now = performance.now();
      const frameDelay = now - lastFrametime;
      lastFrametime = now;
      for (let i = 0; i < playerType.length; i++) {

        if (playerType[i] === 1) {
          fullGameState.inputs[i] = deepCopyObject(true, {}, aiInputBank[i][0]);

        } else if (playerType[i] === 0) {
          fullGameState.inputs[i] = deepCopyObject(true, {}, input[i][0]);

        } else if (playerType[i] === 2) {
          fullGameState.inputs[i] = deepCopyObject(true, {}, input[i][0]);

        }
        const exclusions = ["charAttributes",
          "charHitboxes",
          "prevFrameHitboxes"];
        fullGameState.playerData[i] = player[i].phys.pos;

        prevFramePlayer[i] = deepCopyObject(true, prevFramePlayer[i], player[i], exclusions);

      }
      fullGameState.frameDelay = frameDelay;
      snapShot.push(compressObject({frameCount, fullGameState}));
      frameCount++;

    }
    if (!playing && (frameCount > 0) && replaysOn && gameEnd) {
      frameCount = 0;
      const headerFrame = {};
      const replayname = 'replay-' + new Date() + '.json';
      const wholeReplay = [];
      wholeReplay.push(compressObject(stageSelect));
      wholeReplay.push(compressObject(playerType));
      wholeReplay.push(compressObject(characterSelections));
      wholeReplay.push(snapShot);
      localforage.setItem(replayname, wholeReplay).then((value) => {
        let resultAsUint8Array;
        localforage.getItem(replayname).then((value) => {
          // This code runs once the value has been loaded
          // from the offline store.

          saveData(value, replayname);

          snapShot = [];
        }).catch((err) => {
          // This code runs if there were any errors
          console.log(err);
        });
      }).catch((err) => {
        // This code runs if there were any errors
        console.log(err);
      });


    }
  }
}
const saveData = (function () {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  return function (data, fileName) {
    const blob = new Blob([compressObject(data)], {type: "octet/stream"});
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
}());

export function loadReplay(file) {

  const reader = new FileReader();

  reader.onload = function (event) {


    const decompressed = decompressObject(event.currentTarget.result);

    replayActive = true;
    setStageSelect(decompressObject(decompressed[0]));

    const deplayerTypes = decompressObject(decompressed[1]);

    //ASSUMING PLAYER 1 IS ALWAYS POPULATED
    for (let j = 1; j < deplayerTypes.length; j++) {
      if (playerType.length === deplayerTypes.length) {
        if (deplayerTypes[j] !== -1) {
          addPlayer(j, 0);
        }
      }
    }

    const decharacterSelections = decompressObject(decompressed[2]);
    for (let j = 0; j < decharacterSelections.length; j++) {
      setCS(j, decharacterSelections[j]);
    }
    const replayInputPackage = decompressed[3];
    for (let n = 0; n < replayInputPackage.length; n++) {
      const stateData = decompressObject(replayInputPackage[n]);
      replayInputs.push(stateData.fullGameState.inputs);
      replayPlayerData.push(stateData.fullGameState.playerData);
      // replayFrameData.push(stateData.fullGameState.frameDelay);
    }
    playingReplay = true;
    startGame();
  };
  reader.readAsBinaryString(file);


}

export function retrieveReplayInputs(playerSlot) {
  if (replayInputs[playingFrame] === undefined) {
    finishGame();
    return new nullInput();
  }
  const returnInput = replayInputs[playingFrame][playerSlot];
  player[playerSlot].phys.pos = replayPlayerData[playingFrame][playerSlot];
  if (playerSlot === (ports - 1)) {
    playingFrame++;
  }
  // gameTickDelay = replayFrameData[playingFrame];
  return returnInput;
}

const isEmptyObject = function (obj) {
  let name;
  for (name in obj) {
    return false;
  }
  return true;
};

const diff = function (obj1, obj2, exclusions) {
  const result = {};
  let change;
  for (const key in obj1) {
    if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object' && exclusions.indexOf(key) === -1) {
      change = diff(obj1[key], obj2[key], exclusions);
      if (isEmptyObject(change) === false) {
        result[key] = change;
      }
    }
    else if (obj2[key] !== obj1[key]) {
      result[key] = obj2[key];
    }
  }
  return result;
};

export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
}

export default function mergeDeep(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}