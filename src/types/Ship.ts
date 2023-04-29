import { RoomHandle } from "./RoomHandle";
import { GameEvent } from "./GameEvent";
import * as PIXI from "pixi.js";

export interface Ship {
	gloopAmount: number;
	landingGearFuel: number;
	requiredLandingGearFuel: number;
	roomHandles: RoomHandle[][];
	eventQueue: GameEvent[];
	graphics: {
		root: PIXI.Container;
		background: PIXI.Container;
		foreground: PIXI.Container;
	}
}
