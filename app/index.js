
var mdns = require('mdns');
var express = require('express');
var app = express();

// advertise a http server on port 4321
var ad = mdns.createAdvertisement(mdns.tcp('http'), 4321, {
  name: 'wilson'
});

ad.start();

app.use(express.static('client'));
app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(80, function () {
  console.log('Example app listening on port 80!');
});
