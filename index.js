var express = require('express'),
	io = require('socket.io'),
	settings = require('./settings.json'),
	bodyParser = require('body-parser');

var app = express();
io = io(
	require('http').createServer(app).listen(process.env.PORT || settings.port)
);

app.set('views', __dirname + '/template');
app.set('view engine', 'jade');

//app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.static((__dirname + '/public')));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

if(settings.log) {
	//app.use(express.logger('dev'));
}

echo('# server started on port ' + (process.env.PORT || settings.port));

/*
**	Validate settings
*/

settings.timeout = settings.timeout > 300 ? 300 : settings.timeout;

/*
**	Register events
*/

io.sockets.on('connection', function(socket) {

	var data = {
		game: GAME.id(socket.handshake.headers.referer.replace(/.*\/(.*)/, '$1')),
		id: 
			settings.onceIP ? 
			socket.request.connection.remoteAddress || socket.request.headers['x-forwarded-for'] : 
			socket.id
	};

	if(socket.slot == EVENT.joinPlayer(socket, data)) {

		socket.on('disconnect', function() {
			EVENT.leavePlayer(socket, data);
		})
		.on('action', function(eventData) {
			EVENT.actionPlayer(data, eventData);
		})
		.on('chat', function(eventData) {
			EVENT.chatSend(data, eventData);
		})
		.on('timeout', function() {
			EVENT.timeout(data);
		});
		
	}

});

/*
**	Game functions
*/

var GAME = {

	DATA: [],

	create: function(data) {

		var date = new Date(),
			time = {
				h: date.getHours(),
				m: date.getMinutes(),
				s: date.getSeconds()
			};

		var mapSize = {
			},
			worldSize = {
				x: 900,
				y: 450
			};

		// current sizes: [5] 6 9 [10] [15]
		mapSize = {
			x: data.mapSize * 10,
			y: data.mapSize * 5
		};

		var boxSize = Math.ceil(worldSize.x / mapSize.x);

		this.DATA.push(data = {
			name: data.name,
			id: data.id || generateID(),
			maxPlayers: data.maxPlayers,
			players: [],
			world: generateWorld(mapSize, data.generateIndex),
			sessions: [],
			generateIndex: data.generateIndex,
			mapSize: mapSize,
			boxSize: boxSize,
			worldSize: worldSize,
			step: 1,
			timeout: settings.timeout,
			ctimer: null,
			date: 
				((time.h < 10) ? '0' + time.h : time.h) + ':' + 
				((time.m < 10) ? '0' + time.m : time.m) + ':' + 
				((time.s < 10) ? '0' + time.s : time.s)
		});

		echo('game `' + data.id + '` created');

		return data.id;

	},

	destroy: function(game) {

		echo('game `' + this.DATA[game].id + '` destroyed');

		delete this.DATA[game];

	},

	update: function(game, data) {

		this.DATA[game] = data;

	},

	id: function(id) {

		for(var i = 0; i < this.DATA.length; ++i) {
			if(!this.DATA[i]) continue;
			if(this.DATA[i].id == id) return parseInt(i);
		}

		return undefined;

	},

	playersCount: function(game) {

		var count = 0;

		for(var i = 0; i < this.DATA[game].maxPlayers; ++i) {
			if(!this.DATA[game].players[i]) continue;
			count++;
		}

		return count;

	},

	send: function(game, key, data) {

		io.sockets.to(game).emit('event:' + key, data);

	}

}

/*
**	Player functions
*/

var PLAYER = {

	add: function(socket, game, id) {

		GAME.DATA[game].sessions[id] = true;
		socket.join(game);

		for(var i = 0; i < GAME.DATA[game].maxPlayers; ++i) {
			if(GAME.DATA[game].players[i]) continue;
			GAME.DATA[game].players[i] = id;
			return i + 1;
		}

		return undefined;

	},

	remove: function(socket, game, id) {

		delete GAME.DATA[game].sessions[id];
		socket.leave(game);

		for(var i = 0; i < GAME.DATA[game].maxPlayers; ++i) {
			if(GAME.DATA[game].players[i] != id) continue;
			delete GAME.DATA[game].players[i];
		}

	},

	has: function(game, id) {

		return GAME.DATA[game].sessions[id];

	},

	send: function(player, key, data) {

		player.emit('event:' + key, data);

	}

}

/*
**	Core events
*/

var EVENT = {

	actionPlayer: function(data, eventData) {

		if(
			// check current count players
			GAME.playersCount(data.game) < GAME.DATA[data.game].maxPlayers ||
			// check player step
			GAME.DATA[data.game].step != eventData.slot ||
			// check map place (second)
			GAME.DATA[data.game].world[eventData.place.y][eventData.place.x] != 1 ||
			eventData.place.y + 1 < GAME.DATA[data.game].world.length
		) return;

		// check map place
		if(GAME.DATA[data.game].world[eventData.place.y + 1][eventData.place.x] == 1) return;

		// reset timeout
		GAME.DATA[data.game].timeout = settings.timeout;

		// update step
		GAME.DATA[data.game].world[eventData.place.y][eventData.place.x] = -eventData.slot;
		GAME.DATA[data.game].step = (GAME.DATA[data.game].step == GAME.DATA[data.game].maxPlayers) ? 1 : GAME.DATA[data.game].step + 1;

		// get winner
		var winnerData = getWinnerData(GAME.DATA[data.game].mapSize, GAME.DATA[data.game].world, eventData.place);
		if(winnerData) {

			for(var i = 0; i < 3; ++i) {
				GAME.DATA[data.game].world[winnerData[i][1]][winnerData[i][0]] -= 1000;
			}

			GAME.DATA[data.game].step = 0;

			GAME.send(data.game, 'win', { 
				slot: eventData.slot
			});

		}

		// update client world
		GAME.send(data.game, 'update', {
			world: GAME.DATA[data.game].world,
			step: GAME.DATA[data.game].step
		});

	},

	joinPlayer: function(socket, data) {

		echo('connect `' + socket.id + '`');

		if(data.game == undefined) {
			PLAYER.send(socket, 'error', 'Указанная игра не найдена');
			return undefined;
		}

		var getPlayers = GAME.playersCount(data.game);

		if(getPlayers == GAME.DATA[data.game].maxPlayers) {
			PLAYER.send(socket, 'error', 'Указанная игра уже запущена');
			return undefined;
		}

		if(PLAYER.has(data.game, data.id)) {
			PLAYER.send(socket, 'error', 'Вы уже играете');
			return undefined;
		}

		// add player
		var slot = PLAYER.add(socket, data.game, data.id);

		echo('-> player `' + socket.id + '` join game `' + GAME.DATA[data.game].id + '`');

		// create client world
		PLAYER.send(socket, 'create', {
			slot: slot,
			game: GAME.DATA[data.game],
			settings: settings
		});

		// update clients data
		GAME.send(data.game, 'connect', {
			getPlayers: getPlayers + 1,
			maxPlayers: GAME.DATA[data.game].maxPlayers,
			players: GAME.DATA[data.game].players
		});

		return slot;

	},

	leavePlayer: function(socket, data) {

		echo('<- player `' + socket.id + '` leave game `' + GAME.DATA[data.game].id + '`');

		/*if(!PLAYER.has(data.game, data.id)) {
			return;
		}*/

		PLAYER.remove(socket, data.game, data.id);

		var getPlayers = GAME.playersCount(data.game);
		if(getPlayers === 0) {

			echo('all players disconnected from game `' + GAME.DATA[data.game].id + '`');

			/* TODO
			**
			** Drop server when page is refreshed the last player in game
			*/

			/*GAME.DATA[data.game].ctimer = setInterval(function() {
				if(GAME.playersCount(data.game) === 0) {
					clearInterval(GAME.DATA[data.game].ctimer);
					GAME.destroy(data.game);
				}
			}, 5000);*/

			GAME.destroy(data.game);
			
		} else {

			GAME.send(data.game, 'disconnect', {
				getPlayers: getPlayers,
				maxPlayers: GAME.DATA[data.game].maxPlayers,
				players: GAME.DATA[data.game].players
			});

		}

	},

	chatSend: function(data, eventData) {

		// validate chat message
		eventData.message = eventData.message.escape();

		GAME.send(data.game, 'chat', eventData);	

	}

}

/*
**	Functions
*/

function echo(message) {

	if(!settings.log) return;
	
	console.log(message);

}

function generateID() {

	var	symbols = 'abcdefghijklmnopqrstuvwxyz1234567890',
		id = '',
		ch = '';

	for(var i = 0; i < settings.lenID; ++i) {
		ch = symbols[parseInt(Math.random() * (symbols.length))];
		id += parseInt(Math.random() * 2) ? ch : ch.toUpperCase();
	}

	return (GAME.id(id) == undefined) ? id : generateID();

}

function generateWorld(mapSize, generateIndex) {

	var world = [];

	for(var i = 0; i < mapSize.y; ++i) {
		world[i] = [];
		for(var k = 0; k < mapSize.x; ++k) {
			world[i][k] = (parseInt(Math.random() * generateIndex) != 0) ? 1 : parseInt(Math.random() * 4) + 1;
		}
	}

	return world;

}

function deleteArrayValue(array, value) {

	var index = array.indexOf(value);

	if(index != -1) {
		array.splice(index, 1);
	}

	return array;

}

function getWinnerData(mapSize, world, place) {

	var j = null;

	// horizontal

	j = checkPatentBoxes(mapSize, world, place, [
		[ [ place.x + 1, place.y ], [ place.x + 2, place.y ] ],
		[ [ place.x - 1, place.y ], [ place.x - 2, place.y ] ],
		[ [ place.x - 1, place.y ], [ place.x + 1, place.y ] ]
	]);
	
	if(j) return j;

	// vertical

	j = checkPatentBoxes(mapSize, world, place, [
		[ [ place.x, place.y + 1 ], [ place.x, place.y + 2 ] ],
		[ [ place.x, place.y - 1 ], [ place.x, place.y - 2 ] ],
		[ [ place.x, place.y - 1 ], [ place.x, place.y + 1 ] ]
	]);
	
	if(j) return j;

	// diagonal \

	j = checkPatentBoxes(mapSize, world, place, [
		[ [ place.x - 1, place.y - 1 ], [ place.x - 2, place.y - 2 ] ],
		[ [ place.x - 1, place.y - 1 ], [ place.x + 1, place.y + 1 ] ],
		[ [ place.x + 1, place.y + 1 ], [ place.x + 2, place.y + 2 ] ]
	]);
	
	if(j) return j;

	// diagonal /

	j = checkPatentBoxes(mapSize, world, place, [
		[ [ place.x + 1, place.y - 1 ], [ place.x + 2, place.y - 2 ] ],
		[ [ place.x + 1, place.y - 1 ], [ place.x - 1, place.y + 1 ] ],
		[ [ place.x - 1, place.y + 1 ], [ place.x - 2, place.y + 2 ] ]
	]);
	
	if(j) return j;

	return undefined;

}

function checkPatentBoxes(mapSize, world, place, check) {

	for(var k = 0; k < check.length; ++k) {

		check[k].push([ place.x, place.y ]);
		var buff;

		for(var i = 0; i < 2; ++i) {

			buff = false;

			if(
				check[k][i][0] < 0 || check[k][i][1] < 0 || check[k][i][0] >= mapSize.x || check[k][i][1] >= mapSize.y ||
				check[k][i + 1][0] < 0 || check[k][i + 1][1] < 0 || check[k][i + 1][0] >= mapSize.x || check[k][i + 1][1] >= mapSize.y
			) break;

			if(world[check[k][i][1]][check[k][i][0]] != world[check[k][i + 1][1]][check[k][i + 1][0]]) break;

			buff = true;

		}

		if(buff) return check[k];

	}

	return undefined;

}

String.prototype.escape = function() {

	var tagsToReplace = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;'
	};

	return this.replace(/[&<>]/g, function(tag) {
		return tagsToReplace[tag] || tag;
	});

}

/*
**	Router
*/

app.get('/game/:id', function(req, res) {
	res.render('game');
});

app.get('*', function(req, res) {
	res.render('index');
});

/*
**	Posts
*/

app.post('/create', function(req, res) {

	try {

		req.body.name = req.body.name.trim();

		if(/[^a-zA-Zа-яА-Я0-9\s]/.exec(req.body.name)) {
			throw new Error('Название игры не может содержать символы');
		} else if(req.body.name.length > 32 || req.body.name.length < 3) {
			throw new Error('Длина названия игры должна быть от 3 до 32 символов');
		} else if(req.body.players > 4 || req.body.players < 2) {
			throw new Error('Количество игроков должно быть от 2 до 4');
		} else if(req.body.mapsize > 3 || req.body.mapsize < 1) {
			throw new Error('Размер карты должен быть от 1 до 3');
		} else if(req.body.generate > 30 || req.body.generate < 3) {
			throw new Error('Частота блоков должна быть от 3 до 30');
		}

		var game = GAME.create({
			name: req.body.name,
			maxPlayers: req.body.players,
			mapSize: req.body.mapsize,
			generateIndex: 33 - req.body.generate
		});

		res.send({
			game: game
		});

	}

	catch(e) {
		res.send({ 
			error: e.message 
		});
	}

});

app.post('/load', function(req, res) {

	if(req.body.name) {
		req.body.name = req.body.name.trim();
	}

	var list = [],
		game = (GAME.DATA.length < 10 || req.body.name) ? GAME.DATA.length-1 : 9;

	for(; game >= 0; --game) {

		if(!GAME.DATA[game]) continue;
		if(GAME.DATA[game].step === 0) 	continue;

		var getPlayers = GAME.playersCount(game);
		if(getPlayers == GAME.DATA[game].maxPlayers) continue;

		if(req.body.name) {
			if(GAME.DATA[game].name.toUpperCase().indexOf(req.body.name.toUpperCase()) == -1) continue;
		}

		list.push({
			name: GAME.DATA[game].name,
			id: GAME.DATA[game].id,
			getPlayers: getPlayers,
			maxPlayers: GAME.DATA[game].maxPlayers,
			date: GAME.DATA[game].date
		});

	}

	res.send(!list.length ? null : list);

});

/*
**	Game timeout
*/

setInterval(function() {

	for(var game = 0; game < GAME.DATA.length; ++game) {

		if(!GAME.DATA[game]) continue;
		if(GAME.DATA[game].step === 0 || GAME.playersCount(game) < GAME.DATA[game].maxPlayers) continue;

		if(GAME.DATA[game].timeout == 1) {

			GAME.DATA[game].timeout = settings.timeout;
			
			GAME.DATA[game].step = (GAME.DATA[game].step == GAME.DATA[game].maxPlayers) ? 1 : GAME.DATA[game].step + 1;

		} else {
			GAME.DATA[game].timeout--;
		}

		GAME.send(game, 'timeout', {
			step: GAME.DATA[game].step,
			time: GAME.DATA[game].timeout
		});

	}

}, 1000);
