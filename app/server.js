/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./config.json":
/*!*********************!*\
  !*** ./config.json ***!
  \*********************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"IP_ONCE\":false,\"PORT\":3000,\"LOBBY_IDLE_TIMEOUT\":10,\"RESTART_TIMEOUT\":5}');\n\n//# sourceURL=webpack://locbook/./config.json?");

/***/ }),

/***/ "./src/server/classes/Core.ts":
/*!************************************!*\
  !*** ./src/server/classes/Core.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nvar Core = /** @class */ (function () {\r\n    function Core(io) {\r\n        this.io = io;\r\n        this.lobbies = [];\r\n    }\r\n    Core.prototype.initialize = function () {\r\n        var _this = this;\r\n        setInterval(function () {\r\n            for (var _i = 0, _a = _this.lobbies; _i < _a.length; _i++) {\r\n                var lobby = _a[_i];\r\n                lobby.onGameTick();\r\n            }\r\n        }, 1000);\r\n    };\r\n    Core.prototype.namespace = function (name) {\r\n        return this.io.of(name);\r\n    };\r\n    Core.prototype.send = function (key, data) {\r\n        this.namespace('/home').emit(\"player:\" + key, data);\r\n    };\r\n    Core.prototype.getLobby = function (uuid) {\r\n        return this.lobbies.find(function (lobby) { return (lobby.uuid === uuid); });\r\n    };\r\n    Core.prototype.addLobby = function (lobby) {\r\n        this.lobbies.push(lobby);\r\n        this.updateLobbies();\r\n    };\r\n    Core.prototype.removeLobby = function (lobby) {\r\n        var index = this.lobbies.findIndex(function (l) { return (l.uuid === lobby.uuid); });\r\n        if (index === -1) {\r\n            console.warn(\"Lobby #\" + lobby.uuid + \" is not found\");\r\n            return;\r\n        }\r\n        this.lobbies.splice(index, 1);\r\n        this.updateLobbies();\r\n    };\r\n    Core.prototype.getLastLobbies = function (limit) {\r\n        if (limit === void 0) { limit = 5; }\r\n        var freeLobbies = this.lobbies.filter(function (lobby) { return (lobby.players.length < lobby.options.maxPlayers); }).sort(function (a, b) { return ((a.date.getTime() - b.date.getTime())); });\r\n        return freeLobbies.slice(0, limit).map(function (lobby) { return ({\r\n            uuid: lobby.uuid,\r\n            date: lobby.date,\r\n            players: {\r\n                online: lobby.players.length,\r\n                max: lobby.options.maxPlayers,\r\n            },\r\n        }); });\r\n    };\r\n    Core.prototype.updateLobbies = function () {\r\n        var lobbies = this.getLastLobbies();\r\n        this.send('UpdateLobbies', lobbies);\r\n    };\r\n    return Core;\r\n}());\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Core);\r\n\n\n//# sourceURL=webpack://locbook/./src/server/classes/Core.ts?");

/***/ }),

/***/ "./src/server/classes/Lobby.ts":
/*!*************************************!*\
  !*** ./src/server/classes/Lobby.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ \"./src/server/utils.ts\");\n/* harmony import */ var _World__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./World */ \"./src/server/classes/World.ts\");\n\r\n\r\nvar CONFIG = __webpack_require__(/*! ./../../../config.json */ \"./config.json\");\r\nvar Lobby = /** @class */ (function () {\r\n    function Lobby(core, options) {\r\n        if (options === void 0) { options = {}; }\r\n        this.options = _utils__WEBPACK_IMPORTED_MODULE_0__.default.validate(options, {\r\n            maxPlayers: { default: 3, min: 2, max: 5 },\r\n            density: { default: 10, min: 0, max: 40 },\r\n            bonusing: { default: 2, min: 0, max: 5 },\r\n            timeout: { default: 30, min: 5, max: 60 },\r\n            targetLength: { default: 3, min: 3, max: 4 },\r\n        });\r\n        this.uuid = _utils__WEBPACK_IMPORTED_MODULE_0__.default.generate();\r\n        this.players = [];\r\n        this.step = null;\r\n        this.timeout = 0;\r\n        this.date = new Date();\r\n        this.finished = false;\r\n        this.timeoutReset = null;\r\n        this.core = core;\r\n        this.idleTick = 0;\r\n        this.world = new _World__WEBPACK_IMPORTED_MODULE_1__.default(this.options);\r\n        this.world.generate();\r\n        console.log(\"Lobby #\" + this.uuid + \" created\");\r\n    }\r\n    Lobby.prototype.destroy = function () {\r\n        this.core.removeLobby(this);\r\n        if (this.timeoutReset !== null) {\r\n            clearTimeout(this.timeoutReset);\r\n        }\r\n        console.log(\"Lobby #\" + this.uuid + \" destroyed\");\r\n    };\r\n    Lobby.prototype.send = function (key, data) {\r\n        this.core.namespace('/lobby').to(this.uuid).emit(\"lobby:\" + key, data);\r\n    };\r\n    Lobby.prototype.onGameTick = function () {\r\n        this.handleStepTimeout();\r\n        if (CONFIG.LOBBY_IDLE_TIMEOUT > 0) {\r\n            this.handleIdleTimeout();\r\n        }\r\n    };\r\n    Lobby.prototype.getFreeSlot = function () {\r\n        var _loop_1 = function (i) {\r\n            if (this_1.players.every(function (player) { return (player.slot !== i); })) {\r\n                return { value: i };\r\n            }\r\n        };\r\n        var this_1 = this;\r\n        for (var i = 0; i < this.options.maxPlayers; i++) {\r\n            var state_1 = _loop_1(i);\r\n            if (typeof state_1 === \"object\")\r\n                return state_1.value;\r\n        }\r\n    };\r\n    Lobby.prototype.joinPlayer = function (player) {\r\n        var isExists = this.players.some(function (p) { return (p.id === player.id); });\r\n        if (isExists) {\r\n            return player.send('Error', 'Вы уже находитесь в этой игре');\r\n        }\r\n        var slot = this.getFreeSlot();\r\n        if (slot === undefined) {\r\n            return player.send('Error', 'Указанная игра уже запущена');\r\n        }\r\n        player.join(this.uuid, slot);\r\n        player.send('JoinLobby', {\r\n            world: this.world.map,\r\n            step: this.step,\r\n            timeout: this.timeout,\r\n            options: this.options,\r\n        });\r\n        this.players.push(player);\r\n        this.updateClientPlayers();\r\n        if (!this.isStarted() && this.isFulled()) {\r\n            this.start();\r\n        }\r\n        console.log(\"Player #\" + player.id + \" joined to lobby #\" + this.uuid);\r\n    };\r\n    Lobby.prototype.leavePlayer = function (player) {\r\n        var index = this.players.findIndex(function (p) { return (p.id === player.id); });\r\n        if (index === -1) {\r\n            return console.warn(\"Player #\" + player.id + \" not found in lobby #\" + this.uuid);\r\n        }\r\n        this.players.splice(index, 1);\r\n        this.updateClientPlayers();\r\n        player.leave(this.uuid);\r\n        if (this.finished) {\r\n            this.reset();\r\n        }\r\n        console.log(\"Player #\" + player.id + \" leaved from lobby #\" + this.uuid);\r\n    };\r\n    Lobby.prototype.putEntity = function (player, location) {\r\n        if (this.step !== player.slot) {\r\n            return;\r\n        }\r\n        var result = this.world.place(player.slot, location);\r\n        if (!result) {\r\n            return;\r\n        }\r\n        var isWinning = this.world.checkWinning(result);\r\n        if (isWinning) {\r\n            this.send('PlayerWin', player.id);\r\n            this.finish();\r\n        }\r\n        else {\r\n            this.moveStepToNextPlayer();\r\n        }\r\n        this.updateClientMeta();\r\n        this.updateClientWorld();\r\n    };\r\n    Lobby.prototype.updateClientPlayers = function () {\r\n        var players = this.players.map(function (player) { return ({\r\n            id: player.id,\r\n            slot: player.slot,\r\n        }); });\r\n        this.send('UpdatePlayers', players);\r\n        this.core.updateLobbies();\r\n    };\r\n    Lobby.prototype.updateClientMeta = function () {\r\n        this.send('UpdateMeta', {\r\n            step: this.step,\r\n            timeout: this.timeout,\r\n        });\r\n    };\r\n    Lobby.prototype.updateClientWorld = function () {\r\n        this.send('UpdateWorld', this.world.map);\r\n    };\r\n    Lobby.prototype.moveStepToNextPlayer = function () {\r\n        this.timeout = this.options.timeout;\r\n        if (this.step + 1 === this.options.maxPlayers) {\r\n            this.step = 0;\r\n        }\r\n        else {\r\n            this.step++;\r\n        }\r\n    };\r\n    Lobby.prototype.start = function () {\r\n        this.timeout = this.options.timeout;\r\n        this.step = Math.floor(Math.random() * this.options.maxPlayers);\r\n        this.updateClientMeta();\r\n    };\r\n    Lobby.prototype.isStarted = function () {\r\n        return (this.step !== null);\r\n    };\r\n    Lobby.prototype.isFulled = function () {\r\n        return (this.players.length === this.options.maxPlayers);\r\n    };\r\n    Lobby.prototype.reset = function () {\r\n        if (this.timeoutReset !== null) {\r\n            clearTimeout(this.timeoutReset);\r\n            this.timeoutReset = null;\r\n        }\r\n        this.finished = false;\r\n        this.world.generate();\r\n        this.updateClientWorld();\r\n        if (this.isFulled()) {\r\n            this.start();\r\n        }\r\n    };\r\n    Lobby.prototype.finish = function () {\r\n        var _this = this;\r\n        this.finished = true;\r\n        this.step = null;\r\n        this.timeoutReset = setTimeout(function () {\r\n            _this.reset();\r\n        }, CONFIG.RESTART_TIMEOUT * 1000);\r\n    };\r\n    Lobby.prototype.handleIdleTimeout = function () {\r\n        if (this.players.length === 0) {\r\n            this.idleTick++;\r\n            if (this.idleTick === CONFIG.LOBBY_IDLE_TIMEOUT) {\r\n                this.destroy();\r\n            }\r\n        }\r\n        else {\r\n            this.idleTick = 0;\r\n        }\r\n    };\r\n    Lobby.prototype.handleStepTimeout = function () {\r\n        if (this.isStarted() && this.isFulled()) {\r\n            this.timeout--;\r\n            if (this.timeout === 0) {\r\n                this.moveStepToNextPlayer();\r\n            }\r\n            this.updateClientMeta();\r\n        }\r\n    };\r\n    return Lobby;\r\n}());\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Lobby);\r\n\n\n//# sourceURL=webpack://locbook/./src/server/classes/Lobby.ts?");

/***/ }),

/***/ "./src/server/classes/Player.ts":
/*!**************************************!*\
  !*** ./src/server/classes/Player.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nvar CONFIG = __webpack_require__(/*! ./../../../config.json */ \"./config.json\");\r\nvar Player = /** @class */ (function () {\r\n    function Player(socket) {\r\n        this.socket = socket;\r\n        this.id = CONFIG.IP_ONCE ? socket.request.connection.remoteAddress : socket.id;\r\n        this.slot = null;\r\n    }\r\n    Player.prototype.send = function (key, data) {\r\n        this.socket.emit(\"player:\" + key, data);\r\n    };\r\n    Player.prototype.join = function (room, slot) {\r\n        this.socket.join(room);\r\n        this.slot = slot;\r\n    };\r\n    Player.prototype.leave = function (room) {\r\n        this.socket.leave(room);\r\n        this.slot = null;\r\n    };\r\n    return Player;\r\n}());\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);\r\n\n\n//# sourceURL=webpack://locbook/./src/server/classes/Player.ts?");

/***/ }),

/***/ "./src/server/classes/World.ts":
/*!*************************************!*\
  !*** ./src/server/classes/World.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ \"./src/server/utils.ts\");\n\r\nvar MAP_SIZE = [25, 12];\r\nvar MAP_ENTITY = {\r\n    EMPTY: 'empty',\r\n    BLOCK: 'block',\r\n    PLAYER: 'player',\r\n    BONUS: 'bonus',\r\n};\r\nvar ENTITY_BONUS = {\r\n    REPLACER: 'replacer',\r\n    SPAWN: 'spawn',\r\n    LASER: 'laser',\r\n};\r\nvar World = /** @class */ (function () {\r\n    function World(options) {\r\n        this.map = [];\r\n        this.options = options;\r\n    }\r\n    World.prototype.generate = function () {\r\n        for (var y = 0; y < MAP_SIZE[1]; y++) {\r\n            this.map[y] = [];\r\n            for (var x = 0; x < MAP_SIZE[0]; x++) {\r\n                var entity = MAP_ENTITY.EMPTY;\r\n                if (_utils__WEBPACK_IMPORTED_MODULE_0__.default.probability(this.options.density)) {\r\n                    entity = MAP_ENTITY.BLOCK;\r\n                }\r\n                else if (y + 1 !== MAP_SIZE[1] && _utils__WEBPACK_IMPORTED_MODULE_0__.default.probability(this.options.bonusing)) {\r\n                    entity = MAP_ENTITY.BONUS + '-' + _utils__WEBPACK_IMPORTED_MODULE_0__.default.randomize([\r\n                        ENTITY_BONUS.REPLACER,\r\n                        ENTITY_BONUS.SPAWN,\r\n                        ENTITY_BONUS.LASER,\r\n                    ]);\r\n                }\r\n                this.setEntity([x, y], entity);\r\n            }\r\n        }\r\n    };\r\n    World.prototype.place = function (slot, location) {\r\n        if (!this.canBePlaced(location)) {\r\n            return;\r\n        }\r\n        var locations = [location];\r\n        var types = this.getEntity(location).split('-');\r\n        if (types[0] === MAP_ENTITY.BONUS) {\r\n            var additional = this.useBonus(slot, location, types[1]);\r\n            locations = locations.concat(additional);\r\n        }\r\n        else if (types[0] !== MAP_ENTITY.EMPTY) {\r\n            return;\r\n        }\r\n        for (var _i = 0, locations_1 = locations; _i < locations_1.length; _i++) {\r\n            var location_1 = locations_1[_i];\r\n            this.setEntity(location_1, MAP_ENTITY.PLAYER + \"-slot\" + (slot + 1));\r\n        }\r\n        return locations;\r\n    };\r\n    World.prototype.checkWinning = function (locations) {\r\n        for (var _i = 0, locations_2 = locations; _i < locations_2.length; _i++) {\r\n            var location_2 = locations_2[_i];\r\n            var results = this.getWinningLocations(location_2);\r\n            if (results) {\r\n                for (var _a = 0, results_1 = results; _a < results_1.length; _a++) {\r\n                    var result = results_1[_a];\r\n                    var entity = this.getEntity(result);\r\n                    this.setEntity(result, entity + \"-win\");\r\n                }\r\n                return true;\r\n            }\r\n        }\r\n        return false;\r\n    };\r\n    World.prototype.useBonus = function (slot, location, type) {\r\n        var _this = this;\r\n        var additional = [];\r\n        switch (type) {\r\n            case ENTITY_BONUS.REPLACER: {\r\n                var puttedEntities_1 = [];\r\n                this.eachMap(function (entity, x, y) {\r\n                    var _a = entity.split('-'), type = _a[0], targetSlot = _a[1];\r\n                    if (type === MAP_ENTITY.PLAYER && Number(targetSlot.replace('slot', '')) - 1 !== slot) {\r\n                        puttedEntities_1.push([x, y]);\r\n                    }\r\n                });\r\n                if (puttedEntities_1.length > 0) {\r\n                    additional.push(_utils__WEBPACK_IMPORTED_MODULE_0__.default.randomize(puttedEntities_1));\r\n                }\r\n                break;\r\n            }\r\n            case ENTITY_BONUS.SPAWN: {\r\n                var emptyEntities_1 = [];\r\n                this.eachMap(function (entity, x, y) {\r\n                    if (entity === MAP_ENTITY.EMPTY && _this.canBePlaced([x, y])) {\r\n                        emptyEntities_1.push([x, y]);\r\n                    }\r\n                });\r\n                if (emptyEntities_1.length > 0) {\r\n                    additional.push(_utils__WEBPACK_IMPORTED_MODULE_0__.default.randomize(emptyEntities_1));\r\n                }\r\n                break;\r\n            }\r\n            case ENTITY_BONUS.LASER: {\r\n                for (var _i = 0, _a = Object.keys(this.map); _i < _a.length; _i++) {\r\n                    var y = _a[_i];\r\n                    this.setEntity([location[0], Number(y)], MAP_ENTITY.EMPTY);\r\n                }\r\n                additional[0][1] = this.map.length - 1;\r\n                break;\r\n            }\r\n        }\r\n        return additional;\r\n    };\r\n    World.prototype.canBePlaced = function (location) {\r\n        if (location[1] + 1 === this.map.length) {\r\n            return true;\r\n        }\r\n        else {\r\n            var entity = this.getEntity([location[0], location[1] + 1]);\r\n            if (entity) {\r\n                var type = entity.split('-')[0];\r\n                return [MAP_ENTITY.PLAYER, MAP_ENTITY.BLOCK].includes(type);\r\n            }\r\n            else {\r\n                return false;\r\n            }\r\n        }\r\n    };\r\n    World.prototype.setEntity = function (location, type) {\r\n        if (this.locationIsValid(location)) {\r\n            this.map[location[1]][location[0]] = type;\r\n        }\r\n    };\r\n    World.prototype.getEntity = function (location) {\r\n        if (this.locationIsValid(location)) {\r\n            return this.map[location[1]][location[0]];\r\n        }\r\n    };\r\n    World.prototype.locationIsValid = function (location) {\r\n        return location.every(function (p, i) { return (p >= 0 && p < MAP_SIZE[i]); });\r\n    };\r\n    World.prototype.eachMap = function (callback) {\r\n        for (var _i = 0, _a = Object.entries(this.map); _i < _a.length; _i++) {\r\n            var _b = _a[_i], y = _b[0], line = _b[1];\r\n            for (var _c = 0, _d = Object.entries(line); _c < _d.length; _c++) {\r\n                var _e = _d[_c], x = _e[0], entity = _e[1];\r\n                callback(entity, Number(x), Number(y));\r\n            }\r\n        }\r\n    };\r\n    World.prototype.getWinningLocations = function (from) {\r\n        var _this = this;\r\n        var _loop_1 = function (line) {\r\n            for (var side = 0; side > -this_1.options.targetLength; side--) {\r\n                var locations = [];\r\n                var _loop_2 = function (step) {\r\n                    var point = from.map(function (f, i) { return (f - line[i] * step); });\r\n                    if (point.every(function (c, i) { return (c >= 0 && c < MAP_SIZE[i]); })) {\r\n                        locations.push(point);\r\n                    }\r\n                };\r\n                for (var step = side; step <= (side + this_1.options.targetLength - 1); step++) {\r\n                    _loop_2(step);\r\n                }\r\n                if (locations.length === this_1.options.targetLength) {\r\n                    if (locations.every(function (location) { return (_this.getEntity(location) === _this.getEntity(from)); })) {\r\n                        return { value: locations };\r\n                    }\r\n                }\r\n            }\r\n        };\r\n        var this_1 = this;\r\n        for (var _i = 0, _a = [[-1, 0], [-1, -1], [0, -1], [1, -1]]; _i < _a.length; _i++) {\r\n            var line = _a[_i];\r\n            var state_1 = _loop_1(line);\r\n            if (typeof state_1 === \"object\")\r\n                return state_1.value;\r\n        }\r\n    };\r\n    return World;\r\n}());\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (World);\r\n\n\n//# sourceURL=webpack://locbook/./src/server/classes/World.ts?");

/***/ }),

/***/ "./src/server/game.ts":
/*!****************************!*\
  !*** ./src/server/game.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _classes_Core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classes/Core */ \"./src/server/classes/Core.ts\");\n/* harmony import */ var _classes_Player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./classes/Player */ \"./src/server/classes/Player.ts\");\n/* harmony import */ var _classes_Lobby__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./classes/Lobby */ \"./src/server/classes/Lobby.ts\");\n\r\n\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\r\n    boot: function (io) {\r\n        var core = new _classes_Core__WEBPACK_IMPORTED_MODULE_0__.default(io);\r\n        core.initialize();\r\n        core.namespace('/home').on('connection', function (socket) {\r\n            var lobbies = core.getLastLobbies();\r\n            socket.emit('player:UpdateLobbies', lobbies);\r\n            socket.on('player:CreateLobby', function (data) {\r\n                var lobby = new _classes_Lobby__WEBPACK_IMPORTED_MODULE_2__.default(core, data);\r\n                core.addLobby(lobby);\r\n                socket.emit('player:InviteLobby', lobby.uuid);\r\n            });\r\n        });\r\n        core.namespace('/lobby').on('connection', function (socket) {\r\n            if (!socket.handshake.query.uuid) {\r\n                return;\r\n            }\r\n            var player = new _classes_Player__WEBPACK_IMPORTED_MODULE_1__.default(socket);\r\n            var lobby = core.getLobby(socket.handshake.query.uuid);\r\n            if (!lobby) {\r\n                return player.send('Error', 'Указанная игра не найдена');\r\n            }\r\n            lobby.joinPlayer(player);\r\n            socket.on('disconnect', function () {\r\n                lobby.leavePlayer(player);\r\n            });\r\n            socket.on('player:PutEntity', function (location) {\r\n                lobby.putEntity(player, location);\r\n            });\r\n        });\r\n    },\r\n});\r\n\n\n//# sourceURL=webpack://locbook/./src/server/game.ts?");

/***/ }),

/***/ "./src/server/index.ts":
/*!*****************************!*\
  !*** ./src/server/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http */ \"http\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! socket.io */ \"socket.io\");\n/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(socket_io__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./game */ \"./src/server/game.ts\");\n\r\n\r\n\r\n\r\n\r\nvar CONFIG = __webpack_require__(/*! ../../config.json */ \"./config.json\");\r\nvar PATH_TO_INDEX = path__WEBPACK_IMPORTED_MODULE_1___default().join(__dirname, '..', 'app', 'index.html');\r\nvar app = express__WEBPACK_IMPORTED_MODULE_2___default()();\r\napp.use(express__WEBPACK_IMPORTED_MODULE_2___default().static(path__WEBPACK_IMPORTED_MODULE_1___default().join(__dirname, '..', 'app')));\r\napp.get(['/', '/game/:uuid'], function (req, res) {\r\n    return res.sendFile(PATH_TO_INDEX);\r\n});\r\nvar port = process.env.PORT || CONFIG.PORT;\r\nvar server = (0,http__WEBPACK_IMPORTED_MODULE_0__.createServer)(app);\r\nserver.listen(port, function () {\r\n    console.log(\"Game server listening on :\" + port);\r\n});\r\nvar io = new socket_io__WEBPACK_IMPORTED_MODULE_3__.Server(server);\r\n_game__WEBPACK_IMPORTED_MODULE_4__.default.boot(io);\r\n\n\n//# sourceURL=webpack://locbook/./src/server/index.ts?");

/***/ }),

/***/ "./src/server/utils.ts":
/*!*****************************!*\
  !*** ./src/server/utils.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nvar __assign = (undefined && undefined.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\r\n    probability: function (v) {\r\n        return (Math.floor(1 + Math.random() * 100) <= v);\r\n    },\r\n    randomize: function (v) {\r\n        return v[Math.floor(Math.random() * v.length)];\r\n    },\r\n    validate: function (data, schemes) {\r\n        return Object.entries(schemes).reduce(function (a, _a) {\r\n            var _b;\r\n            var param = _a[0], scheme = _a[1];\r\n            var value = Number(data[param]);\r\n            var valid = (!Number.isNaN(value) && value >= scheme.min && value <= scheme.max);\r\n            return __assign(__assign({}, a), (_b = {}, _b[param] = valid ? value : scheme.default, _b));\r\n        }, {});\r\n    },\r\n    generate: function () {\r\n        return Math.random().toString(36).substr(2, 9);\r\n    },\r\n});\r\n\n\n//# sourceURL=webpack://locbook/./src/server/utils.ts?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("socket.io");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/server/index.ts");
/******/ 	
/******/ })()
;