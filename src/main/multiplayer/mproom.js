/*eslint-disable*/
import * as pdep from 'main/multiplayer/peer';
import $ from 'jquery';
import {nullInputs} from "../input";
import {setPlayerType, ports, addPlayer, currentPlayers, findPlayers} from "../main";


let peer = null;
let peerId = null;
function startRoom() {
  peer = new Peer('', {
    host: location.hostname,
    port: 9000 || (location.protocol === 'https:' ? 443 : 80),
    // port: location.port || (location.protocol === 'https:' ? 443 : 80),
    path: '/peerjs',
    debug: 3
  });

  //set up room for people to join
  peer.on('open', function (id) {
    peerId = id;
    alert('Ask your friend to join using your peer ID: ' + peerId);
    $('#mpcode').prop("value", id);
  });

  //oops?
  peer.on('error', function (err) {
    console.log('' + err)
  });

  //player joins the room
  peer.on('connection', function (conn) {
    console.log("new player joined");
    connectedPeers[conn.peer] = 1;
    peerConnections[conn.peer] = conn;
    giveInputs[ports] = false;
    setPlayerType(ports, 2);

    //take the new connection and set up data connection handler
    conn.on('open', function () {
      // Receive messages from the connection when the handshake is done
      conn.on('data', function (data) {
        console.log("recieving inputs");
        console.log(data);
        if (data.inputBuffer && data.playerSlot) {
          updateNetworkInputs(data.playerSlot, data.inputBuffer);
        }
      });
    });
    //oops?
    conn.on('error', function (err) {
      console.log(err);
    });
  });

  // HTTP routing timeout rule
  function ping() {
    console.log(peer);
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

function sendInputsOverNet(inputBuffer, playerSlot) {
  eachActiveConnection(function (c) {
    if (c.label === 'mpRoom') {
      for (let key of Object.keys(peerConnections)) {
        if (key) {
          console.log("sending inputs");
          c.send({"playerSlot": playerSlot, "inputBuffer": inputBuffer});
        }
      }

    }
  });
}

export function updateNetworkInputs(inputBuffer, playerSlot) {

  if (giveInputs[playerSlot]) {
    let tempBuffer = nullInputs();

    playerInputBuffer[playerSlot] = inputBuffer;

    sendInputsOverNet(inputBuffer, playerSlot);
    for (var k = 0; k < 7; k++) {
      tempBuffer[7 - k].lsX = inputBuffer[6 - k].lsX;
      tempBuffer[7 - k].lsY = inputBuffer[6 - k].lsY;
      tempBuffer[7 - k].rawX = inputBuffer[6 - k].rawX;
      tempBuffer[7 - k].rawY = inputBuffer[6 - k].rawY;
      tempBuffer[7 - k].csX = inputBuffer[6 - k].csX;
      tempBuffer[7 - k].csY = inputBuffer[6 - k].csY;
      tempBuffer[7 - k].lA = inputBuffer[6 - k].lA;
      tempBuffer[7 - k].rA = inputBuffer[6 - k].rA;
      tempBuffer[7 - k].s = inputBuffer[6 - k].s;
      tempBuffer[7 - k].a = inputBuffer[6 - k].a;
      tempBuffer[7 - k].b = inputBuffer[6 - k].b;
      tempBuffer[7 - k].x = inputBuffer[6 - k].x;
      tempBuffer[7 - k].y = inputBuffer[6 - k].y;
      tempBuffer[7 - k].r = inputBuffer[6 - k].r;
      tempBuffer[7 - k].l = inputBuffer[6 - k].l;
      tempBuffer[7 - k].dl = inputBuffer[6 - k].dl;
      tempBuffer[7 - k].dd = inputBuffer[6 - k].dd;
      tempBuffer[7 - k].dr = inputBuffer[6 - k].dr;
      tempBuffer[7 - k].du = inputBuffer[6 - k].du;
      tempBuffer[7 - k].z = inputBuffer[6 - k].z;
    }

    playerInputBuffer[playerSlot] = tempBuffer;
  }
}

export function retrieveNetworkInputs(playerSlot) {
  return playerInputBuffer[playerSlot];
}


//connect to global chat
export function connectToMPRoom() {

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

function connect(c) {
  // Handle a join connection.
  if (c.label === 'mpRoom') {

    c.on('data',  (data)=> {

      console.log("receiving inputs");
      console.log(data);
      if (data.inputBuffer && data.playerSlot) {
        updateNetworkInputs(data.playerSlot, data.inputBuffer);
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
      serialization: 'binary',
      reliable: true
    });

    playerConnection.on('open', function () {
      connect(playerConnection);
      giveInputs[ports] = true;


    });
    playerConnection.on('error', function (err) {
      console.log(err);
    });
    peerConnections[requestedPeer] = playerConnection;

  }
  connectedPeers[requestedPeer] = 1;

}




