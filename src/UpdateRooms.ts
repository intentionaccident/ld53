import {Ship} from "./types/Ship";
import {MAX_CONCURRENT_DIRTY_ROOMS, MAX_DONE_SINKS, SINK_BUSY_TICKS, SINK_REQUEST_TIMEOUT} from "./constants";
import {IntersectionDirection} from "./types/IntersectionDirection";
import {RoomHandle} from "./types/RoomHandle";

export function updateRooms(ship: Ship) {
	const previous = ship.roomHandles.map(row => row.map(row => row.data))
	const sinks = ship.roomHandles.flatMap(a => a).map(r => r.data.feature.type === 'sink' ? r.data.feature : null).filter(r => r != null);
	const idleSinks = sinks.filter(s => s.state === 'idle');
	const doneSinks = sinks.filter(s => s.state === 'done');
	const requestingSinks = sinks.filter(r => r.state === 'requesting');
	const busySinks = sinks.filter(r => r.state === 'busy');
	const dirtyRooms = ship.roomHandles.flatMap(a => a).filter(r => r.data.isDirty);

	if (dirtyRooms.length < MAX_CONCURRENT_DIRTY_ROOMS) {
		function anyIntersectionIsOpen(r: RoomHandle) {
			return r.data.intersectionStates.filter(s => s).length;
		}
		const candidates = ship.roomHandles.flatMap(a => a).filter(anyIntersectionIsOpen);
		const room = candidates[Math.floor(Math.random() * candidates.length)];
		room.data.isDirty = true;
	}
	if (doneSinks.length > MAX_DONE_SINKS) {
		const sink = doneSinks[Math.floor(Math.random() * idleSinks.length)];
		sink.state = 'releasing';
	}
	if (requestingSinks.length === 0 && busySinks.length <= 1 && idleSinks.length > 0) {
		const sink = idleSinks[Math.floor(Math.random() * idleSinks.length)];
		sink.state = 'requesting';
		sink.ticksLeft = SINK_REQUEST_TIMEOUT[sink.subtype];
	}

	function outOfBounds(x: number, y: number): boolean {
		return y < 0 || y >= ship.roomHandles.length || x < 0 || x >= ship.roomHandles[y].length;
	}

	type PipeCandidate = {
		x: number, y: number,
		pipe: 'bottomPipe' | 'rightPipe',
		pipeCapacity: 'bottomPipeCapacity' | 'rightPipeCapacity',
		movedThrough: { x: number, y: number }
	}

	function openIntersectionPipes(x: number, y: number): PipeCandidate[] {
		const candidates = [];
		// Bottom
		if (previous[y][x].intersectionStates[IntersectionDirection.Bottom]) {
			candidates.push({
				x: x,
				y: y,
				pipe: 'bottomPipe',
				pipeCapacity: 'bottomPipeCapacity'
			});
		}
		// Left
		if (previous[y][x].intersectionStates[IntersectionDirection.Left]) {
			candidates.push({
				x: x - 1,
				y: y,
				pipe: 'rightPipe',
				pipeCapacity: 'rightPipeCapacity',
			});
		}
		// Top
		if (previous[y][x].intersectionStates[IntersectionDirection.Top]) {
			candidates.push({
				x: x,
				y: y - 1,
				pipe: 'bottomPipe',
				pipeCapacity: 'bottomPipeCapacity'
			});
		}
		// Right
		if (previous[y][x].intersectionStates[IntersectionDirection.Right]) {
			candidates.push({
				x: x,
				y: y,
				pipe: 'rightPipe',
				pipeCapacity: 'rightPipeCapacity'
			});
		}

		return candidates;
	}

	function onGloopMovedThroughIntersection(x: number, y: number) {
		if (ship.roomHandles[y][x].data.isDirty) {
			ship.roomHandles[y][x].data.isDirty = false;
			ship.score += 1;
		}
	}

	for (let y = 0; y < ship.roomHandles.length; y++)
		for (let x = 0; x < ship.roomHandles[y].length; x++) {
			ship.roomHandles[y][x].data = {...previous[y][x]};

			const candidatePressure = candidate =>
				ship.roomHandles[candidate.y][candidate.x].data[candidate.pipe] / ship.roomHandles[candidate.y][candidate.x].data[candidate.pipeCapacity];

			for (let [pipe, pipeCapacity] of [['rightPipe', 'rightPipeCapacity'], ['bottomPipe', 'bottomPipeCapacity']]) {
				console.assert(previous[y][x][pipe] <= previous[y][x][pipeCapacity]);
				if (previous[y][x][pipe] > 0 && !ship.roomHandles[y][x].data[pipe + 'ReceivedThisFrame']) {
					let candidates: PipeCandidate[] = [];

					if (pipe === 'rightPipe') {
						// Left side
						if (previous[y][x].intersectionStates[IntersectionDirection.Right]) {
							// Left-side bottom
							if (previous[y][x].intersectionStates[IntersectionDirection.Bottom]) {
								candidates.push({
									x: x,
									y: y,
									pipe: 'bottomPipe',
									pipeCapacity: 'bottomPipeCapacity',
									movedThrough: {x, y}
								});
							}
							// Left-side left
							if (previous[y][x].intersectionStates[IntersectionDirection.Left]) {
								candidates.push({
									x: x - 1,
									y: y,
									pipe: 'rightPipe',
									pipeCapacity: 'rightPipeCapacity',
									movedThrough: {x, y}
								});
							}
							// Left-side up
							if (previous[y][x].intersectionStates[IntersectionDirection.Top]) {
								candidates.push({
									x: x,
									y: y - 1,
									pipe: 'bottomPipe',
									pipeCapacity: 'bottomPipeCapacity',
									movedThrough: {x, y}
								});
							}
						}

						// Right side
						if (!outOfBounds(x + 1, y) && previous[y][x + 1].intersectionStates[IntersectionDirection.Left]) {
							// Right-side bottom
							if (previous[y][x + 1].intersectionStates[IntersectionDirection.Bottom]) {
								candidates.push({
									x: x + 1,
									y: y,
									pipe: 'bottomPipe',
									pipeCapacity: 'bottomPipeCapacity',
									movedThrough: {x: x + 1, y}
								});
							}
							// Right-side right
							if (previous[y][x + 1].intersectionStates[IntersectionDirection.Right]) {
								candidates.push({
									x: x + 1,
									y: y,
									pipe: 'rightPipe',
									pipeCapacity: 'rightPipeCapacity',
									movedThrough: {x: x + 1, y}
								});
							}
							// Right-side up
							if (previous[y][x + 1].intersectionStates[IntersectionDirection.Top]) {
								candidates.push({
									x: x + 1,
									y: y - 1,
									pipe: 'bottomPipe',
									pipeCapacity: 'bottomPipeCapacity',
									movedThrough: {x: x + 1, y}
								});
							}
						}
					} else {
						// Top side
						if (previous[y][x].intersectionStates[IntersectionDirection.Bottom]) {
							// Top-side left
							if (previous[y][x].intersectionStates[IntersectionDirection.Left]) {
								candidates.push({
									x: x - 1,
									y: y,
									pipe: 'rightPipe',
									pipeCapacity: 'rightPipeCapacity',
									movedThrough: {x, y}
								});
							}
							// Top-side up
							if (previous[y][x].intersectionStates[IntersectionDirection.Top]) {
								candidates.push({
									x: x,
									y: y - 1,
									pipe: 'bottomPipe',
									pipeCapacity: 'bottomPipeCapacity',
									movedThrough: {x, y}
								});
							}
							// Top-side right
							if (previous[y][x].intersectionStates[IntersectionDirection.Right]) {
								candidates.push({
									x: x,
									y: y,
									pipe: 'rightPipe',
									pipeCapacity: 'rightPipeCapacity',
									movedThrough: {x, y}
								});
							}
						}

						// Bottom side
						if (!outOfBounds(x, y + 1) && previous[y + 1][x].intersectionStates[IntersectionDirection.Top]) {
							// Bottom-side bottom
							if (previous[y + 1][x].intersectionStates[IntersectionDirection.Bottom]) {
								candidates.push({
									x: x,
									y: y + 1,
									pipe: 'bottomPipe',
									pipeCapacity: 'bottomPipeCapacity',
									movedThrough: {x, y: y + 1}
								});
							}
							// Bottom-side left
							if (previous[y + 1][x].intersectionStates[IntersectionDirection.Left]) {
								candidates.push({
									x: x - 1,
									y: y + 1,
									pipe: 'rightPipe',
									pipeCapacity: 'rightPipeCapacity',
									movedThrough: {x, y: y + 1}
								});
							}
							// Bottom-side right
							if (previous[y + 1][x].intersectionStates[IntersectionDirection.Right]) {
								candidates.push({
									x: x,
									y: y + 1,
									pipe: 'rightPipe',
									pipeCapacity: 'rightPipeCapacity',
									movedThrough: {x, y: y + 1}
								});
							}
						}
					}

					// Let's limit our gloop movement to max 1 per room for now
					candidates = candidates.filter(candidate =>
						!outOfBounds(candidate.x, candidate.y)
						&& ship.roomHandles[candidate.y][candidate.x].data[candidate.pipe] < ship.roomHandles[candidate.y][candidate.x].data[candidate.pipeCapacity]
						&& candidatePressure(candidate) < (ship.roomHandles[y][x].data[pipe] / ship.roomHandles[y][x].data[pipeCapacity])
					);
					if (candidates.length > 0) {
						candidates = candidates.sort(
							(a, b) => candidatePressure(a) - candidatePressure(b)
						);
						candidates = candidates.filter(
							candidate => candidatePressure(candidate) == candidatePressure(candidates[0])
						);
						const candidate = candidates[Math.floor(Math.random() * candidates.length)];
						ship.roomHandles[candidate.y][candidate.x].data[candidate.pipe] += 1;
						ship.roomHandles[candidate.y][candidate.x].data[candidate.pipe + 'ReceivedThisFrame'] = true;
						ship.roomHandles[y][x].data[pipe] -= 1;
						onGloopMovedThroughIntersection(candidate.movedThrough.x, candidate.movedThrough.y);
					}
				}
			}

			const feature = ship.roomHandles[y][x].data.feature;
			if (feature.type === 'source' || (feature.type === 'sink' && feature.state === 'releasing')) {
				let gloopLeft = Math.min(feature.storage, feature.releaseSpeed);
				let candidates = openIntersectionPipes(x, y);
				while (candidates.length > 0 && gloopLeft > 0) {
					candidates = candidates.filter(candidate =>
						!outOfBounds(candidate.x, candidate.y)
						&& ship.roomHandles[candidate.y][candidate.x].data[candidate.pipe] < ship.roomHandles[candidate.y][candidate.x].data[candidate.pipeCapacity]
					);
					if (candidates.length > 0) {
						candidates = candidates.sort(
							(a, b) => candidatePressure(a) - candidatePressure(b)
						);
						ship.roomHandles[candidates[0].y][candidates[0].x].data[candidates[0].pipe] += 1;
						ship.roomHandles[candidates[0].y][candidates[0].x].data[candidates[0].pipe + 'ReceivedThisFrame'] = true;
						gloopLeft -= 1;
						feature.storage -= 1;
					}
				}
			}

			if (feature.type === 'sink') {
				if (feature.state === 'requesting') {
					let gloopToConsume = 1;
					let candidates = openIntersectionPipes(x, y);
					while (candidates.length > 0 && gloopToConsume > 0) {
						candidates = candidates.filter(candidate =>
							!outOfBounds(candidate.x, candidate.y)
							&& ship.roomHandles[candidate.y][candidate.x].data[candidate.pipe] > 0
							&& !ship.roomHandles[candidate.y][candidate.x].data[candidate.pipe + 'UpdatedThisFrame']
						);
						if (candidates.length > 0) {
							candidates = candidates.sort(
								(a, b) => candidatePressure(a) - candidatePressure(b)
							);
							ship.roomHandles[candidates[0].y][candidates[0].x].data[candidates[0].pipe] -= 1;
							gloopToConsume -= 1;
							feature.storage += 1;
							feature.ticksLeft = SINK_REQUEST_TIMEOUT[feature.subtype];
						}
					}
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

	for (let y = 0; y < ship.roomHandles.length; y++)
	for (let x = 0; x < ship.roomHandles[y].length; x++) {
		ship.roomHandles[y][x].data.bottomPipeReceivedThisFrame = false;
		ship.roomHandles[y][x].data.rightPipeReceivedThisFrame = false;
	}
}
