import { GameEventType } from "./GameEventType";
import { RoomEditEvent } from "./RoomEditEvent";

interface GameEventInternal {
	type: GameEventType,
	key?: string,
	x?: number,
	y?: number,
}

export type GameEvent = RoomEditEvent | GameEventInternal;


