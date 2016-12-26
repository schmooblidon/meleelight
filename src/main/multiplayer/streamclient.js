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
} from "../main";
import {deepCopyObject} from "../util/deepCopyObject";
import {setTokenPos, setChosenChar} from "../../menus/css";
let ds = null;
let peerId = null;
let connectionReady = false;
let GAME_ID;
let playerID;
let HOST_GAME_ID = null;
let joinedGame = false;
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
      let totalPlayersRecord=   ds.record.getRecord(GAME_ID+'totalPlayers');
      totalPlayersRecord.set('totalPlayers',ports);
      ds.event.emit(GAME_ID+'totalPlayers',{'totalPlayers':ports});
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
        startGame();
      }
    });

  });


}
function _onLoggedIn() {
  connectionReady = true;
  startRoom();

  $("#player1").on('click', (e) => {
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
  ds.event.emit(HOST_GAME_ID + 'player/', payload);

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

function syncClient(exactportnumber) {
  let portSnapshot = ports;
  if(joinedGame === false) {
    joinedGame = true;
    let tempCurrentPlayers = deepCopyObject(true, {}, currentPlayers);
    let playersToBeReassigned = tempCurrentPlayers.length;
    let mTypeSnapshot = deepCopyObject(true, {}, mType);
    //add host players
    for(let v =ports;v <= exactportnumber - 1;v++){

      addPlayer(v,99);
    }
    for (let i = 0; i < exactportnumber; i++) {
      setPlayerType(i, 2);
      setMtype(i, 99);
      setCurrentPlayer(i, i);
      setNetInputFlag(exactportnumber, false);
    }
    //reassign current players
    addPlayer(exactportnumber , mTypeSnapshot[0]);
    setNetInputFlag(exactportnumber, true);
  }else {

    for(let j = ports;ports < exactportnumber + 1 ;j++){
      addPlayer(j,99);
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


  let data = record.get();


  if (Object.keys(data).length === 0 && data.constructor === Object) {
    alert("error room appears to be empty");
  } else {
    let playerstatus = Object.keys(data)[0];
    playerStatusRecords[name] = record;

    syncClient(data[playerstatus].ports);
    ds.event.emit(name + 'playerStatus/', {
      "playerID": playerID,
      "ports": ports - 1,
      "currentPlayers": currentPlayers
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
    ds.event.emit(name + 'player/', payload);

    ds.event.subscribe(name + 'playerStatus/', match => {
      if (match.playerID === playerID) {
        return;
      }

      syncClient(match.ports);


    });
  }
  ds.event.subscribe(name + 'player/', data => {
    //  console.log("listener player  "+ GAME_ID);
    //  console.log(data);
    if (data) {
      if (data.playerID !== playerID) {
        if (data.inputBuffer && (data.playerSlot !== undefined)) {
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
      changeGamemode(data.gameMode);

    }
  });

  ds.event.subscribe(name + 'startGame/', data => {
    if (data) {
      setStageSelect(data.stageSelected);
      startGame();
    }
  });
  peerConnections[name] = record;

}

function eachActiveConnection(fn) {
  const actives = Object.keys(connectedPeers);
  const checkedIds = {};
  for (let val of actives) {

    if (!checkedIds[val]) {
      const conns = getHostRoom()[val];
      let i = 0;
      const ii = conns.length;
      for (; i < ii; i += 1) {
        const conn = conns[i];
        fn(conn);
      }
    }
    checkedIds[val] = 1;
  }
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
   if(HOST_GAME_ID !== null) {
     ds.event.emit(HOST_GAME_ID + 'charSelection/', {"playerSlot": index, "charSelected": charSelection});
   }
}

export function syncGameMode( gameMode) {
  if(HOST_GAME_ID !== null) {
    ds.event.emit(HOST_GAME_ID + 'gameMode/', {"gameMode": gameMode});
  }
}



export function syncStartGame( stageSelected) {
  if(HOST_GAME_ID !== null ) {
    ds.event.emit(HOST_GAME_ID + 'startGame/', {"stageSelected": stageSelected});
  }
}


