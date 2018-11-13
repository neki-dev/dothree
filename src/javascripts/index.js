window.onload = function() {

	var OBJECT = {
		playButton: $('#playButton'),
		contentItem: $('#content').children('.tab'),
		counterBox: $('.counterBox'),
		gamelist: $('#gamelist'),
		createForm: $('form#createGame'),
		searchForm: $('form#searchGame'),
		logotype: $('#logotype'),
		error: null,
		tab: {
			main: $('#tab-main'),
			play: $('#tab-play')
		}
	};

	var updateList;

	/*
	**	Menu
	*/
	
	setTimeout(function() {
		OBJECT.playButton.addClass('animate');
	}, 100);

	if(window.location.pathname == '/play') {
		OBJECT.tab.play.show();
	} else {
		OBJECT.tab.main.show();
	}

	OBJECT.playButton.click(function() {

		OBJECT.tab.play.show();
		OBJECT.tab.main.hide();

		history.replaceState({
			page: '/play'
		}, '', '/play');

	});

	OBJECT.logotype.click(function() {

		OBJECT.tab.play.hide();
		OBJECT.tab.main.show();

		history.replaceState({
			page: '/'
		}, '', '/');

	});

	/*
	**	Create a new game
	*/

	OBJECT.createForm.submit(function() {

		$.post('/create', {

			players: OBJECT.createForm.find('input[name=players]').val(),
			name: OBJECT.createForm.find('input[name=name]').val(),
			generate: OBJECT.createForm.find('input[name=generate]').val(),
			mapsize: OBJECT.createForm.find('input[name=mapsize]').val()

		}).done(function(data) {
			if(data.error) {

				if(OBJECT.error) {
					OBJECT.error.html(data.error);
				} else {
					OBJECT.createForm.append('\
						<div class="error">' + data.error + '</div>\
					');
					OBJECT.error = OBJECT.createForm.find('.error');
				}
				
			} else {
				window.location.href = '/game/' + data.game;
			}
		});

		return false;

	});

	/*
	**	Game settings counters
	*/

	OBJECT.counterBox.children('#plus').click(function() {

		var self = $(this),
			input = $('.counterValue[data-count="' + self.parent().attr('data-count') + '"]'),
			value = parseInt(input.val());

		if(value < self.attr('data-count-max')) {
			input.val(value + 1);
		}

	});

	OBJECT.counterBox.children('#minus').click(function() {

		var self = $(this),
			input = $('.counterValue[data-count="' + self.parent().attr('data-count') + '"]'),
			value = parseInt(input.val());

		if(value > self.attr('data-count-min')) {
			input.val(value - 1);
		}

	});

	/*
	**	Game list
	*/

	updateList = setInterval(postUpdate, 1000);

	postUpdate();

	OBJECT.searchForm.submit(function() {

		var value = OBJECT.searchForm.find('input[name=name]').val();

		if(value.length) {

			clearInterval(updateList);

			OBJECT.searchForm.parent().children('h4').html('Результат поиска');

			$.post('/load', {
				name: value
			}).done(insertGameList);

		}

		return false;

	});

	function postUpdate() {
				
		if(window.location.pathname != '/play'){
			return;
		}

		$.post('/load').done(insertGameList);

	}

	function insertGameList(list) {

		if(list.length > 0) {

			OBJECT.gamelist.html('');

			list.forEach(function(game) {

				OBJECT.gamelist.append('\
					<div class="game" id="' + game.id + '">\
						<span class="name">' + game.name + '</span>\
						<span class="date">' + game.date + '</span>\
						<span class="players">Игроки <b>' + game.getPlayers + '</b> из <b>' + game.maxPlayers + '</b></span>\
					</div>\
				');

			});

			OBJECT.gamelist.children('.game').on('click', function() {
				window.location.href = '/game/' + $(this).attr('id');
			});

		} else {

			OBJECT.gamelist.html('\
				<i>Не найдено ни одной игры...</i>\
			');

		}

	}

}