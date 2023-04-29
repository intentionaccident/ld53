import * as React from "react";
import { Application, Graphics, Sprite, Texture } from "pixi.js";
import { GameFrame } from "./GameFrame";
import { UIRoot } from "./UIRoot";
import { PixiRoot } from "./PixiRoot";
import { useEffect, useState } from "react";
import * as PIXI from "pixi.js";

const app = new Application({
	width: 640,
	height: 480,
	antialias: true
});

const tileSize = 64;
const slantedness = 0.5;
const INTERSECTION_RADIUS = 8;

// TODO: Use Discriminating Unions for `GameEvent`s
interface GameEvent {
	type: 'KeyPressed' | 'KeyReleased',
	name: string
}

interface RoomHandle {
	coordinate: PIXI.Point
	data: Room
	graphics: {
		room: PIXI.Graphics
		pipes: PIXI.Graphics
	}
}

interface Room {
	bottomPipe: number;
	bottomPipeCapacity: number;
	rightPipe: number;
	rightPipeCapacity: number;

	topOpen: boolean;
	bottomOpen: boolean;
	leftOpen: boolean;
	rightOpen: boolean;
	roomOpen: boolean;

	isSource: boolean;
}

function DrawRoom(room: RoomHandle) {
	const graphics = room.graphics.pipes;

	graphics.clear();
	// Draw intersection dot
	graphics.beginFill(room.data.isSource ? 0x009999 : 0x999999);
	graphics.lineStyle(4, 0x00FFFF, 1);
	graphics.drawCircle(0, 0, 8);
	graphics.endFill();

	// Draw bottom pipe
	if (room.data.bottomPipeCapacity > 0) {
		graphics.beginFill(0x009999, room.data.bottomPipe / room.data.bottomPipeCapacity);
		graphics.lineStyle(4, 0x333333, 1);
		graphics.drawPolygon([
			0, INTERSECTION_RADIUS,
			INTERSECTION_RADIUS, INTERSECTION_RADIUS,
			INTERSECTION_RADIUS - (tileSize - INTERSECTION_RADIUS * 2) * slantedness, tileSize - INTERSECTION_RADIUS * 2,
			0 - (tileSize - INTERSECTION_RADIUS * 2) * slantedness, tileSize - INTERSECTION_RADIUS * 2,
		]);
		graphics.endFill();
	}

	// Draw right pipe
	if (room.data.rightPipeCapacity > 0) {
		graphics.beginFill(0x009999, room.data.rightPipe / room.data.rightPipeCapacity);
		graphics.lineStyle(4, 0x333333, 1);
		graphics.drawPolygon([
			20, 0,
			20, 10,
			65, 10,
			65, 0
		]);
		graphics.endFill();
	}
}

const shipContainer = new PIXI.Container();
shipContainer.x = 128;
shipContainer.y = 32;
app.stage.addChild(shipContainer);

const backgroundContainer = new PIXI.Container();
shipContainer.addChild(backgroundContainer);

const foregroundContainer = new PIXI.Container();
shipContainer.addChild(foregroundContainer);


const roomHandles: RoomHandle[][] = Array.from({ length: 4 }, (_, y) =>
	Array.from({ length: 6 }, (_, x) => {
		const roomGraphics = new PIXI.Graphics();
		roomGraphics.x = -y * tileSize * slantedness + x * tileSize;
		roomGraphics.y = y * tileSize;
		backgroundContainer.addChild(roomGraphics)

		roomGraphics.clear();

		roomGraphics.beginFill(0x999999);
		roomGraphics.lineStyle(4, 0xFFFFFF, 1);
		roomGraphics.drawPolygon([
			0, 0,
			tileSize, 0,
			tileSize - tileSize * slantedness, tileSize,
			- tileSize * slantedness, tileSize,
		]);
		roomGraphics.endFill();

		const pipeGraphics = new PIXI.Graphics();
		foregroundContainer.addChild(pipeGraphics)
		pipeGraphics.x = -y * tileSize * slantedness + x * tileSize + tileSize / 2 - tileSize * slantedness / 2;
		pipeGraphics.y = y * tileSize + tileSize / 2;

		return {
			coordinate: new PIXI.Point(x, y),
			data: {
				bottomPipe: 0,
				bottomPipeCapacity: y == 3 ? 0 : 5,
				rightPipe: 0,
				rightPipeCapacity: x == 5 ? 0 : 5,

				topOpen: y != 1,
				bottomOpen: y != 2,
				leftOpen: x != 1,
				rightOpen: x != 3,
				roomOpen: true,

				isSource: x == 1 && y == 1,
			},
			graphics: {
				pipes: pipeGraphics,
				room: roomGraphics,
			}
		} as RoomHandle;
	})
);
const eventQueue: GameEvent[] = [];

const roomHandlesDrawQueue = roomHandles.flat().reverse()

export function Root() {
	const [lastPressedKey, setLastPressedKey] = useState('');

	useEffect(() => {
		const keyDownListener = (event) => {
			const name = event.key;
			eventQueue.push({ type: 'KeyPressed', name });
		};

		const gameLoop = (delta) => {
			while (eventQueue.length > 0) {
				const event = eventQueue.pop();
				if (event.type === 'KeyPressed') {
					setLastPressedKey(event.name);
				}
			}

			const previous = roomHandles.map(row => row.map(row => row.data))
			for (let x = 0; x < 6; x++) {
				for (let y = 0; y < 4; y++) {
					roomHandles[y][x].data = { ...previous[y][x] };

					const candidatePressure = candidate =>
						roomHandles[candidate.y][candidate.x].data[candidate.pipe] / roomHandles[candidate.y][candidate.x].data[candidate.pipeCapacity];

					for (let [pipe, pipeCapacity] of [['rightPipe', 'rightPipeCapacity'], ['bottomPipe', 'bottomPipeCapacity']]) {
						console.assert(previous[y][x][pipe] <= previous[y][x][pipeCapacity]);
						if (previous[y][x][pipe] > 1) {
							// TODO: Check for intersection openness
							let candidates =
								pipe == 'rightPipe' ? [
									// Left-side bottom
									{ x: x, y: y, pipe: 'bottomPipe', pipeCapacity: 'bottomPipeCapacity', isOpen: previous[y][x].bottomOpen },
									// Left-side left
									{ x: x - 1, y: y, pipe: 'rightPipe', pipeCapacity: 'rightPipeCapacity', isOpen: previous[y][x].leftOpen },
									// Left-side up
									{ x: x, y: y - 1, pipe: 'bottomPipe', pipeCapacity: 'bottomPipeCapacity', isOpen: previous[y][x].topOpen },

									// Right-side bottom
									{ x: x + 1, y: y, pipe: 'bottomPipe', pipeCapacity: 'bottomPipeCapacity', isOpen: previous[y][x + 1].bottomOpen },
									// Right-side right
									{ x: x + 1, y: y, pipe: 'rightPipe', pipeCapacity: 'rightPipeCapacity', isOpen: previous[y][x + 1].rightOpen },
									// Right-side up
									{ x: x + 1, y: y - 1, pipe: 'bottomPipe', pipeCapacity: 'bottomPipeCapacity', isOpen: previous[y][x + 1].topOpen },
								] : [
									// Top-side left
									{ x: x - 1, y: y, pipe: 'rightPipe', pipeCapacity: 'rightPipeCapacity', isOpen: previous[y][x].leftOpen },
									// Top-side up
									{ x: x, y: y - 1, pipe: 'bottomPipe', pipeCapacity: 'bottomPipeCapacity', isOpen: previous[y][x].topOpen },
									// Top-side right
									{ x: x, y: y, pipe: 'rightPipe', pipeCapacity: 'rightPipeCapacity', isOpen: previous[y][x].rightOpen },

									// Bottom-side bottom
									{ x: x, y: y + 1, pipe: 'bottomPipe', pipeCapacity: 'bottomPipeCapacity', isOpen: previous[y + 1][x].bottomOpen },
									// Bottom-side left
									{ x: x - 1, y: y + 1, pipe: 'rightPipe', pipeCapacity: 'rightPipeCapacity', isOpen: previous[y + 1][x].leftOpen },
									// Bottom-side right
									{ x: x, y: y + 1, pipe: 'rightPipe', pipeCapacity: 'rightPipeCapacity', isOpen: previous[y + 1][x].rightOpen },
								];

							// Let's limit our water movement to max 1 per room for now
							candidates = candidates.filter(candidate =>
								candidate.x >= 0 && candidate.x < 6 && candidate.y >= 0 && candidate.y < 4
								&& roomHandles[candidate.y][candidate.x].data[candidate.pipe] < roomHandles[candidate.y][candidate.x].data[candidate.pipeCapacity]
								&& candidatePressure(candidate) < (roomHandles[y][x].data[pipe] / roomHandles[y][x].data[pipeCapacity])
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
								roomHandles[candidate.y][candidate.x].data[candidate.pipe] += 1;
								roomHandles[y][x].data[pipe] -= 1;
							}
						}
					}

					if (previous[y][x].isSource) {
						let waterLeft = 2;
						let candidates = [
							// Bottom
							{ x: x, y: y, pipe: 'bottomPipe', pipeCapacity: 'bottomPipeCapacity', isOpen: previous[y][x].bottomOpen },
							// Left
							{ x: x - 1, y: y, pipe: 'rightPipe', pipeCapacity: 'rightPipeCapacity', isOpen: previous[y][x].leftOpen },
							// Top
							{ x: x, y: y - 1, pipe: 'bottomPipe', pipeCapacity: 'bottomPipeCapacity', isOpen: previous[y][x].topOpen },
							// Right
							{ x: x, y: y, pipe: 'rightPipe', pipeCapacity: 'rightPipeCapacity', isOpen: previous[y][x].rightOpen },
						];
						while (candidates.length > 0 && waterLeft > 0) {
							candidates = candidates.filter(candidate =>
								candidate.x >= 0 && candidate.x < 6 && candidate.y >= 0 && candidate.y < 4
								&& roomHandles[candidate.y][candidate.x].data[candidate.pipe] < roomHandles[candidate.y][candidate.x].data[candidate.pipeCapacity]
								&& candidate.isOpen
							);
							if (candidates.length > 0) {
								candidates = candidates.sort(
									(a, b) => candidatePressure(a) - candidatePressure(b)
								);
								roomHandles[candidates[0].y][candidates[0].x].data[candidates[0].pipe] += 1;
								waterLeft -= 1;
							}
						}
					}
				}
			}

			for (const room of roomHandlesDrawQueue)
				DrawRoom(room)
		};

		app.ticker.maxFPS = 0.1;
		app.ticker.add(gameLoop);
		window.addEventListener('keydown', keyDownListener, false);
		return () => {
			app.ticker.remove(gameLoop);
			window.removeEventListener('keydown', keyDownListener);
		}
	}, []);

	return <div>
		<GameFrame>
			<PixiRoot app={app} />
			<UIRoot lastPressedKey={lastPressedKey} />
		</GameFrame>
	</div>;
}
