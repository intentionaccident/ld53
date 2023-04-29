import {Ship} from "./types/Ship";

export function processEvents(ship: Ship, setGloopAmount) {
	while (ship.eventQueue.length > 0) {
		const event = ship.eventQueue.pop();
		if (event.type === 'KeyPressed' && event.key == ' ') {
			ship.gloopAmount += 10;
			setGloopAmount(ship.gloopAmount);
		} else if (event.type === 'RotateIntersection') {
			const room = ship.roomHandles[event.y][event.x];
			const previousTop = room.data.topOpen;
			room.data.topOpen = room.data.leftOpen;
			room.data.leftOpen = room.data.bottomOpen;
			room.data.bottomOpen = room.data.rightOpen;
			room.data.rightOpen = previousTop;
		} else if (event.type === 'CounterRotateIntersection') {
			const room = ship.roomHandles[event.y][event.x];
			const previousTop = room.data.topOpen;
			room.data.topOpen = room.data.rightOpen;
			room.data.rightOpen = room.data.bottomOpen;
			room.data.bottomOpen = room.data.leftOpen;
			room.data.leftOpen = previousTop;
		} else if (event.type === 'FeatureClicked') {
			const room = ship.roomHandles[event.y][event.x];
			if (room.data.feature.type === 'source') {
				if (ship.gloopAmount > 0) {
					const addedAmount = Math.min(ship.gloopAmount, 10)
					room.data.feature.queued += addedAmount;
					ship.gloopAmount -= addedAmount;
					setGloopAmount(ship.gloopAmount);
				}
			}
		}
	}
}
