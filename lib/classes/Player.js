const CONFIG = require('./../../config.json');

class Player {

    constructor(socket) {

        this.id = CONFIG.IP_ONCE ? (socket.request.connection.remoteAddress || socket.request.headers['x-forwarded-for']) : socket.id;
        this.socket = socket;
        this.slot = null;

    }

    /**
     * Отправка данных игроку
     * @param {string} key
     * @param {*} data
     */
    send(key, data) {

        this.socket.emit(`player:${key}`, data);

    }

}

module.exports = Player;