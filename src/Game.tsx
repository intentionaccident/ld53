import * as React from "react"
import { AppContext } from "./AppContext";
import { AssetContext } from "./AssetContext";
import { PixiRoot } from "./PixiRoot";
import { UIRoot } from "./UIRoot";
import { updateRooms } from "./UpdateRooms";
import {
	ANIMATION_UPDATE_INTERVAL,
	ROOM_UPDATE_INTERVAL, SHOW_WELCOME_MESSAGE, SCORE_MAX, BOX_DELIVERY_SCORE
} from "./constants";
import { drawRoom } from "./draw/drawRoom";
import { processEvents } from "./events/processEvents";
import { subscribeToEvents } from "./events/subscribeToEvents";
import { GameEventType } from "./events/types/GameEventType";
import { initShipGraphics } from "./initShipGraphics";
import { Ship } from "./types/Ship";
import { updateAnimations } from "./updateAnimations";
import { initializeLevel } from "./initializeLevel";
import { SinkFeature } from "./types/RoomFeature";
import {drawSource} from "./draw/drawSource";

export const Game = () => {
	const [score, setScore] = React.useState(0);
	const [timeLeft, setTimeLeft] = React.useState(0);
	const [message, setMessage] = React.useState(
		SHOW_WELCOME_MESSAGE
			? 'Good news everyone! We have received a delivery order of gloop to Nomicron Persai 9.' +
			'\n\n' +
			'As the engineer of the ship it will be your job to direct the ' +
			'gloop to the ship components as necessary. Good luck!'
			: ''
	);

	const { textureAssets, soundAssets, animationAssets } = React.useContext(AssetContext);
	const { app } = React.useContext(AppContext);

	React.useEffect(() => {
		const shipGraphics = initShipGraphics(app, textureAssets)

		const ship: Ship = {
			eventQueue: [],
			animationQueue: [],
			roomHandles: initializeLevel(shipGraphics, textureAssets, animationAssets),
			graphics: shipGraphics,
			currentLevel: 0,
			levelProgress: 0,
			timeLeft: 0,
			score: 0,
			ticksBetweenRequests: 0,
			ticksBetweenDirtyRooms: 0
		}

		for (let roomHandle of ship.roomHandles.flatMap(r => r)) {
			roomHandle.graphics.room.boxFillingAnimation.onComplete = () => {
				roomHandle.graphics.room.boxFillingAnimation.visible = false;
				ship.score += BOX_DELIVERY_SCORE;
			}
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

			setTimeLeft(1);
			setScore(ship.score);
			ship.graphics.scoreBar.set(ship.score)
			elapsedTimeBetweenAnimationUpdate += delta;
			elapsedTimeBetweenRoomUpdate += delta;

			while (elapsedTimeBetweenAnimationUpdate > ANIMATION_UPDATE_INTERVAL) {
				elapsedTimeBetweenAnimationUpdate -= ANIMATION_UPDATE_INTERVAL;
				updateAnimations(ship, setScore, soundAssets);
			}

			while (elapsedTimeBetweenRoomUpdate > ROOM_UPDATE_INTERVAL) {
				elapsedTimeBetweenRoomUpdate -= ROOM_UPDATE_INTERVAL;
				updateRooms(ship, textureAssets, soundAssets, showMessageBox);
			}

			for (const room of roomHandlesDrawQueue)
				drawRoom(room, textureAssets)
		};

		if (SHOW_WELCOME_MESSAGE) app.ticker.stop();
		app.ticker.add(gameLoop);
		window.addEventListener('keydown', keyDownListener, false);
		return () => {
			app.ticker.remove(gameLoop);
			window.removeEventListener('keydown', keyDownListener);
		}
	}, []);

	function closeMessageBox() {
		app.ticker.start();
		setMessage('');
	}

	function showMessageBox(message: string) {
		app.ticker.stop();
		setMessage(message);
	}

	return <>
		<PixiRoot />
		<UIRoot
			text={message}
			handleMessageBoxClosed={closeMessageBox}
		/>
	</>
}

