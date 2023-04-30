import { LINE_SIZE, TILE_WIDTH } from "../constants";
import { AssetLibrary } from "../types/AssetLibrary";
import { AssetNames } from "../types/AssetNames";
import { RoomHandle } from "../types/RoomHandle";
import { getPipeColor } from "./getPipeColor";

export function drawHorizontalPipe(room: RoomHandle, assetLibrary: AssetLibrary) {
	room.graphics.horizontalPipe.sprite.texture
		= room.data.rightPipe > 0
			? assetLibrary[AssetNames.PipeHorizontalFull].asset
			: assetLibrary[AssetNames.PipeHorizontalEmpty].asset
	room.graphics.horizontalPipe.sprite.visible = room.data.rightPipeCapacity > 0;

	const graphics = room.graphics.horizontalPipe.primitive;

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
