import * as PIXI from "pixi.js";
import { Room } from "../Root";

export interface RoomHandle {
	coordinate: PIXI.Point;
	data: Room;
	graphics: {
		room: PIXI.Graphics;
		pipes: PIXI.Container;
		intersection: PIXI.Graphics;
		verticalPipe: PIXI.Graphics;
		horizontalPipe: PIXI.Graphics;
		source: PIXI.Graphics;
	};
}
