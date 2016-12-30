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
import jsondiffinstance from 'jsondiffpatch';
let ds = null;
let peerId = null;
let connectionReady = false;
let GAME_ID;
let playerID;
let HOST_GAME_ID = null;
let joinedGame = false;
let hostRoom = null;

var isLoop = function(context) {
  var i=0;
  var currentParentContext = context.parent;
  while (currentParentContext !== undefined){
    if(currentParentContext.left === context.left  && currentParentContext.right === context.right ){
      return true;
    }
    currentParentContext = currentParentContext.parent;
    i++;
    if(i>=100000){
      throw Error("fatal error in loop detection");
    }
  }
  return false;
}

//custom filter to handle cyclic loop
var loopDetectionFilter = function(context) {
  if (typeof context.left === 'object' && typeof context.right === 'object') {
    if (context.childName === 'charAttributes' ||context.childName === 'charHitboxes' ||context.childName === 'hitboxes' ||context.childName === 'prevFrameHitboxes' || isLoop(context)) {
      context.setResult(undefined);
      context.exit();
    }
  }
};

loopDetectionFilter.filterName = 'loopDetection';

var loopingDetectionPatchFilter = function(context) {
  if (context.delta && context.childName === 'charAttributes' ||context.childName === 'charHitboxes' ||context.childName === 'hitboxes' ||context.childName === 'prevFrameHitboxes' || isLoop(context)) {
    context.setResult(undefined).exit();
  }
};
loopingDetectionPatchFilter.filterName = 'aloopcheck';


let jsondiff =jsondiffinstance.create({
  // used to match objects when diffing arrays, by default only === operator is used
  objectHash: function (obj,index) {
    // this function is used only to when objects are not equal by ref
    return '$$index:' + index;
  },
  debug:true,
  arrays: {
    // default true, detect items moved inside the array (otherwise they will be registered as remove+add)
    detectMove: true,
    // default false, the value of items moved is not included in deltas
    includeValueOnMove: false
  },
  textDiff: {
    // default 60, minimum string length (left and right sides) to use text diff algorythm: google-diff-match-patch
    minLength: 60
  },
  propertyFilter: function (name, context) {
    /*
     this optional function can be specified to ignore object properties (eg. volatile data)
     name: property name, present in either context.left or context.right objects
     context: the diff context (has context.left and context.right objects)
     */
    return ((name.slice(0, 1) !== '$') && (name !== 'charAttributes') && (name !== 'charHitboxes') && (name !== 'hitboxes') && (name !== 'prevFrameHitboxes'));
  },
  cloneDiffValues: true /* default false. if true, values in the obtained delta will be cloned
   (using jsondiffpatch.clone by default), to ensure delta keeps no references to left or right objects. this becomes useful if you're diffing and patching the same objects multiple times without serializing deltas.
   instead of true, a function can be specified here to provide a custom clone(value)
   */
});
jsondiff.processor.pipes.diff.before('trivial', loopDetectionFilter);

jsondiff.processor.pipes.patch.before('trivial', loopingDetectionPatchFilter);
const connectedPeers = {};
const peerConnections = {};
const playerStatusRecords = {};

const playerInputBuffer = [nullInputs(), nullInputs(), nullInputs(), nullInputs()];


export const giveInputs = {};

const prevFramePayload = [];
const prevFramePlayerInfo = [];

export function logIntoServer() {
  ds = deepstream("wss://deepml.herokuapp.com:443").login(null, _onLoggedIn);

}

function getPlayerStatusRecord(playerID) {
  return playerStatusRecords[playerID];
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

  ds.record.getRecord(GAME_ID + '-game').whenReady(statusRecord => {
    //  console.log("set up game status "+ GAME_ID);
    statusRecord.set(GAME_ID + 'playerStatus/', {
      "playerID": playerID,
      "ports": ports,
      "currentPlayers": currentPlayers
    });
    playerStatusRecords[playerID] = statusRecord.get();
    $('#mpcode').prop("value", GAME_ID);

    let playerPayload = deepCopyObject(true, {}, player[getPlayerStatusRecord(playerID).ports - 1]);
    delete playerPayload.charAttributes;
    delete playerPayload.charHitboxes;
    delete playerPayload.prevFrameHitboxes;
    delete playerPayload.hitboxes;
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
      syncHost(match.ports);
      let totalPlayersRecord = ds.record.getRecord(GAME_ID + 'totalPlayers');
      totalPlayersRecord.set('totalPlayers', ports);
      totalPlayersRecord.set('gameMode', gameMode);
      totalPlayersRecord.set('stageSelect', stageSelect);
      ds.event.emit(GAME_ID + 'totalPlayers', {
        'totalPlayers': ports,
        "gameMode": gameMode,
        "stageSelect": stageSelect
      });
      statusRecord.set(GAME_ID + 'playerStatus/', {
        "playerID": playerID,
        "ports": ports,
        "currentPlayers": currentPlayers
      });
      HOST_GAME_ID = GAME_ID;

    });

    ds.event.subscribe(GAME_ID + 'player/', data => {

      if (data) {
        if (data.playerID !== playerID) {
          if (data.inputBuffer && (data.playerSlot !== undefined)) {
            saveNetworkInputs(data.playerSlot, data.inputBuffer);
            if(Object.getOwnPropertyNames(data.playerInfo).length > 0) {
              jsondiff.patch(player[data.playerSlot], data.playerInfo);
            }
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

      syncMatchTimer(data.matchTimer);

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


export function setNetInputFlag(name, val) {
  giveInputs[name] = val;
}

function isNotEmpty(payload) {
  return (payload !== undefined) && Object.getOwnPropertyNames(payload).length > 0;
}
function sendInputsOverNet(inputBuffer, playerSlot) {
  let inputPayload = jsondiff.diff(playerInputBuffer[playerSlot][0], inputBuffer);
  if (inputPayload === undefined) {
    return;
  }

  playerInputBuffer[playerSlot][0]=inputBuffer;

  let playerInfo;
  if (prevFramePlayerInfo[playerSlot] === undefined) {
    prevFramePlayerInfo[playerSlot] = deepCopyObject(true, {}, player[playerSlot]);
  }
  playerInfo = jsondiff.diff(prevFramePlayerInfo[playerSlot], player[playerSlot]) || {};

  if (isNotEmpty(inputPayload) || isNotEmpty(playerInfo)) {
    let result = {
      "playerID": playerID,
      "playerSlot": playerSlot,
      "inputBuffer": inputPayload,
      "playerInfo": playerInfo
    };

    if(result[0]) {
      result = result[0];
    }
    result.playerSlot = playerSlot;
    result.playerID = playerID;
    ds.event.emit(HOST_GAME_ID + 'player/', result);
  }
}

export function updateNetworkInputs(inputBuffer, playerSlot) {


  sendInputsOverNet(inputBuffer, playerSlot);

}

export function saveNetworkInputs(playerSlot, inputBuffer) {
  //if inputbuffer is undefined it counts as no diff
  jsondiff.patch(playerInputBuffer[playerSlot][0], inputBuffer);

}

export function retrieveNetworkInputs(playerSlot) {
  return playerInputBuffer[playerSlot][0];
}


//connect to global chat
export function connectToMPServer() {

  logIntoServer();


}


function syncClient(exactportnumber) {
  let portSnapshot = ports;
  if (joinedGame === false) {
    joinedGame = true;
    let tempCurrentPlayers = deepCopyObject(true, {}, currentPlayers);
    let playersToBeReassigned = tempCurrentPlayers.length;
    let mTypeSnapshot = deepCopyObject(true, {}, mType);
    //add host players
    for (let v = ports; v <= exactportnumber - 1; v++) {

      addPlayer(v, 99);
    }
    for (let i = 0; i < exactportnumber; i++) {
      setPlayerType(i, 2);
      setMtype(i, 99);
      setCurrentPlayer(i, i);
      setNetInputFlag(exactportnumber, false);
    }
    //reassign player 1
    //TODO figure out how to join wiht multiple in original party
    addPlayer(tempCurrentPlayers[0], mTypeSnapshot[0]);
    setNetInputFlag(exactportnumber, true);
  } else {

    for (let j = ports; ports < exactportnumber + 1; j++) {
      addPlayer(j, 99);
    }
  }

}

function syncHost() {

  //add joining players

  setNetInputFlag(0, true);
  addPlayer(ports, 99);
  setNetInputFlag(ports, false);
}


function connect(record, name) {
  // Handle a join connection.

  ds.record.getRecord(name + 'totalPlayers').whenReady(totalPlayerRecord => {


    if (totalPlayerRecord.get().totalPlayers > 3) {
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

          syncClient(result[playerstatus].ports);
          ds.event.emit(name + 'playerStatus/', {
            "playerID": playerID,
            "ports": ports - 1,
            "currentPlayers": currentPlayers
          });

          let payload = {
            "playerID": playerID,
            "playerSlot": ports - 1,
            "inputBuffer": playerInputBuffer[ports - 1][0],
            "playerInfo": {}
          };
          ds.event.emit(name + 'player/', payload);
          ds.event.emit(name + 'charSelection/', {"playerSlot": ports -1, "charSelected": characterSelections[0]});
          ds.event.subscribe(name + 'playerStatus/', match => {
            if (match.playerID === playerID) {
              return;
            }

            syncClient(match.ports);


          });

          ds.event.subscribe(name + 'player/', data => {

            if (data) {
              if (data.playerID !== playerID) {
                if (data.inputBuffer && (data.playerSlot !== undefined)) {
                  saveNetworkInputs(data.playerSlot, data.inputBuffer);
                  if(Object.getOwnPropertyNames(data.playerInfo).length > 0) {
                    jsondiff.patch(player[data.playerSlot], data.playerInfo);
                  }
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



