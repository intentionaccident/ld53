import { RoomHandle } from "../types/RoomHandle";
import { TextureAssetLibrary } from "../types/TextureAssetLibrary";

export function updateRoomSprites(room: RoomHandle, assetLibrary: TextureAssetLibrary) {
	room.graphics.room.alertScreen.visible = room.data.feature.type === "sink";
	if (room.data.feature.type === "sink") {
		room.graphics.room.alertAnimation.visible = room.data.feature.state === "requesting";
	}

	switch (room.data.feature.type) {
		case "source": {
			room.graphics.features.base.sprite.texture = assetLibrary.storage.asset
			break;
		} default: {
			room.graphics.features.base.root.visible = false
			return
		}
	}
	room.graphics.features.base.root.visible = true
}
