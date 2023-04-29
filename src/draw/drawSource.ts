import { LINE_SIZE, SLANT, TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { RoomHandle } from "../types/RoomHandle";

export function drawSource(room: RoomHandle) {
	const graphics = room.graphics.features;

	graphics.clear();

	if (room.data.feature.type === 'source') {
		graphics.beginFill(0x009999);
		graphics.lineStyle(LINE_SIZE, 0x00FFFF, 1);
		graphics.drawPolygon([
			0, 0,
			TILE_WIDTH / 2, 0,
			TILE_WIDTH / 2 - SLANT / 2, TILE_HEIGHT / 2,
			-SLANT / 2, TILE_HEIGHT / 2,
		]);
		graphics.endFill();
	}

	if (room.data.feature.type === 'sink') {
		graphics.beginFill(0x003333);
		graphics.lineStyle(LINE_SIZE, 0x00FFFF, 1);
		graphics.drawPolygon([
			0, 0,
			TILE_WIDTH / 2, 0,
			TILE_WIDTH / 2 - SLANT / 2, TILE_HEIGHT / 2,
			-SLANT / 2, TILE_HEIGHT / 2,
		]);
		graphics.endFill();
	}

}
