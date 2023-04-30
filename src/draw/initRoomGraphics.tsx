import * as PIXI from "pixi.js";
import { DualRender, RoomHandle } from "../types/RoomHandle";
import { INTERSECTION_RADIUS, SLANT, TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { Ship } from "../types/Ship";
import { AssetLibrary } from "../types/AssetLibrary";
import { AssetNames } from "../types/AssetNames";

function createDualRender(texture: PIXI.Texture): DualRender {
	const root = new PIXI.Container();
	const primitive = new PIXI.Graphics();
	const sprite = new PIXI.Sprite(texture)
	primitive.visible = false
	root.addChild(primitive, sprite);
	return {
		root, primitive, sprite
	}
}

export function initRoomGraphics(coord: PIXI.Point, graphics: Ship['graphics'], assetLibrary: AssetLibrary): RoomHandle['graphics'] {
	const room = createDualRender(assetLibrary[AssetNames.Template].asset)
	room.root.x = TILE_WIDTH * coord.x - SLANT * coord.y;
	room.root.y = TILE_HEIGHT * coord.y;
	room.sprite.x = -SLANT;
	graphics.background.addChild(room.root);

	const pipeGraphics = new PIXI.Container();
	graphics.foreground.addChild(pipeGraphics);
	pipeGraphics.x = TILE_WIDTH * coord.x - SLANT * coord.y + TILE_WIDTH / 2 - SLANT / 2;
	pipeGraphics.y = TILE_HEIGHT * coord.y + TILE_HEIGHT / 2;

	const verticalPipe = new PIXI.Graphics();
	const horizontalPipe = new PIXI.Graphics();

	const intersection = createDualRender(assetLibrary[AssetNames.IntersectionSingle].asset)
	const feature = new PIXI.Graphics();
	pipeGraphics.addChild(
		feature,
		verticalPipe,
		horizontalPipe,
		intersection.root
	);

	intersection.sprite.interactive = true;
	feature.interactive = true;
	feature.cursor = 'pointer';
	verticalPipe.hitArea = new PIXI.Polygon([
		-INTERSECTION_RADIUS, INTERSECTION_RADIUS,
		INTERSECTION_RADIUS, INTERSECTION_RADIUS,
		INTERSECTION_RADIUS - SLANT, TILE_HEIGHT - INTERSECTION_RADIUS,
		-INTERSECTION_RADIUS - SLANT, TILE_HEIGHT - INTERSECTION_RADIUS,
	]);
	verticalPipe.interactive = true;

	horizontalPipe.hitArea = new PIXI.Polygon([
		INTERSECTION_RADIUS, -INTERSECTION_RADIUS,
		TILE_WIDTH - INTERSECTION_RADIUS, -INTERSECTION_RADIUS,
		TILE_WIDTH - INTERSECTION_RADIUS, INTERSECTION_RADIUS,
		INTERSECTION_RADIUS, INTERSECTION_RADIUS,
	]);
	horizontalPipe.interactive = true;

	return {
		pipes: pipeGraphics,
		room,
		verticalPipe,
		horizontalPipe,
		intersection,
		features: feature,
	};
}
