import {Ship} from "./types/Ship";
import {Node} from "./dijkstraGraph";
import {SinkFeature, SourceFeature} from "./types/RoomFeature";

export function updateAnimations(ship: Ship, setScore) {
	for (const animation of ship.animationQueue) {
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
				{x: newPipe.x, y: newPipe.y},
				newPipe.vertical
					? {x: newPipe.x, y: newPipe.y + 1}
					: {x: newPipe.x + 1, y: newPipe.y}
			];
			for (const candidate of dirtyRoomCandidates) {
				if (!outOfBounds(candidate) && ship.roomHandles[candidate.y][candidate.x].data.isDirty) {
					ship.roomHandles[candidate.y][candidate.x].data.isDirty = false;
					ship.score += 1;
					setScore(ship.score);
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
