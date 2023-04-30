import { RoomFeature } from "./RoomFeature";

export interface Room {
	hidden?: boolean
	bottomPipe: number;
	bottomPipeCapacity: number;
	rightPipe: number;
	rightPipeCapacity: number;

	intersectionStates: boolean[]

	roomOpen: boolean;

	feature: RoomFeature;
	bottomPipeReceivedThisFrame: boolean;
	rightPipeReceivedThisFrame: boolean;
	isDirty: boolean;

	bottomPipeFramesSinceWater: number;
	rightPipeFramesSinceWater: number;
}
