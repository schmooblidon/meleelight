/*eslint-disable*/
import * as pdep from 'main/multiplayer/peer';
import $ from 'jquery';
import {nullInputs} from "../input";
import {
  setPlayerType,
  ports,
  addPlayer,
  currentPlayers,
  findPlayers,
  playerType,
  mType,
  setMtype,
  setCurrentPlayer, player
} from "../main";
import {deepCopyObject} from "../util/deepCopyObject";

let peer = null;
let peerId = null;

function startRoom() {
  peer = new Peer('', {
    host: location.hostname,
    port: location.port || (location.protocol === 'https:' ? 443 : 80),
    path: '/peerjs',
    debug: 3,
    config: {'iceServers': [
      { url: 'stun:stunsturns.herokuapp.com:37708' }
    ]}
  });

  //set up room for people to join
  peer.on('open', function (id) {
    peerId = id;

    $('#mpcode').prop("value", id);
    alert('Ask your friend to join using your peer ID: ' + peerId + "you can copy it from the header of this window");
  });

  //oops?
  peer.on('error', function (err) {
    console.log('' + err)
  });

  //player joins the room
  peer.on('connection', function (conn) {
   // console.log("new player joined");
    connectedPeers[conn.peer] = 1;
    peerConnections[conn.peer] = conn;
    setNetInputFlag(ports, false);


    //take the new connection and set up data connection handler
    conn.on('open', function () {
      conn.send({"syncClient": "syncClient", "ports": ports - 1, "currentPlayers": currentPlayers});
      // Receive messages from the connection when the handshake is done

    });
    conn.on('data', function (d) {
     // console.log("recieving data");
      // console.log(data);
     let data = d;
      if (data.syncHost) {
        syncHost(ports);
      }
      if (data.inputBuffer && (data.playerSlot !== undefined)) {
        saveNetworkInputs(data.playerSlot,data.inputBuffer);
        player[data.playerSlot] = deepCopyObject(true, player[data.playerSlot],data.playerInfo);
      }
    });
    //oops?
    conn.on('error', function (err) {
      console.log(err);
    });
  });

  // HTTP routing timeout rule
  function ping() {
   // console.log(peer);
    peer.socket.send({
      type: 'ping'
    });
    setTimeout(ping, 16000)
  }

  ping();
}
let hostRoom = null;

const connectedPeers = {};
const peerConnections = {};
const playerInputBuffer = [nullInputs(), nullInputs(), nullInputs(), nullInputs()];
let loadingRoom = false;

 const giveInputs = {};

 function setNetInputFlag(name, val) {
  giveInputs[name] = val;
}

function sendInputsOverNet(inputBuffer, playerSlot) {
  eachActiveConnection(function (c) {
    if (c.label === 'mpRoom') {
      for (let key of Object.keys(peerConnections)) {
        if (key) {
       //   console.log("sending inputs");
          //dont be lazy like me;
        let playerPayload =  deepCopyObject(true,{},player[playerSlot]);
        delete playerPayload.charAttributes;
        delete playerPayload.charHitboxes;
        let payload = {"playerSlot": playerSlot, "inputBuffer": inputBuffer,"playerInfo":playerPayload};
          c.send(payload);
        }
      }

    }
  });
}

 function updateNetworkInputs(inputBuffer, playerSlot) {

  playerInputBuffer[playerSlot][0] = inputBuffer;

  sendInputsOverNet(inputBuffer, playerSlot);

}

 function saveNetworkInputs(playerSlot, inputBuffer) {
  playerInputBuffer[playerSlot][0] = inputBuffer;

}

 function retrieveNetworkInputs(playerSlot) {
  return playerInputBuffer[playerSlot][0];
}


//connect to global chat
 function connectToMPRoom() {

  startRoom();
  loadingRoom = true;
  $("#player1").on('click', (e) => {
    var destId = prompt("Hosts's peer ID:");
    connectToUser(destId);
  });


}

function getHostRoom() {
  return peer;
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


function connect(c) {
  // Handle a join connection.
  if (c.label === 'mpRoom') {
    c.send({"syncHost": "syncHost", "ports": ports - 1, "currentPlayers": currentPlayers});
    c.on('data', (data) => {
      if (data.syncClient) {
        console.log("negotiate player position and controller index");
        // console.log(data);
        syncClient(ports)
      }
      // console.log("receiving inputs");

      if (data.inputBuffer && (data.playerSlot !== undefined)) {
        saveNetworkInputs(data.playerSlot, data.inputBuffer);
        player[data.playerSlot] = deepCopyObject(true, player[data.playerSlot],data.playerInfo);
      }
    });
    c.on('close', () => {
      console.log(c.peer + ' has left the game.');
      delete peerConnections[c.peer];
      delete connectedPeers[c.peer];

    });


  }
  connectedPeers[c.peer] = 1;

}

function eachActiveConnection(fn) {
  const actives = Object.keys(connectedPeers);
  const checkedIds = {};
  for (let val of actives) {

    if (!checkedIds[val]) {
      const conns = getHostRoom().connections[val];
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

    const playerConnection = peer.connect(requestedPeer, {
      label: 'mpRoom',
      serialization: 'json',
      reliable:true
    });

    playerConnection.on('open', function () {
      connect(playerConnection);
      setNetInputFlag(ports, true);


    });
    playerConnection.on('error', function (err) {
      console.log(err);
    });
    peerConnections[requestedPeer] = playerConnection;

  }
  connectedPeers[requestedPeer] = 1;

}




