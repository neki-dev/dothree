const CONFIG = require('./../../config.json');

class Core {

    constructor(io) {

        this.io = io;
        this.lobbies = [];
        
    }

    /**
     * Запуск секундного счетчика
     */
    initialize() {

        setInterval(() => {
            for (const lobby of this.lobbies) {
                if (lobby.players.length === 0) {
                    if (CONFIG.AUTO_DROP) {
                        lobby.idleTick++;
                        // Если лобби находится без игроков 10 секунд, то удаляем его
                        if (lobby.idleTick === 10) {
                            this.removeLobby(lobby);
                            lobby.destroy();
                        }
                    }
                } else {
                    lobby.idleTick = 0;
                    if (lobby.step !== null && lobby.players.length === lobby.options.maxPlayers) {
                        lobby.timeout--;
                        // Если время хода вышло, то ход переходит к следующему игроку
                        if (lobby.timeout === 0) {
                            lobby.nextStep();
                        }
                        lobby.updateTick();
                    }
                }
            }
        }, 1000);

    }

    /**
     * Получение лобби по uuid
     * @param {string} uuid
     * @return {Lobby}
     */
    getLobby(uuid) {

        return this.lobbies.find((lobby) => (lobby.uuid === uuid));

    }

    /**
     * Добавление лобби в общий список
     * @param {Lobby} lobby
     */
    addLobby(lobby) {

        this.lobbies.push(lobby);
        this.updateLobbies();

    }

    /**
     * Удаление лобби из общего списка
     * @param {Lobby} lobby
     */
    removeLobby(lobby) {

        const index = this.lobbies.findIndex((l) => (l.uuid === lobby.uuid));
        if (index === -1) {
            return console.warn(`Lobby #${lobby.uuid} is not found`);
        }

        this.lobbies.splice(index, 1);
        this.updateLobbies();

    }

    /**
     * Получение списка последних лобби
     * @return {Object[]}
     */
    getLastLobbies() {

        const lobbies = this.lobbies.filter((lobby) => (lobby.players.length < lobby.options.maxPlayers)).map((lobby) => ({
            uuid: lobby.uuid,
            date: lobby.date,
            players: {
                online: lobby.players.length,
                max: lobby.options.maxPlayers,
            },
        }));

        return lobbies.sort((a, b) => (
            (a.date.getTime() - b.date.getTime())
        )).slice(0, 5);

    }

    /**
     * Обновление списка лобби
     */
    updateLobbies() {

        this.send('UpdateLobbies', this.getLastLobbies());

    }

    /**
     * Отправка данных пользователям
     * @param {string} key
     * @param {*} data
     */
    send(key, data) {

        this.io.of('/home').emit(`player:${key}`, data);

    }

}

module.exports = Core;