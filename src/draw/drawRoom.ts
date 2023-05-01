import { AssetLibrary } from "../types/AssetLibrary";
import { RoomHandle } from "../types/RoomHandle";
import { drawHorizontalPipe } from "./drawHorizontalPipe";
import { drawIntersection } from "./drawIntersection";
import { drawSource } from "./drawSource";
import { drawVerticalPipe } from "./drawVerticalPipe";
import { drawDirty } from "./drawDirty";
import { AssetNames } from "../types/AssetNames";

export function drawRoom(room: RoomHandle, assets: AssetLibrary) {
	drawGloopPort(room, assets)
	drawSource(room)
	drawDirty(room);
	drawIntersection(room)
	drawVerticalPipe(room, assets)
	drawHorizontalPipe(room, assets)
}

const gloopMap = [
	[],
	[AssetNames.GloopPortSingleEmpty, AssetNames.GloopPortSingleEmpty],
	[AssetNames.GloopPortDoubleEmpty, AssetNames.GloopPortDoubleHalf, , AssetNames.GloopPortDoubleFull],
	[AssetNames.GloopPortTripleEmpty, AssetNames.GloopPortTripleOne, AssetNames.GloopPortTripleTwo, AssetNames.GloopPortTripleFull],
]

function drawGloopPort(room: RoomHandle, assets: AssetLibrary) {
	const graphics = room.graphics.room.gloopPort;
	if (room.data.feature.type !== "sink" && room.data.feature.type !== "source") {
		graphics.visible = false
		return
	}

	const asset = gloopMap[room.data.feature.capacity]?.[room.data.feature.storage]
	if (asset == null) {
		graphics.visible = false
		return
	}

	graphics.visible = true
	graphics.texture = assets[asset].asset
}

