import { KeyPressedEvent } from "./KeyPressedEvent";
import { RoomEditEvent } from "./roomEdit/RoomEditEvent";
import { RotateIntersectionEvent } from "./RotateIntersectionEvent";
import { ActivateSinkEvent } from "./ActivateSinkEvent";
import { ActivateFeatureEvent } from "./ActivateFeatureEvent";
import { FlushPipeEvent } from "./FlushPipeEvent";

export type GameEvent = RoomEditEvent
	| KeyPressedEvent
	| ActivateSinkEvent
	| RotateIntersectionEvent
	| ActivateFeatureEvent
	| FlushPipeEvent


