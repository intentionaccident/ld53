import {Ship} from "./types/Ship";
import {SINK_REQUEST_TIMEOUT} from "./constants";

export function processEvents(ship: Ship, setGloopAmount) {
	while (ship.eventQueue.length > 0) {
		const event = ship.eventQueue.pop();
		if (event.type === 'KeyPressed' && event.key == ' ') {
			ship.gloopAmount += 10;
			setGloopAmount(ship.gloopAmount);
		} else if (event.type === 'KeyPressed' && event.key == 'c') {
			for (let y = 0; y < ship.roomHandles.length; y++) {
				for (let x = 0; x < ship.roomHandles[y].length; x++) {
					ship.roomHandles[y][x].data.rightPipe = 0;
					ship.roomHandles[y][x].data.bottomPipe = 0;
				}
			}
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
			const feature = ship.roomHandles[event.y][event.x].data.feature;
			if (feature.type === 'source') {
				if (ship.gloopAmount > 0) {
					const addedAmount = Math.min(ship.gloopAmount, 10)
					feature.storage += addedAmount;
					ship.gloopAmount -= addedAmount;
					setGloopAmount(ship.gloopAmount);
				}
			} else if (feature.type === 'sink') {
				if (feature.state === 'idle') {
					feature.state = 'requesting';
					feature.timeLeft = SINK_REQUEST_TIMEOUT[feature.subtype];
				} else if (feature.state === 'done') {
					feature.state = 'releasing';
				}
			}
		}
	}
}
