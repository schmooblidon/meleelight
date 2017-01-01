import {player, currentPlayers, interpretInputs, playing, playerType} from "./main";
import {deepCopyObject} from "./util/deepCopyObject";
import pako from "pako";
const fullGameState = [{}];
let frameCount = 0;
let snapShot = [];
import localforage from 'localforage';
import {aiInputBank} from "./input";
import {activeStage} from "../stages/activeStage";

export function saveGameState(input, ports) {
  if (playing) {
    for (let i = 0; i < ports; i++) {
      if (playerType[i] === 1) {
        fullGameState[i].inputs = deepCopyObject(true, {}, aiInputBank[i][0]);
      } else {
        fullGameState[i].inputs = deepCopyObject(true, {}, input[i]);
      }
    }
    snapShot.push(pako.deflate(JSON.stringify({frameCount, fullGameState})));
    frameCount++;

  }
  if (!playing && (frameCount > 0)) {
    frameCount = 0;
    const headerFrame = {};
    headerFrame.activeStage = activeStage;
    headerFrame.currentPlayers = currentPlayers;
    replayname = 'replay-' + new Date() + '.bin';
    localforage.setItem(replayname, snapShot).then((value) => {
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
    const blob = new Blob([data], {type: "octet/stream"});
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
}());

export function loadReplay(file) {

  var reader = new FileReader();

  // inject an image with the src url
  reader.onload = function (event) {
    const result = [];
    for (let i = 0; i < event.detail.length; i++) {
      result.push(JSON.parse(pako.inflate(event.detail[i], {to: 'string'})));
    }

    startGame();
  };

  // when the file is read it triggers the onload event above.
  reader.readAsDataURL(file);


}