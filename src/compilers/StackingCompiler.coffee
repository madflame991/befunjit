'use strict'


isNumber = (obj) ->
	typeof obj == 'number'


digitPusher = (digit) ->
	(x, y, dir, index, stack) ->
		stack.push digit
		return


binaryOperator = (operatorFunction, operatorChar, stringFunction) ->
	(x, y, dir, index, stack) ->
		operand1 = stack.pop()
		operand2 = stack.pop()

		fun = if (isNumber operand1) and (isNumber operand2)
			operatorFunction
		else
			stringFunction

		stack.push fun operand1, operand2

		return


codeMap =
	' ': ->


	'0': digitPusher 0
	'1': digitPusher 1
	'2': digitPusher 2
	'3': digitPusher 3
	'4': digitPusher 4
	'5': digitPusher 5
	'6': digitPusher 6
	'7': digitPusher 7
	'8': digitPusher 8
	'9': digitPusher 9


	'+': binaryOperator ((o1, o2) -> o2 + o1), '+', (o1, o2) -> "(#{o2} + #{o1})"
	'-': binaryOperator ((o1, o2) -> o2 - o1), '-', (o1, o2) -> "(#{o2} - #{o1})"
	'*': binaryOperator ((o1, o2) -> o2 * o1), '*', (o1, o2) -> "(#{o2} * #{o1})"
	'/': binaryOperator ((o1, o2) -> o2 // o1), '/', (o1, o2) -> "Math.floor(#{o2} / #{o1})"
	'%': binaryOperator ((o1, o2) -> o2 % o1), '%', (o1, o2) -> "(#{o2} % #{o1})"


	'!': (x, y, dir, index, stack) ->
		stack.push "(+!#{stack.pop()})"
		return


	'`': binaryOperator ((o1, o2) -> +(o1 < o2)), '`', (o1, o2) -> "(+(#{o1} < #{o2}))"


	'^': ->
	'<': ->
	'v': ->
	'>': ->
	'?': ->
	'_': ->
	'|': ->
	'"': ->


	':': (x, y, dir, index, stack) ->
		top = stack.peek()
		stack.push top
		return


	'\\': (x, y, dir, index, stack) ->
		e1 = stack.pop()
		e2 = stack.pop()
		stack.push e1, e2
		return


	'$': (x, y, dir, index, stack) ->
		stack.pop()
		return


	'.': (x, y, dir, index, stack) ->
		stack.out("programState.out(#{stack.pop()})")
		return


	',': (x, y, dir, index, stack) ->
		stack.out("programState.out(String.fromCharCode(#{stack.pop()}))")
		return


	'#': ->


	'p': (x, y, dir, index, stack, from, to) ->
		p1 = stack.pop()
		p2 = stack.pop()
		p3 = stack.pop()

		stack.dump()

		stack.pushChunk """
			programState.put(
				#{p1},
				#{p2},
				#{p3},
				#{x}, #{y}, '#{dir}', #{index},
				'#{from}', '#{to}'
			)
			if (programState.flags.pathInvalidatedAhead) {
				return
			}
		"""
		return


	'g': (x, y, dir, index, stack) ->
		stack.push "programState.get(#{stack.pop()}, #{stack.pop()})"
		return


	'&': (x, y, dir, index, stack) ->
		stack.push stack.next()
		return


	'~': (x, y, dir, index, stack) ->
		stack.push stack.nextChar()
		return


	'@': (x, y, dir, index, stack) ->
		stack.exit()
		return


StackingCompiler = ->


makeStack = (uid) ->
	stack = []
	declarations = []
	reads = []
	writes = []
	chunks = []
	exitRequest = false

	stackObj = {}

	stackObj.push = ->
		Array::push.apply stack, arguments
		return

	stackObj.pop = ->
		if stack.length > 0
			stack.pop()
		else
			name = "p#{uid}_#{declarations.length}"
			# use const once node supports it
			declarations.push "var #{name} = programState.pop()"
			name

	stackObj.peek = ->
		if stack.length
			stack[stack.length - 1]
		else
			name = "p#{uid}_#{declarations.length}"
			# use const once node supports it
			declarations.push "var #{name} = programState.peek()"
			name

	makeNext = (methodName) ->
		->
			name = "r#{uid}_#{reads.length}"
			# use const once node supports it
			reads.push "var #{name} = programState.#{methodName}()"
			name

	stackObj.next = makeNext 'next'
	stackObj.nextChar = makeNext 'nextChar'

	stackObj.out = (entry) ->
		writes.push entry
		return

	stackObj.dump = ->
		chunks.push """
			#{declarations.join '\n'}
			#{reads.join '\n'}
			#{if stack.length > 0 then "programState.push(#{stack.join ', '})" else ''}
			#{writes.join '\n'}
		"""

		stack = []
		declarations = []
		reads = []
		writes = []

		return

	stackObj.pushChunk = (entry) ->
		chunks.push entry
		return

	stackObj.stringify = ->
		"""
			#{chunks.join '\n'}
			#{if exitRequest then 'programState.exit()' else ''}
		"""

	stackObj.exit = ->
		exitRequest = true

	stackObj


StackingCompiler.assemble = (path) ->
	charList = path.getAsList()

	stack = makeStack path.id

	charList.forEach (entry, i) ->
		if entry.string
			stack.push entry.char.charCodeAt 0
		else
			codeGenerator = codeMap[entry.char]
			if codeGenerator?
				codeGenerator entry.x, entry.y, entry.dir, i, stack, path.from, path.to
		return

	stack.dump()
	stack.stringify()


StackingCompiler.compile = (path) ->
	code = StackingCompiler.assemble path
	path.code = code # storing this just for debugging
	compiled = new Function 'programState', code
	path.body = compiled


window.bef ?= {}
window.bef.StackingCompiler = StackingCompiler