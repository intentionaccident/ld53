import { SoundAssetLibrary } from "../types/SoundAssetLibrary";
import { RoomHandle } from "../types/RoomHandle";
import { drawHorizontalPipe } from "./drawHorizontalPipe";
import { drawIntersection } from "./drawIntersection";
import { drawSource } from "./drawSource";
import { drawVerticalPipe } from "./drawVerticalPipe";
import { drawDirty } from "./drawDirty";
import { TextureAssetNames } from "../types/TextureAssetNames";
import {TextureAssetLibrary} from "../types/TextureAssetLibrary";
import { drawGloopPort } from "./drawGloopPort";

export function drawRoom(room: RoomHandle, assets: TextureAssetLibrary) {
	drawGloopPort(room, assets)
	drawSource(room)
	drawDirty(room);
	drawIntersection(room)
	drawVerticalPipe(room, assets)
	drawHorizontalPipe(room, assets)
}


