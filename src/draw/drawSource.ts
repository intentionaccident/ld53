import { slantedness, tileSize } from "../constants";
import { RoomHandle } from "../types/RoomHandle";

export function drawSource(room: RoomHandle) {
	const graphics = room.graphics.source;

	graphics.clear();

	if (room.data.feature == 'source') {
		graphics.beginFill(0x009999);
		graphics.lineStyle(4, 0x00FFFF, 1);
		graphics.drawPolygon([
			(tileSize * slantedness - tileSize) / 2, -tileSize / 2,
			-tileSize / 2, 0,
			0, 0,
			(tileSize * slantedness) / 2, -tileSize / 2,
		]);
		graphics.endFill();
	}

	if (room.data.feature == 'sink') {
		graphics.beginFill(0x003333);
		graphics.lineStyle(4, 0x00FFFF, 1);
		graphics.drawPolygon([
			(tileSize * slantedness - tileSize) / 2, -tileSize / 2,
			-tileSize / 2, 0,
			0, 0,
			(tileSize * slantedness) / 2, -tileSize / 2,
		]);
		graphics.endFill();
	}

	if (room.data.feature == 'landingGear') {
		graphics.beginFill(0x666666);
		graphics.lineStyle(4, 0x00FFFF, 1);
		graphics.drawPolygon([
			(tileSize * slantedness - tileSize) / 2, -tileSize / 2,
			-tileSize / 2, 0,
			0, 0,
			(tileSize * slantedness) / 2, -tileSize / 2,
		]);
		graphics.endFill();
	}

}
