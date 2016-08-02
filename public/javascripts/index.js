window.onload = function() {

	var OBJECT = {
		playButton: $('#playButton'),
		contentItem: $('#content').children('.tab'),
		counterBox: $('.counterBox'),
		counterValue: $('#counterValue'),
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

	var maxPlayers = 3,
		updateList;

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

			maxPlayers: maxPlayers,
			name: OBJECT.createForm.find('input[name=name]').val()

		}).done(function(data) {
			if(data.error) {

				if(OBJECT.error) {
					OBJECT.error.html(data.error);
				} else {
					OBJECT.createForm.append('\
						<div class="error">' + data.error + '</div>\
					');
					OBJECT.error = createForm.find('.error');
				}
				
			}
			else {
				window.location.href = '/game/' + data.game;
			}
		});

		return false;

	});

	/*
	**	Player count
	*/

	OBJECT.counterBox.children('#plus').click(function() {
		if(maxPlayers < 4) {
			maxPlayers++;
			OBJECT.counterValue.val(maxPlayers + ' игрока');
		}
	});

	OBJECT.counterBox.children('#minus').click(function() {
		if(maxPlayers > 2) {
			maxPlayers--;
			OBJECT.counterValue.val(maxPlayers + ' игрока');
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

		if(list) {

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

			//OBJECT.searchForm.remove();

			OBJECT.gamelist.html('\
				<i>Не найдено ни одной игры...</i>\
			');

		}

	}

}