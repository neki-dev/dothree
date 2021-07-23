export default interface LobbyInfo {
	uuid: string
	date: Date
	players: {
		online: number
		max: number
	}
}