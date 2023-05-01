import { RoomHandle } from "../types/RoomHandle";
import {TextureAssetNames} from "../types/TextureAssetNames";
import {TextureAssetLibrary} from "../types/TextureAssetLibrary";

const gloopMap = [
	[],
	[TextureAssetNames.GloopPortSingleEmpty, TextureAssetNames.GloopPortSingleFull],
	[TextureAssetNames.GloopPortDoubleEmpty, TextureAssetNames.GloopPortDoubleHalf, TextureAssetNames.GloopPortDoubleFull],
	[TextureAssetNames.GloopPortTripleEmpty, TextureAssetNames.GloopPortTripleOne, TextureAssetNames.GloopPortTripleTwo, TextureAssetNames.GloopPortTripleFull],
]

export function drawGloopPort(room: RoomHandle, assets: TextureAssetLibrary) {
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
