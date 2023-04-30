import { LINE_SIZE, TILE_WIDTH, SLANT, TILE_HEIGHT } from "../constants";
import { RoomHandle } from "../types/RoomHandle";

export function drawRoomBackground(room: RoomHandle) {
	const graphics = room.graphics.room.primitive;

	graphics.clear();

	graphics.beginFill(0x999999);
	graphics.lineStyle(LINE_SIZE, 0xFFFFFF, 1);
	graphics.drawPolygon([
		0, 0,
		TILE_WIDTH, 0,
		TILE_WIDTH - SLANT, TILE_HEIGHT,
		-SLANT, TILE_HEIGHT,
	]);
	graphics.endFill();
}