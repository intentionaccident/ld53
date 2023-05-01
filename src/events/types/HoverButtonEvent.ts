import { GameEventType } from "./GameEventType";
import * as PIXI from "pixi.js";
import { HoverTarget } from "./HoverTarget";


export interface HoverButtonEvent {
	type: GameEventType.HoverButton;
	active: boolean;
	coord: PIXI.IPointData;
	target: HoverTarget;
}
