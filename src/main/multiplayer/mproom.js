/*eslint-disable*/
import * as pdep from 'main/multiplayer/peer';
import $ from 'jquery';
import {nullInputs} from "../input";
import {setPlayerType} from "../main";




 const hostRoom = new Peer(null, {
    host: 'localhost',
    port: 9000,
    path: '/peerjs',
    logFunction: function (...args) {

      console.log(args);
    },
    debug: 3
  });
 const connectedPeers = {};
 const peerConnections = {};
 const playerInputBuffer = [];


function sendInputsOverNet(inputBuffer, playerSlot) {
  eachActiveConnection(function (c) {
  if (c.label === 'mpRoom') {
    for (let key of Object.keys(peerConnections)) {
      if(key) {
        console.log("sending inputs");
        c.send({playerSlot:playerSlot,inputBuffer:inputBuffer});
      }
    }

  }
});
}
export function updateNetworkInputs(inputBuffer,playerSlot){
   let tempBuffer = nullInputs();

   playerInputBuffer[playerSlot] = inputBuffer;

   sendInputsOverNet(inputBuffer,playerSlot);
   for (var k = 0; k < 7; k++) {
     tempBuffer[7-k].lsX  = inputBuffer[6-k].lsX;
     tempBuffer[7-k].lsY  = inputBuffer[6-k].lsY;
     tempBuffer[7-k].rawX = inputBuffer[6-k].rawX;
     tempBuffer[7-k].rawY = inputBuffer[6-k].rawY;
     tempBuffer[7-k].csX  = inputBuffer[6-k].csX;
     tempBuffer[7-k].csY  = inputBuffer[6-k].csY;
     tempBuffer[7-k].lA   = inputBuffer[6-k].lA;
     tempBuffer[7-k].rA   = inputBuffer[6-k].rA;
     tempBuffer[7-k].s    = inputBuffer[6-k].s;
     tempBuffer[7-k].a    = inputBuffer[6-k].a;
     tempBuffer[7-k].b    = inputBuffer[6-k].b;
     tempBuffer[7-k].x    = inputBuffer[6-k].x;
     tempBuffer[7-k].y    = inputBuffer[6-k].y;
     tempBuffer[7-k].r    = inputBuffer[6-k].r;
     tempBuffer[7-k].l    = inputBuffer[6-k].l;
     tempBuffer[7-k].dl   = inputBuffer[6-k].dl;
     tempBuffer[7-k].dd   = inputBuffer[6-k].dd;
     tempBuffer[7-k].dr   = inputBuffer[6-k].dr;
     tempBuffer[7-k].du   = inputBuffer[6-k].du;
     tempBuffer[7-k].z   = inputBuffer[6-k].z;
   }
 }

 export function retrieveNetworkInputs(playerSlot){
  return playerInputBuffer[playerSlot];
}



  //connect to global chat
 export function connectToMPRoom() {

    hostRoom.on('open', (id)=>{
      console.log("peerid = " + id);
      $("#mpcode").val(id);

    });
    $("#player1").on('click',(e)=>{
      connectToUser($("#mpcode").val(),0);
      setPlayerType(0,2);
    });
    $("#player2").on('click',(e)=>{
      connectToUser($("#mpcode").val(),1);
      setPlayerType(1,2);
    });
    $("#player3").on('click',(e)=>{
      connectToUser($("#mpcode").val(),2);
      setPlayerType(2,2);
    });
    $("#player4").on('click',(e)=>{
      connectToUser($("#mpcode").val(),3);
      setPlayerType(3,2);
    });

  }

 function getHostRoom() {
    return hostRoom;
  }

  function connect(c) {
    // Handle a chat connection.
    if (c.label === 'mpRoom') {

      c.on('data', function (data) {
        console.log(c.peer + " said ");
        console.log(data);
        if(data.inputBuffer && data.playerSlot) {
          updateNetworkInputs(data.playerSlot,data.inputBuffer);
        }
      });
      c.on('close', () => {
        console.log(c.peer + ' has left the chat.');
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

 function connectToUser(userName,playerPosition) {
    const requestedPeer = userName;
    if (!connectedPeers[requestedPeer]) {

      const playerConnection = hostRoom.connect(requestedPeer, {
        label: 'mpRoom',
        serialization: 'none',
        reliable: true
      });
      playerConnection.on('open', function () {
        connect(playerConnection);

      });
      playerConnection.on('error', function (err) {
        console.log(err);
      });
     peerConnections[requestedPeer] = playerConnection;
    }
    connectedPeers[requestedPeer] = 1;

 }
// this.eachActiveConnection(function (c) {
//   if (c.label === 'globalChat') {
//     for (let key of Object.keys(this.peerConnections)) {
//       if(key) {
//         console.log("sending message");
//         c.send("test from " + key);
//       }
//     }
//
//   }
// });



