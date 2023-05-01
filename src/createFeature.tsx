import {SINK_CAPACITY} from "./constants";
import {RoomFeature} from "./types/RoomFeature";

export function createFeature(f: "+" | "t" | "n" | "r" | undefined): RoomFeature {
	return ({
		'+': {type: 'source', storage: 3, capacity: 3, enRoute: 0},
		't': {
			type: 'sink',
			subtype: 'thrusters',
			capacity: SINK_CAPACITY['thrusters'],
			state: 'idle',
			storage: 0,
			enRoute: 0,
			timeLeft: 0
		},
		'n': {
			type: 'sink',
			subtype: 'navigation',
			capacity: SINK_CAPACITY['navigation'],
			state: 'idle',
			storage: 0,
			enRoute: 0,
			timeLeft: 0
		},
		'r': {
			type: 'sink',
			subtype: 'reactor',
			capacity: SINK_CAPACITY['reactor'],
			state: 'idle',
			storage: 0,
			enRoute: 0,
			timeLeft: 0
		},
		'undefined': {type: 'empty'}
	})[f] as any;
}
