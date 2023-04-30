import * as PIXI from "pixi.js";

import { Room } from "./Room";

export interface RoomHandle {
	coordinate: PIXI.Point;
	data: Room;
	graphics: {
		room: {
			root: PIXI.Container
			texture: PIXI.Sprite
			primitive: PIXI.Graphics
		}
		pipes: PIXI.Container;
		intersection: PIXI.Graphics;
		verticalPipe: PIXI.Graphics;
		horizontalPipe: PIXI.Graphics;
		features: PIXI.Graphics;
	};
}
