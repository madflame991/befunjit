specs = [
	{
		text: 'just exits'
		code: '@'
		outRecord: []
	}, {
		text: 'outputs a number'
		code: '5.@'
		outRecord: [5]
	}, {
		text: 'outputs a character'
		code: '77*,@'
		outRecord: ['1']
	}, {
		text: 'executes a figure of 8'
		code: '''
          v
        @.9<
          >^
      '''
		outRecord: [9]
	}, {
		text: 'evaluates a conditional'
		code: '''
        0  v
        @.7_9.@
      '''
		outRecord: [9]
	}, {
		text: 'mutates the current path, before the current index'
		code: '2077*p5.@'
		outRecord: [5]
	}, {
		text: 'mutates the current path, after the current index'
		code: '6077*p5.@'
		outRecord: [1]
	}, {
		text: 'evaluates an addition'
		code: '49+.@'
		outRecord: [13]
	}, {
		text: 'evaluates a subtraction'
		code: '49-.@'
		outRecord: [5]
	}, {
		text: 'evaluates a multiplication'
		code: '49*.@'
		outRecord: [36]
	}, {
		text: 'performs integer division'
		code: '49/.@'
		outRecord: [2]
	}, {
		text: 'performs a modulo operation'
		code: '49%.@'
		outRecord: [1]
	}, {
		text: 'performs unary not'
		code: '4!.@'
		outRecord: [0]
	}, {
		text: 'evaluates a comparison'
		code: '49`.@'
		outRecord: [1]
	}, {
		text: 'duplicates the value on the stack'
		code: '7:..@'
		outRecord: [7, 7]
	}, {
		text: 'swaps the first two values on the stack'
		code: '275\\...@'
		outRecord: [7, 5, 2]
	}, {
		text: 'discards the first value on the stack'
		code: '27$.@'
		outRecord: [2]
	}, {
		text: 'can get a value from the playfield'
		code: '20g.@'
		outRecord: ['g'.charCodeAt 0]
	}, {
		text: 'can read an integer'
		code: '&.@'
		input: [123]
		outRecord: [123]
	}, {
		text: 'can read a char'
		code: '~.@'
		input: ['a']
		outRecord: ['a'.charCodeAt 0]
	}
]

run = (execute) ->
	specs.forEach (spec) ->
		it spec.text, ->
			{ outRecord } = execute spec.code, spec.input

			(expect outRecord).toEqual spec.outRecord


window.befTest ?= {}
window.befTest.runtimeSuite = run