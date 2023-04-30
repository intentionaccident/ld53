import * as React from "react";
import { useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import { GameFrame } from "./GameFrame";
import { UIRoot } from "./UIRoot";
import { PixiRoot } from "./PixiRoot";
import { RoomHandle } from "./types/RoomHandle";
import { drawRoom } from "./draw/drawRoom";
import { processEvents } from "./events/processEvents";
import { updateRooms } from "./UpdateRooms";
import { Ship } from "./types/Ship";
import { initRoomGraphics } from "./draw/initRoomGraphics";
import { initShipGraphics } from "./initShipGraphics";
import { shipLayout } from "./shipLayout";
import { SINK_CAPACITY, SINK_RELEASE_SPEED, SOURCE_RELEASE_SPEED } from "./constants";
import { setRoomVisibility } from "./utils/setRoomVisibility";
import { drawRoomBackground } from "./draw/drawRoomBackground";
import { GameEventType } from "./events/types/GameEventType";
import { saveLevel } from "./saveLevel";
import { subscribeToEvent as subscribeToEvents } from "./events/subscribeToEvent";

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
			const graphics = initRoomGraphics(coordinate, shipGraphics)
			const hidden = layout == null
			const room = {
				coordinate,
				data: {
					hidden,
					bottomPipe: 0,
					bottomPipeCapacity: ['+', '|'].includes(layout?.p) ? 5 : 0,
					rightPipe: 0,
					rightPipeCapacity: ['+', '-'].includes(layout?.p) ? 5 : 0,

					intersectionStates: [
						['┼', '┤', '┴', '┘', '├', '│', '└', '╵'].includes(layout?.i),
						['┼', '┤', '├', '│', '┬', '┐', '┌', '╷'].includes(layout?.i),
						['┼', '┤', '┴', '┘', '┬', '┐', '─', '╴'].includes(layout?.i),
						['┼', '┴', '├', '└', '┬', '─', '┌', '╶'].includes(layout?.i),
					],
					roomOpen: true,

					feature: ({
						'+': { type: 'source', releaseSpeed: SOURCE_RELEASE_SPEED, storage: 0 },
						't': { type: 'sink', subtype: 'thrusters', capacity: SINK_CAPACITY['thrusters'], releaseSpeed: SINK_RELEASE_SPEED['thrusters'], state: 'idle', storage: 0, timeLeft: 0 },
						'n': { type: 'sink', subtype: 'navigation', capacity: SINK_CAPACITY['navigation'], releaseSpeed: SINK_RELEASE_SPEED['navigation'], state: 'idle', storage: 0, timeLeft: 0 },
						'r': { type: 'sink', subtype: 'reactor', capacity: SINK_CAPACITY['reactor'], releaseSpeed: SINK_RELEASE_SPEED['reactor'], state: 'idle', storage: 0, timeLeft: 0 },
						'undefined': { type: 'empty' }
					})[layout?.f]
				},
				graphics
			} as RoomHandle;

			drawRoomBackground(room)
			if (hidden) {
				setRoomVisibility(room, false)
			}
			return room
		})
	),
	graphics: shipGraphics,
	currentLevel: 0,
	levelProgress: 0
}

let elapsedTimeBetweenGloopMovement = 0;
const gloopMovementInterval = 25;
const roomHandlesDrawQueue = ship.roomHandles.flat().reverse();

for (const room of roomHandlesDrawQueue) {
	subscribeToEvents(ship, room);
}

export function Root() {
	const [gloopAmountValue, setGloopAmount] = useState(100);
	const [landingGearFuelValue, setLandingGearFuel] = useState(0);

	useEffect(() => {
		console.log(saveLevel(ship));
		const keyDownListener = (event) => {
			ship.eventQueue.push({ type: GameEventType.KeyPressed, key: event.key });
		};

		const gameLoop = (delta) => {
			processEvents(ship, { setGloopAmount });

			elapsedTimeBetweenGloopMovement += delta;

			if (elapsedTimeBetweenGloopMovement > gloopMovementInterval) {
				elapsedTimeBetweenGloopMovement = 0;
				updateRooms(delta, ship, setGloopAmount, setLandingGearFuel)
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
