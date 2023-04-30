import * as React from "react"
import * as PIXI from "pixi.js";
import { AppContext } from "./AppContext";
import { AssetContext } from "./AssetContext";
import { PixiRoot } from "./PixiRoot";
import { UIRoot } from "./UIRoot";
import { updateRooms } from "./UpdateRooms";
import { DEFAULT_PIPE_CAPACITY, DELIVERY_TIME_LIMIT, GLOOP_AMOUNT, ROOM_UPDATE_INTERVAL } from "./constants";
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
import { AnimationInstance } from "./types/AnimationInstance";

export const Game = () => {
	const [gloopAmount, setGloopAmount] = React.useState(100);
	const [score, setScore] = React.useState(0);
	const [timeLeft, setTimeLeft] = React.useState(0);

	const { assets } = React.useContext(AssetContext);
	const { app } = React.useContext(AppContext);

	React.useEffect(() => {
		const shipGraphics = initShipGraphics(app)

		const ship: Ship = {
			gloopAmount: GLOOP_AMOUNT,
			eventQueue: [],
			animationQueue: [],
			roomHandles: shipLayout.map((layoutRow, y) =>
				layoutRow.map((layout, x) => {
					const coordinate = new PIXI.Point(x, y)
					const graphics = initRoomGraphics(coordinate, shipGraphics, assets)
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
							roomOpen: true,

							feature: createFeature(layout?.f),
							bottomPipeReceivedThisFrame: false,
							rightPipeReceivedThisFrame: false,
							isDirty: false,
							rightPipeFramesSinceWater: parseFloat('inf'),
							bottomPipeFramesSinceWater: parseFloat('inf'),
						},
						graphics
					} as RoomHandle;

					drawRoomBackground(room)
					if (hidden) {
						setRoomVisibility(room, false)
					}
					updateIntersectionTexture(room, assets)
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

		let elapsedTimeBetweenRoomUpdate = 0;
		const roomHandlesDrawQueue = ship.roomHandles.flat().reverse();

		for (const room of roomHandlesDrawQueue) {
			subscribeToEvents(ship, room);
		}

		const gameLoop = (delta) => {
			processEvents(ship, { setGloopAmount }, assets);

			ship.timeLeft -= app.ticker.elapsedMS / 1000;
			setTimeLeft(ship.timeLeft);
			setGloopAmount(ship.gloopAmount);
			setScore(ship.score);
			elapsedTimeBetweenRoomUpdate += delta;

			while (elapsedTimeBetweenRoomUpdate > ROOM_UPDATE_INTERVAL) {
				elapsedTimeBetweenRoomUpdate -= ROOM_UPDATE_INTERVAL;
				for (const animation of ship.animationQueue) {
					if (animation.activePipes.length < animation.template.path.length) {
						const newPipe = animation.template.path[animation.activePipes.length];
						animation.activePipes.push(newPipe)
						const room = ship.roomHandles[newPipe.coord.x][newPipe.coord.y]
						if (newPipe.vertical) {
							room.data.bottomPipeFramesSinceWater = 0
						} else {
							room.data.rightPipeFramesSinceWater = 0
						}
					} else {
						animation.overflow++;
					}

					if (animation.activePipes.length + animation.overflow > animation.template.gloop) {
						const removedPipe = animation.activePipes.shift()
						const room = ship.roomHandles[removedPipe.coord.x][removedPipe.coord.y]
						if (removedPipe.vertical) {
							room.data.bottomPipeFramesSinceWater = 3
						} else {
							room.data.rightPipeFramesSinceWater = 3
						}
					}
				}
				ship.animationQueue = ship.animationQueue.filter((animation) => animation.activePipes.length)
			}

			for (const room of roomHandlesDrawQueue)
				drawRoom(room, assets)
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
			gloopAmount={gloopAmount}
			score={score}
			timeLeft={timeLeft}
		/>
	</>
}

