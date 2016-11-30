var express = require('express');
var app = express();

app.use(express.static('./dist'));

app.get('/', function(req, res) {
  res.redirect('/meleelightikd.html');
});

app.listen(3000, function() {
  console.log('Melee Light running on port 3000');
});
