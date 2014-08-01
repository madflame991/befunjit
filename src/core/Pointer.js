// Generated by CoffeeScript 1.7.1
(function() {
  'use strict';
  var Pointer, dirTable;

  dirTable = {
    '^': {
      x: 0,
      y: -1
    },
    '<': {
      x: -1,
      y: 0
    },
    'v': {
      x: 0,
      y: 1
    },
    '>': {
      x: 1,
      y: 0
    }
  };

  Pointer = function(x, y, dir, space) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.space = space;
    this._updateDir(this.dir);
  };

  Pointer.prototype._updateDir = function(dir) {
    this.dir = dir;
    this.ax = dirTable[this.dir].x;
    return this.ay = dirTable[this.dir].y;
  };

  Pointer.prototype.turn = function(dir) {
    if ((dirTable[dir] != null) && (dir !== this.dir)) {
      this._updateDir(dir);
    }
    return this;
  };

  Pointer.prototype.advance = function() {
    this.x = (this.x + this.ax + this.space.width) % this.space.width;
    this.y = (this.y + this.ay + this.space.height) % this.space.height;
    return this;
  };

  Pointer.prototype.set = function(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this._updateDir(dir);
    return this;
  };

  if (window.bef == null) {
    window.bef = {};
  }

  window.bef.Pointer = Pointer;

}).call(this);
