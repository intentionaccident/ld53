import { RoomFeature } from "./RoomFeature";

export interface Room {
	hidden?: boolean
	bottomPipe: number;
	bottomPipeCapacity: number;
	rightPipe: number;
	rightPipeCapacity: number;

	topOpen: boolean;
	bottomOpen: boolean;
	leftOpen: boolean;
	rightOpen: boolean;
	roomOpen: boolean;

	feature: RoomFeature;
}
