import * as PIXI from "pixi.js";
import { DualRender, RoomHandle } from "../types/RoomHandle";
import { INTERSECTION_RADIUS, SLANT, SLANTEDNESS, TILE_HEIGHT, TILE_WIDTH } from "../constants";
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

	const dirty = new PIXI.Graphics();
	dirty.x = TILE_WIDTH * coord.x - SLANT * coord.y;
	dirty.y = TILE_HEIGHT * coord.y;
	graphics.background.addChild(dirty);

	const pipeGraphics = new PIXI.Container();
	graphics.foreground.addChild(pipeGraphics);
	pipeGraphics.x = TILE_WIDTH * coord.x - SLANT * coord.y + TILE_WIDTH / 2 - SLANT / 2;
	pipeGraphics.y = TILE_HEIGHT * coord.y + TILE_HEIGHT / 2;

	const verticalPipe = createDualRender(assetLibrary[AssetNames.PipeVerticalEmpty].asset)
	verticalPipe.sprite.x = -INTERSECTION_RADIUS * 3 * SLANTEDNESS - INTERSECTION_RADIUS / 2
	verticalPipe.sprite.y = INTERSECTION_RADIUS;
	const horizontalPipe = createDualRender(assetLibrary[AssetNames.PipeHorizontalEmpty].asset)
	horizontalPipe.sprite.x = INTERSECTION_RADIUS - INTERSECTION_RADIUS / 2 * SLANTEDNESS
	horizontalPipe.sprite.y = -INTERSECTION_RADIUS / 2;

	const intersection = createDualRender(assetLibrary[AssetNames.IntersectionSingle].asset)
	intersection.sprite.x = -10;
	intersection.sprite.y = -8;

	const feature = new PIXI.Graphics();
	pipeGraphics.addChild(
		feature,
		verticalPipe.root,
		horizontalPipe.root,
		intersection.root,
	);

	intersection.sprite.interactive = true;
	feature.interactive = true;
	feature.cursor = 'pointer';
	verticalPipe.root.hitArea = new PIXI.Polygon([
		-INTERSECTION_RADIUS, INTERSECTION_RADIUS,
		INTERSECTION_RADIUS, INTERSECTION_RADIUS,
		INTERSECTION_RADIUS - SLANT, TILE_HEIGHT - INTERSECTION_RADIUS,
		-INTERSECTION_RADIUS - SLANT, TILE_HEIGHT - INTERSECTION_RADIUS,
	]);
	verticalPipe.root.interactive = true;

	horizontalPipe.root.hitArea = new PIXI.Polygon([
		INTERSECTION_RADIUS, -INTERSECTION_RADIUS,
		TILE_WIDTH - INTERSECTION_RADIUS, -INTERSECTION_RADIUS,
		TILE_WIDTH - INTERSECTION_RADIUS, INTERSECTION_RADIUS,
		INTERSECTION_RADIUS, INTERSECTION_RADIUS,
	]);
	horizontalPipe.root.interactive = true;

	return {
		pipes: pipeGraphics,
		room,
		verticalPipe,
		horizontalPipe,
		intersection,
		features: feature,
		dirty
	};
}
