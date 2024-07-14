/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
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
/************************************************************************/

;// CONCATENATED MODULE: external "express"
const external_express_namespaceObject = require("express");
var external_express_default = /*#__PURE__*/__webpack_require__.n(external_express_namespaceObject);
;// CONCATENATED MODULE: external "http"
const external_http_namespaceObject = require("http");
;// CONCATENATED MODULE: external "loglevel"
const external_loglevel_namespaceObject = require("loglevel");
var external_loglevel_default = /*#__PURE__*/__webpack_require__.n(external_loglevel_namespaceObject);
;// CONCATENATED MODULE: external "path"
const external_path_namespaceObject = require("path");
var external_path_default = /*#__PURE__*/__webpack_require__.n(external_path_namespaceObject);
;// CONCATENATED MODULE: external "socket.io"
const external_socket_io_namespaceObject = require("socket.io");
;// CONCATENATED MODULE: external "console"
const external_console_namespaceObject = require("console");
var external_console_default = /*#__PURE__*/__webpack_require__.n(external_console_namespaceObject);
;// CONCATENATED MODULE: ./src/server/utils/generate-uuid.ts
function generateUUID() {
  return Math.random().toString(36).substring(2, 11);
}
;// CONCATENATED MODULE: ./src/server/world/const.ts
var WORLD_MAP_SIZE = [25, 11];
var WORLD_CHAIN_TARGET_LENGTH = 3;
var WORLD_DIRECTIONS = [[-1, 0], [-1, -1], [0, -1], [1, -1]];
;// CONCATENATED MODULE: ./src/server/entity/index.ts
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Entity = /*#__PURE__*/function () {
  function Entity(type) {
    var substype = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    _classCallCheck(this, Entity);
    this.type = type;
    this.subtype = substype;
  }
  return _createClass(Entity, [{
    key: "toString",
    value: function toString() {
      return this.subtype ? [this.type, this.subtype].join("-") : this.type;
    }
  }]);
}();
;// CONCATENATED MODULE: ./src/server/utils/probability.ts
function probability(v) {
  return Math.floor(1 + Math.random() * 100) <= v;
}
;// CONCATENATED MODULE: ./src/server/utils/randomize.ts
function randomize(v) {
  return v[Math.floor(Math.random() * v.length)];
}
;// CONCATENATED MODULE: ./src/shared/entity/types.ts
var EntityType;
(function (EntityType) {
  EntityType["BLOCK"] = "block";
  EntityType["PLAYER"] = "player";
  EntityType["EMPTY"] = "empty";
  EntityType["BONUS"] = "bonus";
})(EntityType || (EntityType = {}));
var EntityBonusType;
(function (EntityBonusType) {
  EntityBonusType["REPLACER"] = "replacer";
  EntityBonusType["SPAWN"] = "spawn";
  EntityBonusType["LASER"] = "laser";
})(EntityBonusType || (EntityBonusType = {}));
;// CONCATENATED MODULE: ./src/server/world/index.ts
function world_typeof(o) { "@babel/helpers - typeof"; return world_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, world_typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function world_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function world_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, world_toPropertyKey(o.key), o); } }
function world_createClass(e, r, t) { return r && world_defineProperties(e.prototype, r), t && world_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function world_toPropertyKey(t) { var i = world_toPrimitive(t, "string"); return "symbol" == world_typeof(i) ? i : i + ""; }
function world_toPrimitive(t, r) { if ("object" != world_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != world_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }





var World = /*#__PURE__*/function () {
  function World(options) {
    world_classCallCheck(this, World);
    this.map = [];
    this.options = options;
  }
  return world_createClass(World, [{
    key: "generateMap",
    value: function generateMap() {
      for (var y = 0; y < WORLD_MAP_SIZE[1]; y += 1) {
        this.map[y] = [];
        for (var x = 0; x < WORLD_MAP_SIZE[0]; x += 1) {
          var location = [x, y];
          var entity = this.createRandomEntity(location);
          this.setEntity(location, entity);
        }
      }
    }
  }, {
    key: "place",
    value: function place(slot, to) {
      var _this = this;
      if (!this.canBePlaced(to)) {
        return undefined;
      }
      var locations = [to];
      var targetEntity = this.getEntity(to);
      if (!targetEntity) {
        return undefined;
      }
      if (targetEntity.type === EntityType.BONUS) {
        this.useBonus(locations, slot, targetEntity.subtype);
      } else if (targetEntity.type !== EntityType.EMPTY) {
        return undefined;
      }
      locations.forEach(function (location) {
        var playerEntity = new Entity(EntityType.PLAYER, "slot".concat(slot));
        _this.setEntity(location, playerEntity);
      });
      return locations;
    }
  }, {
    key: "checkWinning",
    value: function checkWinning(locations) {
      var _this2 = this;
      return locations.some(function (location) {
        var results = _this2.getWinningLocations(location);
        if (results) {
          results.forEach(function (result) {
            var entity = _this2.getEntity(result);
            if (entity) {
              entity.subtype += "-win";
            }
          });
        }
        return Boolean(results);
      });
    }
  }, {
    key: "useBonus",
    value: function useBonus(locations, slot, type) {
      var _this3 = this;
      switch (type) {
        case EntityBonusType.REPLACER:
          {
            var puttedEntities = [];
            this.eachMap(function (entity, x, y) {
              if (entity.type === EntityType.PLAYER) {
                var entitySlot = Number(entity.subtype.replace(/^slot(\d)+.*$/, "$1"));
                if (entitySlot !== slot) {
                  puttedEntities.push([x, y]);
                }
              }
            });
            if (puttedEntities.length > 0) {
              locations.push(randomize(puttedEntities));
            }
            break;
          }
        case EntityBonusType.SPAWN:
          {
            var emptyEntities = [];
            this.eachMap(function (entity, x, y) {
              if (entity.type === EntityType.EMPTY && _this3.canBePlaced([x, y])) {
                emptyEntities.push([x, y]);
              }
            });
            if (emptyEntities.length > 0) {
              locations.push(randomize(emptyEntities));
            }
            break;
          }
        case EntityBonusType.LASER:
          {
            var mainLocationX = locations[0][0];
            Object.keys(this.map).forEach(function (y) {
              var emptyEntity = new Entity(EntityType.EMPTY);
              _this3.setEntity([mainLocationX, Number(y)], emptyEntity);
            });
            var mainLocation = [mainLocationX, this.map.length - 1];
            locations.splice(0, locations.length, mainLocation);
            break;
          }
        default:
          {
            break;
          }
      }
    }
  }, {
    key: "moveMap",
    value: function moveMap() {
      var _this4 = this;
      Object.entries(this.map).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          y = _ref2[0],
          line = _ref2[1];
        line.shift();
        var location = [line.length, Number(y)];
        var entity = _this4.createRandomEntity(location);
        _this4.setEntity(location, entity);
      });
    }
  }, {
    key: "canBePlaced",
    value: function canBePlaced(location) {
      var _location = _slicedToArray(location, 2),
        x = _location[0],
        y = _location[1];
      if (y + 1 === this.map.length) {
        return true;
      }
      var entity = this.getEntity([x, y + 1]);
      if (entity) {
        return [EntityType.PLAYER, EntityType.BLOCK].includes(entity.type);
      }
      return false;
    }
  }, {
    key: "setEntity",
    value: function setEntity(location, entity) {
      if (!World.locationIsValid(location)) {
        return;
      }
      var _location2 = _slicedToArray(location, 2),
        x = _location2[0],
        y = _location2[1];
      this.map[y][x] = entity;
    }
  }, {
    key: "getEntity",
    value: function getEntity(location) {
      if (!World.locationIsValid(location)) {
        return undefined;
      }
      var _location3 = _slicedToArray(location, 2),
        x = _location3[0],
        y = _location3[1];
      return this.map[y][x];
    }
  }, {
    key: "eachMap",
    value: function eachMap(callback) {
      Object.entries(this.map).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
          y = _ref4[0],
          line = _ref4[1];
        Object.entries(line).forEach(function (_ref5) {
          var _ref6 = _slicedToArray(_ref5, 2),
            x = _ref6[0],
            entity = _ref6[1];
          callback(entity, Number(x), Number(y));
        });
      });
    }
  }, {
    key: "getWinningLocations",
    value: function getWinningLocations(from) {
      var _this5 = this;
      var result;
      WORLD_DIRECTIONS.some(function (direction) {
        for (var side = 0; side > -WORLD_CHAIN_TARGET_LENGTH; side -= 1) {
          var locations = World.getLocationsByDirection(from, direction, side);
          if (_this5.isLocationsMatch(from, locations)) {
            result = locations;
            return true;
          }
        }
        return false;
      });
      return result;
    }
  }, {
    key: "isLocationsMatch",
    value: function isLocationsMatch(from, locations) {
      var _this6 = this;
      return locations.length === WORLD_CHAIN_TARGET_LENGTH && locations.every(function (location) {
        return _this6.isEntitiesEquals(from, location);
      });
    }
  }, {
    key: "isEntitiesEquals",
    value: function isEntitiesEquals(locationA, locationB) {
      var entityA = this.getEntity(locationA);
      if (!entityA) {
        return false;
      }
      var entityB = this.getEntity(locationB);
      if (!entityB) {
        return false;
      }
      return entityA.toString() === entityB.toString();
    }
  }, {
    key: "createRandomEntity",
    value: function createRandomEntity(location) {
      var _this$options = this.options,
        density = _this$options.density,
        useBonuses = _this$options.useBonuses,
        bonusing = _this$options.bonusing;
      if (probability(density * 10)) {
        return new Entity(EntityType.BLOCK);
      }
      if (useBonuses && location[1] + 1 !== WORLD_MAP_SIZE[1] && probability(bonusing)) {
        return new Entity(EntityType.BONUS, randomize([EntityBonusType.REPLACER, EntityBonusType.SPAWN, EntityBonusType.LASER]));
      }
      return new Entity(EntityType.EMPTY);
    }
  }], [{
    key: "getLocationsByDirection",
    value: function getLocationsByDirection(from, direction, side) {
      var locations = [];
      var _loop = function _loop(step) {
        var point = from.map(function (f, i) {
          return f - direction[i] * step;
        });
        if (point.every(function (c, i) {
          return c >= 0 && c < WORLD_MAP_SIZE[i];
        })) {
          locations.push(point);
        }
      };
      for (var step = side; step <= side + WORLD_CHAIN_TARGET_LENGTH - 1; step += 1) {
        _loop(step);
      }
      return locations;
    }
  }, {
    key: "locationIsValid",
    value: function locationIsValid(location) {
      return location.every(function (p, i) {
        return p >= 0 && p < WORLD_MAP_SIZE[i];
      });
    }
  }]);
}();
;// CONCATENATED MODULE: ./src/shared/lobby/types.ts
var LobbyEvent;
(function (LobbyEvent) {
  LobbyEvent["CreateLobby"] = "CreateLobby";
  LobbyEvent["Error"] = "Error";
  LobbyEvent["SendOptions"] = "SendOptions";
  LobbyEvent["PlayerWin"] = "PlayerWin";
  LobbyEvent["ClearWinner"] = "ClearWinner";
  LobbyEvent["PutEntity"] = "PutEntity";
  LobbyEvent["UpdateLatestLobbies"] = "UpdateLatestLobbies";
  LobbyEvent["UpdateWorldMap"] = "UpdateWorldMap";
  LobbyEvent["UpdateTimeout"] = "UpdateTimeout";
  LobbyEvent["UpdateStep"] = "UpdateStep";
  LobbyEvent["UpdatePlayers"] = "UpdatePlayers";
})(LobbyEvent || (LobbyEvent = {}));
;// CONCATENATED MODULE: ./config.json
const config_namespaceObject = /*#__PURE__*/JSON.parse('{"WG":false,"I":4801,"Ve":true,"nI":5,"SL":60}');
;// CONCATENATED MODULE: ./src/server/lobby/index.ts
function lobby_typeof(o) { "@babel/helpers - typeof"; return lobby_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, lobby_typeof(o); }
function lobby_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function lobby_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, lobby_toPropertyKey(o.key), o); } }
function lobby_createClass(e, r, t) { return r && lobby_defineProperties(e.prototype, r), t && lobby_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function lobby_toPropertyKey(t) { var i = lobby_toPrimitive(t, "string"); return "symbol" == lobby_typeof(i) ? i : i + ""; }
function lobby_toPrimitive(t, r) { if ("object" != lobby_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != lobby_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }





var Lobby = /*#__PURE__*/function () {
  function Lobby(options, parameters) {
    lobby_classCallCheck(this, Lobby);
    this.players = [];
    this.idleTick = 0;
    this.reseting = null;
    this._step = null;
    this._timeout = 0;
    this.options = options;
    this.parameters = parameters;
    this.uuid = generateUUID();
    this.date = new Date();
    this.world = new World(this.options);
    this.world.generateMap();
    external_loglevel_default().info("Lobby #".concat(this.uuid, " created"));
  }
  return lobby_createClass(Lobby, [{
    key: "step",
    get: function get() {
      return this._step;
    },
    set: function set(step) {
      this._step = step;
      this.emit(LobbyEvent.UpdateStep, step);
    }
  }, {
    key: "timeout",
    get: function get() {
      return this._timeout;
    },
    set: function set(v) {
      this._timeout = v;
      this.emit(LobbyEvent.UpdateTimeout, v);
    }
  }, {
    key: "emit",
    value: function emit(key, data) {
      var namespace = this.parameters.namespace;
      namespace().to(this.uuid).emit(key, data);
    }
  }, {
    key: "onGameTick",
    value: function onGameTick() {
      this.handleStepTimeout();
      if (config_namespaceObject.SL > 0) {
        this.handleIdleTimeout();
      }
    }
  }, {
    key: "joinPlayer",
    value: function joinPlayer(player) {
      var isExists = this.players.some(function (p) {
        return p.id === player.id;
      });
      if (isExists) {
        player.emitError("You are already in this lobby");
        return;
      }
      var slot = this.getFreeSlot();
      if (slot === null) {
        player.emitError("This lobby is already started");
        return;
      }
      player.join(this.uuid, slot);
      player.emit(LobbyEvent.SendOptions, this.options);
      player.emit(LobbyEvent.UpdateWorldMap, this.getMap());
      player.emit(LobbyEvent.UpdateStep, this.step);
      this.players.push(player);
      this.updateClientPlayers();
      if (!this.isStarted() && this.isFulled()) {
        this.start();
      }
      external_loglevel_default().info("Player #".concat(player.id, " joined to lobby #").concat(this.uuid));
    }
  }, {
    key: "leavePlayer",
    value: function leavePlayer(player) {
      var index = this.findPlayerIndex(player);
      if (index === -1) {
        external_loglevel_default().warn("Player #".concat(player.id, " not found in lobby #").concat(this.uuid));
        return;
      }
      this.players.splice(index, 1);
      this.updateClientPlayers();
      player.leave(this.uuid);
      if (this.reseting) {
        this.reset();
      }
      external_loglevel_default().info("Player #".concat(player.id, " leaved from lobby #").concat(this.uuid));
    }
  }, {
    key: "putEntity",
    value: function putEntity(player, location) {
      if (this.step === null || this.step !== player.slot) {
        return;
      }
      var result = this.world.place(player.slot, location);
      if (result) {
        var isWinning = this.world.checkWinning(result);
        if (isWinning) {
          this.finish();
          this.emit(LobbyEvent.PlayerWin, player.id);
        } else {
          this.moveStepToNextPlayer();
        }
        this.emit(LobbyEvent.UpdateWorldMap, this.world.map);
      }
    }
  }, {
    key: "getMap",
    value: function getMap() {
      return this.world.map;
    }
  }, {
    key: "getInfo",
    value: function getInfo() {
      return {
        uuid: this.uuid,
        date: this.date,
        players: {
          online: this.players.length,
          max: this.options.maxPlayers
        }
      };
    }
  }, {
    key: "isStarted",
    value: function isStarted() {
      return this.step !== null;
    }
  }, {
    key: "isFulled",
    value: function isFulled() {
      return this.players.length === this.options.maxPlayers;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var onDestroy = this.parameters.onDestroy;
      if (onDestroy) {
        onDestroy();
      }
      if (this.reseting !== null) {
        clearTimeout(this.reseting);
      }
      external_loglevel_default().info("Lobby #".concat(this.uuid, " destroyed"));
    }
  }, {
    key: "findPlayerIndex",
    value: function findPlayerIndex(player) {
      return this.players.findIndex(function (p) {
        return p.id === player.id;
      });
    }
  }, {
    key: "getFreeSlot",
    value: function getFreeSlot() {
      var _this = this;
      var _loop = function _loop(i) {
          if (_this.players.every(function (player) {
            return player.slot !== i;
          })) {
            return {
              v: i
            };
          }
        },
        _ret;
      for (var i = 0; i < this.options.maxPlayers; i += 1) {
        _ret = _loop(i);
        if (_ret) return _ret.v;
      }
      return null;
    }
  }, {
    key: "updateClientPlayers",
    value: function updateClientPlayers() {
      var players = this.players.map(function (player) {
        return {
          id: player.id,
          slot: player.slot
        };
      });
      this.emit(LobbyEvent.UpdatePlayers, players);
    }
  }, {
    key: "moveStepToNextPlayer",
    value: function moveStepToNextPlayer() {
      this.resetTimeout();
      if (this.step !== null) {
        if (this.step + 1 === this.options.maxPlayers) {
          this.step = 0;
        } else {
          this.step++;
        }
      }
      if (this.options.moveMap) {
        this.world.moveMap();
      }
    }
  }, {
    key: "resetTimeout",
    value: function resetTimeout() {
      this.timeout = this.options.timeout;
    }
  }, {
    key: "start",
    value: function start() {
      this.timeout = this.options.timeout;
      this.step = Math.floor(Math.random() * this.options.maxPlayers);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.emit(LobbyEvent.ClearWinner);
      if (this.reseting) {
        clearTimeout(this.reseting);
        this.reseting = null;
      }
      this.world.generateMap();
      this.emit(LobbyEvent.UpdateWorldMap, this.world.map);
      if (this.isFulled()) {
        this.start();
      }
    }
  }, {
    key: "finish",
    value: function finish() {
      var _this2 = this;
      this.reseting = setTimeout(function () {
        _this2.reset();
      }, config_namespaceObject.nI * 1000);
      this.step = null;
    }
  }, {
    key: "handleIdleTimeout",
    value: function handleIdleTimeout() {
      if (this.players.length === 0) {
        this.idleTick++;
        if (this.idleTick === config_namespaceObject.SL) {
          this.destroy();
        }
      } else {
        this.idleTick = 0;
      }
    }
  }, {
    key: "handleStepTimeout",
    value: function handleStepTimeout() {
      if (this.isStarted() && this.isFulled()) {
        this.timeout--;
        if (this.timeout === 0) {
          this.moveStepToNextPlayer();
        }
      }
    }
  }]);
}();
;// CONCATENATED MODULE: ./src/server/core/index.ts
function core_typeof(o) { "@babel/helpers - typeof"; return core_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, core_typeof(o); }
function core_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function core_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, core_toPropertyKey(o.key), o); } }
function core_createClass(e, r, t) { return r && core_defineProperties(e.prototype, r), t && core_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function core_toPropertyKey(t) { var i = core_toPrimitive(t, "string"); return "symbol" == core_typeof(i) ? i : i + ""; }
function core_toPrimitive(t, r) { if ("object" != core_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != core_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var Core = /*#__PURE__*/function () {
  function Core(io) {
    core_classCallCheck(this, Core);
    this.io = io;
    this.lobbies = [];
  }
  return core_createClass(Core, [{
    key: "initialize",
    value: function initialize() {
      var _this = this;
      setInterval(function () {
        _this.lobbies.forEach(function (lobby) {
          lobby.onGameTick();
        });
      }, 1000);
    }
  }, {
    key: "namespace",
    value: function namespace(name) {
      return this.io.of(name);
    }
  }, {
    key: "createLobby",
    value: function createLobby(options) {
      var _this2 = this;
      var lobby = new Lobby(options, {
        namespace: function namespace() {
          return _this2.namespace("/lobby");
        },
        onDestroy: function onDestroy() {
          _this2.removeLobby(lobby);
        }
      });
      this.addLobby(lobby);
      return lobby;
    }
  }, {
    key: "findLobby",
    value: function findLobby(uuid) {
      return this.lobbies.find(function (lobby) {
        return lobby.uuid === uuid;
      });
    }
  }, {
    key: "addLobby",
    value: function addLobby(lobby) {
      this.lobbies.push(lobby);
      this.updateClientLatestLobbies();
    }
  }, {
    key: "removeLobby",
    value: function removeLobby(lobby) {
      var index = this.findLobbyIndex(lobby);
      if (index === -1) {
        external_console_default().warn("Lobby #".concat(lobby.uuid, " is not found"));
        return;
      }
      this.lobbies.splice(index, 1);
      this.updateClientLatestLobbies();
    }
  }, {
    key: "updateClientLatestLobbies",
    value: function updateClientLatestLobbies() {
      var lobbies = this.getLastLobbies();
      this.namespace("/home").emit(LobbyEvent.UpdateLatestLobbies, lobbies);
    }
  }, {
    key: "findLobbyIndex",
    value: function findLobbyIndex(lobby) {
      return this.lobbies.findIndex(function (l) {
        return l.uuid === lobby.uuid;
      });
    }
  }, {
    key: "getLastLobbies",
    value: function getLastLobbies() {
      var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
      return this.lobbies.filter(function (lobby) {
        return !lobby.isFulled();
      }).reverse().slice(0, limit).map(function (lobby) {
        return lobby.getInfo();
      });
    }
  }]);
}();
;// CONCATENATED MODULE: ./src/server/player/index.ts
function player_typeof(o) { "@babel/helpers - typeof"; return player_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, player_typeof(o); }
function player_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function player_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, player_toPropertyKey(o.key), o); } }
function player_createClass(e, r, t) { return r && player_defineProperties(e.prototype, r), t && player_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function player_toPropertyKey(t) { var i = player_toPrimitive(t, "string"); return "symbol" == player_typeof(i) ? i : i + ""; }
function player_toPrimitive(t, r) { if ("object" != player_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != player_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var Player = /*#__PURE__*/function () {
  function Player(socket) {
    player_classCallCheck(this, Player);
    this.slot = null;
    this.socket = socket;
    this.id = config_namespaceObject.WG ? socket.handshake.address : socket.id;
  }
  return player_createClass(Player, [{
    key: "emit",
    value: function emit(key, data) {
      this.socket.emit(key, data);
    }
  }, {
    key: "emitError",
    value: function emitError(message) {
      this.socket.emit(LobbyEvent.Error, message);
    }
  }, {
    key: "join",
    value: function join(uuid, slot) {
      this.slot = slot;
      this.socket.join(uuid);
    }
  }, {
    key: "leave",
    value: function leave(uuid) {
      this.slot = null;
      this.socket.leave(uuid);
    }
  }]);
}();
;// CONCATENATED MODULE: ./src/shared/lobby/const.ts
var DEFAULT_OPTIONS = {
  maxPlayers: 3,
  density: 1,
  bonusing: 2,
  timeout: 30,
  moveMap: false,
  useBonuses: true
};
;// CONCATENATED MODULE: ./src/server/game.ts





function boot(io) {
  var core = new Core(io);
  core.initialize();
  if (config_namespaceObject.Ve) {
    core.createLobby(DEFAULT_OPTIONS);
  }
  core.namespace("/home").on("connection", function (socket) {
    core.updateClientLatestLobbies();
    socket.on(LobbyEvent.CreateLobby, function (data, callback) {
      var _core$createLobby = core.createLobby(data),
        uuid = _core$createLobby.uuid;
      callback(uuid);
    });
  });
  core.namespace("/lobby").on("connection", function (socket) {
    var uuid = socket.handshake.query.uuid;
    if (!uuid) {
      return;
    }
    var player = new Player(socket);
    var lobby = core.findLobby(uuid);
    if (!lobby) {
      player.emitError("Lobby is not found");
      return;
    }
    lobby.joinPlayer(player);
    core.updateClientLatestLobbies();
    socket.on(LobbyEvent.PutEntity, function (location) {
      lobby.putEntity(player, location);
    });
    socket.on("disconnect", function () {
      lobby.leavePlayer(player);
      core.updateClientLatestLobbies();
    });
  });
}
;// CONCATENATED MODULE: ./src/server/index.ts







var PUBLIC_PATH = external_path_default().join(__dirname, "public");
external_loglevel_default().setLevel("debug");
// Configure Express application
var app = external_express_default()();
app.use(external_express_default()["static"](PUBLIC_PATH));
app.get(["/", "/game/:uuid"], function (_, res) {
  res.sendFile(external_path_default().join(PUBLIC_PATH, "index.html"));
});
// Configure server
var port = Number(process.env.PORT) || config_namespaceObject.I;
var server = (0,external_http_namespaceObject.createServer)(app);
server.listen(port, function () {
  external_loglevel_default().info("Game server listening on http://localhost:".concat(port));
});
var io = new external_socket_io_namespaceObject.Server(server);
// Boot game processes
boot(io);
/******/ })()
;