import { RoomHandle } from "./RoomHandle";
import { GameEvent } from "../events/types/GameEvent";
import * as PIXI from "pixi.js";
import {ProgressBar} from "./ProgressBar";

export interface Ship {
	gloopAmount: number;
	roomHandles: RoomHandle[][];
	eventQueue: GameEvent[];
	graphics: {
		root: PIXI.Container;
		background: PIXI.Container;
		foreground: PIXI.Container;
		progressBar: ProgressBar;
	},
	currentLevel: number,
	levelProgress: number
}
