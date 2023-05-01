import { Ship } from "./types/Ship";
import { Node } from "./dijkstraGraph";
import { SoundAssetLibrary } from "./types/SoundAssetLibrary";
import { SoundAssetNames } from "./types/SoundAssetNames";
import { BOX_DELIVERY_SCORE } from "./constants";

export function updateAnimations(ship: Ship, setScore, soundAssets: SoundAssetLibrary) {
	for (const animation of ship.animationQueue) {
		if (animation.flow === 0) {
			soundAssets[SoundAssetNames.Glop].asset.play()
		}

		if (animation.flow < animation.template.path.length) {
			const newPipe = animation.template.path[animation.flow];
			animation.activePipes.push(newPipe)
			const room = ship.roomHandles[newPipe.y][newPipe.x]
			if (newPipe.vertical) {
				room.data.bottomPipe++
			} else {
				room.data.rightPipe++
			}

			function outOfBounds(n: Node): boolean {
				return n.y < 0 || n.y >= ship.roomHandles.length || n.x < 0 || n.x >= ship.roomHandles[n.y].length;
			}

			// Every pipe touches two intersections, we check both of them
			let dirtyRoomCandidates = [
				{ x: newPipe.x, y: newPipe.y },
				newPipe.vertical
					? { x: newPipe.x, y: newPipe.y + 1 }
					: { x: newPipe.x + 1, y: newPipe.y }
			];
			for (const candidate of dirtyRoomCandidates) {
				if (!outOfBounds(candidate) && ship.roomHandles[candidate.y][candidate.x].data.isDirty) {
					const room = ship.roomHandles[candidate.y][candidate.x]
					room.data.isDirty = false;
					room.graphics.room.boxArrivalAnimation.visible = false;
					room.graphics.room.boxFillingAnimation.visible = true;
					room.graphics.room.boxFillingAnimation.play()
					soundAssets.collect.asset.play();
				}
			}
		}

		animation.flow++

		if (animation.flow > animation.template.gloop) {
			const removedPipe = animation.activePipes.shift()
			const room = ship.roomHandles[removedPipe.y][removedPipe.x]
			room.data.lockSemaphore--
			if (removedPipe.vertical) {
				room.data.bottomPipe--
			} else {
				room.data.rightPipe--
			}
		}

		if (animation.activePipes.length === 0) {
			animation.template.target.enRoute -= 1;
			animation.template.target.storage += 1;
		}
	}
	ship.animationQueue = ship.animationQueue.filter((animation) => animation.activePipes.length)
}
