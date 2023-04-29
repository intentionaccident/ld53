import * as PIXI from "pixi.js";
import { GameEventType } from "./GameEventType";
import { RoomEdit } from "./RoomEdit";


export interface RoomEditEvent {
	type: GameEventType.RoomEditEvent;
	coord: PIXI.IPointData;
	edit: RoomEdit;
}
