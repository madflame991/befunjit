// Generated by CoffeeScript 1.11.0
(function() {
  'use strict';
  var PathMetrics, consumeCount, consumePair, getDepth;

  consumePair = function(consume, delta) {
    return {
      consume: consume,
      delta: delta
    };
  };

  consumeCount = new Map([[' ', consumePair(0, 0)], ['0', consumePair(0, 1)], ['1', consumePair(0, 1)], ['2', consumePair(0, 1)], ['3', consumePair(0, 1)], ['4', consumePair(0, 1)], ['5', consumePair(0, 1)], ['6', consumePair(0, 1)], ['7', consumePair(0, 1)], ['8', consumePair(0, 1)], ['9', consumePair(0, 1)], ['+', consumePair(2, -1)], ['-', consumePair(2, -1)], ['*', consumePair(2, -1)], ['/', consumePair(2, -1)], ['%', consumePair(2, -1)], ['!', consumePair(1, 0)], ['`', consumePair(2, -1)], ['^', consumePair(0, 0)], ['<', consumePair(0, 0)], ['v', consumePair(0, 0)], ['>', consumePair(0, 0)], ['?', consumePair(0, 0)], ['_', consumePair(1, -1)], ['|', consumePair(1, -1)], ['"', consumePair(0, 0)], [':', consumePair(0, 1)], ['\\', consumePair(2, 0)], ['$', consumePair(1, -1)], ['.', consumePair(1, -1)], [',', consumePair(1, -1)], ['#', consumePair(0, 0)], ['p', consumePair(3, -3)], ['g', consumePair(2, -1)], ['&', consumePair(0, 1)], ['~', consumePair(0, 1)], ['@', consumePair(0, 0)]]);

  getDepth = function(path) {
    var max, ref, sum;
    ref = path.getAsList().reduce(function(arg, arg1) {
      var char, consume, delta, max, ref, string, sum;
      max = arg.max, sum = arg.sum;
      char = arg1.char, string = arg1.string;
      ref = string ? {
        consume: 0,
        delta: 1
      } : consumeCount.has(char) ? consumeCount.get(char) : {
        consume: 0,
        delta: 0
      }, consume = ref.consume, delta = ref.delta;
      return {
        sum: sum + delta,
        max: Math.min(max, sum - consume)
      };
    }, {
      max: 0,
      sum: 0
    }), max = ref.max, sum = ref.sum;
    return {
      max: -max,
      sum: sum
    };
  };

  PathMetrics = function() {};

  Object.assign(PathMetrics, {
    getDepth: getDepth
  });

  if (window.bef == null) {
    window.bef = {};
  }

  window.bef.PathMetrics = PathMetrics;

}).call(this);