import { RoomHandle } from "../types/RoomHandle";
import { TextureAssetNames } from "../types/TextureAssetNames";
import { TextureAssetLibrary } from "../types/TextureAssetLibrary";

const gloopMap = [
	[],
	[TextureAssetNames.GloopPortSingleEmpty, TextureAssetNames.GloopPortSingleFull],
	[TextureAssetNames.GloopPortDoubleEmpty, TextureAssetNames.GloopPortDoubleHalf, TextureAssetNames.GloopPortDoubleFull],
	[TextureAssetNames.GloopPortTripleEmpty, TextureAssetNames.GloopPortTripleOne, TextureAssetNames.GloopPortTripleTwo, TextureAssetNames.GloopPortTripleFull],
]

export function drawGloopPort(room: RoomHandle, assets: TextureAssetLibrary) {
	const graphics = room.graphics.room.gloopPort;
	if (room.data.feature.type !== "sink" && room.data.feature.type !== "source") {
		room.graphics.room.gloopSyphon.visible = graphics.visible = false;
		return;
	}

	const highlightGloopButton =
		room.gloopButtonActive
		&& room.data.feature.storage > 0
		&& (room.data.feature.type !== 'sink' || room.data.feature.state !== 'busy');
	room.graphics.room.gloopSyphon.texture = highlightGloopButton
		? assets[TextureAssetNames.GloopPortSyphonFull].asset
		: assets[TextureAssetNames.GloopPortSyphonEmpty].asset

	const asset = gloopMap[room.data.feature.capacity]?.[room.data.feature.storage];
	if (asset == null) {
		room.graphics.room.gloopSyphon.visible = graphics.visible = false;
		return;
	}

	room.graphics.room.gloopSyphon.visible = graphics.visible = true;
	graphics.texture = assets[asset].asset;
}
