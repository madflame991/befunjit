// Generated by CoffeeScript 1.8.0
(function() {
  'use strict';
  var EagerRuntime, canReach, getHash, getPath, getPointer, registerGraph;

  EagerRuntime = function() {
    this.playfield = null;
    this.pathSet = null;
    this.stats = {
      compileCalls: 0,
      jumpsPerformed: 0
    };
  };

  EagerRuntime.prototype._getPath = function(x, y, dir) {
    var currentChar, initialPath, loopingPath, path, pointer, splitPosition;
    path = new bef.Path();
    pointer = new bef.Pointer(x, y, dir, this.playfield.getSize());
    while (true) {
      currentChar = this.playfield.getAt(pointer.x, pointer.y);
      if (currentChar === '"') {
        path.push(pointer.x, pointer.y, pointer.dir, currentChar);
        while (true) {
          pointer.advance();
          currentChar = this.playfield.getAt(pointer.x, pointer.y);
          if (currentChar === '"') {
            path.push(pointer.x, pointer.y, pointer.dir, currentChar);
            break;
          }
          path.push(pointer.x, pointer.y, pointer.dir, currentChar, true);
        }
        pointer.advance();
        continue;
      }
      pointer.turn(currentChar);
      if (path.hasNonString(pointer.x, pointer.y, pointer.dir)) {
        splitPosition = (path.getEntryAt(pointer.x, pointer.y, pointer.dir)).index;
        if (splitPosition > 0) {
          initialPath = path.prefix(splitPosition);
          loopingPath = path.suffix(splitPosition);
          return {
            type: 'composed',
            initialPath: initialPath,
            loopingPath: loopingPath
          };
        } else {
          return {
            type: 'looping',
            loopingPath: path
          };
        }
      }
      path.push(pointer.x, pointer.y, pointer.dir, currentChar);
      if (currentChar === '|' || currentChar === '_' || currentChar === '?' || currentChar === '@') {
        return {
          type: 'simple',
          path: path
        };
      }
      if (currentChar === '#') {
        pointer.advance();
      }
      pointer.advance();
    }
  };

  canReach = (function() {
    var visited;
    visited = new Set;
    return function(graph, start, targets) {
      var traverse;
      traverse = function(start) {
        if (targets.has(start)) {
          return true;
        }
        if (visited.has(start)) {
          return false;
        }
        visited.add(start);
        return graph[start].some(function(_arg) {
          var to;
          to = _arg.to;
          return traverse(to);
        });
      };
      return traverse(start);
    };
  })();

  getPath = function(graph, from, to) {
    var edge, _i, _len, _ref;
    _ref = graph[from];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      edge = _ref[_i];
      if (edge.to === to) {
        return edge;
      }
    }
  };

  EagerRuntime.prototype.put = function(x, y, e, currentX, currentY, currentDir, currentIndex, from, to) {
    var currentPath, lastEntry, paths, targets;
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
    if (paths.length > 0) {
      targets = paths.reduce(function(targets, path) {
        return targets.add(path.from);
      }, new Set);
      currentPath = getPath(this.graph, from, to).path;
      lastEntry = (function() {
        var _ref;
        switch (currentPath.type) {
          case 'simple':
            return currentPath.path.getLastEntryThrough(x, y);
          case 'looping':
            return currentPath.loopingPath.getLastEntryThrough(x, y);
          case 'composed':
            return (_ref = currentPath.initialPath.getLastEntryThrough(x, y)) != null ? _ref : currentPath.loopingPath.getLastEntryThrough(x, y);
        }
      })();
      if ((lastEntry != null) || (canReach(this.graph, to, targets))) {
        this.programState.flags.pathInvalidatedAhead = true;
        this.programState.flags.exitPoint = {
          x: currentX,
          y: currentY,
          dir: currentDir
        };
      }
    }
  };

  EagerRuntime.prototype.get = function(x, y) {
    var char;
    if (!this.playfield.isInside(x, y)) {
      return 0;
    }
    char = this.playfield.getAt(x, y);
    return char.charCodeAt(0);
  };

  getHash = function(pointer) {
    return "" + pointer.x + "_" + pointer.y;
  };

  getPointer = function(point, space, dir) {
    var pointer;
    pointer = new bef.Pointer(point.x, point.y, dir, space);
    return pointer.advance();
  };

  EagerRuntime.prototype.buildGraph = function(start) {
    var buildEdge, dispatch, graph, hash;
    graph = {};
    dispatch = (function(_this) {
      return function(hash, destination) {
        var currentChar, partial;
        currentChar = _this.playfield.getAt(destination.x, destination.y);
        partial = getPointer.bind(null, destination, _this.playfield.getSize());
        switch (currentChar) {
          case '_':
            buildEdge(hash, partial('<'));
            buildEdge(hash, partial('>'));
            break;
          case '|':
            buildEdge(hash, partial('^'));
            buildEdge(hash, partial('v'));
            break;
          case '?':
            buildEdge(hash, partial('^'));
            buildEdge(hash, partial('v'));
            buildEdge(hash, partial('<'));
            buildEdge(hash, partial('>'));
        }
      };
    })(this);
    buildEdge = (function(_this) {
      return function(hash, pointer) {
        var destination, newHash, newPath, _ref, _ref1, _ref2, _ref3;
        newPath = _this._getPath(pointer.x, pointer.y, pointer.dir);
        if ((_ref = newPath.path) != null) {
          _ref.from = hash;
        }
        if ((_ref1 = newPath.initialPath) != null) {
          _ref1.from = hash;
        }
        if ((_ref2 = newPath.loopingPath) != null) {
          _ref2.from = hash;
        }
        if ((_ref3 = newPath.path) != null) {
          _ref3.to = getHash(newPath.path.getEndPoint());
        }
        if (newPath.type !== 'simple') {
          graph[hash].push({
            path: newPath,
            to: null
          });
        } else {
          destination = newPath.path.getAsList().length > 0 ? newPath.path.getEndPoint() : pointer;
          newHash = getHash(destination);
          graph[hash].push({
            path: newPath,
            to: newHash
          });
          if (graph[newHash] != null) {
            return;
          }
          graph[newHash] = [];
          dispatch(newHash, destination);
        }
      };
    })(this);
    hash = 'start';
    graph[hash] = [];
    buildEdge(hash, start);
    return graph;
  };

  EagerRuntime.prototype.compile = function(graph, options) {
    var assemble;
    assemble = options.compiler.assemble;
    (Object.keys(graph)).forEach(function(nodeName) {
      var edges;
      edges = graph[nodeName];
      return edges.forEach(function(edge) {
        var path, type, _ref;
        path = edge.path, (_ref = edge.path, type = _ref.type);
        return edge.code = (function() {
          switch (type) {
            case 'composed':
              return "" + (assemble(path.initialPath)) + "\nwhile (programState.isAlive()) {\n	" + (assemble(path.loopingPath)) + "\n}";
            case 'looping':
              return "while (programState.isAlive()) {\n	" + (assemble(path.loopingPath)) + "\n}";
            case 'simple':
              return assemble(path.path);
          }
        })();
      });
    });
    this.code = bef.GraphCompiler.assemble({
      start: 'start',
      nodes: graph
    });
    return new Function('programState', this.code);
  };

  registerGraph = function(graph, playfield, pathSet) {
    playfield.clearPaths();
    pathSet.clear();
    (Object.keys(graph)).forEach(function(node) {
      var edges;
      edges = graph[node];
      edges.forEach(function(_arg) {
        var path;
        path = _arg.path;
        if (path.type === 'simple') {
          pathSet.add(path.path);
          playfield.addPath(path.path);
        } else if (path.type === 'looping') {
          pathSet.add(path.loopingPath);
          playfield.addPath(path.loopingPath);
        } else if (path.type === 'composed') {
          pathSet.add(path.loopingPath);
          pathSet.add(path.initialPath);
          playfield.addPath(path.loopingPath);
          playfield.addPath(path.initialPath);
        }
      });
    });
  };

  EagerRuntime.prototype.execute = function(playfield, options, input) {
    var dir, program, start, x, y, _ref;
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
    this.programState.maxChecks = options.jumpLimit;
    start = new bef.Pointer(0, 0, '>', this.playfield.getSize());
    while (true) {
      this.stats.compileCalls++;
      this.graph = this.buildGraph(start);
      registerGraph(this.graph, this.playfield, this.pathSet);
      program = this.compile(this.graph, options);
      program(this.programState);
      if (this.programState.flags.pathInvalidatedAhead) {
        this.programState.flags.pathInvalidatedAhead = false;
        _ref = this.programState.flags.exitPoint, x = _ref.x, y = _ref.y, dir = _ref.dir;
        start.set(x, y, dir);
        start.advance();
      }
      if (this.programState.flags.exitRequest) {
        break;
      }
      this.stats.jumpsPerformed++;
      if (this.stats.jumpsPerformed > options.jumpLimit) {
        break;
      }
    }
  };

  if (window.bef == null) {
    window.bef = {};
  }

  window.bef.EagerRuntime = EagerRuntime;

}).call(this);