import { RoomFeatureEdit } from "./RoomFeatureEdit";
import { RoomIntersectionEdit } from "./RoomIntersectionEdit";
import { RoomPipeEdit } from "./RoomPipeEdit";
import {RoomFeatureGloopEdit} from "./RoomFeatureGloopEdit";

export type RoomEdit = RoomPipeEdit
	| RoomFeatureEdit
	| RoomIntersectionEdit
	| RoomFeatureGloopEdit;
