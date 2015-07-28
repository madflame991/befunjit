// Generated by CoffeeScript 1.8.0
(function() {
  'use strict';
  var DEFAULT, Playfield;

  DEFAULT = {
    WIDTH: 80,
    HEIGHT: 25
  };

  Playfield = function(width, height) {
    this.width = width != null ? width : DEFAULT.WIDTH;
    this.height = height != null ? height : DEFAULT.HEIGHT;
    this.field = [];
    this.pathPlane = [];
  };

  Playfield.prototype._initPathPlane = function(width, height) {
    var i, j, line, _i, _j, _results;
    if (width == null) {
      width = DEFAULT.WIDTH;
    }
    if (height == null) {
      height = DEFAULT.HEIGHT;
    }
    this.pathPlane = [];
    _results = [];
    for (i = _i = 1; 1 <= height ? _i <= height : _i >= height; i = 1 <= height ? ++_i : --_i) {
      line = [];
      for (j = _j = 1; 1 <= width ? _j <= width : _j >= width; j = 1 <= width ? ++_j : --_j) {
        line.push({});
      }
      _results.push(this.pathPlane.push(line));
    }
    return _results;
  };

  Playfield.prototype.fromString = function(string, width, height) {
    var i, j, line, lines, _i, _j, _ref, _ref1, _ref2, _ref3;
    lines = string.split('\n');
    _ref = (width != null) && (height != null) ? [width, height] : [
      Math.max.apply(Math, lines.map(function(line) {
        return line.length;
      })), lines.length
    ], this.width = _ref[0], this.height = _ref[1];
    this.field = [];
    lines.forEach((function(_this) {
      return function(line) {
        var chars, i, _i, _ref1, _ref2;
        chars = line.split('');
        for (i = _i = _ref1 = chars.length, _ref2 = _this.width; _ref1 <= _ref2 ? _i < _ref2 : _i > _ref2; i = _ref1 <= _ref2 ? ++_i : --_i) {
          chars.push(' ');
        }
        return _this.field.push(chars);
      };
    })(this));
    for (i = _i = _ref1 = lines.length, _ref2 = this.height; _ref1 <= _ref2 ? _i < _ref2 : _i > _ref2; i = _ref1 <= _ref2 ? ++_i : --_i) {
      line = [];
      for (j = _j = 0, _ref3 = this.width; 0 <= _ref3 ? _j < _ref3 : _j > _ref3; j = 0 <= _ref3 ? ++_j : --_j) {
        line.push(' ');
      }
      this.field.push(line);
    }
    this._initPathPlane(width, height);
    return this;
  };

  Playfield.prototype.getAt = function(x, y) {
    return this.field[y][x];
  };

  Playfield.prototype.setAt = function(x, y, char) {
    this.field[y][x] = char;
    return this;
  };

  Playfield.prototype.addPath = function(path) {
    path.list.forEach((function(_this) {
      return function(entry) {
        _this.setAt(entry.x, entry.y, entry.char);
        return _this.pathPlane[entry.y][entry.x][path.id] = path;
      };
    })(this));
    return this;
  };

  Playfield.prototype.isInside = function(x, y) {
    return (0 <= x && x < this.width) && (0 <= y && y < this.height);
  };

  Playfield.prototype.getPathsThrough = function(x, y) {
    var cell, keys, paths;
    cell = this.pathPlane[y][x];
    keys = Object.keys(cell);
    paths = [];
    keys.forEach(function(key) {
      return paths.push(cell[key]);
    });
    return paths;
  };

  Playfield.prototype.removePath = function(path) {
    return path.list.forEach((function(_this) {
      return function(entry) {
        var cell;
        cell = _this.pathPlane[entry.y][entry.x];
        return delete cell[path.id];
      };
    })(this));
  };

  Playfield.prototype.getSize = function() {
    return {
      width: this.width,
      height: this.height
    };
  };

  Playfield.prototype.clearPaths = function() {
    var i, j, _i, _ref, _results;
    _results = [];
    for (i = _i = 0, _ref = this.height; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      _results.push((function() {
        var _j, _ref1, _results1;
        _results1 = [];
        for (j = _j = 0, _ref1 = this.width; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
          _results1.push(this.pathPlane[i][j] = {});
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  if (window.bef == null) {
    window.bef = {};
  }

  window.bef.Playfield = Playfield;

}).call(this);