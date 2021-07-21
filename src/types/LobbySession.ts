import type WorldMap from './WorldMap';
export default interface LobbySession {
	step: number
	timeout: number
	map?: WorldMap
}