var express = require('express');
var app = express();

app.use(express.static('src'));

app.get('/', function(req, res) {
  res.redirect('/meleelight.html');
});

app.listen(3000, function() {
  console.log('Melee Light running on port 3000');
});
