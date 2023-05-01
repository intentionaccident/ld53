import { RoomEditTarget } from "./RoomEditTarget";


export interface RoomIntersectionEdit {
	target: RoomEditTarget.Intersection;
	reverse?: boolean;
	lock?: boolean;
}
