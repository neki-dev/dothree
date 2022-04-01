export type LobbyInfo = {
  uuid: string
  date: Date
  players: {
    online: number
    max: number
  }
};

export type LobbyOptions = {
  maxPlayers?: number
  density?: number
  bonusing?: number
  timeout?: number
  moveMap?: boolean
  useBonuses?: boolean
};
