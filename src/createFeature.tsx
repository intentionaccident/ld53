import {SINK_CAPACITY, SINK_RELEASE_SPEED, SOURCE_RELEASE_SPEED} from "./constants";
import {RoomFeature} from "./types/RoomFeature";

export function createFeature(f: "+" | "t" | "n" | "r" | undefined): RoomFeature {
	return ({
		'+': {type: 'source', releaseSpeed: SOURCE_RELEASE_SPEED, storage: 0},
		't': {
			type: 'sink',
			subtype: 'thrusters',
			capacity: SINK_CAPACITY['thrusters'],
			releaseSpeed: SINK_RELEASE_SPEED['thrusters'],
			state: 'idle',
			storage: 0,
			timeLeft: 0
		},
		'n': {
			type: 'sink',
			subtype: 'navigation',
			capacity: SINK_CAPACITY['navigation'],
			releaseSpeed: SINK_RELEASE_SPEED['navigation'],
			state: 'idle',
			storage: 0,
			timeLeft: 0
		},
		'r': {
			type: 'sink',
			subtype: 'reactor',
			capacity: SINK_CAPACITY['reactor'],
			releaseSpeed: SINK_RELEASE_SPEED['reactor'],
			state: 'idle',
			storage: 0,
			timeLeft: 0
		},
		'undefined': {type: 'empty'}
	})[f] as any;
}
