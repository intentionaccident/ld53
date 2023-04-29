import { RoomHandle } from "../types/RoomHandle";
import { drawHorizontalPipe } from "./drawHorizontalPipe";
import { drawIntersection } from "./drawIntersection";
import { drawSource } from "./drawSource";
import { drawVerticalPipe } from "./drawVerticalPipe";

export function drawRoom(room: RoomHandle) {
	drawSource(room)
	drawIntersection(room)
	drawVerticalPipe(room)
	drawHorizontalPipe(room)
}