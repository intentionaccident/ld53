import { GameEventType } from "./GameEventType";
import * as PIXI from "pixi.js";


export interface ActivateSinkEvent {
	type: GameEventType.ActivateSink;
	coord: PIXI.IPointData;
}
