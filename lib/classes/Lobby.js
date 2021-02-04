const utils = require('../utils');

class Lobby {

    constructor(core, options = {}) {

        this.options = utils.validate(options, {
            maxPlayers: {default: 3, min: 2, max: 5},
            density: {default: 10, min: 0, max: 40},
            bonusing: {default: 2, min: 0, max: 5},
            timeout: {default: 30, min: 5, max: 60},
            targetLength: {default: 3, min: 3, max: 4},
        });

        this.uuid = utils.generate();
        this.players = [];
        this.world = [];
        this.step = null;
        this.timeout = 0;
        this.date = new Date();
        this.finished = false;
        this.timeoutReset = null;
        this.core = core;
        this.mapSize = [23, 12];
        this.idleTick = 0;

        this.generateWorld();

        console.log(`Lobby #${this.uuid} created`);

    }

    /**
     * Удаление лобби
     */
    destroy() {

        if (this.timeoutReset !== null) {
            clearTimeout(this.timeoutReset);
        }

        console.log(`Lobby #${this.uuid} destroyed`);

    }

    /**
     * Отправка данных всем игрокам лобби
     * @param {string} key
     * @param {*} data
     */
    send(key, data) {

        this.core.io.of('/lobby').to(this.uuid).emit(`lobby:${key}`, data);

    }

    /**
     * Генерация элементов мира
     */
    generateWorld() {

        for (let y = 0; y < this.mapSize[1]; y++) {
            this.world[y] = [];
            for (let x = 0; x < this.mapSize[0]; x++) {
                let entity = 'empty';
                if (utils.probability(this.options.density)) {
                    entity = 'block';
                } else if (y + 1 !== this.mapSize[1] && utils.probability(this.options.bonusing)) {
                    entity = `bonus-${utils.randomize(['replacer', 'spawn', 'laser'])}`;
                }
                this.world[y][x] = entity;
            }
        }

    }

    /**
     * Запуск игры
     */
    start() {

        this.timeout = this.options.timeout;
        this.step = Math.floor(Math.random() * this.options.maxPlayers);
        this.updateTick();

    }

    /**
     * Сброс игры
     */
    reset() {

        if (this.timeoutReset !== null) {
            clearTimeout(this.timeoutReset);
            this.timeoutReset = null;
        }

        this.finished = false;

        this.generateWorld();
        this.updateWorld();

        if (this.players.length === this.options.maxPlayers) {
            this.start();
        }

    }

    /**
     * Поиск свободного слота
     * @return {null|number}
     */
    getEmptySlot() {

        for (let i = 0; i < this.options.maxPlayers; i++) {
            if (this.players.every((player) => (player.slot !== i))) {
                return i;
            }
        }

        return null;

    }

    /**
     * Добавление игрока в лобби
     * @param {Player} player
     */
    joinPlayer(player) {

        const isExists = this.players.some((p) => (p.id === player.id));
        if (isExists) {
            return player.send('Error', 'Вы уже находитесь в этой игре');
        }

        const slot = this.getEmptySlot();
        if (slot === null) {
            return player.send('Error', 'Указанная игра уже запущена');
        }

        player.slot = slot;
        player.socket.join(this.uuid);

        player.send('JoinLobby', {
            world: this.world,
            step: this.step,
            timeout: this.timeout,
            options: this.options,
        });

        this.players.push(player);
        this.updatePlayers();

        if (this.step === null && this.players.length === this.options.maxPlayers) {
            this.start();
        }

        console.log(`Player #${player.id} joined to lobby #${this.uuid}`);

    }

    /**
     * Удаление игрока из лобби
     * @param {Player} player
     */
    leavePlayer(player) {

        const index = this.players.findIndex((p) => (p.id === player.id));
        if (index === -1) {
            return console.warn(`Player #${player.id} not found in lobby #${this.uuid}`);
        }

        this.players.splice(index, 1);
        this.updatePlayers();

        player.slot = null;
        player.socket.leave(this.uuid);

        if (this.finished) {
            this.reset();
        }

        console.log(`Player #${player.id} leaved from lobby #${this.uuid}`);

    }

    /**
     * Обновление списка игроков
     */
    updatePlayers() {

        const players = this.players.map((player) => ({
            id: player.id,
            slot: player.slot,
        }));

        this.send('UpdatePlayers', players);
        this.core.updateLobbies();

    }

    /**
     * Обновление элементов мира
     */
    updateWorld() {

        this.send('UpdateWorld', this.world);

    }

    /**
     * Обновление данных хода и таймера
     */
    updateTick() {

        this.send('UpdateTick', {
            step: this.step,
            timeout: this.timeout,
        });

    }

    /**
     * Переход хода с следующему игроку
     */
    nextStep() {

        this.timeout = this.options.timeout;
        if (this.step + 1 === this.options.maxPlayers) {
            this.step = 0;
        } else {
            this.step++;
        }

    }

    /**
     * Добавление элемента в мир
     * @param {Player} player
     * @param {number[]} location
     */
    putEntity(player, location) {

        const [x, y] = location;

        if (
            // Если ход не принадлежит игроку
            this.step !== player.slot ||
            // Если место, куда ставится элемент в воздухе
            !utils.mainstay(this.world, x, y)
        ) {
            return;
        }

        const puts = [[x, y]];

        const types = this.world[y][x].split('-');
        if (types[0] === 'bonus') {
            switch (types[1]) {

                case 'replacer':
                    const puttedEntities = [];
                    for (const [y, line] of Object.entries(this.world)) {
                        for (const [x, entity] of Object.entries(line)) {
                            const [type, slot] = entity.split('-');
                            if (type === 'player' && (slot.replace('slot', '') - 1) !== player.slot) {
                                puttedEntities.push([x, y]);
                            }
                        }
                    }
                    if (puttedEntities.length > 0) {
                        puts.push(utils.randomize(puttedEntities));
                    }
                    break;

                case 'spawn':
                    const emptyEntities = [];
                    for (const [y, line] of Object.entries(this.world)) {
                        for (const [x, entity] of Object.entries(line)) {
                            if (entity === 'empty' && utils.mainstay(this.world, Number(x), Number(y))) {
                                emptyEntities.push([x, y]);
                            }
                        }
                    }
                    if (emptyEntities.length > 0) {
                        puts.push(utils.randomize(emptyEntities));
                    }
                    break;

                case 'laser':
                    for (const y of Object.keys(this.world)) {
                        this.world[y][x] = 'empty';
                    }
                    puts[0][1] = this.world.length - 1;
                    break;

            }
        } else if (types[0] !== 'empty') {
            return;
        }

        this.nextStep();

        for (const [x, y] of puts) {

            // Замена затронутых элементов на элемент игрока
            this.world[y][x] = `player-slot${player.slot + 1}`;

            const result = this.getWinningLocations([x, y]);
            if (result) {
                for (const [x, y] of result) {
                    this.world[y][x] += '-win';
                }
                this.finished = true;
                this.step = null;
                this.send('PlayerWin', player.id);
                // Запуск таймера на сброс игры
                this.timeoutReset = setTimeout(() => this.reset(), 3000);
                break;
            }

        }

        this.updateTick();
        this.updateWorld();

    }

    /**
     * Получение выигрышных позиций элементов
     * @param {number[]} from
     * @return {number[]}
     */
    getWinningLocations(from) {

        for (const line of [[-1,0], [-1,-1], [0,-1], [1,-1]]) {
            for (let side = 0; side > -this.options.targetLength; side--) {
                const locations = [];
                for (let step = side; step <= (side + this.options.targetLength - 1); step++) {
                    const point = from.map((f, i) => (f - line[i] * step));
                    if (point.every((c, i) => (c >= 0 && c < this.mapSize[i]))) {
                        locations.push(point);
                    }
                }
                if (locations.length === this.options.targetLength) {
                    if (locations.every(([x, y]) => (this.world[y][x] === this.world[from[1]][from[0]]))) {
                        return locations;
                    }
                }
            }
        }

    }

}

module.exports = Lobby;