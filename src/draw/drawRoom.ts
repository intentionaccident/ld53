import { RoomHandle } from "../types/RoomHandle";
import { drawHorizontalPipe } from "./drawHorizontalPipe";
import { drawIntersection } from "./drawIntersection";
import { drawSource } from "./drawSource";
import { drawVerticalPipe } from "./drawVerticalPipe";
import { drawDirty } from "./drawDirty";
import { TextureAssetLibrary } from "../types/TextureAssetLibrary";
import { drawGloopPort } from "./drawGloopPort";
import { updateRoomSprites } from "./updateRoomSprites";

function drawFeatureProgress(room: RoomHandle) {
	const g = room.graphics.progress;
	g.clear();

	const feature = room.data.feature;
	if (feature.type === 'sink' && feature.state === 'busy') {
		const width = 6;
		const height = 16;
		const x = 10;
		const y = 0;
		const progress = feature.ticksLeft / feature.maxTicks;

		g.beginFill(0xE5EC9E);
		g.lineStyle(1, 0x868244, 1, 0);
		g.drawPolygon([
			x, y + Math.round(height * (1 - progress)),
			x + width, y + Math.round(height * (1 - progress)),
			x + width, y + height,
			x, y + height,
		]);
		g.endFill();

		g.lineStyle(1, 0x868244, 1, 0);
		g.drawPolygon([
			x, y,
			x + width, y,
			x + width, y + height,
			x, y + height,
		]);
	}
}

export function drawRoom(room: RoomHandle, assets: TextureAssetLibrary) {
	drawGloopPort(room, assets)
	drawSource(room)
	drawDirty(room);
	drawIntersection(room)
	drawVerticalPipe(room, assets)
	drawHorizontalPipe(room, assets)
	drawFeatureProgress(room);
	updateRoomSprites(room)
}


