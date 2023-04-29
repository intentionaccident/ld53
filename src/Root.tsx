import * as React from "react";
import {Application, Graphics, Sprite, Texture} from "pixi.js";
import {GameFrame} from "./GameFrame";
import {UIRoot} from "./UIRoot";
import {PixiRoot} from "./PixiRoot";
import {useEffect, useState} from "react";
import * as PIXI from "pixi.js";

const app = new Application({
	width: 640,
	height: 480,
	antialias: true
});
const backgroundTiles = new PIXI.Graphics();
const offsetX = 128; // TODO: Replace offsets here with scene tree x,y instead
const offsetY = 32;
const tileSize = 64;
const slantedness = 0.5;
for (let x = 0; x < 6; x++) {
	for (let y = 0; y < 4; y++) {
		backgroundTiles.beginFill(0x999999);
		backgroundTiles.lineStyle(4, 0xFFFFFF, 1);
		backgroundTiles.drawPolygon([
			offsetX + -y * tileSize * slantedness + x * tileSize + tileSize * slantedness, offsetY + y * tileSize + 0,
			offsetX + -y * tileSize * slantedness + x * tileSize + tileSize + tileSize * slantedness, offsetY + y * tileSize + 0,
			offsetX + -y * tileSize * slantedness + x * tileSize + tileSize, offsetY + y * tileSize + tileSize,
			offsetX + -y * tileSize * slantedness + x * tileSize + 0, offsetY + y * tileSize + tileSize
		]);
		backgroundTiles.endFill();
	}
}

const texture = Texture.from('assets/bunny.png');
const bunny = new Sprite(texture);
bunny.x = app.renderer.width / 2;
bunny.y = app.renderer.height / 2;
bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;
app.stage.addChild(bunny);
app.stage.addChild(backgroundTiles);

// TODO: Use Discriminating Unions for `GameEvent`s
interface GameEvent {
	type: 'KeyPressed' | 'KeyReleased',
	name: string
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

let rooms: Room[][] = Array.from({length: 4}, (_, y) =>
	Array.from({length: 6}, (_, x) => ({
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
	}))
);

function DrawRoom(room: Room, graphics: PIXI.Graphics) {
	graphics.clear();

	// Draw intersection dot
	graphics.beginFill(room.isSource ? 0x009999 : 0x999999);
	graphics.lineStyle(4, 0x00FFFF, 1);
	graphics.drawCircle(10, 0, 8);
	graphics.endFill();

	// Draw bottom pipe
	if (room.bottomPipeCapacity > 0) {
		graphics.beginFill(room.bottomPipe > 0 ? 0x009999 : 0x999999);
		graphics.lineStyle(4, 0x333333, 1);
		graphics.drawPolygon([
			5, 10,
			15, 10,
			-10, 60,
			-20, 60
		]);
		graphics.endFill();
	}

	// Draw right pipe
	if (room.rightPipeCapacity > 0) {
		graphics.beginFill(room.rightPipe > 0 ? 0x009999 : 0x999999);
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

const roomGraphics: PIXI.Graphics[][] = Array.from({length: 4}, (_, y) =>
	Array.from({length: 6}, (_, x) => {
		const graphics = new PIXI.Graphics();
		graphics.x = offsetX + -y * tileSize * slantedness + x * tileSize + 32 + 8;
		graphics.y = offsetY + y * tileSize + 32;
		DrawRoom(rooms[y][x], graphics);
		app.stage.addChild(graphics);
		return graphics;
	})
);
const eventQueue: GameEvent[] = [];

export function Root() {
	const [lastPressedKey, setLastPressedKey] = useState('');

	useEffect(() => {
		const keyDownListener = (event) => {
			const name = event.key;
			eventQueue.push({type: 'KeyPressed', name});
		};

		const gameLoop = (delta) => {
			while (eventQueue.length > 0) {
				const event = eventQueue.pop();
				if (event.type === 'KeyPressed') {
					bunny.anchor.x += 0.2;
					setLastPressedKey(event.name);
				}
			}

			const previous = rooms.map(row => [...row]);
			for (let x = 0; x < 6; x++) {
				for (let y = 0; y < 4; y++) {
					rooms[y][x] = {...previous[y][x]};
					if (previous[y][x].isSource) {
						let waterLeft = 1;
						// top
						if (y - 1 >= 0
							&& previous[y][x].topOpen
							&& previous[y - 1][x].bottomPipe < previous[y - 1][x].bottomPipeCapacity
							&& rooms[y - 1][x].bottomPipe < rooms[y - 1][x].bottomPipeCapacity
							&& waterLeft > 0
						) {
							rooms[y - 1][x].bottomPipe += 1;
							waterLeft -= 1;
						}

						// right
						if (x + 1 < 6
							&& previous[y][x].rightOpen
							&& previous[y][x].rightPipe < previous[y][x].rightPipeCapacity
							&& rooms[y][x].rightPipe < rooms[y][x].rightPipeCapacity
							&& waterLeft > 0
						) {
							rooms[y][x].rightPipe += 1;
							waterLeft -= 1;
						}

						// bottom
						if (y + 1 < 4
							&& previous[y][x].bottomOpen
							&& previous[y][x].bottomPipe < previous[y][x].bottomPipeCapacity
							&& rooms[y][x].bottomPipe < rooms[y][x].bottomPipeCapacity
							&& waterLeft > 0
						) {
							rooms[y][x].bottomPipe += 1;
							waterLeft -= 1;
						}

						// left
						if (x - 1 >= 0
							&& previous[y][x].leftOpen
							&& previous[y][x-1].rightPipe < previous[y][x-1].rightPipeCapacity
							&& rooms[y][x-1].rightPipe < rooms[y][x-1].rightPipeCapacity
							&& waterLeft > 0
						) {
							rooms[y][x-1].rightPipe += 1;
							waterLeft -= 1;
						}
					}

					console.assert(previous[y][x].rightPipe <= previous[y][x].rightPipeCapacity);
					if (previous[y][x].rightPipe === previous[y][x].rightPipeCapacity) {
						// TODO: Propagate water
					}
				}
			}
			for (let x = 0; x < 6; x++) {
				for (let y = 0; y < 4; y++) {
					DrawRoom(rooms[y][x], roomGraphics[y][x]);
				}
			}
		};

		app.ticker.maxFPS = 0.2;
		app.ticker.add(gameLoop);
		window.addEventListener('keydown', keyDownListener, false);
		return () => {
			app.ticker.remove(gameLoop);
			window.removeEventListener('keydown', keyDownListener);
		}
	}, []);

	return <div>
		<GameFrame>
			<PixiRoot app={app}/>
			<UIRoot lastPressedKey={lastPressedKey}/>
		</GameFrame>
	</div>;
}
