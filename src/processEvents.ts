import { Ship } from "./types/Ship";
import { SINK_REQUEST_TIMEOUT } from "./constants";
import { GameEventType } from "./types/events/GameEventType";
import { KeyPressedEvent } from "./types/events/KeyPressedEvent";

export interface UIHooks {
	setGloopAmount(_: number): void
}

function processKeystroke(event: KeyPressedEvent, ship: Ship, hooks: UIHooks) {
	switch (event.key) {
		case ' ': {
			ship.gloopAmount += 10;
			hooks.setGloopAmount(ship.gloopAmount);
			return
		} case 'c': {
			for (let y = 0; y < ship.roomHandles.length; y++) {
				for (let x = 0; x < ship.roomHandles[y].length; x++) {
					ship.roomHandles[y][x].data.rightPipe = 0;
					ship.roomHandles[y][x].data.bottomPipe = 0;
				}
			}
			return
		}
	}
}

export function processEvents(ship: Ship, hooks: UIHooks) {
	while (ship.eventQueue.length) {
		const event = ship.eventQueue.pop();
		switch (event.type) {
			case GameEventType.KeyPressed: {
				processKeystroke(event, ship, hooks)
				continue;
			} case GameEventType.RotateIntersection: {
				const room = ship.roomHandles[event.coord.y][event.coord.x];
				const previousTop = room.data.topOpen;
				if (event.clockwise) {
					room.data.topOpen = room.data.leftOpen;
					room.data.leftOpen = room.data.bottomOpen;
					room.data.bottomOpen = room.data.rightOpen;
					room.data.rightOpen = previousTop;
				} else {
					room.data.topOpen = room.data.rightOpen;
					room.data.rightOpen = room.data.bottomOpen;
					room.data.bottomOpen = room.data.leftOpen;
					room.data.leftOpen = previousTop;
				}
				continue
			} case GameEventType.FeatureClicked: {
				const feature = ship.roomHandles[event.coord.y][event.coord.x].data.feature;
				if (feature.type === 'source') {
					if (ship.gloopAmount > 0) {
						const addedAmount = Math.min(ship.gloopAmount, 10)
						feature.storage += addedAmount;
						ship.gloopAmount -= addedAmount;
						hooks.setGloopAmount(ship.gloopAmount);
					}
				} else if (feature.type === 'sink') {
					if (feature.state === 'idle') {
						feature.state = 'requesting';
						feature.timeLeft = SINK_REQUEST_TIMEOUT[feature.subtype];
					} else if (feature.state === 'done') {
						feature.state = 'releasing';
					}
				}
				continue;
			} default: {
				console.warn("unprocessed event", event)
				continue;
			}
		}
	}
}
