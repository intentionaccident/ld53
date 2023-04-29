import { LINE_SIZE, TILE_WIDTH } from "../constants";
import { RoomHandle } from "../types/RoomHandle";
import { getPipeColor } from "./getPipeColor";

export function drawHorizontalPipe(room: RoomHandle) {
	const graphics = room.graphics.horizontalPipe;

	graphics.clear();

	// Draw right pipe
	if (room.data.rightPipeCapacity > 0) {
		graphics.lineStyle(LINE_SIZE, getPipeColor(room.data.rightPipe, room.data.rightPipeCapacity), 1);

		graphics.lineTo(
			TILE_WIDTH, 0
		);
		graphics.endFill();
	}
}
