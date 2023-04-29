import * as React from "react";
import { useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import { GameFrame } from "./GameFrame";
import { UIRoot } from "./UIRoot";
import { PixiRoot } from "./PixiRoot";
import { RoomHandle } from "./types/RoomHandle";
import { drawRoom } from "./draw/drawRoom";
import { processEvents } from "./ProcessEvents";
import { updateRooms } from "./UpdateRooms";
import { Ship } from "./types/Ship";
import { initRoomGraphics } from "./draw/initRoomGraphics";
import { initShipGraphics } from "./initShipGraphics";
import { shipLayout } from "./shipLayout";

export const app = new Application({
	width: 640,
	height: 480,
	antialias: true
});


const shipGraphics = initShipGraphics()

export const ship: Ship = {
	gloopAmount: 100,
	landingGearFuel: 0,
	requiredLandingGearFuel: 50,
	eventQueue: [],
	roomHandles: shipLayout.map((layoutRow, y) =>
		layoutRow.map((layout, x) => {
			const coordinate = new PIXI.Point(x, y)
			return {
				coordinate,
				data: {
					bottomPipe: 0,
					bottomPipeCapacity: y == 3 ? 0 : 5,
					rightPipe: 0,
					rightPipeCapacity: x == 5 ? 0 : 5,

					topOpen: ['+', '|', 'L', 'J'].includes(layout.i),
					bottomOpen: ['+', '|', '>', '<'].includes(layout.i),
					leftOpen: ['+', '-', '>', 'J'].includes(layout.i),
					rightOpen: ['+', '-', '<', 'L'].includes(layout.i),
					roomOpen: true,

					feature: ({
						'+': { type: 'source', queued: 0 },
						'-': { type: 'sink', storage: 0, capacity: 10 },
						'undefined': { type: 'empty' }
					})[layout.f]
				},
				graphics: initRoomGraphics(coordinate, shipGraphics)
			} as RoomHandle;
		})
	),
	graphics: shipGraphics
}

let elapsedTimeBetweenGloopMovement = 0;
const gloopMovementInterval = 25;
const roomHandlesDrawQueue = ship.roomHandles.flat().reverse();

for (const room of roomHandlesDrawQueue) {
	room.graphics.intersection.on('rightdown', (event) => {
		ship.eventQueue.push({ type: 'CounterRotateIntersection', x: room.coordinate.x, y: room.coordinate.y });
	});
	room.graphics.intersection.on('mousedown', (event) => {
		console.log(event);
		if (event.button === 0) {
			ship.eventQueue.push({ type: 'RotateIntersection', x: room.coordinate.x, y: room.coordinate.y });
		}
	});
	room.graphics.features.on('mousedown', (event) => console.log("source", event));
	room.graphics.verticalPipe.on('mousedown', (event) => console.log("verticalPipe", event));
	room.graphics.features.on('mousedown', (event) => {
		ship.eventQueue.push({ type: 'FeatureClicked', x: room.coordinate.x, y: room.coordinate.y });
	});
}

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
