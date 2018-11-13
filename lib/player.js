module.exports = function () {

	var Player = function (socket, id, lobby, slot) {

		this.socket = socket;
		this.id = id;
		this.lobby = lobby;
		this.slot = slot + 1;

		this.lobby.sessions[this.id] = true;
		this.lobby.players[this.slot - 1] = this.id;
		this.socket.join(this.lobby.id);

	};

	Player.prototype.destroy = function () {

		delete this.lobby.sessions[this.id];
		delete this.lobby.players[this.slot - 1];
		this.socket.leave(this.lobby.id);

	};

	Player.prototype.joined = function (lobby) {

		return lobby.sessions[this.id];

	};

	Player.prototype.send = function (key, data) {

		this.socket.emit('event:' + key, data);

	};

	return {
		class: Player
	};

};