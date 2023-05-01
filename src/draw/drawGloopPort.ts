import { AssetLibrary } from "../types/AssetLibrary";
import { AssetNames } from "../types/AssetNames";
import { RoomHandle } from "../types/RoomHandle";

const gloopMap = [
	[],
	[AssetNames.GloopPortSingleEmpty, AssetNames.GloopPortSingleFull],
	[AssetNames.GloopPortDoubleEmpty, AssetNames.GloopPortDoubleHalf, AssetNames.GloopPortDoubleFull],
	[AssetNames.GloopPortTripleEmpty, AssetNames.GloopPortTripleOne, AssetNames.GloopPortTripleTwo, AssetNames.GloopPortTripleFull],
]

export function drawGloopPort(room: RoomHandle, assets: AssetLibrary) {
	const graphics = room.graphics.room.gloopPort;
	if (room.data.feature.type !== "sink" && room.data.feature.type !== "source") {
		graphics.visible = false;
		return;
	}

	const asset = gloopMap[room.data.feature.capacity]?.[room.data.feature.storage];
	if (asset == null) {
		graphics.visible = false;
		return;
	}

	graphics.visible = true;
	graphics.texture = assets[asset].asset;
}
