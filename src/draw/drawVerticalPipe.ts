import { LINE_SIZE, SLANT, TILE_HEIGHT } from "../constants";
import { RoomHandle } from "../types/RoomHandle";
import { getPipeColor } from "./getPipeColor";

export function drawVerticalPipe(room: RoomHandle) {
	const graphics = room.graphics.verticalPipe;

	graphics.clear();

	if (room.data.bottomPipeCapacity > 0) {
		graphics.lineStyle(LINE_SIZE, getPipeColor(room.data.bottomPipe, room.data.bottomPipeCapacity), 1);
		graphics.lineTo(
			-SLANT, TILE_HEIGHT
		);
		graphics.endFill();
	}
}
