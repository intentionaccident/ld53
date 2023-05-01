import { GameEventType } from "./GameEventType";
import * as PIXI from "pixi.js";


export interface DeliveryRequestEvent {
	type: GameEventType.DeliveryRequest;
	coord: PIXI.IPointData;
}
