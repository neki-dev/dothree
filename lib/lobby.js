module.exports = function (settings, io) {
	
	var listing = [];

	var Lobby = function (params) {

		var world = [],
			date = new Date(),
			time = {
				h: date.getHours(),
				m: date.getMinutes(),
				s: date.getSeconds()
			},
			worldSize = {
				x: 900,
				y: 450
			},
			mapSize = {
				x: params.mapSize * 10,
				y: params.mapSize * 5
			};

		for (var i = 0; i < mapSize.y; ++i) {
			world[i] = [];
			for (var k = 0; k < mapSize.x; ++k) {
				world[i][k] = (parseInt(Math.random() * params.generateIndex) != 0) ? 1 : parseInt(Math.random() * 4) + 1;
			}
		}

		this.name = params.name;
		this.id = Math.random().toString(36).substr(2, 9),
		this.maxPlayers = params.maxPlayers,
		this.players = [],
		this.world = world,
		this.sessions = [],
		this.generateIndex = params.generateIndex,
		this.mapSize = mapSize,
		this.boxSize = Math.ceil(worldSize.x / mapSize.x),
		this.worldSize = worldSize,
		this.step = 1,
		this.timeout = settings.timeout,
		this.date = (
			((time.h < 10) ? '0' + time.h : time.h) + ':' + 
			((time.m < 10) ? '0' + time.m : time.m) + ':' + 
			((time.s < 10) ? '0' + time.s : time.s)
		);

		listing.push(this);

	};

	Lobby.prototype.destroy = function () {
		
		var index = listing.indexOf(this);
		if (index > -1) {
			listing.splice(index, 1);
		}

	};

	Lobby.prototype.getPlayers = function () {

		var count = 0;

		for (var i = 0; i < this.maxPlayers; ++i) {
			if (!this.players[i]) {
				continue;
			}
			count++;
		}

		return count;

	};

	Lobby.prototype.send = function (key, data) {

		io.sockets.to(this.id).emit('event:' + key, data);

	};

	Lobby.prototype.slot = function () {

		for (var i = 0; i < this.maxPlayers; ++i) {
			if (this.players[i]) {
				continue;
			}
			return i;
		}

	};

	var find = function (id) {

		for (var lobby of listing) {
			if (lobby.id == id) {
				return lobby;
			}
		}

	};

	return {
		listing,
		class: Lobby,
		find
	};

};