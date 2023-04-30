import { RoomHandle } from "../types/RoomHandle";
import { GameEventType } from "./types/GameEventType";
import { RoomEditTarget } from "./types/roomEdit/RoomEditTarget";
import { Ship } from "../types/Ship";

export function subscribeToEvents(ship: Ship, room: RoomHandle) {
	room.graphics.intersection.on('rightdown', (event) => {
		if (event.ctrlKey) {
			ship.eventQueue.push({
				type: GameEventType.RoomEdit, coord: room.coordinate, edit: {
					target: RoomEditTarget.Intersection,
					reverse: true
				}
			});
			return
		}
		ship.eventQueue.push({ type: GameEventType.RotateIntersection, coord: room.coordinate });
	});
	room.graphics.intersection.on('mousedown', (event) => {
		if (event.button !== 0) {
			return
		}

		if (event.ctrlKey) {
			ship.eventQueue.push({
				type: GameEventType.RoomEdit, coord: room.coordinate, edit: {
					target: RoomEditTarget.Intersection
				}
			});
			return
		}

		ship.eventQueue.push({ type: GameEventType.RotateIntersection, clockwise: true, coord: room.coordinate });
	});

	room.graphics.verticalPipe.on('mousedown', (event) => {
		if (!event.ctrlKey) {
			return;
		}
		console.log("verticalPipe", event);
		ship.eventQueue.push({
			type: GameEventType.RoomEdit,
			coord: room.coordinate,
			edit: {
				target: RoomEditTarget.Pipe,
				vertical: true
			}
		});
	});
	room.graphics.horizontalPipe.on('mousedown', (event) => {
		if (!event.ctrlKey) {
			return;
		}
		console.log("horizontalPipe", event);
		ship.eventQueue.push({
			type: GameEventType.RoomEdit,
			coord: room.coordinate,
			edit: {
				target: RoomEditTarget.Pipe
			}
		});
	});

	room.graphics.features.on('mousedown', (event) => {
		if (event.ctrlKey) {
			ship.eventQueue.push({
				type: GameEventType.RoomEdit, coord: room.coordinate, edit: {
					target: RoomEditTarget.Feature
				}
			});
			return
		}

		if (event.shiftKey) {
			ship.eventQueue.push({ type: GameEventType.ActivateSink, coord: room.coordinate });
			return
		}

		ship.eventQueue.push({ type: GameEventType.ActivateFeature, coord: room.coordinate });
	});

	room.graphics.features.on('rightdown', (event) => {
		if (event.ctrlKey) {
			ship.eventQueue.push({
				type: GameEventType.RoomEdit, coord: room.coordinate, edit: {
					target: RoomEditTarget.Feature,
					reverse: true
				}
			});
			return
		}
	});
}
