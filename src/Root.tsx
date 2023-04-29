import * as React from "react";
import { Application } from "pixi.js";
import { GameFrame } from "./GameFrame";
import { UIRoot } from "./UIRoot";
import { PixiRoot } from "./PixiRoot";
import { useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import { RoomHandle } from "./types/RoomHandle";
import { drawRoom } from "./draw/drawRoom";
import { tileSize, slantedness, INTERSECTION_RADIUS } from "./constants";

const app = new Application({
	width: 640,
	height: 480,
	antialias: true
});


// TODO: Use Discriminating Unions for `GameEvent`s
interface GameEvent {
	type: 'KeyPressed' | 'KeyReleased' | 'RotateIntersection' | 'CounterRotateIntersection',
	key?: string,
	x?: number,
	y?: number,
}

type RoomFeature = 'source' | 'sink' | 'landingGear' | null;

export interface Room {
	bottomPipe: number;
	bottomPipeCapacity: number;
	rightPipe: number;
	rightPipeCapacity: number;

	topOpen: boolean;
	bottomOpen: boolean;
	leftOpen: boolean;
	rightOpen: boolean;
	roomOpen: boolean;

	feature: RoomFeature;
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

		const pipeGraphics = new PIXI.Container();
		foregroundContainer.addChild(pipeGraphics)
		pipeGraphics.x = -y * tileSize * slantedness + x * tileSize + tileSize / 2 - tileSize * slantedness / 2;
		pipeGraphics.y = y * tileSize + tileSize / 2;

		const verticalPipe = new PIXI.Graphics();
		const horizontalPipe = new PIXI.Graphics();
		const intersection = new PIXI.Graphics();
		const source = new PIXI.Graphics();
		pipeGraphics.addChild(
			source,
			verticalPipe,
			horizontalPipe,
			intersection,
		)

		intersection.on('rightdown', (event) => {
			eventQueue.push({ type: 'CounterRotateIntersection', x, y });
		});
		intersection.on('mousedown', (event) => {
			console.log(event)
			if (event.button === 0) {
				eventQueue.push({ type: 'RotateIntersection', x, y });
			}
		})
		intersection.interactive = true;
		intersection.cursor = 'pointer';
		source.on('mousedown', (event) => console.log("source", event))
		source.interactive = true
		verticalPipe.on('mousedown', (event) => console.log("verticalPipe", event))
		verticalPipe.hitArea = new PIXI.Polygon([
			-INTERSECTION_RADIUS, INTERSECTION_RADIUS,
			INTERSECTION_RADIUS, INTERSECTION_RADIUS,
			INTERSECTION_RADIUS - tileSize * slantedness, tileSize - INTERSECTION_RADIUS,
			-INTERSECTION_RADIUS - tileSize * slantedness, tileSize - INTERSECTION_RADIUS,
		])
		verticalPipe.interactive = true

		horizontalPipe.on('mousedown', (event) => console.log("horizontalPipe", event))
		horizontalPipe.hitArea = new PIXI.Polygon([
			INTERSECTION_RADIUS, -INTERSECTION_RADIUS,
			tileSize - INTERSECTION_RADIUS, -INTERSECTION_RADIUS,
			tileSize - INTERSECTION_RADIUS, INTERSECTION_RADIUS,
			INTERSECTION_RADIUS, INTERSECTION_RADIUS,
		])
		horizontalPipe.interactive = true

		return {
			coordinate: new PIXI.Point(x, y),
			data: {
				bottomPipe: 0,
				bottomPipeCapacity: y == 3 ? 0 : 5,
				rightPipe: 0,
				rightPipeCapacity: x == 5 ? 0 : 5,

				topOpen: y != 1,
				bottomOpen: true,
				leftOpen: x != 1,
				rightOpen: true,
				roomOpen: true,

				feature: x == 1 && y == 1
					? 'source'
					: (x == 4 && y == 3
						? 'sink' : (x == 2 && y == 3) ? 'landingGear' : null)
			},
			graphics: {
				pipes: pipeGraphics,
				room: roomGraphics,
				verticalPipe,
				horizontalPipe,
				intersection,
				source,
			}
		} as RoomHandle;
	})
);
const eventQueue: GameEvent[] = [];
const roomHandlesDrawQueue = roomHandles.flat().reverse()
let gloopAmount = 100;
let landingGearFuel = 0;
const requiredLandingGearFuel = 50;
let elapsedTimeBetweenGloopMovement = 0;
let gloopMovementInterval = 25;

export function Root() {
	const [gloopAmountValue, setGloopAmount] = useState(100);
	const [landingGearFuelValue, setLandingGearFuel] = useState(0);

	useEffect(() => {
		const keyDownListener = (event) => {
			eventQueue.push({ type: 'KeyPressed', key: event.key });
		};

		const gameLoop = (delta) => {
			while (eventQueue.length > 0) {
				const event = eventQueue.pop();
				if (event.type === 'KeyPressed' && event.key == ' ') {
					gloopAmount += 10;
					setGloopAmount(gloopAmount);
				} else if (event.type === 'RotateIntersection') {
					const room = roomHandles[event.y][event.x];
					const previousTop = room.data.topOpen;
					room.data.topOpen = room.data.leftOpen;
					room.data.leftOpen = room.data.bottomOpen;
					room.data.bottomOpen = room.data.rightOpen;
					room.data.rightOpen = previousTop;
				} else if (event.type === 'CounterRotateIntersection') {
					const room = roomHandles[event.y][event.x];
					const previousTop = room.data.topOpen;
					room.data.topOpen = room.data.rightOpen;
					room.data.rightOpen = room.data.bottomOpen;
					room.data.bottomOpen = room.data.leftOpen;
					room.data.leftOpen = previousTop;
				}
			}

			elapsedTimeBetweenGloopMovement += delta;

			if (elapsedTimeBetweenGloopMovement > gloopMovementInterval) {
				elapsedTimeBetweenGloopMovement = 0;
				const previous = roomHandles.map(row => row.map(row => row.data))
				for (let x = 0; x < 6; x++) {
					for (let y = 0; y < 4; y++) {
						roomHandles[y][x].data = { ...previous[y][x] };

						const candidatePressure = candidate =>
							roomHandles[candidate.y][candidate.x].data[candidate.pipe] / roomHandles[candidate.y][candidate.x].data[candidate.pipeCapacity];

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

						if (previous[y][x].feature === 'source') {
							let waterLeft = gloopAmount - 2 >= 0 ? 2 : 0;
							gloopAmount -= waterLeft;
							setGloopAmount(gloopAmount);
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
									&& roomHandles[candidate.y][candidate.x].data[candidate.pipe] > 0
									&& candidate.isOpen
								);
								if (candidates.length > 0) {
									candidates = candidates.sort(
										(a, b) => candidatePressure(a) - candidatePressure(b)
									);
									roomHandles[candidates[0].y][candidates[0].x].data[candidates[0].pipe] -= 1;
									waterToConsume -= 1;
								}
							}
						}

						if (previous[y][x].feature === 'landingGear' && landingGearFuel < requiredLandingGearFuel) {
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
									&& roomHandles[candidate.y][candidate.x].data[candidate.pipe] > 0
									&& candidate.isOpen
								);
								if (candidates.length > 0) {
									candidates = candidates.sort(
										(a, b) => candidatePressure(a) - candidatePressure(b)
									);
									roomHandles[candidates[0].y][candidates[0].x].data[candidates[0].pipe] -= 1;
									gloopToConsume -= 1;
									landingGearFuel += 1;
								}
							}
						}
						setLandingGearFuel(landingGearFuel);
					}
				}
			}

			for (const room of roomHandlesDrawQueue)
				drawRoom(room)
		};

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
			<UIRoot gloopAmount={gloopAmountValue} landingGearFuel={landingGearFuelValue} requiredLandingGearFuel={requiredLandingGearFuel} />
		</GameFrame>
	</div>;
}
