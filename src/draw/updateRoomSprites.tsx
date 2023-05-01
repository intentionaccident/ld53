import { RoomHandle } from "../types/RoomHandle";
import { TextureAssetLibrary } from "../types/TextureAssetLibrary";

export function updateRoomSprites(room: RoomHandle, assetLibrary: TextureAssetLibrary) {
	room.graphics.room.alertScreen.visible = room.data.feature.type === "sink";
	if (room.data.feature.type === "sink") {
		room.graphics.room.alertAnimation.visible = room.data.feature.state === "requesting";
	}

	if (room.data.feature.type === "source") {
		room.graphics.features.base.sprite.texture = assetLibrary.storage.asset
	} else if (room.data.feature.type === "sink" && room.data.feature.subtype === 'navigation') {
		room.graphics.features.base.sprite.texture = assetLibrary["feature-radar"].asset
	} else if (room.data.feature.type === "sink" && room.data.feature.subtype === 'thrusters') {
		room.graphics.features.base.sprite.texture = assetLibrary["feature-control"].asset
	} else if (room.data.feature.type === "sink" && room.data.feature.subtype === 'reactor') {
		room.graphics.features.base.sprite.texture = assetLibrary["feature-reactor"].asset
	} else {
		room.graphics.features.base.root.visible = false
		return
	}
	room.graphics.features.base.root.visible = true
}
