describe 'Interpreter', ->
	Playfield = bef.Playfield
	Interpreter = bef.Interpreter2

	getPlayfield = (string, width, height) ->
		lines = string.split '\n'
		width ?= Math.max (lines.map (line) -> line.length)...
		height ?= lines.length

		playfield = new Playfield width, height
		playfield.fromString string, width, height
		playfield

	getInterpreter = (string, width, height) ->
		playfield = getPlayfield string, width, height
		interpreter = new Interpreter()
		interpreter.playfield = playfield
		interpreter

	describe 'buildGraph', ->
		it 'builds a graph from a simple path', ->
			interpreter = getInterpreter 'abc@'
			graph = interpreter.buildGraph()

			(expect graph['0_0']).toBeDefined()
			(expect graph['0_0'].length).toEqual 1

		it 'builds a graph from a branching path', ->
			interpreter = getInterpreter '''
				abv
				@c_d@
			'''
			graph = interpreter.buildGraph()

			(expect graph['0_0']).toBeDefined()
			(expect graph['0_0'].length).toEqual 1
			(expect graph['0_0'][0].to).toEqual '2_1'

			(expect graph['2_1']).toBeDefined()
			(expect graph['2_1'].length).toEqual 2

		it 'builds a graph from a cycling path', ->
			interpreter = getInterpreter '''
				abv
				vc_dv
				>e^g<
			'''
			graph = interpreter.buildGraph()

			(expect graph['0_0']).toBeDefined()
			(expect graph['0_0'].length).toEqual 1
			(expect graph['0_0'][0].to).toEqual '2_1'

			(expect graph['2_1']).toBeDefined()
			(expect graph['2_1'].length).toEqual 2
			(expect graph['2_1'][0].to).toEqual '2_1'
			(expect graph['2_1'][1].to).toEqual '2_1'