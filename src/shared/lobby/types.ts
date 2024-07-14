export type LobbyInfo = {
  uuid: string;
  date: Date;
  players: {
    online: number;
    max: number;
  };
};

export type LobbyOptions = {
  maxPlayers: number;
  density: number;
  bonusing: number;
  timeout: number;
  moveMap: boolean;
  useBonuses: boolean;
};

export enum LobbyEvent {
  CreateLobby = "CreateLobby",
  Error = "Error",
  SendOptions = "SendOptions",
  PlayerWin = "PlayerWin",
  ClearWinner = "ClearWinner",
  PutEntity = "PutEntity",
  UpdateLatestLobbies = "UpdateLatestLobbies",
  UpdateWorldMap = "UpdateWorldMap",
  UpdateTimeout = "UpdateTimeout",
  UpdateStep = "UpdateStep",
  UpdatePlayers = "UpdatePlayers",
}
