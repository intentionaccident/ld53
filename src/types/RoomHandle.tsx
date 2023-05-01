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
		room: {
			base: DualRender
			gloopPort: PIXI.Sprite
			gloopSyphon: PIXI.Sprite
		}
		dirty: PIXI.Graphics;
		pipes: PIXI.Container;
		intersection: {
			base: DualRender
			clamps: PIXI.Sprite[]
			clampsRoot: PIXI.Container
			interactive: PIXI.Sprite
		}
		verticalPipe: {
			base: DualRender
			animation: PIXI.AnimatedSprite
		}
		horizontalPipe: {
			base: DualRender
			animation: PIXI.AnimatedSprite
		}
		features: PIXI.Graphics;
		progress: PIXI.Graphics;
	};
	gloopButtonActive: boolean
}
