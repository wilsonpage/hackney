
/**
 * Dependencies
 */

var debug = require('debug')('scanner');
var request = require('superagent');
var Emitter = require('events');
var jsdom = require('jsdom');
var mdns = require('mdns');
var url = require('url');

/**
 * Locals
 */

Scanner.prototype = Object.create(Emitter.prototype);

/**
 * Exports
 */

module.exports = Scanner;

/**
 * Initialize a new `Scanner`
 *
 * @constuctor
 * @public
 */
function Scanner() {
  if (!(this instanceof Scanner)) return new Scanner();
  Emitter.call(this);
  this.cache = {};
  this.browser = mdns.createBrowser(mdns.tcp('http'));
  this.browser.on('serviceUp', this.onFound.bind(this));
  this.browser.on('serviceDown', this.onLost.bind(this));
  this.browser.start();
}

Scanner.prototype.get = function() {
  var result = [];
  for (var host in this.cache) result.push(this.cache[host]);
  return result;
};

Scanner.prototype.onFound = function(service) {
  debug('found', service);
  this.getManifest(service.host)
    .then(manifest => {
      if (!manifest) return;
      debug('got maniest', manifest);

      var app = this.cache[service.name] = {
        base: `http://${service.host}`,
        manifest: manifest
      };

      this.emit('found', app);
    });
};

Scanner.prototype.onLost = function(service) {
  debug('lost', service);
  var match = this.cache[service.name];
  if (!match) return;
  delete this.cache[service.name];
  this.emit('lost', match);
};

Scanner.prototype.getManifest = function(host) {
  debug('get manifest', host);
  return this.getManifestUrl(host)
    .then(url => {
      debug('got manifest url', url);
      return new Promise((resolve, reject) => {
        request.get(url, function(err, res) {
          if (err) return reject(err);
          resolve(res.body);
        });
      });
    });
};

Scanner.prototype.getManifestUrl = function(host) {
  return new Promise((resolve, reject) => {
    debug('get manifest url', host);
    if (!host) return reject();
    var index = `http://${host}`;
    jsdom.env(index, [], function(err, win) {
      if (err) return reject(err);
      var document = win.document;
      var manifest = document.querySelector('link[rel=manifest]');
      if (!manifest) return reject();
      var location = url.resolve(index, manifest.href);
      resolve(location);
    });
  });
};
