import * as PIXI from "pixi.js";

import { Room } from "./Room";

export interface DualRender {
	root: PIXI.Container
	sprite: PIXI.Sprite
	primitive: PIXI.Graphics
}

export interface RoomHandle {
	coordinate: PIXI.Point;
	data: Room;
	graphics: {
		room: DualRender
		pipes: PIXI.Container;
		intersection: DualRender
		verticalPipe: PIXI.Graphics;
		horizontalPipe: PIXI.Graphics;
		features: PIXI.Graphics;
	};
}
