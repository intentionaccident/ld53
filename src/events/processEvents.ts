import { Ship } from "../types/Ship";
import { DEFAULT_PIPE_CAPACITY, SINK_REQUEST_TIMEOUT } from "../constants";
import { GameEventType } from "./types/GameEventType";
import { KeyPressedEvent } from "./types/KeyPressedEvent";
import { RoomEditTarget } from "./types/roomEdit/RoomEditTarget";
import { saveLevel } from "../saveLevel";
import { createFeature } from "../createFeature";
import { updateIntersectionTexture } from "../utils/updateIntersectionTexture";
import { AssetLibrary } from "../types/AssetLibrary";
import {dijkstra} from "../dijkstra";

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
		} case 's': {
			console.log(saveLevel(ship));
			return
		} case 'f': {
			ship.eventQueue.push({
				type: GameEventType.FlushPipe,
				animationTemplate: {
					gloop: 10,
					path: [...Array(10)].map(_ => ({
						coord: {
							x: Math.random() * 10 | 0,
							y: Math.random() * 10 | 0
						},
						vertical: Math.random() > 0.5
					}))
				}
			})
			return
		} case 'd': {
			const source = ship.roomHandles.flatMap(r => r).filter(r => r.data.feature.type === 'source')[0];
			console.log(dijkstra(ship.roomHandles, {x: source.coordinate.x, y: source.coordinate.y}));
			return
		}
	}
}

export function processEvents(ship: Ship, hooks: UIHooks, assets: AssetLibrary) {
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
				} else {
					room.data.intersectionStates.unshift(room.data.intersectionStates.pop())
				}
				updateIntersectionTexture(room, assets)

				continue
			} case GameEventType.ActivateFeature: {
				const feature = ship.roomHandles[event.coord.y][event.coord.x].data.feature;
				if (feature.type === 'source') {
					if (ship.gloopAmount > 0) {
						const addedAmount = Math.min(ship.gloopAmount, 10)
						feature.storage += addedAmount;
						ship.gloopAmount -= addedAmount;
						hooks.setGloopAmount(ship.gloopAmount);
					}
				} else if (feature.type === 'sink' && feature.state === 'done') {
					feature.state = 'releasing';
				}
				continue;
			} case GameEventType.ActivateSink: {
				const feature = ship.roomHandles[event.coord.y][event.coord.x].data.feature;
				if (feature.type === 'sink' && feature.state === 'idle') {
					feature.state = 'requesting';
					feature.ticksLeft = SINK_REQUEST_TIMEOUT[feature.subtype];
				}
				continue;
			} case GameEventType.RoomEdit: {
				const room = ship.roomHandles[event.coord.y][event.coord.x];
				switch (event.edit.target) {
					case RoomEditTarget.Pipe: {
						if (event.edit.vertical) {
							room.data.bottomPipeCapacity = room.data.bottomPipeCapacity > 0 ? 0 : DEFAULT_PIPE_CAPACITY
							continue
						}
						room.data.rightPipeCapacity = room.data.rightPipeCapacity > 0 ? 0 : DEFAULT_PIPE_CAPACITY
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
						updateIntersectionTexture(room, assets)
						continue
					} case RoomEditTarget.Feature: {
						if (room.data.feature.type === 'empty') {
							room.data.feature = createFeature('t');
						} else if (room.data.feature.type === 'sink' && room.data.feature.subtype === 'thrusters') {
							room.data.feature = createFeature('n');
						} else if (room.data.feature.type === 'sink' && room.data.feature.subtype === 'navigation') {
							room.data.feature = createFeature('r');
						} else if (room.data.feature.type === 'sink' && room.data.feature.subtype === 'reactor') {
							room.data.feature = createFeature('+');
						} else {
							room.data.feature = createFeature(undefined);
						}
						room.data.feature
						continue
					}
				}
				continue
			} case GameEventType.FlushPipe: {
				ship.animationQueue.push({
					template: event.animationTemplate,
					activePipes: [],
					overflow: 0
				})
				continue
			} default: {
				console.warn("unprocessed event", event)
				continue;
			}
		}
	}
}
