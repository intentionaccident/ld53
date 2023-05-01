import { RoomHandle } from "../types/RoomHandle";
import { GameEventType } from "./types/GameEventType";
import { RoomEditTarget } from "./types/roomEdit/RoomEditTarget";
import { Ship } from "../types/Ship";
import { HoverTarget } from "./types/HoverTarget";

export function subscribeToEvents(ship: Ship, room: RoomHandle) {
	room.graphics.intersection.base.root.on('rightdown', (event) => {
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
	room.graphics.intersection.base.root.on('mousedown', (event) => {
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

		if (event.shiftKey) {
			ship.eventQueue.push({
				type: GameEventType.RoomEdit, coord: room.coordinate, edit: {
					target: RoomEditTarget.Feature
				}
			});
			return
		}

		if (event.altKey) {
			ship.eventQueue.push({
				type: GameEventType.RoomEdit, coord: room.coordinate, edit: {
					target: RoomEditTarget.Intersection,
					lock: true
				}
			});
			return
		}

		ship.eventQueue.push({ type: GameEventType.RotateIntersection, clockwise: true, coord: room.coordinate });
	});

	room.graphics.verticalPipe.base.root.on('mousedown', (event) => {
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
	room.graphics.horizontalPipe.base.root.on('mousedown', (event) => {
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
		if (event.shiftKey) {
			ship.eventQueue.push({ type: GameEventType.ActivateSink, coord: room.coordinate });
			return
		}

		if (event.ctrlKey) {
			ship.eventQueue.push({
				type: GameEventType.RoomEdit, coord: room.coordinate, edit: {
					target: RoomEditTarget.FeatureGloop,
				}
			});
			return
		}

	});

	room.graphics.features.on('rightdown', (event) => {
		if (event.ctrlKey) {
			ship.eventQueue.push({
				type: GameEventType.RoomEdit, coord: room.coordinate, edit: {
					target: RoomEditTarget.FeatureGloop,
					reverse: true
				}
			});
			return
		}
	});

	room.graphics.room.gloopPort.on("mouseenter", () => {
		ship.eventQueue.push({
			type: GameEventType.HoverButton, coord: room.coordinate, active: true, target: HoverTarget.GloopButton
		});
	})

	room.graphics.room.gloopPort.on("mouseleave", () => {
		ship.eventQueue.push({
			type: GameEventType.HoverButton, coord: room.coordinate, active: false, target: HoverTarget.GloopButton
		});
	})

	room.graphics.room.gloopPort.on("mousedown", () => {
		ship.eventQueue.push({ type: GameEventType.ActivateFeature, coord: room.coordinate });
	})
}
