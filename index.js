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

	if(socket.slot = EVENT.joinPlayer(socket, data)) {

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

		this.DATA.push(data = {
			name: data.name || 'Undefined',
			id: data.id || generateID(),
			maxPlayers: data.maxPlayers || 3,
			players: [],
			world: generateWorld(),
			sessions: [],
			step: 1,
			timeout: settings.timeout,
			date: 
				((time.h < 10) ? '0' + time.h : time.h) + ':' + 
				((time.m < 10) ? '0' + time.m : time.m) + ':' + 
				((time.s < 10) ? '0' + time.s : time.s)
		});

		echo('GAME `' + data.id + '` CREATED');

		return data.id;

	},

	destroy: function(game) {

		delete this.DATA[game];

	},

	update: function(game, data) {

		this.DATA[game] = data;

	},

	id: function(id) {

		for(var i in this.DATA) { 
			if(this.DATA[i].id == id) {
				return parseInt(i);
			}
		}

		return undefined;

	},

	playersCount: function(game) {

		var count = 0;

		for(var i = 0; i < this.DATA[game].maxPlayers; ++i) {
			if(this.DATA[game].players[i]) {
				count++;
			}
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
			if(!GAME.DATA[game].players[i]) {
				GAME.DATA[game].players[i] = id;
				return i+1;
			}
		}

		return undefined;

	},

	remove: function(socket, game, id) {

		delete GAME.DATA[game].sessions[id];
		socket.leave(game);

		for(var i = 0; i < GAME.DATA[game].maxPlayers; ++i) {
			if(GAME.DATA[game].players[i] == id) {
				delete GAME.DATA[game].players[i];
			}
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

		if(GAME.playersCount(data.game) < GAME.DATA[data.game].maxPlayers) {
			return;
		}

		if(GAME.DATA[data.game].step != eventData.slot) {
			return;
		}

		if(GAME.DATA[data.game].world[eventData.place] != 1) {
			return;
		}

		if(eventData.place <= settings.worldSize.x*(settings.worldSize.y-1)) {
			if(GAME.DATA[data.game].world[eventData.place+settings.worldSize.x] == 1) {
				return;
			}
		}

		GAME.DATA[data.game].timeout = settings.timeout;

		GAME.DATA[data.game].world[eventData.place] = eventData.slot+100;
		GAME.DATA[data.game].step++;
		if(GAME.DATA[data.game].step > GAME.DATA[data.game].maxPlayers) {
			GAME.DATA[data.game].step = 1;
		}

		GAME.send(data.game, 'update', { 
			place: eventData.place,
			size: settings.worldSize,
			slot: eventData.slot,
			world: GAME.DATA[data.game].world,
			step: GAME.DATA[data.game].step,
			time: GAME.DATA[data.game].timeout
		});

		var winnerData = getWinnerData(GAME.DATA[data.game].world, eventData.place);
		if(winnerData) {

			GAME.DATA[data.game].step = 0;

			GAME.send(data.game, 'win', { 
				slot: eventData.slot,
				boxes: winnerData
			});

		}

	},

	joinPlayer: function(socket, data) {

		echo('CONNECT ' + socket.id);

		if(data.game == undefined) {
			PLAYER.send(socket, 'error', 'Указанная игра не найдена');
			return false;
		}

		var getPlayers = GAME.playersCount(data.game);

		if(getPlayers == GAME.DATA[data.game].maxPlayers) {
			PLAYER.send(socket, 'error', 'Указанная игра уже запущена');
			return false;
		}

		if(PLAYER.has(data.game, data.id)) {
			PLAYER.send(socket, 'error', 'Вы уже играете');
			return false;
		}

		var slot = PLAYER.add(socket, data.game, data.id);

		PLAYER.send(socket, 'create', {
			slot: slot,
			game: GAME.DATA[data.game],
			size: settings.worldSize
		});

		GAME.send(data.game, 'connect', {
			getPlayers: getPlayers+1,
			maxPlayers: GAME.DATA[data.game].maxPlayers,
			players: GAME.DATA[data.game].players
		});

		return slot;

	},

	leavePlayer: function(socket, data) {

		echo('DISCONNECT ' + socket.id);

		/*if(!PLAYER.has(data.game, data.id)) {
			return;
		}*/

		PLAYER.remove(socket, data.game, data.id);

		var getPlayers = GAME.playersCount(data.game);

		if(getPlayers == 0) {

			setTimeout(function() {
				if(GAME.playersCount(data.game) == 0) {
					GAME.destroy(data.game);
				}
			}, 3000);
			
		} else {

			GAME.send(data.game, 'disconnect', {
				getPlayers: getPlayers,
				maxPlayers: GAME.DATA[data.game].maxPlayers,
				players: GAME.DATA[data.game].players
			});

		}

	},

	chatSend: function(data, eventData) {

		eventData.message = eventData.message.escape();

		GAME.send(data.game, 'chat', eventData);	

	}

}

/*
**	Functions
*/

function echo(message) {

	if(settings.log) {
		console.log(message);
	}

}

function generateID() {

	var	symbols = 'abcdefghijklmnopqrstuvwxyz1234567890',
		id = '',
		ch = '';

	for(var i = 0; i < settings.lenID; ++i) {
		ch = symbols[parseInt(Math.random()*(symbols.length))];
		id += parseInt(Math.random()*2) ? ch : ch.toUpperCase();
	}

	if(GAME.id(id) == undefined) {
		return id;
	} else {
		return generateID();
	}

}

function generateWorld() {

	var world = [],
		size = settings.worldSize.x*settings.worldSize.y;

	for(var i = 0; i < size; ++i) {
		if(parseInt(Math.random()*6) > 0) {
			world[i] = 1;
		} else {
			world[i] = parseInt(Math.random()*5) + 1;
			if(world[i] == 2) {
				world[i] = 1;
			}
		}
	}

	return world;

}

function getWinnerData(world, place) {

	var size = settings.worldSize.x*settings.worldSize.y,
		type = world[place]
		column = (place < 14) ? place+1 : ((place+1) % settings.worldSize.x || settings.worldSize.x);

	// horizontal

	if(column < settings.worldSize.x-1) {
		if(world[place+1] == type && world[place+2] == type) {
			return [ 
				place, 
				place+1,
				place+2 
			];
		}
	}

	if(column > 1 && column < settings.worldSize.x) {
		if(world[place-1] == type && world[place+1] == type) {
			return [ 
				place-1, 
				place, 
				place+1 
			];
		}
	}

	if(column > 2) {
		if(world[place-2] == type && world[place-1] == type) {
			return [ 
				place-2, 
				place-1, 
				place 
			];
		}
	}

	// vertical

	if(place+settings.worldSize.x*2 < size) {
		if(world[place+settings.worldSize.x] == type && world[place+settings.worldSize.x*2] == type) {
			return [ 
				place, 
				place+settings.worldSize.x, 
				place+settings.worldSize.x*2
			];
		}
	}

	// diagonal \

	if(place+settings.worldSize.x*2+2 < size && column < settings.worldSize.x-1) {
		if(world[place+settings.worldSize.x+1] == type && world[place+settings.worldSize.x*2+2] == type) {
			return [ 
				place, 
				place+settings.worldSize.x+1, 
				place+settings.worldSize.x*2+2
			];
		}
	}

	if(place+settings.worldSize.x+1 < size && place-settings.worldSize.x-1 > 0 && column < settings.worldSize.x && column > 1) {
		if(world[place+settings.worldSize.x+1] == type && world[place-settings.worldSize.x-1] == type) {
			return [ 
				place, 
				place+settings.worldSize.x+1, 
				place-settings.worldSize.x-1
			];
		}
	}

	if(place-settings.worldSize.x*2-2 > 0 && column > 2) {
		if(world[place-settings.worldSize.x-1] == type && world[place-settings.worldSize.x*2-2] == type) {
			return [ 
				place, 
				place-settings.worldSize.x-1, 
				place-settings.worldSize.x*2-2
			];
		}
	}

	// diagonal /

	if(place+settings.worldSize.x*2-2 < size && column > 2) {
		if(world[place+settings.worldSize.x-1] == type && world[place+settings.worldSize.x*2-2] == type) {
			return [ 
				place, 
				place+settings.worldSize.x-1, 
				place+settings.worldSize.x*2-2
			];
		}
	}

	if(place+settings.worldSize.x-1 < size && place-settings.worldSize.x+1 > 0 && column < settings.worldSize.x && column > 1) {
		if(world[place+settings.worldSize.x-1] == type && world[place-settings.worldSize.x+1] == type) {
			return [ 
				place, 
				place+settings.worldSize.x-1, 
				place-settings.worldSize.x+1
			];
		}
	}

	if(place-settings.worldSize.x*2+2 > 0 && column < settings.worldSize.x-1) {
		if(world[place-settings.worldSize.x+1] == type && world[place-settings.worldSize.x*2+2] == type) {
			return [ 
				place, 
				place-settings.worldSize.x+1, 
				place-settings.worldSize.x*2+2
			];
		}
	}

	return null;

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
		} else if(req.body.maxPlayers > 4 || req.body.maxPlayers < 2) {
			throw new Error('Количество игроков должно быть от 2 до 4');
		}

		var game = GAME.create({
			name: req.body.name,
			maxPlayers: req.body.maxPlayers
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

		if(!GAME.DATA[game]) {
			continue;
		}

		if(GAME.DATA[game].step == 0) {
			continue;
		}

		var getPlayers = GAME.playersCount(game);

		if(getPlayers == GAME.DATA[game].maxPlayers) {
			continue;
		}

		if(req.body.name) {
			if((GAME.DATA[game].name.toUpperCase()).indexOf(req.body.name.toUpperCase()) == -1) {
				continue;
			}
		}

		list.push({
			name: GAME.DATA[game].name,
			id: GAME.DATA[game].id,
			getPlayers: getPlayers,
			maxPlayers: GAME.DATA[game].maxPlayers,
			date: GAME.DATA[game].date
		});

	}
	
	if(!list.length) {
		res.send(null);
	} else {
		res.send(list);
	}

});

/*
**	Game timeout
*/

setInterval(function() {

	for(var game = 0; game < GAME.DATA.length; ++game) {

		if(!GAME.DATA[game]) {
			continue;
		}

		if(GAME.DATA[game].step == 0) {
			continue;
		}

		if(GAME.playersCount(game) < GAME.DATA[game].maxPlayers) {
			continue;
		}

		if(GAME.DATA[game].timeout == 1) {

			GAME.DATA[game].timeout = settings.timeout;

			GAME.DATA[game].step++;
			if(GAME.DATA[game].step > GAME.DATA[game].maxPlayers) {
				GAME.DATA[game].step = 1;
			}

		} else {

			GAME.DATA[game].timeout--;

		}

		GAME.send(game, 'timeout', {
			step: GAME.DATA[game].step,
			time: GAME.DATA[game].timeout
		});

	}

}, 1000);