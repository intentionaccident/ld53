import {Ship} from "./types/Ship";
import {SINK_BUSY_TIME} from "./constants";

export function updateRooms(delta: number, ship: Ship, setGloopAmount, setLandingGearFuel) {
	const previous = ship.roomHandles.map(row => row.map(row => row.data))
	for (let y = 0; y < ship.roomHandles.length; y++)
	for (let x = 0; x < ship.roomHandles[y].length; x++){
		ship.roomHandles[y][x].data = { ...previous[y][x] };

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
							isOpen: previous[y][x].rightOpen && previous[y][x].bottomOpen
						},
						// Left-side left
						{
							x: x - 1,
							y: y,
							pipe: 'rightPipe',
							pipeCapacity: 'rightPipeCapacity',
							isOpen: previous[y][x].rightOpen && previous[y][x].leftOpen
						},
						// Left-side up
						{
							x: x,
							y: y - 1,
							pipe: 'bottomPipe',
							pipeCapacity: 'bottomPipeCapacity',
							isOpen: previous[y][x].rightOpen && previous[y][x].topOpen
						},

						// Right-side bottom
						{
							x: x + 1,
							y: y,
							pipe: 'bottomPipe',
							pipeCapacity: 'bottomPipeCapacity',
							isOpen: previous[y][x + 1].rightOpen && previous[y][x + 1].bottomOpen
						},
						// Right-side right
						{
							x: x + 1,
							y: y,
							pipe: 'rightPipe',
							pipeCapacity: 'rightPipeCapacity',
							isOpen: previous[y][x + 1].rightOpen && previous[y][x + 1].rightOpen
						},
						// Right-side up
						{
							x: x + 1,
							y: y - 1,
							pipe: 'bottomPipe',
							pipeCapacity: 'bottomPipeCapacity',
							isOpen: previous[y][x + 1].rightOpen && previous[y][x + 1].topOpen
						},
					] : [
						// Top-side left
						{
							x: x - 1,
							y: y,
							pipe: 'rightPipe',
							pipeCapacity: 'rightPipeCapacity',
							isOpen: previous[y][x].bottomOpen && previous[y][x].leftOpen
						},
						// Top-side up
						{
							x: x,
							y: y - 1,
							pipe: 'bottomPipe',
							pipeCapacity: 'bottomPipeCapacity',
							isOpen: previous[y][x].bottomOpen && previous[y][x].topOpen
						},
						// Top-side right
						{
							x: x,
							y: y,
							pipe: 'rightPipe',
							pipeCapacity: 'rightPipeCapacity',
							isOpen: previous[y][x].bottomOpen && previous[y][x].rightOpen
						},

						// Bottom-side bottom
						{
							x: x,
							y: y + 1,
							pipe: 'bottomPipe',
							pipeCapacity: 'bottomPipeCapacity',
							isOpen: previous[y + 1][x].topOpen && previous[y + 1][x].bottomOpen
						},
						// Bottom-side left
						{
							x: x - 1,
							y: y + 1,
							pipe: 'rightPipe',
							pipeCapacity: 'rightPipeCapacity',
							isOpen: previous[y + 1][x].topOpen && previous[y + 1][x].leftOpen
						},
						// Bottom-side right
						{
							x: x,
							y: y + 1,
							pipe: 'rightPipe',
							pipeCapacity: 'rightPipeCapacity',
							isOpen: previous[y + 1][x].topOpen && previous[y + 1][x].rightOpen
						},
					];

				// Let's limit our water movement to max 1 per room for now
				candidates = candidates.filter(candidate =>
					candidate.x >= 0 && candidate.x < 6 && candidate.y >= 0 && candidate.y < 4
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
			let waterLeft = Math.min(feature.storage, feature.releaseSpeed);
			let candidates = [
				// Bottom
				{
					x: x,
					y: y,
					pipe: 'bottomPipe',
					pipeCapacity: 'bottomPipeCapacity',
					isOpen: previous[y][x].bottomOpen
				},
				// Left
				{
					x: x - 1,
					y: y,
					pipe: 'rightPipe',
					pipeCapacity: 'rightPipeCapacity',
					isOpen: previous[y][x].leftOpen
				},
				// Top
				{
					x: x,
					y: y - 1,
					pipe: 'bottomPipe',
					pipeCapacity: 'bottomPipeCapacity',
					isOpen: previous[y][x].topOpen
				},
				// Right
				{
					x: x,
					y: y,
					pipe: 'rightPipe',
					pipeCapacity: 'rightPipeCapacity',
					isOpen: previous[y][x].rightOpen
				},
			];
			while (candidates.length > 0 && waterLeft > 0) {
				candidates = candidates.filter(candidate =>
					candidate.x >= 0 && candidate.x < 6 && candidate.y >= 0 && candidate.y < 4
					&& ship.roomHandles[candidate.y][candidate.x].data[candidate.pipe] < ship.roomHandles[candidate.y][candidate.x].data[candidate.pipeCapacity]
					&& candidate.isOpen
				);
				if (candidates.length > 0) {
					candidates = candidates.sort(
						(a, b) => candidatePressure(a) - candidatePressure(b)
					);
					ship.roomHandles[candidates[0].y][candidates[0].x].data[candidates[0].pipe] += 1;
					waterLeft -= 1;
					feature.storage -= 1;
				}
			}
		}

		if (feature.type === 'sink') {
			if (feature.state === 'requesting') {
				let waterToConsume = 1;
				let candidates = [
					// Bottom
					{
						x: x,
						y: y,
						pipe: 'bottomPipe',
						pipeCapacity: 'bottomPipeCapacity',
						isOpen: previous[y][x].bottomOpen
					},
					// Left
					{
						x: x - 1,
						y: y,
						pipe: 'rightPipe',
						pipeCapacity: 'rightPipeCapacity',
						isOpen: previous[y][x].leftOpen
					},
					// Top
					{
						x: x,
						y: y - 1,
						pipe: 'bottomPipe',
						pipeCapacity: 'bottomPipeCapacity',
						isOpen: previous[y][x].topOpen
					},
					// Right
					{
						x: x,
						y: y,
						pipe: 'rightPipe',
						pipeCapacity: 'rightPipeCapacity',
						isOpen: previous[y][x].rightOpen
					},
				];
				while (candidates.length > 0 && waterToConsume > 0) {
					candidates = candidates.filter(candidate =>
						candidate.x >= 0 && candidate.x < 6 && candidate.y >= 0 && candidate.y < 4
						&& ship.roomHandles[candidate.y][candidate.x].data[candidate.pipe] > 0
						&& candidate.isOpen
					);
					if (candidates.length > 0) {
						candidates = candidates.sort(
							(a, b) => candidatePressure(a) - candidatePressure(b)
						);
						ship.roomHandles[candidates[0].y][candidates[0].x].data[candidates[0].pipe] -= 1;
						waterToConsume -= 1;
						feature.storage += 1;
					}
				}
				if (feature.storage >= feature.capacity) {
					feature.state = 'busy';
					feature.timeLeft = SINK_BUSY_TIME[feature.subtype];
				}
			} else if (feature.state === 'busy') {
				feature.timeLeft -= delta;
				if (feature.timeLeft <= 0) {
					feature.state = 'done';
				}
			} else if (feature.state === 'releasing' && feature.storage === 0) {
				feature.state = 'idle';
			}
		}
	}
}
