/*eslint-disable*/
import $ from 'jquery';
import {nullInputs, nullInput} from "../input";
import deepstream from 'deepstream.io-client-js';
import {
  setPlayerType,
  ports,
  addPlayer,
  currentPlayers,
  mType,
  setMtype,
  setCurrentPlayer, player
  , setCS
  , changeGamemode
  , setStageSelect
  , startGame
  , setTagText
  , gameMode
  , stageSelect
  , matchTimer
  , characterSelections
} from "../main";
import {deepCopyObject} from "../util/deepCopyObject";
import {setTokenPos, setChosenChar, setChoosingTag} from "../../menus/css";
import pako from 'pako';
import {gameSettings, updateGameSettings} from "../../settings";
import {updateGameTickDelay} from "../replay";


let ds = null;
let peerId = null;
let connectionReady = false;
let GAME_ID;
let playerID;
export let HOST_GAME_ID = null;
export let inServerMode = false;
export let meHost = true;
let joinedGame = false;
let lastRecievedPacket = 0;
const usServer = 'wss://deepml.herokuapp.com:443';
const eurServer = 'wss://deepmleur.herokuapp.com:443';
let pickedServer = 'america';
let packetNumber = 0;

$("#america").on("click", function () {
  localStorage.setItem('pickedServer', 'america');
  $("#europe").attr('checked', false);
  $("#localGame").attr('checked', false);
  ds = deepstream(usServer).login(null, _onLoggedIn);
  GAME_ID = ds.getUid().replace("-", "");
  playerID = ds.getUid().replace("-", "");

});

$("#europe").on("click", function () {
  localStorage.setItem('pickedServer', 'europe');
  $("#america").attr('checked', false);
  $("#localGame").attr('checked', false);
  ds = deepstream(eurServer).login(null, _onLoggedIn);
  GAME_ID = ds.getUid().replace("-", "");
  playerID = ds.getUid().replace("-", "");

});
$("#localGame").on("click", function () {
  localStorage.setItem('pickedServer', 'lan');
  $("#america").attr('checked', false);
  $("#europe").attr('checked', false);
  ds = deepstream(localStorage.getItem('lastLANIP')).login(null, _onLoggedIn);
  GAME_ID = ds.getUid().replace("-", "");
  playerID = ds.getUid().replace("-", "");

});
$("#lanIP").on("click", function () {
  var hostIP = prompt("Hosts's IP ADDRESS (enter nothing or localhost to be host):");
  $("#lanIP").attr("value", hostIP);
  $("#america").attr('checked', false);
  $("#europe").attr('checked', false);
  $("#localGame").attr('checked', true);
  if (hostIP === null || hostIP === undefined || hostIP === "" || hostIP === "localhost") {
    localStorage.setItem('lastLANIP', "localhost:6020");
  }
  localStorage.setItem('lastLANIP', hostIP + ":6020");
  console.log("server set to :" + localStorage.getItem('lastLANIP'));
});
if (localStorage.getItem('pickedServer') === 'america' || localStorage.getItem('pickedServer') === null) {
  $("#america").attr('checked', true);
  $("#europe").attr('checked', false);
  $("#localGame").attr('checked', false);
  localStorage.setItem('pickedServer', 'america');
} else if (localStorage.getItem('pickedServer') === 'america') {
  $("#europe").attr('checked', true);
  $("#america").attr('checked', false);
  $("#localGame").attr('checked', false);
  localStorage.setItem('pickedServer', 'europe');
} else {
  $("#europe").attr('checked', false);
  $("#america").attr('checked', false);
  $("#localGame").attr('checked', true);
  localStorage.setItem('pickedServer', 'lan');
}
export function logIntoServer() {
  if (localStorage.getItem('pickedServer') === 'america') {
    ds = deepstream(usServer).login(null, _onLoggedIn);
  } else if (localStorage.getItem('pickedServer') === 'europe') {
    ds = deepstream(eurServer).login(null, _onLoggedIn);
  } else {
    ds = deepstream(localStorage.getItem('lastLANIP')).login(null, _onLoggedIn);
  }

}

function getPlayerStatusRecord(playerID) {
  return playerStatusRecords[playerID];
}
function startRoom() {
  GAME_ID = ds.getUid().replace("-", "");
  playerID = ds.getUid().replace("-", "");
  inServerMode = true;
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
    $("#connstatus").css('background-color', cssClass);
  });

  ds.record.getRecord(GAME_ID + '-game').whenReady(statusRecord => {
    //  console.log("set up game status "+ GAME_ID);
    statusRecord.set(GAME_ID + 'playerStatus/', {
      "playerID": playerID,
      "ports": ports,
      "currentPlayers": currentPlayers,
      "gameSettings": gameSettings,
      "characterSelections": characterSelections,
    });
    playerStatusRecords[playerID] = statusRecord.get();
    $('#mpcode').prop("value", GAME_ID);

    let playerPayload = deepCopyObject(true, {}, player[getPlayerStatusRecord(playerID).ports - 1]);
    delete playerPayload.charAttributes;
    delete playerPayload.charHitboxes;
    delete playerPayload.prevFrameHitboxes;
    statusRecord.set(GAME_ID + 'player/',
        {
          name: playerID,
          playerSlot: ports - 1,
          inputBuffer: nullInput(),
          playerInfo: playerPayload
        });
    //TODO iterate over ports to establish inital group

    ds.event.subscribe(GAME_ID + 'playerStatus/', match => {
      if (match.playerID === playerID) {
        return;
      }

      playerStatusRecords[playerID] = statusRecord;
      syncHost(match);
      let totalPlayersRecord = ds.record.getRecord(GAME_ID + 'totalPlayers');
      totalPlayersRecord.set('totalPlayers', ports);
      totalPlayersRecord.set('gameMode', gameMode);
      totalPlayersRecord.set('currentPlayers', currentPlayers);
      totalPlayersRecord.set('stageSelect', stageSelect);
      totalPlayersRecord.set('characterSelections', characterSelections);
      ds.event.emit(GAME_ID + 'totalPlayers', {
        'totalPlayers': ports,
        "gameMode": gameMode,
        "stageSelect": stageSelect,
        "characterSelections": characterSelections,
        "currentPlayers": currentPlayers
      });
      statusRecord.set(GAME_ID + 'playerStatus/', {
        "playerID": playerID,
        "ports": ports,
        "currentPlayers": currentPlayers,
        "characterSelections": characterSelections,
        "gameSettings": gameSettings
      });
      HOST_GAME_ID = GAME_ID;

    });

    ds.event.subscribe(GAME_ID + 'player/', answer => {

      const data = JSON.parse(pako.inflate(answer.bstring, {to: 'string', level: 9}));
      if (data) {
        if (data.playerID !== playerID) {
          if (data.inputBuffer && (data.playerSlot !== undefined)) {
            const now = performance.now();
            let frameDelay = now - lastRecievedPacket;
            if (frameDelay > 33) {
              frameDelay = 33;
            }
            lastRecievedPacket = now;
            updateGameTickDelay(frameDelay);
            saveNetworkInputs(data.playerSlot, data.inputBuffer);
            player[data.playerSlot] = deepCopyObject(true, player[data.playerSlot], data.playerInfo);
          }
        }
      }
    });

    ds.event.subscribe(GAME_ID + 'charSelection/', data => {
      if (data) {
        setChosenChar(data.playerSlot, data.charSelected);
      }
    });
    ds.event.subscribe(GAME_ID + 'gameMode/', data => {
      if (data) {
        changeGamemode(data.gameMode);
      }
    });
    ds.event.subscribe(GAME_ID + 'startGame/', data => {
      if (data) {
        setStageSelect(data.stageSelected);
        ds.record.getRecord(GAME_ID + 'totalPlayers').set('stageSelect', data.stageSelected);
        $("#pTagEdit" + 0).hide();
        $("#pTagEdit" + 1).hide();
        $("#pTagEdit" + 2).hide();
        $("#pTagEdit" + 3).hide();
        $("#pTagEdit" + 4).hide();
        $("#pTagEdit" + 0).blur();
        $("#pTagEdit" + 1).blur();
        $("#pTagEdit" + 2).blur();
        $("#pTagEdit" + 3).blur();
        $("#pTagEdit" + 4).blur();
        document.getSelection().removeAllRanges();
        setChoosingTag(-1);
        startGame();
      }
    });
    ds.event.subscribe(GAME_ID + 'setTag/', data => {
      if (data) {
        setTagText(data.playerSlot, data.tagText);
      }
    });

    ds.event.subscribe(GAME_ID + 'getMatchTimer/', data => {

      syncMatchTimer(matchTimer);

    });

  });


}
function _onLoggedIn() {
  connectionReady = true;
  startRoom();

  $("#joinServer").on('click', (e) => {
    var destId = prompt("Hosts's peer ID:");
    connectToUser(destId);
  });
}

let hostRoom = null;

const connectedPeers = {};
const peerConnections = {};
const playerStatusRecords = {};

const playerInputBuffer = [nullInputs(), nullInputs(), nullInputs(), nullInputs()];


export const giveInputs = {};

export function setNetInputFlag(name, val) {
  giveInputs[name] = val;
}

function sendInputsOverNet(inputBuffer, playerSlot) {

  //   console.log("sending inputs");
  //dont be lazy like me;
  let playerPayload = Object.assign({}, player[playerSlot]);
  delete playerPayload.charAttributes;
  delete playerPayload.charHitboxes;
  delete playerPayload.prevFrameHitboxes;
  let payload = {
    "playerID": playerID,
    "playerSlot": playerSlot,
    "inputBuffer": inputBuffer,
    "playerInfo": playerPayload
  };
  ds.event.emit(HOST_GAME_ID + 'player/', {"bstring": pako.deflate(JSON.stringify(payload), {to: 'string', level: 9})});

}

export function updateNetworkInputs(inputBuffer, playerSlot) {

  playerInputBuffer[playerSlot][0] = inputBuffer;

  sendInputsOverNet(inputBuffer, playerSlot);

}

export function saveNetworkInputs(playerSlot, inputBuffer) {
  playerInputBuffer[playerSlot][0] = inputBuffer;

}

export function retrieveNetworkInputs(playerSlot) {
  return playerInputBuffer[playerSlot][0];
}


//connect to global chat
export function connectToMPServer() {

  logIntoServer();


}

function getHostRoom() {
  return connectedPeers;
}

function syncClient(data) {
  const exactportnumber = data.ports;
  const charselected = data.characterSelections;
  let portSnapshot = ports;
  if (joinedGame === false) {
    joinedGame = true;
    let tempCurrentPlayers = deepCopyObject(true, {}, currentPlayers);
    let playersToBeReassigned = tempCurrentPlayers.length;
    let mTypeSnapshot = deepCopyObject(true, {}, mType);
    let charSelectedSnapshot = deepCopyObject(true, {}, characterSelections);
    //add host players
    for (let v = ports; v <= exactportnumber - 1; v++) {

      addPlayer(v, 99);
    }
    for (let i = 0; i < exactportnumber; i++) {
      setPlayerType(i, 2);
      setMtype(i, 99);
      setCurrentPlayer(i, i);
      setNetInputFlag(i, false);
      setCS(i, charselected[i]);
    }
    //reassign player 1
    //TODO figure out how to join wiht multiple in original party
    addPlayer(tempCurrentPlayers[0], mTypeSnapshot[0]);
    setNetInputFlag(exactportnumber, true);
    setCS(exactportnumber, charSelectedSnapshot[0]);
  } else {

    for (let j = ports; ports < exactportnumber + 1; j++) {
      addPlayer(j, 99);
    }
  }

}

function syncHost(data) {

  //add joining players
  //TODO Currently assuming only one player joins
  setCS(data.ports, data.characterSelections[data.ports]);
  setNetInputFlag(0, true);
  addPlayer(ports, 99);
  setNetInputFlag(ports, false);

}


function connect(record, name) {
  // Handle a join connection.

  ds.record.getRecord(name + 'totalPlayers').whenReady(totalPlayerRecord => {


    const hostStateRecord = totalPlayerRecord.get();
    if (hostStateRecord.totalPlayers > 3) {
      alert("Host room is full");

    } else {


      record.whenReady(data => {

        let result = data.get();

        if (Object.keys(result).length === 0 && result.constructor === Object) {
          alert("error room appears to be empty");
        } else if (result.gameMode === 3) {
          alert("The match is currently in progress. please wait until it has completed");
        } else if (currentPlayers.length > 1) {
          alert("Too many players your current session. Only one player may join per browser until I figure out a solution");
        } else if (result.gameMode === 6) {
          alert("The host is already in stage select. Please wait until the match has completed or have the host return to character select");
        } else {
          let playerstatus = Object.keys(result)[0];
          playerStatusRecords[name] = record;

          syncClient(result[playerstatus]);
          meHost = false;
          updateGameSettings(result[playerstatus].gameSettings);

          ds.event.emit(name + 'playerStatus/', {
            "playerID": playerID,
            "ports": ports - 1,
            "currentPlayers": currentPlayers,
            "characterSelections": characterSelections
          });
          let playerPayload = Object.assign({}, player[ports]);
          delete playerPayload.charAttributes;
          delete playerPayload.charHitboxes;
          delete playerPayload.prevFrameHitboxes;
          let payload = {
            "playerID": playerID,
            "playerSlot": ports - 1,
            "inputBuffer": playerInputBuffer,
            "playerInfo": playerPayload
          };
          ds.event.emit(name + 'player/', {"bstring": pako.deflate(JSON.stringify(payload), {to: 'string', level: 9})});
          // ds.event.emit(name + 'charSelection/', {"playerSlot": ports -1, "charSelected": characterSelections[0]});

          ds.event.subscribe(name + 'playerStatus/', match => {
            if (match.playerID === playerID) {
              return;
            }

            syncClient(match);


          });

          ds.event.subscribe(name + 'player/', answer => {

            const data = JSON.parse(pako.inflate(answer.bstring, {to: 'string', level: 9}));
            if (data) {
              if (data.playerID !== playerID) {
                if (data.inputBuffer && (data.playerSlot !== undefined)) {
                  const now = performance.now();
                  let frameDelay = now - lastRecievedPacket;
                  if (frameDelay > 33) {
                    frameDelay = 33;
                  }
                  lastRecievedPacket = now;
                  updateGameTickDelay(frameDelay);
                  saveNetworkInputs(data.playerSlot, data.inputBuffer);
                  player[data.playerSlot] = deepCopyObject(true, player[data.playerSlot], data.playerInfo);
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
              if (data.gameMode === 2 || data.gameMode === 3 || data.gameMode === 6) {
                changeGamemode(data.gameMode);
              }

            }
          });

          ds.event.subscribe(name + 'startGame/', data => {
            if (data) {
              setStageSelect(data.stageSelected);
              startGame();
            }
          });
          ds.event.subscribe(name + 'setTag/', data => {
            if (data) {
              setTagText(data.playerSlot, data.tagText);
            }
          });
          peerConnections[name] = record;
        }
      });
    }
  });
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


export function syncCharacter(index, charSelection) {
  if (HOST_GAME_ID !== null) {
    ds.event.emit(HOST_GAME_ID + 'charSelection/', {"playerSlot": index, "charSelected": charSelection});
  }
  if (meHost) {
    ds.record.getRecord(GAME_ID + '-game').whenReady(statusRecord => {
      //  console.log("set up game status "+ GAME_ID);
      statusRecord.set(GAME_ID + 'playerStatus/', {
        "playerID": playerID,
        "ports": ports,
        "currentPlayers": currentPlayers,
        "gameSettings": gameSettings,
        "characterSelections": characterSelections
      });
    });
  }
}

export function syncGameMode(gameMode) {
  if (HOST_GAME_ID !== null) {
    ds.event.emit(HOST_GAME_ID + 'gameMode/', {"gameMode": gameMode});
  }
}


export function syncStartGame(stageSelected) {
  if (HOST_GAME_ID !== null) {
    ds.event.emit(HOST_GAME_ID + 'startGame/', {"stageSelected": stageSelected});
    ds.record.getRecord(HOST_GAME_ID + '-game').set('gameMode', gameMode);
  }
}

export function syncTagText(playerSlot, tagText) {
  if (HOST_GAME_ID !== null) {
    ds.event.emit(HOST_GAME_ID + 'setTag/', {"playerSlot": playerSlot, "tagText": tagText});
  }
}
export function syncMatchTimer(timer) {
  if (HOST_GAME_ID !== null) {
    ds.event.emit(HOST_GAME_ID + 'matchTimer/', {"matchTimer": timer});
  }
}


