import {Ship} from "./types/Ship";
import {SINK_BUSY_TICKS, SINK_REQUEST_TIMEOUT} from "./constants";
import {IntersectionDirection} from "./types/IntersectionDirection";

export function updateRooms(delta: number, ship: Ship, setGloopAmount, setLandingGearFuel) {
	const previous = ship.roomHandles.map(row => row.map(row => row.data))
	const sinks = ship.roomHandles.flatMap(a => a).map(r => r.data.feature.type === 'sink' ? r.data.feature : null).filter(r => r != null);
	const idleSinks = sinks.filter(s => s.state === 'idle');
	const doneSinks = sinks.filter(s => s.state === 'done');
	const requestingSinks = sinks.filter(r => r.state === 'requesting');
	const busySinks = sinks.filter(r => r.state === 'busy');
	if (doneSinks.length > 3) {
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

	for (let y = 0; y < ship.roomHandles.length; y++)
		for (let x = 0; x < ship.roomHandles[y].length; x++) {
			ship.roomHandles[y][x].data = {...previous[y][x]};

			const candidatePressure = candidate =>
				ship.roomHandles[candidate.y][candidate.x].data[candidate.pipe] / ship.roomHandles[candidate.y][candidate.x].data[candidate.pipeCapacity];

			for (let [pipe, pipeCapacity] of [['rightPipe', 'rightPipeCapacity'], ['bottomPipe', 'bottomPipeCapacity']]) {
				console.assert(previous[y][x][pipe] <= previous[y][x][pipeCapacity]);
				if (previous[y][x][pipe] > 0) {
					let candidates =
						pipe == 'rightPipe' ? [
							// Left-side bottom
							{
								x: x,
								y: y,
								pipe: 'bottomPipe',
								pipeCapacity: 'bottomPipeCapacity',
								isOpen: previous[y][x].intersectionStates[IntersectionDirection.Right] && previous[y][x].intersectionStates[IntersectionDirection.Bottom]
							},
							// Left-side left
							{
								x: x - 1,
								y: y,
								pipe: 'rightPipe',
								pipeCapacity: 'rightPipeCapacity',
								isOpen: previous[y][x].intersectionStates[IntersectionDirection.Right] && previous[y][x].intersectionStates[IntersectionDirection.Left]
							},
							// Left-side up
							{
								x: x,
								y: y - 1,
								pipe: 'bottomPipe',
								pipeCapacity: 'bottomPipeCapacity',
								isOpen: previous[y][x].intersectionStates[IntersectionDirection.Right] && previous[y][x].intersectionStates[IntersectionDirection.Top]
							},

							// Right-side bottom
							{
								x: x + 1,
								y: y,
								pipe: 'bottomPipe',
								pipeCapacity: 'bottomPipeCapacity',
								isOpen: !outOfBounds(x + 1, y) && previous[y][x].intersectionStates[IntersectionDirection.Right] && previous[y][x + 1].intersectionStates[IntersectionDirection.Bottom]
							},
							// Right-side right
							{
								x: x + 1,
								y: y,
								pipe: 'rightPipe',
								pipeCapacity: 'rightPipeCapacity',
								isOpen: !outOfBounds(x + 1, y) && previous[y][x].intersectionStates[IntersectionDirection.Right] && previous[y][x + 1].intersectionStates[IntersectionDirection.Right]
							},
							// Right-side up
							{
								x: x + 1,
								y: y - 1,
								pipe: 'bottomPipe',
								pipeCapacity: 'bottomPipeCapacity',
								isOpen: !outOfBounds(x + 1, y) && previous[y][x].intersectionStates[IntersectionDirection.Right] && previous[y][x + 1].intersectionStates[IntersectionDirection.Top]
							},
						] : [
							// Top-side left
							{
								x: x - 1,
								y: y,
								pipe: 'rightPipe',
								pipeCapacity: 'rightPipeCapacity',
								isOpen: previous[y][x].intersectionStates[IntersectionDirection.Bottom] && previous[y][x].intersectionStates[IntersectionDirection.Left]
							},
							// Top-side up
							{
								x: x,
								y: y - 1,
								pipe: 'bottomPipe',
								pipeCapacity: 'bottomPipeCapacity',
								isOpen: previous[y][x].intersectionStates[IntersectionDirection.Bottom] && previous[y][x].intersectionStates[IntersectionDirection.Top]
							},
							// Top-side right
							{
								x: x,
								y: y,
								pipe: 'rightPipe',
								pipeCapacity: 'rightPipeCapacity',
								isOpen: previous[y][x].intersectionStates[IntersectionDirection.Bottom] && previous[y][x].intersectionStates[IntersectionDirection.Right]
							},

							// Bottom-side bottom
							{
								x: x,
								y: y + 1,
								pipe: 'bottomPipe',
								pipeCapacity: 'bottomPipeCapacity',
								isOpen: !outOfBounds(x, y + 1) && previous[y + 1][x].intersectionStates[IntersectionDirection.Top] && previous[y + 1][x].intersectionStates[IntersectionDirection.Bottom]
							},
							// Bottom-side left
							{
								x: x - 1,
								y: y + 1,
								pipe: 'rightPipe',
								pipeCapacity: 'rightPipeCapacity',
								isOpen: !outOfBounds(x, y + 1) && previous[y + 1][x].intersectionStates[IntersectionDirection.Top] && previous[y + 1][x].intersectionStates[IntersectionDirection.Left]
							},
							// Bottom-side right
							{
								x: x,
								y: y + 1,
								pipe: 'rightPipe',
								pipeCapacity: 'rightPipeCapacity',
								isOpen: !outOfBounds(x, y + 1) && previous[y + 1][x].intersectionStates[IntersectionDirection.Top] && previous[y + 1][x].intersectionStates[IntersectionDirection.Right]
							},
						];

					// Let's limit our gloop movement to max 1 per room for now
					candidates = candidates.filter(candidate =>
						!outOfBounds(candidate.x, candidate.y)
						&& ship.roomHandles[candidate.y][candidate.x].data[candidate.pipe] < ship.roomHandles[candidate.y][candidate.x].data[candidate.pipeCapacity]
						&& candidatePressure(candidate) < (ship.roomHandles[y][x].data[pipe] / ship.roomHandles[y][x].data[pipeCapacity])
						&& candidate.isOpen
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
						ship.roomHandles[y][x].data[pipe] -= 1;
					}
				}
			}

			const feature = ship.roomHandles[y][x].data.feature;
			if (feature.type === 'source' || (feature.type === 'sink' && feature.state === 'releasing')) {
				let gloopLeft = Math.min(feature.storage, feature.releaseSpeed);
				let candidates = [
					// Bottom
					{
						x: x,
						y: y,
						pipe: 'bottomPipe',
						pipeCapacity: 'bottomPipeCapacity',
						isOpen: previous[y][x].intersectionStates[IntersectionDirection.Bottom]
					},
					// Left
					{
						x: x - 1,
						y: y,
						pipe: 'rightPipe',
						pipeCapacity: 'rightPipeCapacity',
						isOpen: previous[y][x].intersectionStates[IntersectionDirection.Left]
					},
					// Top
					{
						x: x,
						y: y - 1,
						pipe: 'bottomPipe',
						pipeCapacity: 'bottomPipeCapacity',
						isOpen: previous[y][x].intersectionStates[IntersectionDirection.Top]
					},
					// Right
					{
						x: x,
						y: y,
						pipe: 'rightPipe',
						pipeCapacity: 'rightPipeCapacity',
						isOpen: previous[y][x].intersectionStates[IntersectionDirection.Right]
					},
				];
				while (candidates.length > 0 && gloopLeft > 0) {
					candidates = candidates.filter(candidate =>
						!outOfBounds(candidate.x, candidate.y)
						&& ship.roomHandles[candidate.y][candidate.x].data[candidate.pipe] < ship.roomHandles[candidate.y][candidate.x].data[candidate.pipeCapacity]
						&& candidate.isOpen
					);
					if (candidates.length > 0) {
						candidates = candidates.sort(
							(a, b) => candidatePressure(a) - candidatePressure(b)
						);
						ship.roomHandles[candidates[0].y][candidates[0].x].data[candidates[0].pipe] += 1;
						gloopLeft -= 1;
						feature.storage -= 1;
					}
				}
			}

			if (feature.type === 'sink') {
				if (feature.state === 'requesting') {
					let gloopToConsume = 1;
					let candidates = [
						// Bottom
						{
							x: x,
							y: y,
							pipe: 'bottomPipe',
							pipeCapacity: 'bottomPipeCapacity',
							isOpen: previous[y][x].intersectionStates[IntersectionDirection.Bottom]
						},
						// Left
						{
							x: x - 1,
							y: y,
							pipe: 'rightPipe',
							pipeCapacity: 'rightPipeCapacity',
							isOpen: previous[y][x].intersectionStates[IntersectionDirection.Left]
						},
						// Top
						{
							x: x,
							y: y - 1,
							pipe: 'bottomPipe',
							pipeCapacity: 'bottomPipeCapacity',
							isOpen: previous[y][x].intersectionStates[IntersectionDirection.Top]
						},
						// Right
						{
							x: x,
							y: y,
							pipe: 'rightPipe',
							pipeCapacity: 'rightPipeCapacity',
							isOpen: previous[y][x].intersectionStates[IntersectionDirection.Right]
						},
					];
					while (candidates.length > 0 && gloopToConsume > 0) {
						candidates = candidates.filter(candidate =>
							!outOfBounds(candidate.x, candidate.y)
							&& ship.roomHandles[candidate.y][candidate.x].data[candidate.pipe] > 0
							&& candidate.isOpen
						);
						if (candidates.length > 0) {
							candidates = candidates.sort(
								(a, b) => candidatePressure(a) - candidatePressure(b)
							);
							ship.roomHandles[candidates[0].y][candidates[0].x].data[candidates[0].pipe] -= 1;
							gloopToConsume -= 1;
							feature.storage += 1;
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
}
