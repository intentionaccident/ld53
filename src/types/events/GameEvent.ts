import { KeyPressedEvent } from "./KeyPressedEvent";
import { RoomEditEvent } from "./RoomEditEvent";
import { RotateIntersectionEvent } from "./RotateIntersectionEvent";
import { FeatureClickedEvent } from "./FeatureClickedEvent";

export type GameEvent = RoomEditEvent
	| KeyPressedEvent
	| FeatureClickedEvent
	| RotateIntersectionEvent;


