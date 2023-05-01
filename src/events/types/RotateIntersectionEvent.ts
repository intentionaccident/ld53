import { GameEventType } from "./GameEventType";
import * as PIXI from "pixi.js";


export interface RotateIntersectionEvent {
	type: GameEventType.RotateIntersection;
	clockwise?: boolean;
	coord: PIXI.IPointData;
}

