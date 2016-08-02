$(function() {

	var CONST_PLAYER_SHIFT = 101,
		CONST_OBJECT_SHIFT = 100;

	var socket = io.connect(),
		playerSlot = undefined,
		gameToggle = true,
		gameFinished = false,
		getStep = 1;

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

			playerSlot = data.slot;
			getStep = data.game.step;

			OBJECT.title.html('SquareInCube # ' + data.game.name);

			OBJECT.main.html('\
				<div class="worldBody">\
					<div id="world"></div>\
					<div id="data">\
						<div class="mark">\
							<span>Игроки</span>\
							<div class="pointList" id="playersList"></div>\
						</div>\
						<div class="mark">\
							<span>Вы</span>\
							<div class="point ' + getObjectClass(data.slot + CONST_OBJECT_SHIFT) + '"></div>\
						</div>\
						<div class="mark">\
							<span>Ходит</span>\
							<div class="point ' + getObjectClass(data.game.step + CONST_OBJECT_SHIFT) + '" id="markStep"></div>\
						</div>\
						<div class="mark">\
							<span>Таймаут хода</span>\
							<span id="timeout">01:30</span>\
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
				<div class="worldBodySizer"></div>\
			');

			OBJECT.insert([
				'#world', '#data', '#markStep', '#playersList', '#timeout', '#chatToggle', '#chat'
			]);

			for(var i = 0; i < data.game.world.length; ++i) {
				OBJECT.world.append('\
					<div class="object ' + getObjectClass(data.game.world[i]) + getChance(data, i) + '"></div>\
				');
			}

			OBJECT.insert([
				'.object'
			]);

			OBJECT.object.on('click', onPlayerAction);

			OBJECT.chat.find('button').on('click', onChatSend);
			OBJECT.chatToggle.on('click', onChatToggle);
			OBJECT.chat.find('textarea').keydown(onChatKeyPress);

			OBJECT.loading.remove();

		},

		update: function(data) {

			OBJECT.object.eq(data.place).attr('class', 'object ' + getObjectClass(data.slot + CONST_OBJECT_SHIFT));

			if(data.place - data.size.x >= 0) {
				if(data.world[data.place - data.size.x] == 1) {
					OBJECT.object.eq(data.place-data.size.x).addClass('chance');
				}
			}

			updateTimeoutWithStep(data.time, data.step);

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
			OBJECT.object.removeClass('chance');

			gameFinished = true;

			for(var i = 0; i < 3; ++i) {
				OBJECT.object.eq(data.boxes[i]).addClass('win');
			}

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
					<div class="autor ' + getObjectClass(data.slot + CONST_OBJECT_SHIFT) + '"></div>\
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
	
	function onPlayerAction() {		

		if(!gameToggle || gameFinished) {
			return;
		}

		var object = $(this);
		
		if(!object.hasClass('chance')) {
			return;
		}

		socket.emit('action', {
			place: object.index(),
			slot: playerSlot
		});

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

	function updateTimeoutWithStep(time, step) {

		var s = time % 60;
		OBJECT.timeout.html('0' + Math.floor(time/60) + ':' + ((s < 10) ? '0' + s : s));

		if(getStep != step){
			
			OBJECT.markStep.attr('class', 'point ' + getObjectClass(step + CONST_OBJECT_SHIFT));			

			if(playerSlot == step) {
				playSound('step');
			}

			getStep = step;

		}

	}

	function getObjectClass(id) {

		if(id <= CONST_OBJECT_SHIFT) {

			var classes = [
				'*', 'air', '*', 'high', 'medium', 'easy'
			];

			return 'object-' + classes[id];

		} else {

			var classes = [
				'*', 'red', 'green', 'blue', 'purple'
			];

			return 'player-' + classes[id - CONST_OBJECT_SHIFT];
		}

	}

	function getChance(data, index) {

		if(data.game.world[index] == 1) {
			if(index + data.size.x > data.game.world.length) {
				return ' chance';
			} else if(data.game.world[index + data.size.x] != 1) {
				return ' chance';
			}
		}

		return '';

	}

	function awaitingToggle(data) {

		if(data.getPlayers < data.maxPlayers) {

			if(gameToggle) {

				gameToggle = false;

				OBJECT.body.prepend('\
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
				'<div class="point ' + getObjectClass(i + CONST_PLAYER_SHIFT) + '"></div>' :
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