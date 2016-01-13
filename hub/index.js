
var mdns = require('mdns');
var express = require('express');
var app = express();

// watch all http servers
var browser = mdns.createBrowser(mdns.tcp('http'));

browser.on('serviceUp', function(service) {
  console.log("service up: ", service);
});

browser.on('serviceDown', function(service) {
  console.log("service down: ", service);
});

browser.start();
