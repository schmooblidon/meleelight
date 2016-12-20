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
export function logIntoServer() {
  ds = deepstream('localhost:6020').login( null, _onLoggedIn );
}

function startRoom() {

let GAME_ID=  ds.getUid();
let playerID=  ds.getUid();
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

  ds.record.getRecord(GAME_ID + '-status').whenReady(statusRecord => {
    const oldValue = statusRecord.get(`player${playerID}-online`)
    statusRecord.set(`player${playerID}-online`, {"playerID":playerID,"ports": ports, "currentPlayers": currentPlayers,"online":!oldValue});
    statusRecord.discard()

    $('#mpcode').prop("value", GAME_ID);
    alert('Ask your friend to join using your peer ID: ' + GAME_ID + "you can copy it from the header of this window");
    setNetInputFlag(ports, false);
  });

  const statusRecord = client.record.getRecord(GAME_ID + '-status');
    statusRecord.subscribe(`player${playerID}-online`, statusData => {
      let online = statusData.get("online");
      if (online === true) {
        playerStatusRecords[playerID] = statusData;

        if (playerStatusRecords[playerID] && (playerID !== GAME_ID)) {
          let data = playerStatusRecords[playerID].get();
          syncHost(data.get(ports) - 1);


        }
      }
  }, true);


 let record = client.record.getRecord(GAME_ID + '-player/' + playerID);

  record.whenReady(record => {
    let playerPayload =  deepCopyObject(true,{},player[playerStatusRecords[playerID].playerSlot]);
    delete playerPayload.charAttributes;
    delete playerPayload.charHitboxes;
    record.set({
      name: playerID,
      playerSlot:ports - 1,
      inputBuffer:nullInput(),
      playerInfo:playerPayload
    })
  });



  record.subscribe(GAME_ID + '-player/' + playerID, data => {
    if(data){
      if (data.inputBuffer && (data.playerSlot !== undefined)) {
        saveNetworkInputs(data.playerSlot, data.inputBuffer);
        player[data.playerSlot] = deepCopyObject(true, player[data.playerSlot], data.playerInfo);
      }
    }
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
  eachActiveConnection(function (c) {

      for (let key of Object.keys(peerConnections)) {
        if (key) {
          //   console.log("sending inputs");
          //dont be lazy like me;
          let playerPayload = deepCopyObject(true, {}, player[playerSlot]);
          delete playerPayload.charAttributes;
          delete playerPayload.charHitboxes;
          let payload = {"playerSlot": playerSlot, "inputBuffer": inputBuffer, "playerInfo": playerPayload};
          peerConnections[key].set(payload);
        }
      }

  });
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


function connect(record,name) {
  // Handle a join connection.


 let statusRecords = ds.record.getList(name+'/playerStatus/'+name).getEntries();

 if(statusRecords.length === 0){
   alert("error room appears to be empty");
 }else if(statusRecords.length >= 1){
   for (let j = 0 ; j < statusRecords.length ;j++) {
     playerStatusRecords[statusRecords[j]] = ds.record.getRecord(statusRecords[j]);
     //TODO handle syncing
   }
 }

   // statusRecord.set({"name":name,"syncHost": "syncHost", "ports": ports - 1, "currentPlayers": currentPlayers});
  //  playerStatusRecords[name]= statusRecord;
ds.record.listen('player/'+name,function(){
  let data =ds.record.getRecord('player/'+name);
  if (data.syncClient) {
    console.log("negotiate player position and controller index");
    // console.log(data);
    syncClient(ports)
  }
  // console.log("receiving inputs");

  if (data.inputBuffer && (data.playerSlot !== undefined)) {
    saveNetworkInputs(data.playerSlot, data.inputBuffer);
    player[data.playerSlot] = deepCopyObject(true, player[data.playerSlot], data.playerInfo);
  }
});


    // record.on('close', () => {
    //   console.log(record.peer + ' has left the game.');
    //   delete peerConnections[record.peer];
    //   delete connectedPeers[record.peer];
    //
    // });



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

   let playerRecord=  ds.record.getRecord( 'player/' + requestedPeer);
     connect(playerRecord,requestedPeer);
     setNetInputFlag(ports, true);


    peerConnections[requestedPeer] = playerRecord;

  }
  connectedPeers[requestedPeer] = 1;

}




