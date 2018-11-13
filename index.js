var express = require('express'),
	io = require('socket.io'),
	settings = require('./config.json'),
	path = require('path'),
	parser = require('body-parser');

var app = express();
io = io(
	require('http').createServer(app).listen(process.env.PORT || settings.port)
);

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.use(express.static(path.join(__dirname, 'src')));

console.log('Server started on port ' + (process.env.PORT || settings.port));

/*
**	Validate settings
*/

settings.timeout = Math.min(settings.timeout, 300);

/*
**	?
*/

var gameProcess = require('./lib/process')(settings);
var Lobby = require('./lib/lobby')(settings, io);
var Player = require('./lib/player')();

/*
**	Register events
*/

io.sockets.on('connection', function (socket) {

	var lobby = Lobby.find(socket.handshake.headers.referer.replace(/.*\/(.*)/, '$1')),
		id = (
			settings.once_ip ? 
			socket.request.connection.remoteAddress || socket.request.headers['x-forwarded-for'] : 
			socket.id
		);

	if (!lobby) {
		return gameProcess.send(socket, 'error', 'Указанная игра не найдена');
	}

	var slot = lobby.slot();
	if (typeof slot != 'number') {
		return gameProcess.send(socket, 'error', 'Указанная игра уже запущена');
	}

	var player = new Player.class(socket, id, lobby, slot);

	gameProcess.joinPlayer(player);

	socket
	.on('disconnect', function () {
		gameProcess.leavePlayer(player);
		player.destroy();
	})
	.on('chat', function (data) {
		gameProcess.chat(lobby, data);
	})
	.on('action', function (data) {
		gameProcess.action(lobby, data);
	});

});

/*
**	Router
*/

app.get('/game/:id', function (req, res) {
	res.sendFile(path.join(__dirname, 'src', 'game.html'));
});

app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

/*
**	Posts
*/

app.post('/create', function (req, res) {

	try {

		req.body.name = req.body.name.trim();

		if (/[^a-zA-Zа-яА-Я0-9\s]/.exec(req.body.name)) {
			throw new Error('Название игры не может содержать символы');
		} else if (req.body.name.length > 32 || req.body.name.length < 3) {
			throw new Error('Длина названия игры должна быть от 3 до 32 символов');
		} else if (req.body.players > 4 || req.body.players < 2) {
			throw new Error('Количество игроков должно быть от 2 до 4');
		} else if (req.body.mapsize > 3 || req.body.mapsize < 1) {
			throw new Error('Размер карты должен быть от 1 до 3');
		} else if (req.body.generate > 30 || req.body.generate < 3) {
			throw new Error('Частота блоков должна быть от 3 до 30');
		}

		res.send({
			game: new Lobby.class({
				name: req.body.name,
				maxPlayers: req.body.players,
				mapSize: req.body.mapsize,
				generateIndex: 33 - req.body.generate
			}).id
		});

	}
	catch(e) {

		res.send({ 
			error: e.message 
		});

	}

});

app.post('/load', function (req, res) {

	var list = [],
		search = req.body.name ? req.body.name.trim() : null,
		count = 0;

	for (var lobby of Lobby.listing) {

		if (lobby.step === 0) {
			continue;
		}

		var players = lobby.getPlayers();

		// game is started
		if (players == lobby.maxPlayers) {
			continue;
		}

		// search
		if (search && lobby.name.toUpperCase().indexOf(search.toUpperCase()) == -1) {
			continue;
		}

		list.push({
			name: lobby.name,
			id: lobby.id,
			getPlayers: players,
			maxPlayers: lobby.maxPlayers,
			date: lobby.date
		});
		
		if (++count == 10 && !search) {
			break;
		}

	}

	res.send(list);

});

/*
**	Game timeout
*/

setInterval(function () {

	for (var lobby of Lobby.listing) {

		if (lobby.step === 0 || lobby.getPlayers() < lobby.maxPlayers) {
			continue;
		}

		if (lobby.timeout === 1) {
			lobby.timeout = settings.timeout;
			lobby.step = (lobby.step == lobby.maxPlayers) ? 1 : lobby.step + 1;
		} else {
			lobby.timeout--;
		}

		lobby.send('timeout', {
			step: lobby.step,
			time: lobby.timeout
		});

	}

}, 1000);