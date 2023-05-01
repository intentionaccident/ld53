import { LINE_SIZE, SLANT, TILE_HEIGHT } from "../constants";
import { SoundAssetLibrary } from "../types/SoundAssetLibrary";
import { TextureAssetNames } from "../types/TextureAssetNames";
import { RoomHandle } from "../types/RoomHandle";
import { getPipeColor } from "./getPipeColor";
import {TextureAssetLibrary} from "../types/TextureAssetLibrary";

export function drawVerticalPipe(room: RoomHandle, assetLibrary: TextureAssetLibrary) {
	room.graphics.verticalPipe.base.sprite.texture
		= room.data.bottomPipe > 0
			? assetLibrary[TextureAssetNames.PipeVerticalFull].asset
			: assetLibrary[TextureAssetNames.PipeVerticalEmpty].asset
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
