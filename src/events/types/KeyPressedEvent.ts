import { GameEventType } from "./GameEventType";


export interface KeyPressedEvent {
	type: GameEventType.KeyPressed;
	key: string;
}
