import { RoomHandle } from "../types/RoomHandle";
import { AssetLibrary } from "../types/AssetLibrary";
import { AssetNames } from "../types/AssetNames";

const textureMap = {
	1: [AssetNames.SingleIntersectionUp, AssetNames.SingleIntersectionRight, AssetNames.SingleIntersectionDown, AssetNames.SingleIntersectionLeft],
	2: [AssetNames.BendIntersectionUp, AssetNames.BendIntersectionRight, AssetNames.BendIntersectionDown, AssetNames.BendIntersectionLeft],
	3: [AssetNames.TripleIntersectionUp, AssetNames.TripleIntersectionRight, AssetNames.TripleIntersectionDown, AssetNames.TripleIntersectionLeft]
}

export function updateIntersectionTexture(room: RoomHandle, assets: AssetLibrary) {
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
					? assets[AssetNames.BarIntersectionUp].asset
					: assets[AssetNames.BarIntersectionRight].asset
				return
			}
			if (!firstConnection && room.data.intersectionStates[3]) {
				room.graphics.intersection.base.sprite.texture = assets[AssetNames.BendIntersectionLeft].asset
				return
			}
			room.graphics.intersection.base.sprite.texture = assets[textureMap[type][firstConnection]].asset
			return
		case 4:
			room.graphics.intersection.base.sprite.texture = assets[AssetNames.CrossIntersection].asset
			return

	}
}
