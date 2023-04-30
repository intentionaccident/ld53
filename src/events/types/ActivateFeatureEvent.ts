import { GameEventType } from "./GameEventType";
import * as PIXI from "pixi.js";


export interface ActivateFeatureEvent {
	type: GameEventType.ActivateFeature;
	coord: PIXI.IPointData;
}
