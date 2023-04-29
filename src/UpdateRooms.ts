import {Ship} from "./types/Ship";

export function updateRooms(ship: Ship, setGloopAmount, setLandingGearFuel) {
	const previous = ship.roomHandles.map(row => row.map(row => row.data))
	for (let x = 0; x < 6; x++) {
		for (let y = 0; y < 4; y++) {
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
								isOpen: previous[y][x].bottomOpen
							},
							// Left-side left
							{
								x: x - 1,
								y: y,
								pipe: 'rightPipe',
								pipeCapacity: 'rightPipeCapacity',
								isOpen: previous[y][x].leftOpen
							},
							// Left-side up
							{
								x: x,
								y: y - 1,
								pipe: 'bottomPipe',
								pipeCapacity: 'bottomPipeCapacity',
								isOpen: previous[y][x].topOpen
							},

							// Right-side bottom
							{
								x: x + 1,
								y: y,
								pipe: 'bottomPipe',
								pipeCapacity: 'bottomPipeCapacity',
								isOpen: previous[y][x + 1].bottomOpen
							},
							// Right-side right
							{
								x: x + 1,
								y: y,
								pipe: 'rightPipe',
								pipeCapacity: 'rightPipeCapacity',
								isOpen: previous[y][x + 1].rightOpen
							},
							// Right-side up
							{
								x: x + 1,
								y: y - 1,
								pipe: 'bottomPipe',
								pipeCapacity: 'bottomPipeCapacity',
								isOpen: previous[y][x + 1].topOpen
							},
						] : [
							// Top-side left
							{
								x: x - 1,
								y: y,
								pipe: 'rightPipe',
								pipeCapacity: 'rightPipeCapacity',
								isOpen: previous[y][x].leftOpen
							},
							// Top-side up
							{
								x: x,
								y: y - 1,
								pipe: 'bottomPipe',
								pipeCapacity: 'bottomPipeCapacity',
								isOpen: previous[y][x].topOpen
							},
							// Top-side right
							{
								x: x,
								y: y,
								pipe: 'rightPipe',
								pipeCapacity: 'rightPipeCapacity',
								isOpen: previous[y][x].rightOpen
							},

							// Bottom-side bottom
							{
								x: x,
								y: y + 1,
								pipe: 'bottomPipe',
								pipeCapacity: 'bottomPipeCapacity',
								isOpen: previous[y + 1][x].bottomOpen
							},
							// Bottom-side left
							{
								x: x - 1,
								y: y + 1,
								pipe: 'rightPipe',
								pipeCapacity: 'rightPipeCapacity',
								isOpen: previous[y + 1][x].leftOpen
							},
							// Bottom-side right
							{
								x: x,
								y: y + 1,
								pipe: 'rightPipe',
								pipeCapacity: 'rightPipeCapacity',
								isOpen: previous[y + 1][x].rightOpen
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

			if (previous[y][x].feature === 'source') {
				let waterLeft = ship.gloopAmount - 2 >= 0 ? 2 : 0;
				ship.gloopAmount -= waterLeft;
				setGloopAmount(ship.gloopAmount);
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
					}
				}
			}

			if (previous[y][x].feature === 'sink') {
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
					}
				}
			}

			if (previous[y][x].feature === 'landingGear' && ship.landingGearFuel < ship.requiredLandingGearFuel) {
				let gloopToConsume = 1;
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
				while (candidates.length > 0 && gloopToConsume > 0) {
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
						gloopToConsume -= 1;
						ship.landingGearFuel += 1;
					}
				}
			}
			setLandingGearFuel(ship.landingGearFuel);
		}
	}
}