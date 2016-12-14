/*eslint-disable*/
import * as pdep from 'main/multiplayer/peer';

export default class GlobalChat {


  hostRoom = new Peer(null, {
    host: 'localhost',
    port: 9000,
    path: '/peerjs',
    logFunction: function (...args) {

      console.log(args);
    },
    debug: 3
  });
  connectedPeers = {};
  peerConnections = {};

  //connect to global chat
  constructor() {
    this.hostRoom.on('open', function(id){
      console.log("peerid = " + id);
    });
    this.connectToUser('testuser1@gmail.com');
    // this.connectToUser('testuser2@gmail.com');
    // this.connectToUser('testuser3@gmail.com');
    // this.connectToUser('testuser4@gmail.com');
    this.eachActiveConnection(function (c) {
      if (c.label === 'globalChat') {
        for (let key of Object.keys(this.peerConnections)) {
          if(key) {
            console.log("sending message");
            c.send("test from " + key);
          }
        }

      }
    });
  }

  getHostRoom() {
    return this.hostRoom;
  }

  connect(c) {
    // Handle a chat connection.
    if (c.label === 'globalChat') {

      c.on('data', function (data) {
        console.log(c.peer + " said ");
        console.log(data);
      });
      c.on('close', () => {
        console.log(c.peer + ' has left the chat.');
        delete this.peerConnections[c.peer];
        delete this.connectedPeers[c.peer];

      });


    }
    this.connectedPeers[c.peer] = 1;

  }

  eachActiveConnection(fn) {
    const actives = Object.keys(this.connectedPeers);
    const checkedIds = {};
    for (let val of actives) {

      if (!checkedIds[val]) {
        const conns = this.getHostRoom().connections[val];
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

  connectToUser(userName) {
    const requestedPeer = userName;
    if (!this.connectedPeers[requestedPeer]) {
      // Create 2 connections, one labelled chat and another labelled file.
      const playerConnection = this.hostRoom.connect(requestedPeer, {
        label: 'globalChat',
        serialization: 'none',
        reliable: true
      });
      playerConnection.on('open', function () {
        this.connect(playerConnection);

      });
      playerConnection.on('error', function (err) {
        console.log(err);
      });
      this.peerConnections[requestedPeer] = playerConnection;
    }
    this.connectedPeers[requestedPeer] = 1;

  };
}