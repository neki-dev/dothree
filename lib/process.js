module.exports = function (settings) {

	return {

		send: function (player, key, data) {

			player.emit('event:' + key, data);

		},

		joinPlayer: function (player) {

			player.send('create', {
				slot: player.slot,
				game: player.lobby,
				settings: settings
			});

			player.lobby.send('connect', {
				getPlayers: player.lobby.getPlayers(),
				maxPlayers: player.lobby.maxPlayers,
				players: player.lobby.players
			});

		},

		leavePlayer: function (player) {

			var players = player.lobby.getPlayers();
			if (players === 0) {
				player.lobby.destroy();
			} else {
				player.lobby.send('disconnect', {
					getPlayers: players,
					maxPlayers: player.lobby.maxPlayers,
					players: player.lobby.players
				});
			}

		},

		chat: function (lobby, data) {

			var tagsToReplace = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;'
			};

			data.message = data.message.replace(/[&<>]/g, function (tag) {
				return tagsToReplace[tag] || tag;
			});

			lobby.send('chat', data);	

		},

		action: function (lobby, data) {

			if (
				lobby.getPlayers() < lobby.maxPlayers ||
				lobby.step != data.slot ||
				lobby.world[data.place.y][data.place.x] != 1
			) {
				return;
			}

			if (data.place.y + 1 < lobby.world.length && lobby.world[data.place.y + 1][data.place.x] == 1) {
				return;
			}

			lobby.world[data.place.y][data.place.x] = -data.slot;
			lobby.step = (lobby.step == lobby.maxPlayers) ? 1 : lobby.step + 1;
			lobby.timeout = settings.timeout;

			var winnerData = getWinnerData(lobby.mapSize, lobby.world, data.place);
			if (winnerData) {
				for (var i = 0; i < 3; ++i) {
					lobby.world[data.place.y + winnerData[i][1]][data.place.x + winnerData[i][0]] -= 1000;
				}
				lobby.step = 0;
				lobby.send('win', data.slot);
			}

			lobby.send('update', {
				world: lobby.world,
				step: lobby.step
			});

		},

	};

};

var getWinnerData = function (mapSize, world, place) {

	var ways = [
		// horizontal
		[[  1,  0 ],[  2,  0 ]],
		[[ -1,  0 ],[ -2,  0 ]],
		[[ -1,  0 ],[  1,  0 ]],
		// vertical
		[[  0,  1 ],[  0,  2 ]],
		[[  0, -1 ],[  0, -2 ]],
		[[  0, -1 ],[  0,  1 ]],
		// diagonal \
		[[ -1, -1 ],[ -2, -2 ]],
		[[ -1, -1 ],[  1,  1 ]],
		[[  1,  1 ],[  2,  2 ]],
		// diagonal /
		[[  1, -1 ],[  2, -2 ]],
		[[  1, -1 ],[ -1,  1 ]],
		[[ -1,  1 ],[ -2,  2 ]]
	];

	for (var n = 0; n < ways.length; ++n) {
		ways[n].push([ 0, 0 ]);
		var buffer;
		for (var m = 0; m < ways[n].length - 1; ++m) {
			buffer = false;
			var _i = place.x + ways[n][m    ][0], 
				_k = place.y + ways[n][m    ][1], 
				_j = place.x + ways[n][m + 1][0],
				_l = place.y + ways[n][m + 1][1];
			if (
				(_i < 0 || _k < 0 || _i >= mapSize.x || _k >= mapSize.y) || 
				(_j < 0 || _l < 0 || _j >= mapSize.x || _l >= mapSize.y) ||
				world[_k][_i] != world[_l][_j]
			) {
				break;
			}
			buffer = true;
		}
		if (buffer) {
			return ways[n];
		}
	}

};