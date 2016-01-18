
var mdns = require('mdns');
var express = require('express');
var app = express();

var port = Number(process.env.PORT) || 80;

// advertise a http server on the specified port
var ad = mdns.createAdvertisement(mdns.tcp('http'), port, {
  name: 'calculator'
});

ad.start();

app.use(express.static('client'));
app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});
