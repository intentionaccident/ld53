import { Ship } from "../types/Ship";
import { SINK_REQUEST_TIMEOUT } from "../constants";
import { GameEventType } from "./types/GameEventType";
import { KeyPressedEvent } from "./types/KeyPressedEvent";
import { RoomEditTarget } from "./types/roomEdit/RoomEditTarget";

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
				if (event.clockwise) {
					room.data.intersectionStates.push(room.data.intersectionStates.shift())
					return
				}
				room.data.intersectionStates.unshift(room.data.intersectionStates.pop())
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
			} case GameEventType.RoomEdit: {
				const room = ship.roomHandles[event.coord.y][event.coord.x];
				switch (event.edit.target) {
					case RoomEditTarget.Pipe: {
						if (event.edit.vertical) {
							room.data.bottomPipeCapacity = room.data.bottomPipeCapacity > 0 ? 0 : 5
							continue
						}
						room.data.rightPipeCapacity = room.data.rightPipeCapacity > 0 ? 0 : 5
						continue
					} case RoomEditTarget.Intersection: {
						let state = room.data.intersectionStates.filter(s => s).length
						const bar = room.data.intersectionStates[0] !== room.data.intersectionStates[1]
						if (event.edit.reverse) {
							if (state === 3) {
								room.data.intersectionStates = [true, false, true, false]
								continue
							}

							if (state !== 2 || !bar) {
								state = (state + 4) % 5
							}
						} else {
							if (state === 2 && !bar) {
								room.data.intersectionStates = [true, false, true, false]
								continue
							}
							state = (state + 1) % 5
						}

						room.data.intersectionStates = [...Array(4)].map((_, i) => i < state)
						continue
					} case RoomEditTarget.Feature: {
						continue
					}
				}
				continue
			} default: {
				console.warn("unprocessed event", event)
				continue;
			}
		}
	}
}
