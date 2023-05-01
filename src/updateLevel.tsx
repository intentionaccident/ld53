import * as PIXI from "pixi.js";
import {Container} from "pixi.js";
import {ProgressBar} from "./types/ProgressBar";
import {TextureAssetLibrary} from "./types/TextureAssetLibrary";
import {RoomLayout, shipLayouts} from "./shipLayouts";
import {initRoomGraphics} from "./draw/initRoomGraphics";
import {DEFAULT_PIPE_CAPACITY} from "./constants";
import {createFeature} from "./createFeature";
import {RoomHandle} from "./types/RoomHandle";
import {drawRoomBackground} from "./draw/drawRoomBackground";
import {setRoomVisibility} from "./utils/setRoomVisibility";
import {updateIntersectionTexture} from "./utils/updateIntersectionTexture";
import {Ship} from "./types/Ship";

export function updateLevel(ship: Ship, shipLayoutMask: string[], shipLayout: RoomLayout[][], textureAssets: TextureAssetLibrary) {
	for (let y = 0; y < ship.roomHandles.length; y++)
		for (let x = 0; x < ship.roomHandles[y].length; x++) {
			const layout = shipLayout[y][x];
			if (shipLayoutMask[y][x] === 'k') continue;
			ship.roomHandles[y][x].data.hidden = layout === null;
			ship.roomHandles[y][x].data.bottomPipe = 0;
			ship.roomHandles[y][x].data.bottomPipeCapacity = ['+', '|'].includes(layout?.p) ? DEFAULT_PIPE_CAPACITY : 0;
			ship.roomHandles[y][x].data.rightPipe = 0;
			ship.roomHandles[y][x].data.rightPipeCapacity = ['+', '-'].includes(layout?.p) ? DEFAULT_PIPE_CAPACITY : 0;

			ship.roomHandles[y][x].data.intersectionStates = [
				['┼', '┤', '┴', '┘', '├', '│', '└', '╵'].includes(layout?.i),
				['┼', '┴', '├', '└', '┬', '─', '┌', '╶'].includes(layout?.i),
				['┼', '┤', '├', '│', '┬', '┐', '┌', '╷'].includes(layout?.i),
				['┼', '┤', '┴', '┘', '┬', '┐', '─', '╴'].includes(layout?.i),
			];

			ship.roomHandles[y][x].data.feature = createFeature(layout?.f);
			ship.roomHandles[y][x].data.isDirty = false;
			ship.roomHandles[y][x].data.intersectionLocked = layout?.il === true;

			if (ship.roomHandles[y][x].data.hidden) {
				setRoomVisibility(ship.roomHandles[y][x], false)
			}
			updateIntersectionTexture(ship.roomHandles[y][x], textureAssets)
		}
}
