import * as React from "react";
import {useEffect, useState} from "react";
import * as PIXI from "pixi.js";
import {Application} from "pixi.js";
import {GameFrame} from "./GameFrame";
import {UIRoot} from "./UIRoot";
import {PixiRoot} from "./PixiRoot";
import {RoomHandle} from "./types/RoomHandle";
import {drawRoom} from "./draw/drawRoom";
import {INTERSECTION_RADIUS, slantedness, tileSize} from "./constants";
import {processEvents} from "./ProcessEvents";
import {updateRooms} from "./UpdateRooms";
import {Ship} from "./types/Ship";
import {shipLayout} from "./shipLayout";

const app = new Application({
	width: 640,
	height: 480,
	antialias: true
});

const shipContainer = new PIXI.Container();
shipContainer.x = 128;
shipContainer.y = 32;
app.stage.addChild(shipContainer);

const backgroundContainer = new PIXI.Container();
shipContainer.addChild(backgroundContainer);

const foregroundContainer = new PIXI.Container();
shipContainer.addChild(foregroundContainer);

const ship: Ship = {
	gloopAmount: 100,
	landingGearFuel: 0,
	requiredLandingGearFuel: 50,
	eventQueue: [],
	roomHandles: shipLayout.map((layoutRow, y) =>
		layoutRow.map((layout, x) => {
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
				-tileSize * slantedness, tileSize,
			]);
			roomGraphics.endFill();

			const pipeGraphics = new PIXI.Container();
			foregroundContainer.addChild(pipeGraphics)
			pipeGraphics.x = -y * tileSize * slantedness + x * tileSize + tileSize / 2 - tileSize * slantedness / 2;
			pipeGraphics.y = y * tileSize + tileSize / 2;

			const verticalPipe = new PIXI.Graphics();
			const horizontalPipe = new PIXI.Graphics();
			const intersection = new PIXI.Graphics();
			const feature = new PIXI.Graphics();
			pipeGraphics.addChild(
				feature,
				verticalPipe,
				horizontalPipe,
				intersection,
			)

			intersection.on('rightdown', (event) => {
				ship.eventQueue.push({type: 'CounterRotateIntersection', x, y});
			});
			intersection.on('mousedown', (event) => {
				console.log(event)
				if (event.button === 0) {
					ship.eventQueue.push({type: 'RotateIntersection', x, y});
				}
			})
			intersection.interactive = true;
			intersection.cursor = 'pointer';
			feature.on('mousedown', (event) => {
				ship.eventQueue.push({type: 'FeatureClicked', x, y});
			});
			feature.interactive = true
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

					topOpen: ['+', '|'].includes(layout.i),
					bottomOpen: ['+', '|', '>', '<'].includes(layout.i),
					leftOpen: ['+', '-', '>'].includes(layout.i),
					rightOpen: ['+', '-', '<'].includes(layout.i),
					roomOpen: true,

					feature:  ({
						'+': {type: 'source', queued: 0},
						'-': {type: 'sink', storage: 0, capacity: 10},
						'undefined': {type: 'empty'}
					})[layout.f]
				},
				graphics: {
					pipes: pipeGraphics,
					room: roomGraphics,
					verticalPipe,
					horizontalPipe,
					intersection,
					source: feature,
				}
			} as RoomHandle;
		})
	)
}

let elapsedTimeBetweenGloopMovement = 0;
const gloopMovementInterval = 25;
const roomHandlesDrawQueue = ship.roomHandles.flat().reverse();

export function Root() {
	const [gloopAmountValue, setGloopAmount] = useState(100);
	const [landingGearFuelValue, setLandingGearFuel] = useState(0);

	useEffect(() => {
		const keyDownListener = (event) => {
			ship.eventQueue.push({ type: 'KeyPressed', key: event.key });
		};

		const gameLoop = (delta) => {
			processEvents(ship, setGloopAmount);

			elapsedTimeBetweenGloopMovement += delta;

			if (elapsedTimeBetweenGloopMovement > gloopMovementInterval) {
				elapsedTimeBetweenGloopMovement = 0;
				updateRooms(ship, setGloopAmount, setLandingGearFuel)
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
			<UIRoot gloopAmount={gloopAmountValue} landingGearFuel={landingGearFuelValue} requiredLandingGearFuel={ship.requiredLandingGearFuel} />
		</GameFrame>
	</div>;
}
