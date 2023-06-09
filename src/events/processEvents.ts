import { Ship } from "../types/Ship";
import { DEBUG, DEFAULT_PIPE_CAPACITY, SINK_BUSY_TICKS } from "../constants";
import { GameEventType } from "./types/GameEventType";
import { KeyPressedEvent } from "./types/KeyPressedEvent";
import { RoomEditTarget } from "./types/roomEdit/RoomEditTarget";
import { saveLevel } from "../saveLevel";
import { createFeature } from "../createFeature";
import { updateIntersectionTexture } from "../utils/updateIntersectionTexture";
import { TextureAssetLibrary } from "../types/TextureAssetLibrary";
import { dijkstraGraph, dijkstraPath } from "../dijkstraGraph";
import { SinkFeature, SourceFeature } from "../types/RoomFeature";
import { RoomIntersectionEdit } from "./types/roomEdit/RoomIntersectionEdit";
import { RoomHandle } from "../types/RoomHandle";
import { HoverTarget } from "./types/HoverTarget";
import { SoundAssetLibrary } from "../types/SoundAssetLibrary";
import { shipLayouts } from "../shipLayouts";

function processIntersectionEdit(room: RoomHandle, edit: RoomIntersectionEdit) {
	let state = room.data.intersectionStates.filter(s => s).length
	const bar = room.data.intersectionStates[0] !== room.data.intersectionStates[1]
	if (edit.lock) {
		room.data.intersectionLocked = !room.data.intersectionLocked
		return
	}

	if (edit.reverse) {
		if (state === 3) {
			room.data.intersectionStates = [true, false, true, false]
			return
		}

		if (state !== 2 || !bar) {
			state = (state + 4) % 5
		}
	} else {
		if (state === 2 && !bar) {
			room.data.intersectionStates = [true, false, true, false]
			return
		}
		state = (state + 1) % 5
	}

	room.data.intersectionStates = [...Array(4)].map((_, i) => i < state)
}

function processKeystroke(event: KeyPressedEvent, ship: Ship) {
	if (DEBUG) {
		switch (event.key) {
			case 'p': {
				ship.score += 1;
				return
			}
			case 'P': {
				ship.score += 10;
				return
			}
			case 'n': {
				ship.levelProgress = 1;
				ship.graphics.progressBar.set((ship.currentLevel + ship.levelProgress) / shipLayouts.length);
				return
			}
			case 's': {
				console.log(saveLevel(ship));
				return
			}
		}
	}
}

export function processEvents(ship: Ship, textureAssets: TextureAssetLibrary, soundAssets: SoundAssetLibrary) {
	while (ship.eventQueue.length) {
		const event = ship.eventQueue.pop();
		switch (event.type) {
			case GameEventType.KeyPressed: {
				processKeystroke(event, ship)
				continue;
			} case GameEventType.RotateIntersection: {
				const room = ship.roomHandles[event.coord.y][event.coord.x];
				if (room.data.lockSemaphore > 0 || room.data.intersectionLocked) {
					continue
				}

				if (event.clockwise) {
					room.data.intersectionStates.unshift(room.data.intersectionStates.pop())
				} else {
					room.data.intersectionStates.push(room.data.intersectionStates.shift())
				}
				updateIntersectionTexture(room, textureAssets)

				continue
			} case GameEventType.ActivateFeature: {
				const roomHandle = ship.roomHandles[event.coord.y][event.coord.x];
				const feature = roomHandle.data.feature;
				if (feature.type === 'source' || (feature.type === 'sink' && (feature.state === 'done' || feature.state === 'requesting'))) {
					const targetCandidates =
						ship.roomHandles.flatMap(r => r)
							.filter(r =>
								(r.data.feature.type === 'sink' && r.data.feature.state === 'requesting')
								|| (r.data.feature.type === 'source' && r.data.feature.storage < r.data.feature.capacity)
							);
					const graph = dijkstraGraph(ship.roomHandles, { x: roomHandle.coordinate.x, y: roomHandle.coordinate.y });
					const paths = targetCandidates.map(target => {
						return {
							sink: target,
							path: dijkstraPath(graph, { x: target.coordinate.x, y: target.coordinate.y })
						}
					}).filter(path => path.path.length > 0);
					paths.sort((a, b) => {
						const aType = a.sink.data.feature.type === 'source' ? 1 : 0;
						const bType = b.sink.data.feature.type === 'source' ? 1 : 0;
						if (aType == bType) {
							return a.path.length - b.path.length
						} else {
							return aType - bType;
						}
					});
					console.log(paths);
					let failed = true;
					if (paths.length > 0) {
						const sinkPath = paths[0];
						const sink = sinkPath.sink.data.feature as (SinkFeature | SourceFeature);
						if (feature.storage > 0 && (sink.storage + sink.enRoute) < sink.capacity) {
							sink.enRoute += 1;
							feature.storage -= 1;
							ship.eventQueue.push({
								type: GameEventType.FlushPipe,
								animationTemplate: {
									gloop: 1,
									path: sinkPath.path,
									target: sink
								}
							});
							failed = false;
							if (feature.type === 'sink' && feature.state === 'done' && feature.storage === 0) {
								feature.state = 'idle';
							}
						}
					}
					if (failed) {
						const sinks = ship.roomHandles.flatMap(a => a).filter(r => r => r.data.feature.type === 'sink' && r.state === 'requesting');
						if (!sinks.length) {
							soundAssets.boing.asset.play()
							continue
						} else {
							soundAssets.alarm.asset.play()
							for (const sink of sinks) {
								sink.graphics.room.alertAnimation.play()
							}
						}
					}
				} else if (feature.type === 'sink' && feature.state === 'busy') {
					soundAssets.busy.asset.play();
				}
				continue;
			} case GameEventType.ActivateSink: {
				const feature = ship.roomHandles[event.coord.y][event.coord.x].data.feature;
				if (feature.type === 'sink' && feature.state === 'idle') {
					feature.state = 'requesting';
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
						processIntersectionEdit(room, event.edit)
						updateIntersectionTexture(room, textureAssets)
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
						} else if (room.data.feature.type === 'source' && room.data.feature.storage === 0) {
							room.data.feature = createFeature('++');
						} else if (room.data.feature.type === 'source' && room.data.feature.storage === 1) {
							room.data.feature = createFeature('+++');
						} else if (room.data.feature.type === 'source' && room.data.feature.storage === 2) {
							room.data.feature = createFeature('++++');
						} else {
							room.data.feature = createFeature(undefined);
						}
						continue
					} case RoomEditTarget.FeatureGloop: {
						if (room.data.feature.type === 'sink' || room.data.feature.type === 'source') {
							room.data.feature.storage = (room.data.feature.storage + (event.edit.reverse ? -1 : 1)) % (room.data.feature.capacity + 1);
							if (room.data.feature.storage < 0) room.data.feature.storage = room.data.feature.capacity;
						}
						continue
					}
				}
				continue
			} case GameEventType.FlushPipe: {
				for (const pipe of event.animationTemplate.path) {
					ship.roomHandles[pipe.y][pipe.x].data.lockSemaphore++
				}

				ship.animationQueue.push({
					template: event.animationTemplate,
					activePipes: [],
					flow: 0
				})
				continue
			} case GameEventType.HoverButton: {
				const room = ship.roomHandles[event.coord.y][event.coord.x];
				switch (event.target) {
					case HoverTarget.GloopButton: {
						room.gloopButtonActive = event.active
						continue
					}
				}
				continue;
			} case GameEventType.DeliveryRequest: {
				const room = ship.roomHandles[event.coord.y][event.coord.x];
				room.data.isDirty = true
				room.graphics.room.boxArrivalAnimation.visible = true
				room.graphics.room.boxArrivalAnimation.play()
				continue
			} default: {
				console.warn("unprocessed event", event)
				continue;
			}
		}
	}
}
