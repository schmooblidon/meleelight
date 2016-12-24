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
} from "../main";
import {deepCopyObject} from "../util/deepCopyObject";
let ds = null;
let peerId = null;
let connectionReady = false;
let GAME_ID;
let playerID;

export function logIntoServer() {
  ds = deepstream("deepml.herokuapp.com:80").login(null, _onLoggedIn);

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
    statusRecord.set(`playerStatus/`, {
      "playerID": playerID,
      "ports": ports,
      "currentPlayers": currentPlayers
    });
    playerStatusRecords[playerID] = statusRecord.get();
    $('#mpcode').prop("value", GAME_ID);
    alert('Ask your friend to join using your game ID: ' + GAME_ID + "you can copy it from the header of this window");
    setNetInputFlag(ports, false);
   let playerPayload = deepCopyObject(true, {}, player[getPlayerStatusRecord(playerID).ports - 1]);
   delete playerPayload.charAttributes;
   delete playerPayload.charHitboxes;
   statusRecord.set('player/',
      {
        name: playerID,
        playerSlot: ports - 1,
        inputBuffer: nullInput(),
        playerInfo: playerPayload
      });
   //TODO iterate over ports to establish inital group

   ds.event.subscribe('playerStatus/', match=> {
     if(match.playerID === playerID){
       return;
     }
     console.log("subscriber game status "+ match);

     playerStatusRecords[playerID] = statusRecord;
     syncHost(match.ports );

   });

   ds.event.subscribe('player/', data => {
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
        let payload = {"playerID":playerID,"playerSlot": playerSlot, "inputBuffer": inputBuffer, "playerInfo": playerPayload};
        ds.event.emit('player/',payload);

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
  let tempCurrentPlayers = deepCopyObject(true, {}, currentPlayers);
  let playersToBeReassigned = tempCurrentPlayers.length;
  let mTypeSnapshot = deepCopyObject(true, {}, mType);
  //add host players
  for (let i = 0; i < exactportnumber; i++) {
    setPlayerType(i, 2);
    setMtype(i, 99);
    setCurrentPlayer(i, i);
  }
  //reassign current players
  for (let i = 0; i < playersToBeReassigned; i++) {
    if (tempCurrentPlayers[i] != -1)
      addPlayer(portSnapshot - 1, mTypeSnapshot[i]);
    portSnapshot++;
  }
}

function syncHost(exactportnumber) {
  let portSnapshot = ports;
  //add joining players
  for (let j = 0; j < portSnapshot; j++) {
    setNetInputFlag(j, true);
  }

  for (let i = 0; i < exactportnumber; i++) {
    addPlayer(portSnapshot + i, 99);
  }
}


function connect(record, name) {
  // Handle a join connection.


  let data = record.get();


  if (Object.keys(data).length === 0 && data.constructor === Object) {
    alert("error room appears to be empty");
  } else {
    let playerstatus = Object.keys(data)[0];
    playerStatusRecords[name] = record;
    setNetInputFlag(ports, true);
    syncClient(data[playerstatus].ports);
    ds.event.emit('playerStatus/', {
      "playerID": playerID,
      "syncHost": "syncHost",
      "ports": ports - 1,
      "currentPlayers": currentPlayers
    });
    let playerPayload = Object.assign({}, player[ports]);
    delete playerPayload.charAttributes;
    delete playerPayload.charHitboxes;
    let payload = {"playerID":playerID,"playerSlot": ports, "inputBuffer": playerInputBuffer, "playerInfo": playerPayload};
    ds.event.emit('player/',payload);

  }

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

    let playerRecord = ds.record.getRecord(requestedPeer + '-game').whenReady(statusRecord => {
      connect(statusRecord, requestedPeer);
      setNetInputFlag(ports, true);
    });


    peerConnections[requestedPeer] = playerRecord;

  }
  connectedPeers[requestedPeer] = 1;

}




