import { GameEventType } from "./GameEventType";
import * as PIXI from "pixi.js";


export interface FeatureClickedEvent {
	type: GameEventType.FeatureClicked;
	coord: PIXI.IPointData;
}
