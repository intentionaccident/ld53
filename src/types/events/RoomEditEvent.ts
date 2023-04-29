import * as PIXI from "pixi.js";
import { GameEventType } from "./GameEventType";
import { RoomEdit } from "./RoomEdit";

export interface RoomEditEvent {
	type: GameEventType.RoomEdit;
	coord: PIXI.IPointData;
	edit: RoomEdit;
}
