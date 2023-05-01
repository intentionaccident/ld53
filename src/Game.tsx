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
import { shipLayouts } from "./shipLayouts";
import { RoomHandle } from "./types/RoomHandle";
import { Ship } from "./types/Ship";
import { setRoomVisibility } from "./utils/setRoomVisibility";
import { updateIntersectionTexture } from "./utils/updateIntersectionTexture";
import { updateAnimations } from "./updateAnimations";
import { initializeLevel } from "./initializeLevel";
import {SinkFeature} from "./types/RoomFeature";

export const Game = () => {
	const [score, setScore] = React.useState(0);
	const [timeLeft, setTimeLeft] = React.useState(1);
	const [message, setMessage] = React.useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');

	const { textureAssets, soundAssets } = React.useContext(AssetContext);
	const { app } = React.useContext(AppContext);

	React.useEffect(() => {
		const shipGraphics = initShipGraphics(app, textureAssets)

		const ship: Ship = {
			eventQueue: [],
			animationQueue: [],
			roomHandles: initializeLevel(shipGraphics, textureAssets),
			graphics: shipGraphics,
			currentLevel: 0,
			levelProgress: 0,
			timeLeft: DELIVERY_TIME_LIMIT,
			score: 0
		}

		// Manually activate the 'thrusters' for the first level
		const room = ship.roomHandles.flatMap(r => r).filter(r => r.data.feature.type === 'sink' && r.data.feature.subtype === 'thrusters')[0];
		(room.data.feature as SinkFeature).state = 'requesting';

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
			processEvents(ship, textureAssets, soundAssets);

			ship.timeLeft -= app.ticker.elapsedMS / 1000;
			setTimeLeft(ship.timeLeft);
			setScore(ship.score);
			elapsedTimeBetweenAnimationUpdate += delta;
			elapsedTimeBetweenRoomUpdate += delta;

			while (elapsedTimeBetweenAnimationUpdate > ANIMATION_UPDATE_INTERVAL) {
				elapsedTimeBetweenAnimationUpdate -= ANIMATION_UPDATE_INTERVAL;
				updateAnimations(ship, setScore, soundAssets);
			}

			while (elapsedTimeBetweenRoomUpdate > ROOM_UPDATE_INTERVAL) {
				elapsedTimeBetweenRoomUpdate -= ROOM_UPDATE_INTERVAL;
				updateRooms(ship, textureAssets, soundAssets);
			}

			for (const room of roomHandlesDrawQueue)
				drawRoom(room, textureAssets)
		};

		app.ticker.stop();
		app.ticker.add(gameLoop);
		window.addEventListener('keydown', keyDownListener, false);
		return () => {
			app.ticker.remove(gameLoop);
			window.removeEventListener('keydown', keyDownListener);
		}
	}, []);

	function handleMessageBoxClosed() {
		app.ticker.start();
		setMessage('');
	}

	return <>
		<PixiRoot />
		<UIRoot
			text={message}
			score={score}
			timeLeft={timeLeft}
			handleMessageBoxClosed={handleMessageBoxClosed}
		/>
	</>
}

