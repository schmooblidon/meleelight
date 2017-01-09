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
} from "./main";
import {deepCopyObject} from "./util/deepCopyObject";
import pako from "pako";
import $ from 'jquery';
import localforage from 'localforage';
import {aiInputBank} from "./input";
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
export let replaysOn = $("#replayson").attr('checked');
$("#replayson").on("click", () => {
  localStorage.setItem('replayson', !replaysOn);
  $("#replayson").attr('checked', !replaysOn);
  replaysOn = !replaysOn;

});

export function updateGameTickDelay(val) {
  gameTickDelay = val;
}
const prevFramePlayer = [];


function compressObject(obj) {
  return pako.deflate(JSON.stringify(obj));
}
function decompressObject(obj) {
  return JSON.parse(pako.inflate(obj, {to: 'string'}));
}
export function saveGameState(input) {
  if (playing && replaysOn) {
    const now = performance.now();
    const frameDelay = now - lastFrametime;
    lastFrametime = now;
    for (let i = 0; i < playerType.length; i++) {
      //TODO compare to previous frame and only save diff
      if (playerType[i] === 1) {
        fullGameState.inputs[i] = deepCopyObject(true, {}, aiInputBank[i][0]);
        const playerSaveData = deepCopyObject(true, {}, player[i]);
        delete playerSaveData.charAttributes;
        delete playerSaveData.charHitboxes;
        delete playerSaveData.prevFrameHitboxes;
        fullGameState.playerData[i] = playerSaveData;
      } else if (playerType[i] === 0) {
        fullGameState.inputs[i] = deepCopyObject(true, {}, input[i][0]);
        const playerSaveData = deepCopyObject(true, {}, player[i]);
        delete playerSaveData.charAttributes;
        delete playerSaveData.charHitboxes;
        delete playerSaveData.prevFrameHitboxes;
        fullGameState.playerData[i] = playerSaveData;
      } else if (playerType[i] === 2) {
        fullGameState.inputs[i] = deepCopyObject(true, {}, input[i][0]);
        const playerSaveData = deepCopyObject(true, {}, player[i]);
        delete playerSaveData.charAttributes;
        delete playerSaveData.charHitboxes;
        delete playerSaveData.prevFrameHitboxes;
        fullGameState.playerData[i] = playerSaveData;
      }
      // console.log(diff(prevFramePlayer[i], player[i]));
      prevFramePlayer[i] = deepCopyObject(true, prevFramePlayer[i], player[i]);

    }
    fullGameState.frameDelay = frameDelay;
    snapShot.push(compressObject({frameCount, fullGameState}));
    frameCount++;

  }
  if (!playing && (frameCount > 0) && replaysOn) {
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


    const decompressed = decompressObject(event.currentTarget.result, {to: 'string'});

    replayActive = true;
    setStageSelect(decompressObject(decompressed[0]));

    const deplayerTypes = decompressObject(decompressed[1]);

    //ASSUMING PLAYER 1 IS ALWAYS POPULATED
    for (let j = 1; j < deplayerTypes.length; j++) {
      if (deplayerTypes[j] !== -1) {
        addPlayer(j, 0);
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
      replayFrameData.push(stateData.fullGameState.frameDelay);
    }
    startGame();
  };
  reader.readAsBinaryString(file);

//   // when the file is read it triggers the onload event above.
//   reader.readAsDataURL(file);


}

export function retrieveReplayInputs(playerSlot) {
  const returnInput = replayInputs[playingFrame][playerSlot];
  player[playerSlot] = deepCopyObject(true, player[playerSlot], replayPlayerData[playingFrame][playerSlot]);
  playingFrame++;
  gameTickDelay = replayFrameData[playingFrame];
  return returnInput;
}

const isEmptyObject = function (obj) {
  let name;
  for (name in obj) {
    return false;
  }
  return true;
};

const diff = function (obj1, obj2) {
  const result = {};
  let change;
  for (const key in obj1) {
    if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
      change = diff(obj1[key], obj2[key]);
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