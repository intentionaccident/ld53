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
	const isBar = room.data.intersectionStates[0] === room.data.intersectionStates[1]
	room.graphics.intersection.base.root.visible = true
	switch (type) {
		case 0:
			room.graphics.intersection.base.root.visible = false
			return
		case 1:
		case 3:
			console.log(room.data.intersectionStates.indexOf(true))
			room.graphics.intersection.base.sprite.texture = assets[textureMap[type][room.data.intersectionStates.indexOf(true)]].asset
			return
		case 2:
			if (isBar) {
				room.graphics.intersection.base.sprite.texture = room.data.intersectionStates[0]
					? assets[AssetNames.BarIntersectionUp].asset
					: assets[AssetNames.BarIntersectionRight].asset
				return
			}
			room.graphics.intersection.base.sprite.texture = assets[textureMap[type][room.data.intersectionStates.indexOf(true)]].asset
			return
		case 4:
			room.graphics.intersection.base.sprite.texture = assets[AssetNames.CrossIntersection].asset
			return

	}
}
