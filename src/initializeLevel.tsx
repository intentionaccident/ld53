import * as PIXI from "pixi.js";
import {Container} from "pixi.js";
import {ProgressBar} from "./types/ProgressBar";
import {TextureAssetLibrary} from "./types/TextureAssetLibrary";
import {shipLayoutMasks, shipLayouts} from "./shipLayouts";
import {initRoomGraphics} from "./draw/initRoomGraphics";
import {DEFAULT_PIPE_CAPACITY} from "./constants";
import {createFeature} from "./createFeature";
import {RoomHandle} from "./types/RoomHandle";
import {drawRoomBackground} from "./draw/drawRoomBackground";
import {setRoomVisibility} from "./utils/setRoomVisibility";
import {updateIntersectionTexture} from "./utils/updateIntersectionTexture";

export function initializeLevel(shipGraphics: {
	root: Container;
	background: Container;
	foreground: Container;
	progressBar: ProgressBar
}, textureAssets: TextureAssetLibrary) {
	return shipLayouts[0].map((layoutRow, y) =>
		layoutRow.map((layout, x) => {
			const coordinate = new PIXI.Point(x, y)
			const graphics = initRoomGraphics(coordinate, shipGraphics, textureAssets)
			const hidden = layout == null
			const room = {
				coordinate,
				data: {
					hidden,
					bottomPipe: 0,
					bottomPipeCapacity: ['+', '|'].includes(layout?.p) ? DEFAULT_PIPE_CAPACITY : 0,
					rightPipe: 0,
					rightPipeCapacity: ['+', '-'].includes(layout?.p) ? DEFAULT_PIPE_CAPACITY : 0,

					intersectionStates: [
						['┼', '┤', '┴', '┘', '├', '│', '└', '╵'].includes(layout?.i),
						['┼', '┴', '├', '└', '┬', '─', '┌', '╶'].includes(layout?.i),
						['┼', '┤', '├', '│', '┬', '┐', '┌', '╷'].includes(layout?.i),
						['┼', '┤', '┴', '┘', '┬', '┐', '─', '╴'].includes(layout?.i),
					],
					intersectionLocked: !!layout?.il,
					roomOpen: true,

					feature: createFeature(layout?.f),
					isDirty: false,
					lockSemaphore: 0,
				},
				graphics
			} as RoomHandle;

			drawRoomBackground(room)
			if (hidden) {
				setRoomVisibility(room, false)
			}
			updateIntersectionTexture(room, textureAssets)
			return room
		})
	);
}
