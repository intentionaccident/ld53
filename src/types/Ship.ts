import { RoomHandle } from "./RoomHandle";
import { GameEvent } from "../events/types/GameEvent";
import * as PIXI from "pixi.js";
import { ProgressBar } from "./ProgressBar";
import { AnimationInstance } from "./AnimationInstance";
import {ScoreBoard} from "../draw/drawScore";

export interface Ship {
	roomHandles: RoomHandle[][];
	eventQueue: GameEvent[];
	animationQueue: AnimationInstance[]
	graphics: {
		root: PIXI.Container;
		background: PIXI.Container;
		foreground: PIXI.Container;
		progressBar: ProgressBar;
		scoreBar: ScoreBoard;
	},
	currentLevel: number,
	levelProgress: number,
	score: number,
	timeLeft: number,
	ticksBetweenRequests: number,
	ticksBetweenDirtyRooms: number
}
