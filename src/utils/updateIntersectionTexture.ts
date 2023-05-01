import { RoomHandle } from "../types/RoomHandle";
import { TextureAssetNames } from "../types/TextureAssetNames";
import { TextureAssetLibrary } from "../types/TextureAssetLibrary";

const textureMap = {
	1: [TextureAssetNames.SingleIntersectionUp, TextureAssetNames.SingleIntersectionRight, TextureAssetNames.SingleIntersectionDown, TextureAssetNames.SingleIntersectionLeft],
	2: [TextureAssetNames.BendIntersectionUp, TextureAssetNames.BendIntersectionRight, TextureAssetNames.BendIntersectionDown, TextureAssetNames.BendIntersectionLeft],
	3: [TextureAssetNames.TripleIntersectionUp, TextureAssetNames.TripleIntersectionRight, TextureAssetNames.TripleIntersectionDown, TextureAssetNames.TripleIntersectionLeft]
}

export function updateIntersectionTexture(room: RoomHandle, assets: TextureAssetLibrary) {
	for (let i = 0; i < 4; i++) {
		room.graphics.intersection.clamps[i].visible =
			room.data.intersectionLocked ? false : room.data.intersectionStates[i];
	}

	room.graphics.intersection.interactive.visible = !room.data.intersectionLocked;

	const type = room.data.intersectionStates.filter(s => s).length
	const firstConnection = room.data.intersectionStates.indexOf(true);
	room.graphics.intersection.base.sprite.visible = true
	switch (type) {
		case 0:
			room.graphics.intersection.base.sprite.visible = false
			return
		case 1:
			room.graphics.intersection.base.sprite.texture = assets[textureMap[type][firstConnection]].asset
			return
		case 3:
			room.graphics.intersection.base.sprite.texture = assets[textureMap[type][room.data.intersectionStates.indexOf(false)]].asset
			return
		case 2:
			if (room.data.intersectionStates[(firstConnection + 2) % room.data.intersectionStates.length]) {
				room.graphics.intersection.base.sprite.texture = room.data.intersectionStates[0]
					? assets[TextureAssetNames.BarIntersectionUp].asset
					: assets[TextureAssetNames.BarIntersectionRight].asset
				return
			}
			if (!firstConnection && room.data.intersectionStates[3]) {
				room.graphics.intersection.base.sprite.texture = assets[TextureAssetNames.BendIntersectionLeft].asset
				return
			}
			room.graphics.intersection.base.sprite.texture = assets[textureMap[type][firstConnection]].asset
			return
		case 4:
			room.graphics.intersection.base.sprite.texture = assets[TextureAssetNames.CrossIntersection].asset
			return

	}
}
