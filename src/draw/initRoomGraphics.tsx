import * as PIXI from "pixi.js";
import { DualRender, RoomHandle } from "../types/RoomHandle";
import { INTERSECTION_RADIUS, SLANT, SLANTEDNESS, TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { Ship } from "../types/Ship";
import { SoundAssetLibrary } from "../types/SoundAssetLibrary";
import { TextureAssetNames } from "../types/TextureAssetNames";
import {TextureAssetLibrary} from "../types/TextureAssetLibrary";

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

export function initRoomGraphics(coord: PIXI.Point, graphics: Ship['graphics'], assetLibrary: TextureAssetLibrary): RoomHandle['graphics'] {
	const room = createDualRender(assetLibrary[TextureAssetNames.Template].asset)
	room.root.x = TILE_WIDTH * coord.x - SLANT * coord.y;
	room.root.y = TILE_HEIGHT * coord.y;
	room.sprite.x = -SLANT;
	graphics.background.addChild(room.root);

	const gloopPort = new PIXI.Sprite(assetLibrary[TextureAssetNames.GloopPortTripleEmpty].asset)
	room.root.addChild(gloopPort)
	gloopPort.x = -SLANT;
	gloopPort.visible = false;

	const dirty = new PIXI.Graphics();
	dirty.x = TILE_WIDTH * coord.x - SLANT * coord.y;
	dirty.y = TILE_HEIGHT * coord.y;
	graphics.background.addChild(dirty);

	const pipeGraphics = new PIXI.Container();
	graphics.foreground.addChild(pipeGraphics);
	pipeGraphics.x = TILE_WIDTH * coord.x - SLANT * coord.y + TILE_WIDTH / 2 - SLANT / 2;
	pipeGraphics.y = TILE_HEIGHT * coord.y + TILE_HEIGHT / 2;

	const verticalPipe = createDualRender(assetLibrary[TextureAssetNames.PipeVerticalEmpty].asset)
	verticalPipe.sprite.x = -INTERSECTION_RADIUS * 3 * SLANTEDNESS - INTERSECTION_RADIUS / 2
	verticalPipe.sprite.y = INTERSECTION_RADIUS;
	const horizontalPipe = createDualRender(assetLibrary[TextureAssetNames.PipeHorizontalEmpty].asset)
	const horizontalPipeAnimation = new PIXI.AnimatedSprite([
		assetLibrary[TextureAssetNames.PipeHorizontalAnimationFrame1].asset,
		assetLibrary[TextureAssetNames.PipeHorizontalAnimationFrame2].asset,
		assetLibrary[TextureAssetNames.PipeHorizontalAnimationFrame3].asset,
	])
	horizontalPipeAnimation.x = horizontalPipe.sprite.x = INTERSECTION_RADIUS - INTERSECTION_RADIUS / 2 * SLANTEDNESS
	horizontalPipeAnimation.y = horizontalPipe.sprite.y = -INTERSECTION_RADIUS / 2;

	const intersection = createDualRender(assetLibrary[TextureAssetNames.CrossIntersection].asset)
	intersection.sprite.x = -10;
	intersection.sprite.y = -8;

	intersection.root.interactive = true;
	intersection.root.hitArea = new PIXI.Polygon([
		INTERSECTION_RADIUS, INTERSECTION_RADIUS,
		INTERSECTION_RADIUS, -INTERSECTION_RADIUS,
		-INTERSECTION_RADIUS, -INTERSECTION_RADIUS,
		-INTERSECTION_RADIUS, INTERSECTION_RADIUS,
	]);

	const clampsRoot = new PIXI.Container()
	intersection.sprite.addChild(clampsRoot)
	const clamps = [
		TextureAssetNames.ClampUp,
		TextureAssetNames.ClampRight,
		TextureAssetNames.ClampDown,
		TextureAssetNames.ClampLeft
	].map(clamp => {
		const clampSprite = new PIXI.Sprite(assetLibrary[clamp].asset)
		clampSprite.x = -1;
		clampSprite.y = -1;
		clampsRoot.addChild(clampSprite)
		return clampSprite
	})

	const interactiveIntersection = new PIXI.Sprite(assetLibrary[TextureAssetNames.InteractiveIntersection].asset)
	interactiveIntersection.x = 5;
	interactiveIntersection.y = 5;
	intersection.sprite.addChild(interactiveIntersection)

	const feature = new PIXI.Graphics();
	pipeGraphics.addChild(
		feature,
		verticalPipe.root,
		horizontalPipe.root,
		intersection.root,
	);

	intersection.root.interactive = true;
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
		room: {
			base: room,
			gloopPort: gloopPort,
		},
		verticalPipe: {
			base: verticalPipe,
			animation: horizontalPipeAnimation,
		},
		horizontalPipe: {
			base: horizontalPipe,
			animation: horizontalPipeAnimation,
		},
		intersection: {
			base: intersection,
			clampsRoot,
			clamps,
			interactive: interactiveIntersection
		},
		features: feature,
		dirty
	};
}
