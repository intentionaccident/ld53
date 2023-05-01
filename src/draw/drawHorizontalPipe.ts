import { LINE_SIZE, TILE_WIDTH } from "../constants";
import { SoundAssetLibrary } from "../types/SoundAssetLibrary";
import { TextureAssetNames } from "../types/TextureAssetNames";
import { RoomHandle } from "../types/RoomHandle";
import { getPipeColor } from "./getPipeColor";
import {TextureAssetLibrary} from "../types/TextureAssetLibrary";

export function drawHorizontalPipe(room: RoomHandle, assetLibrary: TextureAssetLibrary) {
	room.graphics.horizontalPipe.base.sprite.texture
		= room.data.rightPipe > 0
			? assetLibrary[TextureAssetNames.PipeHorizontalFull].asset
			: assetLibrary[TextureAssetNames.PipeHorizontalEmpty].asset
	room.graphics.horizontalPipe.base.sprite.visible = room.data.rightPipeCapacity > 0;

	const graphics = room.graphics.horizontalPipe.base.primitive;

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
