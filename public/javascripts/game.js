$(function() {

	var socket = io.connect(),
		playerSlot = undefined,
		gameToggle = true,
		gameFinished = false,
		getStep = 1,
		activePlace = undefined,
		localWorld = [],
		imageCache = {};

	var canvasInit,
		canvas;

	var settings = {};

	var CLASSES = {
		players: [ '#DE212E', '#85C918', '#0780B0', '#BF5EB2' ],
		objects: [ '#eeeeee', '#444444', '#777777', '#aaaaaa' ]
	};

	/*
	**	Objects
	*/

	var OBJECT = {

		title: $('title'),
		main: $('#main'),
		global: $(window),
		body: $('body'),
		loading: $('#loading'),

		insert: function(objects) {

			objects.forEach(function(object) {
				OBJECT[object.replace(/[^a-zA-Z0-9]*/, '')] = $(object);
			});

		}

	};

	/*
	**	Events
	*/

	var EVENT = {

		serverData: function(data) {

			alert('server: ' + data);

		},

		create: function(data) {

			if(data.game.step == 0) {
				EVENT.error('Данная игра уже завершена');
				return;
			}

			settings = data.settings;
			settings.worldSize = data.game.worldSize;
			settings.mapSize = data.game.mapSize;
			settings.boxSize = data.game.boxSize;

			playerSlot = data.slot;
			getStep = data.game.step;

			OBJECT.title.html('squareInCube # ' + data.game.name);

			OBJECT.main.html('\
				<div class="worldBody">\
					<canvas id="world"></canvas>\
					<div id="data">\
						<div class="mark">\
							<span>Игроки</span>\
							<div class="pointList" id="playersList"></div>\
						</div>\
						<div class="mark">\
							<span>Вы</span>\
							<div class="point" style="background:' + getObjectClass(-data.slot) + '"></div>\
						</div>\
						<div class="mark">\
							<span>Ходит</span>\
							<div class="point" style="background:' + getObjectClass(-data.game.step) + '" id="markStep"></div>\
						</div>\
						<div class="mark">\
							<span>Таймаут хода</span>\
							<span id="timeout">' + getTimeoutFromSeconds(settings.timeout) + '</span>\
						</div>\
						<div class="tools">\
							<a href="" id="chatToggle">ЧАТ</a>\
							<a href="/" target="_blank">ПРАВИЛА</a>\
							<a href="/">ПОКИНУТЬ ИГРУ</a>\
						</div>\
					</div>\
					<div id="chat">\
						<div class="messages"><i>Сообщений нет...</i></div>\
						<div class="tools">\
							<textarea placeholder="Сообщение..."  maxlength="128"></textarea>\
							<button>Написать</button>\
						</div>\
					</div>\
				</div>\
			');

			canvasInit = document.getElementById('world');
			canvasInit.width = settings.worldSize.x;
			canvasInit.height = settings.worldSize.y;
			canvas = canvasInit.getContext('2d');

			OBJECT.insert([
				'#world', '#data', '#markStep', '#playersList', '#timeout', '#chatToggle', '#chat', '.worldBody'
			]);

			OBJECT.worldBody.css({
				width: settings.worldSize.x + 100
			})

			localWorld = data.game.world;
			renderWorld(data.game.world);
			
			OBJECT.chat.find('button').on('click', onChatSend);
			OBJECT.chatToggle.on('click', onChatToggle);
			OBJECT.chat.find('textarea').keydown(onChatKeyPress);
			
			OBJECT.world
			.on('click', onPlayerAction)
			.on('mouseleave', onPlayerLeaveMap)
			.on('mousemove', onPlayerHover);

			OBJECT.loading.remove();

		},

		update: function(data) {

			localWorld = data.world;
			renderWorld(data.world);

			updateTimeoutWithStep(settings.timeout, data.step);

		},

		timeout: function(data) {

			if(playerSlot == data.step && data.time <= 10) {
				playSound('timeout');
			}

			updateTimeoutWithStep(data.time, data.step);

		},

		win: function(data) {

			OBJECT.markStep.parent().remove();
			OBJECT.timeout.parent().remove();

			gameFinished = true;

			OBJECT.data.append('\
				<div class="mark">\
					<span class="win">' + ((data.slot == playerSlot) ? "Вы победили" : "Вы проиграли") + '</span>\
				</div>\
			');

		},

		connect: function(data) {

			if(gameFinished) {
				return;
			}

			updatePlayersList(data);
			awaitingToggle(data);

		},

		disconnect: function(data) {

			if(gameFinished) {
				return;
			}

			updatePlayersList(data);
			awaitingToggle(data);

		},

		error: function(message) {

			OBJECT.main.html('\
				<div class="error">\
					<h1>' + message + '</h1>\
					<a href="/">Главная страница</a>\
				</div>\
			');

			OBJECT.loading.remove();

		},

		chat: function(data) {

			var messages = OBJECT.chat.find('.messages');

			messages.find('i').remove();

			messages.append('\
				<div class="message">\
					<div class="autor" style="background:' + getObjectClass(-data.slot) + '"></div>\
					<span>' + data.message + '</span>\
				</div>\
			');

			messages.animate({ 
				scrollTop: messages.height() * 2
			}, 500);

		}

	};

	/*
	**	Register events
	*/

	var eventList = [
		'error',
		'disconnect',
		'create',
		'serverData',
		'update',
		'connect',
		'win',
		'timeout',
		'chat'
	];

	for(var i in eventList) {
		socket.on('event:' + eventList[i], EVENT[eventList[i]]);
	}

	/*
	**	Actions
	*/

	OBJECT.global.keydown(function(e) {

		if(e.key === 'F5' || e.keyCode == 116 || ((e.key === 'r' || e.key === 'R' || e.keyCode == 82) && e.ctrlKey)) {
			return false;
		}

	});
	
	function onPlayerAction(e) {		

		if(!gameToggle || gameFinished || getStep != playerSlot) {
			return;
		}

		socket.emit('action', {
			place: { 
				x: Math.floor(e.offsetX / settings.boxSize), 
				y: Math.floor(e.offsetY / settings.boxSize)
			},
			slot: playerSlot
		});

	}
	
	function onPlayerHover(e) {		

		if(!gameToggle || gameFinished || getStep != playerSlot) {
			return;
		}

		activePlace = [ Math.floor(e.offsetX / settings.boxSize), Math.floor(e.offsetY / settings.boxSize) ];
		renderWorld(localWorld);

	}

	function onPlayerLeaveMap() {

		activePlace = undefined;
		renderWorld(localWorld);

	}

	/*
	**	Chat 
	*/

	function onChatKeyPress(e) {
		
		if(e.keyCode == '13') {
			onChatSend();
			return false;
		}

	}

	function onChatToggle() {
		
		OBJECT.chat.toggle();

		return false;

	}

	function onChatSend() {

		var textarea = OBJECT.chat.find('textarea'),
			value = textarea.val();

		if(!value.length) {
			return false;
		}
		
		socket.emit('chat', {
			slot: playerSlot,
			message: value
		});

		textarea.val('');

		return false;

	}

	/*
	**	Functions
	*/

	function renderWorld(world) {

		var imageData;

		canvas.clearRect(0, 0, settings.worldSize.x, settings.worldSize.y);

		for(var i = 0; i < settings.mapSize.y; ++i) {
			for(var k = 0; k < settings.mapSize.x; ++k) {

				canvas.beginPath();

				canvas.fillStyle = getObjectClass(world[i][k]);
				canvas.fillRect(k * settings.boxSize + 2, i * settings.boxSize + 2, settings.boxSize - 4, settings.boxSize - 4);

				if(world[i][k] < -1000) {
					canvas.fillStyle = '#fff';
					canvas.arc(k * settings.boxSize + settings.boxSize / 2, i * settings.boxSize + settings.boxSize / 2, settings.boxSize / 6, 0, 2 * Math.PI);
					canvas.fill();
				}

				if(world[i][k] != 1 || (i + 1 < settings.mapSize.y && world[i + 1][k] == 1)) {
					continue;
				}

				canvas.fillStyle = '#ddd';

				if(activePlace) {
					if(activePlace[0] == k && activePlace[1] == i) {
						canvas.fillStyle = getObjectClass(-playerSlot);
					}
				}

				canvas.arc(k * settings.boxSize + settings.boxSize / 2, i * settings.boxSize + settings.boxSize / 2, settings.boxSize / 8, 0, 2 * Math.PI);
				canvas.fill();

			}
		}

	}

	function updateTimeoutWithStep(time, step) {

		OBJECT.timeout.html(getTimeoutFromSeconds(time));

		if(getStep != step) {
			
			OBJECT.markStep.css('background', getObjectClass(-step));			

			if(playerSlot == step) {
				playSound('step');
			}

			getStep = step;

		}

	}

	function getTimeoutFromSeconds(seconds) {

		return '0' + Math.floor(seconds / 60) + ':' + ((seconds % 60 < 10) ? '0' + seconds % 60 : seconds % 60)

	}

	function getObjectClass(id) {

		if(id < 0 && id > -1000) { // player
			return CLASSES.players[-id - 1];
		} else if(id < -1000) { // win player
			return CLASSES.players[-id - 1 - 1000];
		} else { // object
			return CLASSES.objects[id - 1];
		}

	}

	function awaitingToggle(data) {

		if(data.getPlayers < data.maxPlayers) {

			if(gameToggle) {

				gameToggle = false;

				OBJECT.main.append('\
					<div id="awaiting">\
						<div class="modal">\
							<div class="loader"></div>\
							<span class="text">\
								<b>Ожидание игроков...</b>\
								онлайн <span id="awaitingCount">' + data.getPlayers + '</span> из ' + data.maxPlayers + '\
							</span>\
						</div>\
					</div>\
				');

				OBJECT.insert([
					'#awaiting', '#awaitingCount'
				]);

			} else {
				OBJECT.awaitingCount.html(data.getPlayers);
			}

		} else {

			if(!gameToggle) {

				gameToggle = true;

				OBJECT.awaiting.remove();

				playSound('start');

			}

		}

	}

	function updatePlayersList(data) {

		OBJECT.playersList.html('');

		for(var i = 0; i < data.maxPlayers; ++i) {
			OBJECT.playersList.append(
				data.players[i] ?
				'<div class="point" style="background:' + getObjectClass(-(i + 1)) + '"></div>' :
				'<div class="pointEmpty"></div>'
			);
		}

	}

	function playSound(sound) {

		var audio = new Audio();
  		audio.src = '../sounds/' + sound + '.wav';
  		audio.autoplay = true;

	}

});
