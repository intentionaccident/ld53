import { RoomFeature } from "./RoomFeature";

export interface Room {
	hidden?: boolean
	bottomPipe: number;
	bottomPipeCapacity: number;
	rightPipe: number;
	rightPipeCapacity: number;

	intersectionStates: boolean[]

	roomOpen: boolean;

	lockSemaphore: number

	feature: RoomFeature;
	isDirty: boolean;
}
