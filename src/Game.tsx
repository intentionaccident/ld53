import * as React from "react"
import * as PIXI from "pixi.js";
import { AppContext } from "./AppContext";
import { AssetContext } from "./AssetContext";
import { PixiRoot } from "./PixiRoot";
import { UIRoot } from "./UIRoot";
import { updateRooms } from "./UpdateRooms";
import {
	DEFAULT_PIPE_CAPACITY,
	DELIVERY_TIME_LIMIT,
	ANIMATION_UPDATE_INTERVAL,
	ROOM_UPDATE_INTERVAL
} from "./constants";
import { createFeature } from "./createFeature";
import { drawRoom } from "./draw/drawRoom";
import { drawRoomBackground } from "./draw/drawRoomBackground";
import { initRoomGraphics } from "./draw/initRoomGraphics";
import { processEvents } from "./events/processEvents";
import { subscribeToEvents } from "./events/subscribeToEvents";
import { GameEventType } from "./events/types/GameEventType";
import { initShipGraphics } from "./initShipGraphics";
import { shipLayout } from "./shipLayout";
import { RoomHandle } from "./types/RoomHandle";
import { Ship } from "./types/Ship";
import { setRoomVisibility } from "./utils/setRoomVisibility";
import { updateIntersectionTexture } from "./utils/updateIntersectionTexture";
import { updateAnimations } from "./updateAnimations";

export const Game = () => {
	const [score, setScore] = React.useState(0);
	const [timeLeft, setTimeLeft] = React.useState(0);

	const { textureAssets, soundAssets } = React.useContext(AssetContext);
	const { app } = React.useContext(AppContext);

	React.useEffect(() => {
		const shipGraphics = initShipGraphics(app, textureAssets)

		const ship: Ship = {
			eventQueue: [],
			animationQueue: [],
			roomHandles: shipLayout.map((layoutRow, y) =>
				layoutRow.map((layout, x) => {
					const coordinate = new PIXI.Point(x, y)
					const graphics = initRoomGraphics(coordinate, shipGraphics, textureAssets)
					const hidden = layout == null
					const room = {
						coordinate,
						data: {
							hidden,
							bottomPipe: 0,
							bottomPipeCapacity: ['+', '|'].includes(layout?.p) ? DEFAULT_PIPE_CAPACITY : 0,
							rightPipe: 0,
							rightPipeCapacity: ['+', '-'].includes(layout?.p) ? DEFAULT_PIPE_CAPACITY : 0,

							intersectionStates: [
								['┼', '┤', '┴', '┘', '├', '│', '└', '╵'].includes(layout?.i),
								['┼', '┴', '├', '└', '┬', '─', '┌', '╶'].includes(layout?.i),
								['┼', '┤', '├', '│', '┬', '┐', '┌', '╷'].includes(layout?.i),
								['┼', '┤', '┴', '┘', '┬', '┐', '─', '╴'].includes(layout?.i),
							],
							intersectionLocked: !!layout?.il,
							roomOpen: true,

							feature: createFeature(layout?.f),
							isDirty: false,
							lockSemaphore: 0,
						},
						graphics
					} as RoomHandle;

					drawRoomBackground(room)
					if (hidden) {
						setRoomVisibility(room, false)
					}
					updateIntersectionTexture(room, textureAssets)
					return room
				})
			),
			graphics: shipGraphics,
			currentLevel: 0,
			levelProgress: 0,
			timeLeft: DELIVERY_TIME_LIMIT,
			score: 0
		}

		const keyDownListener = (event) => {
			ship.eventQueue.push({ type: GameEventType.KeyPressed, key: event.key });
		};

		let elapsedTimeBetweenAnimationUpdate = 0;
		let elapsedTimeBetweenRoomUpdate = 0;
		const roomHandlesDrawQueue = ship.roomHandles.flat().reverse();

		for (const room of roomHandlesDrawQueue) {
			subscribeToEvents(ship, room);
		}

		const gameLoop = (delta) => {
			processEvents(ship, textureAssets);

			ship.timeLeft -= app.ticker.elapsedMS / 1000;
			setTimeLeft(ship.timeLeft);
			setScore(ship.score);
			elapsedTimeBetweenAnimationUpdate += delta;
			elapsedTimeBetweenRoomUpdate += delta;

			while (elapsedTimeBetweenAnimationUpdate > ANIMATION_UPDATE_INTERVAL) {
				elapsedTimeBetweenAnimationUpdate -= ANIMATION_UPDATE_INTERVAL;
				updateAnimations(ship, setScore);
			}

			while (elapsedTimeBetweenRoomUpdate > ROOM_UPDATE_INTERVAL) {
				elapsedTimeBetweenRoomUpdate -= ROOM_UPDATE_INTERVAL;
				updateRooms(ship);
			}

			for (const room of roomHandlesDrawQueue)
				drawRoom(room, textureAssets)
		};

		app.ticker.add(gameLoop);
		window.addEventListener('keydown', keyDownListener, false);
		return () => {
			app.ticker.remove(gameLoop);
			window.removeEventListener('keydown', keyDownListener);
		}
	}, []);

	return <>
		<PixiRoot />
		<UIRoot
			score={score}
			timeLeft={timeLeft}
		/>
	</>
}

