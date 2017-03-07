// Generated by CoffeeScript 1.12.4
(function() {
  'use strict';
  var Grid, colors, directions, directionsIndexed, fonts, getArrowImage, getArrowImages, mouseMove;

  colors = {
    background: 'hsl(70, 8%, 15%)',
    grid: 'hsl(270, 100%, 93%)',
    path: {
      arrow: 'hsl(202, 81%, 50%)',
      background: 'hsl(55, 8%, 26%)'
    },
    text: 'hsl(270, 100%, 93%)',
    altered: 'hsl(0, 54%, 28%)'
  };

  fonts = {
    normal: '20px Consolas, monospace',
    small: '14px Consolas, monospace'
  };

  Grid = function(original, playfield, pathSet, canvas1) {
    this.original = original;
    this.playfield = playfield;
    this.pathSet = pathSet;
    this.canvas = canvas1;
    this.cellSize = 36;
    this.canvas.width = this.playfield.width * this.cellSize;
    this.canvas.height = this.playfield.height * this.cellSize;
    this.con2d = this.canvas.getContext('2d');
    this.con2d.textAlign = 'center';
    this.con2d.textBaseline = 'middle';
    this.con2d.strokeStyle = '#FFF';
    this.con2d.lineWidth = 0.8;
    this.onChange = null;
    this.mouseState = {
      x: -1,
      y: -1
    };
    this._setupMouseListener();
    this.hitRegions = [];
    this._setupHitRegions();
    this.arrowImages = getArrowImages(this.cellSize / 3);
    this.draw();
  };

  getArrowImage = function(size, angle) {
    var canvas, con2d;
    canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    con2d = canvas.getContext('2d');
    con2d.strokeStyle = colors.path.arrow;
    con2d.lineWidth = 2;
    con2d.translate(size / 2, size / 2);
    con2d.rotate(angle);
    con2d.beginPath();
    con2d.moveTo(-size / 2 - 1, size / 2 - 4);
    con2d.lineTo(0, -size / 2 + 3);
    con2d.lineTo(size / 2 + 1, size / 2 - 4);
    con2d.stroke();
    return canvas;
  };

  getArrowImages = function(size) {
    return {
      '^': getArrowImage(size, 0),
      '<': getArrowImage(size, -Math.PI / 2),
      'v': getArrowImage(size, Math.PI),
      '>': getArrowImage(size, Math.PI / 2)
    };
  };

  directions = [
    {
      char: '<',
      offset: {
        x: 0,
        y: 1
      }
    }, {
      char: '^',
      offset: {
        x: 1,
        y: 0
      }
    }, {
      char: 'v',
      offset: {
        x: 1,
        y: 2
      }
    }, {
      char: '>',
      offset: {
        x: 2,
        y: 1
      }
    }
  ];

  directionsIndexed = directions.reduce(function(ret, arg) {
    var char, offset;
    char = arg.char, offset = arg.offset;
    ret.set(char, offset);
    return ret;
  }, new Map);

  Grid.prototype._setupHitRegions = function() {
    var char, dir, getCellRegion, i, j, k, l, len, m, offset, ref, ref1;
    getCellRegion = (function(_this) {
      return function(x, y, offX, offY, dir) {
        return {
          x: x,
          y: y,
          dir: dir,
          start: {
            x: x * _this.cellSize + _this.cellSize / 3 * offX,
            y: y * _this.cellSize + _this.cellSize / 3 * offY
          },
          end: {
            x: x * _this.cellSize + _this.cellSize / 3 * (offX + 1),
            y: y * _this.cellSize + _this.cellSize / 3 * (offY + 1)
          },
          size: {
            width: _this.cellSize / 3,
            height: _this.cellSize / 3
          }
        };
      };
    })(this);
    for (i = k = 0, ref = this.playfield.width; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      for (j = l = 0, ref1 = this.playfield.height; 0 <= ref1 ? l < ref1 : l > ref1; j = 0 <= ref1 ? ++l : --l) {
        char = this.playfield.getAt(i, j);
        if ((char === '^' || char === '<' || char === 'v' || char === '>') && ((this.pathSet.getStartingFrom(i, j, '')) != null)) {
          offset = directionsIndexed.get(char);
          this.hitRegions.push(getCellRegion(i, j, offset.x, offset.y, char));
        } else {
          for (m = 0, len = directions.length; m < len; m++) {
            dir = directions[m];
            if ((this.pathSet.getStartingFrom(i, j, dir.char)) != null) {
              offset = dir.offset;
              this.hitRegions.push(getCellRegion(i, j, offset.x, offset.y, dir.char));
            }
          }
        }
      }
    }
  };

  Grid.prototype._getRegion = function(x, y) {
    var k, len, ref, region;
    ref = this.hitRegions;
    for (k = 0, len = ref.length; k < len; k++) {
      region = ref[k];
      if ((region.start.x <= x && x <= region.end.x) && (region.start.y <= y && y <= region.end.y)) {
        return region;
      }
    }
    return null;
  };

  mouseMove = function(e) {
    var newRegion, ref, ref1;
    this.mouseState.x = (ref = e.offsetX) != null ? ref : e.layerX;
    this.mouseState.y = (ref1 = e.offsetY) != null ? ref1 : e.layerY;
    newRegion = this._getRegion(this.mouseState.x, this.mouseState.y);
    if (newRegion !== this.currentRegion) {
      this.currentRegion = newRegion;
      if (this.currentRegion != null) {
        this.highlightedPath = this.pathSet.getStartingFrom(this.currentRegion.x, this.currentRegion.y, this.currentRegion.dir);
      } else {
        this.highlightedPath = null;
      }
      this.draw();
      return typeof this.onChange === "function" ? this.onChange(this.highlightedPath) : void 0;
    }
  };

  Grid.prototype._setupMouseListener = function() {
    this._mouseMove = mouseMove.bind(this);
    this.canvas.addEventListener('mousemove', this._mouseMove);
  };

  Grid.prototype.draw = function() {
    var charCode, charNow, charOriginal, charPretty, charRaw, hitRegion, i, j, k, l, len, m, n, o, p, q, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7;
    for (i = k = 0, ref = this.playfield.width; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      for (j = l = 0, ref1 = this.playfield.height; 0 <= ref1 ? l < ref1 : l > ref1; j = 0 <= ref1 ? ++l : --l) {
        charOriginal = this.original.getAt(i, j);
        charNow = this.playfield.getAt(i, j);
        this.con2d.fillStyle = charNow === charOriginal ? colors.background : colors.altered;
        this.con2d.fillRect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
      }
    }
    this.con2d.fillStyle = colors.path.background;
    if ((ref2 = this.highlightedPath) != null) {
      ref2.list.forEach((function(_this) {
        return function(entry) {
          return _this.con2d.fillRect(entry.x * _this.cellSize, entry.y * _this.cellSize, _this.cellSize, _this.cellSize);
        };
      })(this));
    }
    this.con2d.fillStyle = colors.text;
    for (i = m = 0, ref3 = this.playfield.width; 0 <= ref3 ? m < ref3 : m > ref3; i = 0 <= ref3 ? ++m : --m) {
      for (j = n = 0, ref4 = this.playfield.height; 0 <= ref4 ? n < ref4 : n > ref4; j = 0 <= ref4 ? ++n : --n) {
        charRaw = this.playfield.getAt(i, j);
        charCode = charRaw.charCodeAt(0);
        if (charCode > 0) {
          charPretty = (32 <= charCode && charCode <= 126) ? (this.con2d.font = fonts.normal, charRaw) : (this.con2d.font = fonts.small, "#" + charCode);
          this.con2d.fillText(charPretty, i * this.cellSize + this.cellSize / 2, j * this.cellSize + this.cellSize / 2);
        }
      }
      ref5 = this.hitRegions;
      for (o = 0, len = ref5.length; o < len; o++) {
        hitRegion = ref5[o];
        this.con2d.drawImage(this.arrowImages[hitRegion.dir], hitRegion.start.x, hitRegion.start.y);
      }
    }
    this.con2d.save();
    this.con2d.translate(0.5, 0.5);
    this.con2d.strokeStyle = colors.grid;
    this.con2d.beginPath();
    for (i = p = 1, ref6 = this.playfield.width; 1 <= ref6 ? p < ref6 : p > ref6; i = 1 <= ref6 ? ++p : --p) {
      this.con2d.moveTo(i * this.cellSize, 0);
      this.con2d.lineTo(i * this.cellSize, this.canvas.height);
    }
    for (i = q = 1, ref7 = this.playfield.height; 1 <= ref7 ? q < ref7 : q > ref7; i = 1 <= ref7 ? ++q : --q) {
      this.con2d.moveTo(0, i * this.cellSize);
      this.con2d.lineTo(this.canvas.width, i * this.cellSize);
    }
    this.con2d.stroke();
    this.con2d.restore();
  };

  Grid.prototype.setListener = function(onChange) {
    this.onChange = onChange;
  };

  Grid.prototype.destroy = function() {
    return this.canvas.removeEventListener('mousemove', this._mouseMove);
  };

  if (window.viz == null) {
    window.viz = {};
  }

  window.viz.Grid = Grid;

}).call(this);
