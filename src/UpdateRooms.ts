import {
	DIRTY_ROOM_DELAY_IN_TICKS,
	MAX_CONCURRENT_DIRTY_ROOMS,
	PROGRESS_MODIFIER,
	REQUEST_DELAY_IN_TICKS,
	SINK_BUSY_TICKS
} from "./constants";
import { GameEventType } from "./events/types/GameEventType";
import { shipLayouts, shipLayoutMasks } from "./shipLayouts";
import { RoomHandle } from "./types/RoomHandle";
import { Ship } from "./types/Ship";
import { SoundAssetLibrary } from "./types/SoundAssetLibrary";
import { TextureAssetLibrary } from "./types/TextureAssetLibrary";
import { updateLevel } from "./updateLevel";


export function updateRooms(ship: Ship, textureAssets: TextureAssetLibrary, soundAssets: SoundAssetLibrary, showMessageBox: (message: string) => void) {
	const sinks = ship.roomHandles.flatMap(a => a).map(r => r.data.feature.type === 'sink' ? r.data.feature : null).filter(r => r != null);
	const idleEmptySinks = sinks.filter(s => s.state === 'idle' && s.storage === 0 && s.enRoute === 0);
	const doneSinks = sinks.filter(s => s.state === 'done');
	const requestingSinks = sinks.filter(r => r.state === 'requesting');
	const busySinks = sinks.filter(r => r.state === 'busy');
	const dirtyRooms = ship.roomHandles.flatMap(a => a).filter(r => r.data.isDirty);

	let maxConcurrentDirtyRooms = 0;
	const level = ship.currentLevel + ship.levelProgress;
	for (const limit of MAX_CONCURRENT_DIRTY_ROOMS) {
		if (level >= limit.level) {
			maxConcurrentDirtyRooms = limit.value;
		}
	}
	if (dirtyRooms.length < maxConcurrentDirtyRooms) {
		ship.ticksBetweenDirtyRooms += 1;
		if (ship.ticksBetweenDirtyRooms > DIRTY_ROOM_DELAY_IN_TICKS) {
			function anyIntersectionIsOpen(r: RoomHandle) {
				return r.data.intersectionStates.filter(s => s).length && r.data.lockSemaphore === 0;
			}

			const candidates = ship.roomHandles.flatMap(a => a).filter(anyIntersectionIsOpen).filter(r => !r.data.isDirty).filter(r => r.data.feature.type === 'empty');
			if (candidates.length > 0) {
				const room = candidates[Math.floor(Math.random() * candidates.length)];

				ship.eventQueue.push({
					type: GameEventType.DeliveryRequest,
					coord: room.coordinate
				})
			}
			ship.ticksBetweenDirtyRooms = 0;
		}
	} else {
		ship.ticksBetweenDirtyRooms = 0;
	}
	if (requestingSinks.length === 0 && busySinks.length <= 1 && idleEmptySinks.length > 0) {
		ship.ticksBetweenRequests += 1;
		if (ship.ticksBetweenRequests > REQUEST_DELAY_IN_TICKS) {
			const sink = idleEmptySinks[Math.floor(Math.random() * idleEmptySinks.length)];
			sink.state = 'requesting';
			ship.ticksBetweenRequests = 0;
			soundAssets.alarm.asset.play();
		}
	} else {
		ship.ticksBetweenRequests = 0;
	}

	for (let y = 0; y < ship.roomHandles.length; y++)
		for (let x = 0; x < ship.roomHandles[y].length; x++) {
			const feature = ship.roomHandles[y][x].data.feature;
			if (feature.type === 'sink') {
				if (feature.state === 'requesting') {
					if (feature.storage >= feature.capacity) {
						feature.state = 'busy';
						feature.maxTicks = SINK_BUSY_TICKS[feature.subtype];
						feature.ticksLeft = feature.maxTicks;
						soundAssets.busy.asset.play();
					}
				} else if (feature.state === 'busy') {
					feature.ticksLeft -= 1;
					ship.levelProgress += 0.01 * PROGRESS_MODIFIER[ship.currentLevel];
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
			showMessageBox("YOU WON!");
		} else {
			updateLevel(ship, shipLayoutMasks[ship.currentLevel], shipLayouts[ship.currentLevel], textureAssets);
			showMessageBox(`You have advanced to level ${ship.currentLevel}. Score: ${ship.score}`);
		}
		ship.score = 0;
	}
}
