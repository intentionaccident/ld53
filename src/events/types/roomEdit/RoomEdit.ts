import { RoomFeatureEdit } from "./RoomFeatureEdit";
import { RoomIntersectionEdit } from "./RoomIntersectionEdit";
import { RoomPipeEdit } from "./RoomPipeEdit";

export type RoomEdit = RoomPipeEdit
	| RoomFeatureEdit
	| RoomIntersectionEdit;
