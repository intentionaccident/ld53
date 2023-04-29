import { INTERSECTION_RADIUS, LINE_SIZE, slantedness, tileSize } from "../constants";
import { RoomHandle } from "../types/RoomHandle";
import { getPipeColor } from "./getPipeColor";

export function drawVerticalPipe(room: RoomHandle) {
	const graphics = room.graphics.verticalPipe;

	graphics.clear();

	if (room.data.bottomPipeCapacity > 0) {
		graphics.lineStyle(LINE_SIZE, getPipeColor(room.data.bottomPipe, room.data.bottomPipeCapacity), 1);
		graphics.lineTo(
			0 - (tileSize - INTERSECTION_RADIUS) * slantedness, tileSize - INTERSECTION_RADIUS
		);
		graphics.endFill();
	}
}
