// Generated by CoffeeScript 1.11.0
(function() {
  'use strict';
  var GraphCompiler, List, assemble, computeIndegree;

  List = bef.List;

  computeIndegree = function(nodes) {
    return (Object.keys(nodes)).reduce(function(indegree, nodeName) {
      nodes[nodeName].forEach(function(edge) {
        var to;
        to = edge.to;
        if (indegree.has(to)) {
          return indegree.set(to, (indegree.get(to)) + 1);
        } else {
          return indegree.set(to, 1);
        }
      });
      return indegree;
    }, new Map);
  };

  assemble = function(graph, options) {
    var cycledNodes, df, fastConditionals, wrapIfLooping;
    fastConditionals = options != null ? options.fastConditionals : void 0;
    cycledNodes = new Set;
    wrapIfLooping = function(node, code) {
      if (cycledNodes.has(node)) {
        return "while (programState.isAlive()) _" + node + ": {\n	" + code + "\n}";
      } else {
        return code;
      }
    };
    df = function(node, prev, stack) {
      var branch, branch0, branch1, branch2, branch3, conditionalChunk, edgeCode, ending, maybeTight, neighbours, newStack, pBit, path, randomCode, ref, ref1, ref2, ref3, selectCode;
      if (graph.nodes[node] == null) {
        return '';
      }
      if ((stack.find(node)) != null) {
        cycledNodes.add(node);
        return "break _" + node + ";";
      } else {
        neighbours = graph.nodes[node];
        newStack = stack.con(node);
        switch (neighbours.length) {
          case 4:
            branch0 = df(neighbours[0].to, neighbours[0], newStack);
            branch1 = df(neighbours[1].to, neighbours[1], newStack);
            branch2 = df(neighbours[2].to, neighbours[2], newStack);
            branch3 = df(neighbours[3].to, neighbours[3], newStack);
            randomCode = (fastConditionals ? 'stack.push(branchFlag);' : '') + "\nvar choice = programState.randInt(4);\nswitch (choice) {\n	case 0:\n		" + (neighbours[0].assemble()) + "\n		" + branch0 + "\n		break;\n	case 1:\n		" + (neighbours[1].assemble()) + "\n		" + branch1 + "\n		break;\n	case 2:\n		" + (neighbours[2].assemble()) + "\n		" + branch2 + "\n		break;\n	case 3:\n		" + (neighbours[3].assemble()) + "\n		" + branch3 + "\n		break;\n}";
            return wrapIfLooping(node, randomCode);
          case 2:
            conditionalChunk = fastConditionals ? 'branchFlag' : 'programState.pop()';
            if (node === neighbours[0].to) {
              branch1 = df(neighbours[1].to, neighbours[1], newStack);
              maybeTight = ((ref = neighbours[0].assembleTight) != null ? ref : neighbours[0].assemble)();
              selectCode = typeof maybeTight === 'string' ? "while (" + conditionalChunk + ") {\n	" + maybeTight + "\n}\n" + (neighbours[1].assemble()) + "\n" + branch1 : "if (" + conditionalChunk + ") {\n	" + maybeTight.pre + "\n	while (" + conditionalChunk + ") {\n		" + maybeTight.body + "\n	}\n	" + maybeTight.post + "\n}\n" + (neighbours[1].assemble()) + "\n" + branch1;
            } else if (node === neighbours[1].to) {
              branch0 = df(neighbours[0].to, neighbours[0], newStack);
              maybeTight = ((ref1 = neighbours[1].assembleTight) != null ? ref1 : neighbours[1].assemble)();
              selectCode = typeof maybeTight === 'string' ? "while (!" + conditionalChunk + ") {\n	" + (neighbours[1].assemble()) + "\n}\n" + (neighbours[0].assemble()) + "\n" + branch0 : "if (!" + conditionalChunk + ") {\n	" + maybeTight.pre + "\n	while (!" + conditionalChunk + ") {\n		" + maybeTight.body + "\n	}\n	" + maybeTight.post + "\n}\n" + (neighbours[0].assemble()) + "\n" + branch0;
            } else {
              branch0 = df(neighbours[0].to, neighbours[0], newStack);
              branch1 = df(neighbours[1].to, neighbours[1], newStack);
              selectCode = "if (" + conditionalChunk + ") {\n	" + (neighbours[0].assemble()) + "\n	" + branch0 + "\n} else {\n	" + (neighbours[1].assemble()) + "\n	" + branch1 + "\n}";
            }
            return wrapIfLooping(node, selectCode);
          case 1:
            branch = df(neighbours[0].to, neighbours[0], newStack);
            pBit = (prev != null ? (ref2 = prev.path.path) != null ? ref2.ending.char : void 0 : void 0) === 'p' ? ((ref3 = prev.path, path = ref3.path, ref3), (ending = path.ending, path), "var x = programState.pop();\nvar y = programState.pop();\nvar e = programState.pop();\nprogramState.put(x, y, e, " + ending.x + ", " + ending.y + ", '" + ending.dir + "', '" + path.from + "', '" + path.to + "');\nif (programState.flags.pathInvalidatedAhead) {\n	return;\n}") : '';
            edgeCode = "stack = programState.stack;\n" + (fastConditionals ? 'var branchFlag = 0;' : '') + "\n" + pBit + "\n" + (neighbours[0].assemble()) + "\n" + branch;
            return wrapIfLooping(node, edgeCode);
          case 0:
            return 'return;';
        }
      }
    };
    return df(graph.start, null, List.EMPTY);
  };

  GraphCompiler = {
    assemble: assemble
  };

  if (window.bef == null) {
    window.bef = {};
  }

  window.bef.GraphCompiler = GraphCompiler;

}).call(this);
