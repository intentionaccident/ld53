import {RoomFeature} from "./RoomFeature";

export interface Room {
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
