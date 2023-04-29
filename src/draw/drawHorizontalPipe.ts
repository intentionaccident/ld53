import { LINE_SIZE, tileSize } from "../constants";
import { RoomHandle } from "../types/RoomHandle";
import { getPipeColor } from "./getPipeColor";

export function drawHorizontalPipe(room: RoomHandle) {
	const graphics = room.graphics.horizontalPipe;

	graphics.clear();

	// Draw right pipe
	if (room.data.rightPipeCapacity > 0) {
		graphics.lineStyle(LINE_SIZE, getPipeColor(room.data.rightPipe, room.data.rightPipeCapacity), 1);

		graphics.lineTo(
			tileSize, 0
		);
		graphics.endFill();
	}
}
