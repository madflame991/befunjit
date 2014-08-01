// Generated by CoffeeScript 1.7.1
(function() {
  'use strict';
  var PathSet, getHash;

  getHash = function(x, y, dir) {
    return "" + x + "_" + y + "_" + dir;
  };

  PathSet = function() {
    this.set = {};
  };

  PathSet.prototype.add = function(path) {
    var hash;
    hash = getHash(path.list[0].x, path.list[0].y, path.list[0].dir);
    this.set[hash] = path;
    return this;
  };

  PathSet.prototype.has = function(x, y, dir) {
    var hash;
    hash = getHash(x, y, dir);
    return this.set[hash] != null;
  };

  PathSet.prototype.getStartingFrom = function(x, y, dir) {
    var hash;
    hash = getHash(x, y, dir);
    return this.set[hash];
  };

  PathSet.prototype.remove = function(path) {
    var hash;
    hash = getHash(path.list[0].x, path.list[0].y, path.list[0].dir);
    delete this.set[hash];
    return this;
  };

  if (window.bef == null) {
    window.bef = {};
  }

  window.bef.PathSet = PathSet;

}).call(this);
