var express = require('express');
var app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;
app.use(express.static('./dist'));

app.get('/', function(req, res) {
  res.redirect('/meleelightikd.html');
});
app.set('port', (process.env.PORT || 5000));

var server = app.listen((process.env.PORT || 5000));

var options = {
  debug: true
};

//var server = require('http').createServer(app);

app.use('/peerjs', ExpressPeerServer(server, options));

server.listen(9000);


var connected = [];
server.on('connection', function (id) {
  var idx = connected.indexOf(id); // only add id if it's not in the list yet
  if (idx === -1) {console.log("peer connected"+ id);connected.push(id);}
});
server.on('disconnect', function (id) {
  var idx = connected.indexOf(id); // only attempt to remove id if it's in the list
  if (idx !== -1) {console.log("peer disconnected" + id);connected.splice(idx, 1);}
});

app.get('/connected-people', function (req, res) {
  return res.json(connected);
});