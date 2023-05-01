import {Ship} from "./types/Ship";

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
			if (ship.roomHandles[newPipe.y][newPipe.x].data.isDirty) {
				ship.roomHandles[newPipe.y][newPipe.x].data.isDirty = false;
				ship.score += 1;
				setScore(ship.score);
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
	}
	ship.animationQueue = ship.animationQueue.filter((animation) => animation.activePipes.length)
}
