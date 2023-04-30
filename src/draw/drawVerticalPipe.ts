import { LINE_SIZE, SLANT, TILE_HEIGHT } from "../constants";
import { AssetLibrary } from "../types/AssetLibrary";
import { AssetNames } from "../types/AssetNames";
import { RoomHandle } from "../types/RoomHandle";
import { getPipeColor } from "./getPipeColor";

export function drawVerticalPipe(room: RoomHandle, assetLibrary: AssetLibrary) {
	room.graphics.verticalPipe.base.sprite.texture
		= room.data.bottomPipeFramesSinceWater < 2
			? assetLibrary[AssetNames.PipeVerticalFull].asset
			: assetLibrary[AssetNames.PipeVerticalEmpty].asset
	room.graphics.verticalPipe.base.sprite.visible = room.data.bottomPipeCapacity > 0;

	const graphics = room.graphics.verticalPipe.base.primitive;

	graphics.clear();

	if (room.data.bottomPipeCapacity > 0) {
		graphics.lineStyle(LINE_SIZE, getPipeColor(room.data.bottomPipe, room.data.bottomPipeCapacity), 1);
		graphics.lineTo(
			-SLANT, TILE_HEIGHT
		);
		graphics.endFill();
	}
}
