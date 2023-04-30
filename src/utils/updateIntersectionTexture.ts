import { RoomHandle } from "../types/RoomHandle";
import { AssetLibrary } from "../types/AssetLibrary";

export function updateIntersectionTexture(room: RoomHandle, assets: AssetLibrary) {
	const type = room.data.intersectionStates.filter(s => s).length
	const isBar = room.data.intersectionStates[0] === room.data.intersectionStates[1]
	room.graphics.intersection.base.sprite.visible = true
	switch (type) {
		case 0:
			room.graphics.intersection.base.sprite.visible = false
			return
		case 1:
			room.graphics.intersection.base.sprite.texture
	}
}
