/*eslint-disable*/
import $ from 'jquery';
import {nullInputs} from "../../input/input";
import deepstream from 'deepstream.io-client-js';
import {
  setPlayerType,
  setMtype,
  setCurrentPlayer, player
  , changeGamemode
  , setStageSelect
  , startGame
  , setMatchTimer


} from "../main";
import {deepObjectMerge} from "../util/deepCopyObject";
import { setChosenChar} from "../../menus/css";
import pako from 'pako';
let ds = null;
let connectionReady = false;
let GAME_ID;
let playerID;
let HOST_GAME_ID = null;

export function logIntoServerAsSpectator() {
  ds = deepstream("wss://deepml.herokuapp.com:443").login(null, onSpectate);

}

function startRoom() {
  GAME_ID = ds.getUid().replace("-", "");
  playerID = ds.getUid().replace("-", "");

  ds.on('connectionStateChanged', function (connectionState) {
    var cssClass;

    if (connectionState === 'ERROR' || connectionState === 'CLOSED') {
      cssClass = 'red';
    }
    else if (connectionState === 'OPEN') {
      cssClass = 'green';
    }
    else {
      cssClass = 'yellow';
    }
//apply this to the front end at some point
    console.log("connection status : " + cssClass);
  });


}


function onSpectate() {
  connectionReady = true;
  startRoom();

  $("#spectate").on('click', (e) => {
    var destId = prompt("Hosts's peer ID:");
    connectToUser(destId);
  });
}


const connectedPeers = {};
const peerConnections = {};
const playerInputBuffer = [nullInputs(), nullInputs(), nullInputs(), nullInputs()];


export function saveNetworkInputs(playerSlot, inputBuffer) {
  playerInputBuffer[playerSlot][0] = inputBuffer;

}


export function connectAsSpectator() {

  logIntoServerAsSpectator();


}


function syncSpectator(exactportnumber) {

  //add host players
  for (let i = 0; i < exactportnumber; i++) {
    setPlayerType(i, 2);
    setMtype(i, 99);
    setCurrentPlayer(i, i);
  }

}

function clearRoster() {

  //add host players
  for (let i = 0; i < 4; i++) {
    setPlayerType(i, -1);
    setMtype(i, 99);
    setCurrentPlayer(i, -1);
  }

}


function connect(record, name) {
  // Handle a join connection.

  ds.record.getRecord(name + 'totalPlayers').whenReady(totalPlayerRecord => {
    clearRoster();
    syncSpectator(totalPlayerRecord.get().totalPlayers);

    changeGamemode(totalPlayerRecord.get().gameMode);
    setStageSelect(totalPlayerRecord.get().stageSelect);


    ds.event.emit(name+'getMatchTimer');

    if (totalPlayerRecord.get().gameMode === 3) {
      startGame();

    }
  });

  ds.event.subscribe(name + 'totalPlayers', data => {
    clearRoster();
    syncSpectator(data.totalPlayers);
    changeGamemode(data.gameMode);
    setStageSelect(data.stageSelect);



    if ( data.gameMode === 3) {
      startGame();

    }
  });
  ds.event.subscribe(name + 'player/', answer => {
    const data = JSON.parse(answer.bstring);
    if (data) {
      if (data.playerID !== playerID) {
        if (data.inputBuffer && (data.playerSlot !== undefined)) {
          saveNetworkInputs(data.playerSlot, data.inputBuffer);
          player[data.playerSlot].phys.pos = data.position;
        }
      }
    }
  });
  ds.event.subscribe(name + 'charSelection/', data => {
    if (data) {
      setChosenChar(data.playerSlot, data.charSelected);
    }
  });
  ds.event.subscribe(name + 'gameMode/', data => {
    if (data) {
      changeGamemode(data.gameMode);

    }
  });

  ds.event.subscribe(name + 'startGame/', data => {
    if (data) {
      setStageSelect(data.stageSelected);
      startGame();
    }
  });

  ds.event.subscribe(name + 'matchTimer/', data => {
    if (data) {
      setMatchTimer(data.stageSelected);
    }
  });
  peerConnections[name] = record;

}


function connectToUser(userName) {
  const requestedPeer = userName;
  if (!connectedPeers[requestedPeer]) {
    HOST_GAME_ID = requestedPeer;
    let playerRecord = ds.record.getRecord(requestedPeer + '-game').whenReady(statusRecord => {
      connect(statusRecord, requestedPeer);

    });


    peerConnections[requestedPeer] = playerRecord;

  }
  connectedPeers[requestedPeer] = 1;

}


