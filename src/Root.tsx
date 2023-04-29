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
		root: PIXI.Container
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
	// Draw intersection dot
	graphics.beginFill(room.data.isSource ? 0x009999 : 0x999999);
	graphics.lineStyle(4, 0x00FFFF, 1);
	graphics.drawCircle(0, 0, 8);
	graphics.endFill();

	// Draw bottom pipe
	if (room.data.bottomPipeCapacity > 0) {
		graphics.beginFill(room.data.rightPipe > 0 ? 0x009999 : 0x999999);
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
		graphics.beginFill(room.data.rightPipe > 0 ? 0x009999 : 0x999999);
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

const roomHandles: RoomHandle[][] = Array.from({ length: 4 }, (_, y) =>
	Array.from({ length: 6 }, (_, x) => {
		const roomContainer = new PIXI.Container();
		shipContainer.addChild(roomContainer)
		roomContainer.x = -y * tileSize * slantedness + x * tileSize;
		roomContainer.y = y * tileSize;

		const roomGraphics = new PIXI.Graphics();
		roomContainer.addChild(roomGraphics)

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
		roomContainer.addChild(pipeGraphics)
		pipeGraphics.x = tileSize / 2 - tileSize * slantedness / 2;
		pipeGraphics.y = tileSize / 2;

		return {
			coordinate: new PIXI.Point(x, y),
			data: {
				bottomPipe: 0,
				bottomPipeCapacity: y == 3 ? 0 : 2,
				rightPipe: 0,
				rightPipeCapacity: x == 5 ? 0 : 2,

				topOpen: true,
				bottomOpen: true,
				leftOpen: true,
				rightOpen: true,
				roomOpen: true,

				isSource: x == 1 && y == 1,
			},
			graphics: {
				pipes: pipeGraphics,
				room: roomGraphics,
				root: roomContainer,
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

					for (let [pipe, pipeCapacity] of [['rightPipe', 'rightPipeCapacity'], ['bottomPipe', 'bottomPipeCapacity']]) {
						console.assert(previous[y][x][pipe] <= previous[y][x][pipeCapacity]);
						if (previous[y][x][pipe] === previous[y][x][pipeCapacity]) {
							// TODO: Check for intersection openness
							const candidates =
								pipe == 'rightPipe' ? [
									// Left-side bottom
									{ x: x, y: y, pipe: 'bottomPipe', pipeCapacity: 'bottomPipeCapacity' },
									// Left-side left
									{ x: x - 1, y: y, pipe: 'rightPipe', pipeCapacity: 'rightPipeCapacity' },
									// Left-side up
									{ x: x, y: y - 1, pipe: 'bottomPipe', pipeCapacity: 'bottomPipeCapacity' },

									// Right-side bottom
									{ x: x + 1, y: y, pipe: 'bottomPipe', pipeCapacity: 'bottomPipeCapacity' },
									// Right-side right
									{ x: x + 1, y: y, pipe: 'rightPipe', pipeCapacity: 'rightPipeCapacity' },
									// Right-side up
									{ x: x + 1, y: y - 1, pipe: 'bottomPipe', pipeCapacity: 'bottomPipeCapacity' },
								] : [
									// Top-side left
									{ x: x - 1, y: y, pipe: 'rightPipe', pipeCapacity: 'rightPipeCapacity' },
									// Top-side up
									{ x: x, y: y - 1, pipe: 'bottomPipe', pipeCapacity: 'bottomPipeCapacity' },
									// Top-side right
									{ x: x, y: y, pipe: 'rightPipe', pipeCapacity: 'rightPipeCapacity' },

									// Bottom-side bottom
									{ x: x, y: y + 1, pipe: 'bottomPipe', pipeCapacity: 'bottomPipeCapacity' },
									// Bottom-side left
									{ x: x - 1, y: y + 1, pipe: 'rightPipe', pipeCapacity: 'rightPipeCapacity' },
									// Bottom-side right
									{ x: x, y: y + 1, pipe: 'rightPipe', pipeCapacity: 'rightPipeCapacity' },
								];

							// TODO: Should run until out of good candidates (candidates where the pressure dictates we move water towards them)
							for (const candidate of candidates) {
								// Break when out of water
								if (roomHandles[y][x].data[pipe] < roomHandles[y][x].data[pipeCapacity]) break;
								// Ignore out of bounds
								if (candidate.x < 0 || candidate.x >= 6 || candidate.y < 0 || candidate.y >= 4) {
									continue;
								}
								if (
									// TODO: Should be comparing pressure here instead
									previous[candidate.y][candidate.x][candidate.pipe] >= previous[candidate.y][candidate.x][candidate.pipeCapacity]
									|| roomHandles[candidate.y][candidate.x].data[candidate.pipe] >= roomHandles[candidate.y][candidate.x].data[candidate.pipeCapacity]
								) {
									continue;
								}
								roomHandles[candidate.y][candidate.x].data[candidate.pipe] += 1;
								roomHandles[y][x].data[pipe] -= 1;
							}
						}
					}

					if (previous[y][x].isSource) {
						let waterLeft = 1;
						// TODO: Check for intersection openness
						const candidates = [
							// Bottom
							{ x: x, y: y, pipe: 'bottomPipe', pipeCapacity: 'bottomPipeCapacity' },
							// Left
							{ x: x - 1, y: y, pipe: 'rightPipe', pipeCapacity: 'rightPipeCapacity' },
							// Top
							{ x: x, y: y - 1, pipe: 'bottomPipe', pipeCapacity: 'bottomPipeCapacity' },
							// Right
							{ x: x, y: y, pipe: 'rightPipe', pipeCapacity: 'rightPipeCapacity' },
						].filter(candidate =>
							candidate.x >= 0 && candidate.x < 6 && candidate.y >= 0 && candidate.y < 4
							&& roomHandles[candidate.y][candidate.x].data[candidate.pipe] < roomHandles[candidate.y][candidate.x].data[candidate.pipeCapacity]
						);
						for (const candidate of candidates) {
							if (waterLeft <= 0) break;
							roomHandles[candidate.y][candidate.x].data[candidate.pipe] += 1;
							waterLeft -= 1;
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
