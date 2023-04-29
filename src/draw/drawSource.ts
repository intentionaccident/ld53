import {LINE_SIZE, SLANT, TILE_HEIGHT, TILE_WIDTH} from "../constants";
import {RoomHandle} from "../types/RoomHandle";

export function drawSource(room: RoomHandle) {
	const graphics = room.graphics.features;

	graphics.clear();

	const feature = room.data.feature;
	if (feature.type === 'source') {
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

	if (feature.type === 'sink') {
		if (feature.subtype === 'reactor') {
			graphics.beginFill(0x73DF5C);
		} else if (feature.subtype === 'thrusters') {
			graphics.beginFill(0xFFAC3A);
		} else if (feature.subtype === 'navigation') {
			graphics.beginFill(0xB927FF);
		} else {
			graphics.beginFill(0x000000);
		}
		graphics.lineStyle(LINE_SIZE, 0xFFFFFF, 1);
		graphics.drawPolygon([
			0, 0,
			TILE_WIDTH / 2, 0,
			TILE_WIDTH / 2 - SLANT / 2, TILE_HEIGHT / 2,
			-SLANT / 2, TILE_HEIGHT / 2,
		]);
		graphics.endFill();

		if (feature.state === 'requesting') {
			graphics.beginFill(0xFF0001);
			graphics.drawCircle((TILE_WIDTH / 2 - SLANT / 2) / 2, TILE_HEIGHT / 2 / 2, 3);
			graphics.endFill();
		} else if (feature.state === 'busy') {
			graphics.beginFill(0xFFDB00);
			graphics.drawCircle((TILE_WIDTH / 2 - SLANT / 2) / 2, TILE_HEIGHT / 2 / 2, 5);
			graphics.endFill();
		} else if (feature.state === 'done') {
			graphics.beginFill(0x2FFF00);
			graphics.drawCircle((TILE_WIDTH / 2 - SLANT / 2) / 2, TILE_HEIGHT / 2 / 2, 7);
			graphics.endFill();
		} else if (feature.state === 'releasing') {
			graphics.beginFill(0x2FFF00);
			graphics.drawCircle((TILE_WIDTH / 2 - SLANT / 2) / 2, TILE_HEIGHT / 2 / 2, 3);
			graphics.endFill();
		}
	}

}
