var express = require('express');
var app = express();
app.use(express.static('./dist'));

app.get('/', function(req, res) {
  res.redirect('/meleelight.html');
});

app.set('port', (process.env.PORT || 5000));

const appServer = app.listen((process.env.PORT || 5000));


