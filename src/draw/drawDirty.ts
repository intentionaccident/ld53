import { LINE_SIZE, SLANT, TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { RoomHandle } from "../types/RoomHandle";

export function drawDirty(room: RoomHandle) {
	return;
	const graphics = room.graphics.dirty;

	graphics.clear();

	if (room.data.isDirty) {
		graphics.beginFill(0xE1E015);
		graphics.drawCircle((TILE_WIDTH / 2 - SLANT / 2) / 2, TILE_HEIGHT / 2 / 2, 3);
		graphics.endFill();
	}
}
