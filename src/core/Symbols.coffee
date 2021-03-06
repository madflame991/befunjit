'use strict'

Symbols =
	BLANK: ' '.charCodeAt 0
	D0: '0'.charCodeAt 0
	D1: '1'.charCodeAt 0
	D2: '2'.charCodeAt 0
	D3: '3'.charCodeAt 0
	D4: '4'.charCodeAt 0
	D5: '5'.charCodeAt 0
	D6: '6'.charCodeAt 0
	D7: '7'.charCodeAt 0
	D8: '8'.charCodeAt 0
	D9: '9'.charCodeAt 0
	ADD: '+'.charCodeAt 0
	SUB: '-'.charCodeAt 0
	MUL: '*'.charCodeAt 0
	DIV: '/'.charCodeAt 0
	MOD: '%'.charCodeAt 0
	NOT: '!'.charCodeAt 0
	GT: '`'.charCodeAt 0
	UP: '^'.charCodeAt 0
	LEFT: '<'.charCodeAt 0
	DOWN: 'v'.charCodeAt 0
	RIGHT: '>'.charCodeAt 0
	RAND: '?'.charCodeAt 0
	IFH: '_'.charCodeAt 0
	IFV: '|'.charCodeAt 0
	QUOT: '"'.charCodeAt 0
	DUP: ':'.charCodeAt 0
	SWAP: '\\'.charCodeAt 0
	DROP: '$'.charCodeAt 0
	OUTI: '.'.charCodeAt 0
	OUTC: ','.charCodeAt 0
	JUMP: '#'.charCodeAt 0
	PUT: 'p'.charCodeAt 0
	GET: 'g'.charCodeAt 0
	INI: '&'.charCodeAt 0
	INC: '~'.charCodeAt 0
	END: '@'.charCodeAt 0

window.bef ?= {}
window.bef.Symbols = Symbols