import {Ship} from "./types/Ship";
import {MAX_CONCURRENT_DIRTY_ROOMS, SINK_BUSY_TICKS, SINK_REQUEST_TIMEOUT} from "./constants";
import {IntersectionDirection} from "./types/IntersectionDirection";
import {RoomHandle} from "./types/RoomHandle";
import {TextureAssetLibrary} from "./types/TextureAssetLibrary";
import {shipLayoutMasks, shipLayouts} from "./shipLayouts";
import {updateLevel} from "./updateLevel";

export function updateRooms(ship: Ship, textureAssets: TextureAssetLibrary) {
	const sinks = ship.roomHandles.flatMap(a => a).map(r => r.data.feature.type === 'sink' ? r.data.feature : null).filter(r => r != null);
	const idleSinks = sinks.filter(s => s.state === 'idle');
	const doneSinks = sinks.filter(s => s.state === 'done');
	const requestingSinks = sinks.filter(r => r.state === 'requesting');
	const busySinks = sinks.filter(r => r.state === 'busy');
	const dirtyRooms = ship.roomHandles.flatMap(a => a).filter(r => r.data.isDirty);

	if (dirtyRooms.length < MAX_CONCURRENT_DIRTY_ROOMS) {
		function anyIntersectionIsOpen(r: RoomHandle) {
			return r.data.intersectionStates.filter(s => s).length && r.data.lockSemaphore === 0;
		}
		const candidates = ship.roomHandles.flatMap(a => a).filter(anyIntersectionIsOpen);
		if (candidates.length > 0) {
			const room = candidates[Math.floor(Math.random() * candidates.length)];
			room.data.isDirty = true;
		}
	}
	if (requestingSinks.length === 0 && busySinks.length <= 1 && idleSinks.length > 0) {
		const sink = idleSinks[Math.floor(Math.random() * idleSinks.length)];
		sink.state = 'requesting';
		sink.ticksLeft = SINK_REQUEST_TIMEOUT[sink.subtype];
	}

	for (let y = 0; y < ship.roomHandles.length; y++)
		for (let x = 0; x < ship.roomHandles[y].length; x++) {
			const feature = ship.roomHandles[y][x].data.feature;
			if (feature.type === 'sink') {
				if (feature.state === 'requesting') {
					feature.ticksLeft -= 1;
					if (feature.storage >= feature.capacity) {
						feature.state = 'busy';
						feature.ticksLeft = SINK_BUSY_TICKS[feature.subtype];
					} else if (feature.ticksLeft <= 0) {
						if (feature.storage > 0) {
							feature.state = 'releasing';
						} else {
							feature.state = 'idle';
						}
					}
				} else if (feature.state === 'busy') {
					feature.ticksLeft -= 1;
					ship.levelProgress += 0.01;
					ship.graphics.progressBar.set(ship.levelProgress);
					if (feature.ticksLeft <= 0) {
						feature.state = 'done';
					}
				} else if (feature.state === 'releasing' && feature.storage === 0) {
					feature.state = 'idle';
				}
			}
		}

	if (ship.levelProgress >= 1) {
		ship.currentLevel += 1;
		ship.levelProgress = 0;
		ship.graphics.progressBar.set(ship.levelProgress);
		if (ship.currentLevel >= shipLayouts.length) {
			console.log("YOU WON!")
		} else {
			updateLevel(ship, shipLayoutMasks[ship.currentLevel], shipLayouts[ship.currentLevel], textureAssets);
		}
	}
}
