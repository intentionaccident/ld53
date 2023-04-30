import { AssetLibrary } from "../types/AssetLibrary";
import { RoomHandle } from "../types/RoomHandle";
import { drawHorizontalPipe } from "./drawHorizontalPipe";
import { drawIntersection } from "./drawIntersection";
import { drawSource } from "./drawSource";
import { drawVerticalPipe } from "./drawVerticalPipe";

export function drawRoom(room: RoomHandle, assets: AssetLibrary) {
	drawSource(room)
	drawIntersection(room)
	drawVerticalPipe(room, assets)
	drawHorizontalPipe(room, assets)
}