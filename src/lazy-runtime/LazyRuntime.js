// Generated by CoffeeScript 1.11.0
(function() {
  'use strict';
  var LazyRuntime, findPath;

  findPath = bef.PathFinder.findPath;

  LazyRuntime = function() {
    this.playfield = null;
    this.pathSet = null;
    this.stats = {
      compileCalls: 0,
      jumpsPerformed: 0
    };
  };

  LazyRuntime.prototype.put = function(x, y, e) {
    var paths;
    if (!this.playfield.isInside(x, y)) {
      return;
    }
    paths = this.playfield.getPathsThrough(x, y);
    paths.forEach((function(_this) {
      return function(path) {
        _this.pathSet.remove(path);
        _this.playfield.removePath(path);
      };
    })(this));
    this.playfield.setAt(x, y, e);
  };

  LazyRuntime.prototype.get = function(x, y) {
    var char;
    if (!this.playfield.isInside(x, y)) {
      return 0;
    }
    char = this.playfield.getAt(x, y);
    return char.charCodeAt(0);
  };

  LazyRuntime.prototype._registerPath = function(path, compiler) {
    var code;
    this.stats.compileCalls++;
    code = "stack = programState.stack;\n" + (compiler.assemble(path));
    path.code = code;
    path.body = new Function('programState', code);
    if (path.list.length > 0) {
      this.pathSet.add(path);
      this.playfield.addPath(path);
    }
  };

  LazyRuntime.prototype._getCurrentPath = function(start, compiler) {
    var newPath, path;
    path = this.pathSet.getStartingFrom(start.x, start.y, start.dir);
    if (path == null) {
      newPath = findPath(this.playfield, start);
      path = (function() {
        switch (newPath.type) {
          case 'simple':
            newPath.path.ending = null;
            this._registerPath(newPath.path, compiler);
            return newPath.path;
          case 'looping':
            newPath.loopingPath.ending = null;
            this._registerPath(newPath.loopingPath, compiler);
            return newPath.loopingPath;
          case 'composed':
            newPath.initialPath.ending = null;
            newPath.loopingPath.ending = null;
            this._registerPath(newPath.initialPath, compiler);
            this._registerPath(newPath.loopingPath, compiler);
            return newPath.initialPath;
        }
      }).call(this);
    }
    return path;
  };

  LazyRuntime.prototype._turn = function(pointer, char) {
    var dir;
    dir = (function() {
      switch (char) {
        case '|':
          if (this.programState.pop()) {
            return '^';
          } else {
            return 'v';
          }
          break;
        case '_':
          if (this.programState.pop()) {
            return '<';
          } else {
            return '>';
          }
          break;
        case '?':
          return '^<v>'[Math.random() * 4 | 0];
      }
    }).call(this);
    pointer.turn(dir);
    pointer.advance();
  };

  LazyRuntime.prototype.execute = function(playfield, options, input) {
    var currentChar, currentPath, e, pathEndPoint, pointer, x, y;
    this.playfield = playfield;
    if (input == null) {
      input = [];
    }
    if (options == null) {
      options = {};
    }
    if (options.jumpLimit == null) {
      options.jumpLimit = -1;
    }
    if (options.compiler == null) {
      options.compiler = bef.OptimizingCompiler;
    }
    this.stats.compileCalls = 0;
    this.stats.jumpsPerformed = 0;
    this.pathSet = new bef.PathSet();
    this.programState = new bef.ProgramState(this);
    this.programState.setInput(input);
    pointer = new bef.Pointer(0, 0, '>', this.playfield.getSize());
    while (true) {
      if (this.stats.jumpsPerformed === options.jumpLimit) {
        break;
      }
      this.stats.jumpsPerformed++;
      currentPath = this._getCurrentPath(pointer, options.compiler);
      currentPath.body(this.programState);
      if (currentPath.list.length) {
        pathEndPoint = currentPath.getEndPoint();
        pointer.set(pathEndPoint.x, pathEndPoint.y, pathEndPoint.dir);
        if (currentPath.looping) {
          pointer.advance();
          continue;
        }
      }
      currentChar = this.playfield.getAt(pointer.x, pointer.y);
      if (currentChar === '@') {
        break;
      }
      if (currentChar === 'p') {
        e = String.fromCharCode(this.programState.pop());
        y = this.programState.pop();
        x = this.programState.pop();
        this.put(x, y, e);
        pointer.advance();
      } else {
        this._turn(pointer, currentChar);
      }
    }
  };

  if (window.bef == null) {
    window.bef = {};
  }

  window.bef.LazyRuntime = LazyRuntime;

}).call(this);