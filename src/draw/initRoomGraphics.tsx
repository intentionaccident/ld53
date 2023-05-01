import * as PIXI from "pixi.js";
import { DualRender, RoomHandle } from "../types/RoomHandle";
import { INTERSECTION_RADIUS, SLANT, SLANTEDNESS, TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { Ship } from "../types/Ship";
import { TextureAssetNames } from "../types/TextureAssetNames";
import { TextureAssetLibrary } from "../types/TextureAssetLibrary";
import { AnimationAssetLibrary } from "../types/AnimationAssetLibrary";

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

export function initRoomGraphics(coord: PIXI.Point, graphics: Ship['graphics'], assetLibrary: TextureAssetLibrary, animationAssets: AnimationAssetLibrary): RoomHandle['graphics'] {
	const room = createDualRender(assetLibrary[TextureAssetNames.Template].asset)
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

	const alertAnimation = new PIXI.AnimatedSprite(animationAssets.alert.textures.slice(1))
	alertAnimation.x = -SLANT;
	alertAnimation.animationSpeed = 0.1;
	alertAnimation.visible = false
	alertAnimation.play()

	const boxArrivalAnimation = new PIXI.AnimatedSprite(animationAssets.box.textures.slice(0, 13))
	boxArrivalAnimation.x = -SLANT;
	boxArrivalAnimation.animationSpeed = 0.2;
	boxArrivalAnimation.visible = false
	boxArrivalAnimation.loop = false

	const boxFillingAnimation = new PIXI.AnimatedSprite(animationAssets.box.textures.slice(13))
	boxFillingAnimation.x = -SLANT;
	boxFillingAnimation.animationSpeed = 0.2;
	boxFillingAnimation.visible = false
	boxArrivalAnimation.loop = false

	const alertScreen = new PIXI.Sprite(animationAssets.alert.textures[0])
	alertScreen.x = -SLANT;
	room.root.addChild(alertScreen, alertAnimation, boxArrivalAnimation, boxFillingAnimation)

	const gloopPort = new PIXI.Sprite(assetLibrary[TextureAssetNames.GloopPortTripleEmpty].asset)
	const gloopSyphon = new PIXI.Sprite(assetLibrary[TextureAssetNames.GloopPortSyphonEmpty].asset)
	gloopSyphon.x = gloopPort.x = -TILE_WIDTH / 2 - SLANT / 2;
	gloopSyphon.y = gloopPort.y = -TILE_HEIGHT / 2;
	gloopSyphon.visible = gloopPort.visible = false;

	gloopPort.hitArea = new PIXI.Polygon([
		-SLANT + TILE_WIDTH / 2, TILE_HEIGHT / 2,
		-SLANT + TILE_WIDTH, TILE_HEIGHT / 2,
		-SLANT * 1.5 + TILE_WIDTH, TILE_HEIGHT,
		-SLANT * 1.5 + TILE_WIDTH / 2, TILE_HEIGHT
	]);
	gloopPort.interactive = true

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
	const progress = new PIXI.Graphics();
	pipeGraphics.addChild(
		feature,
		verticalPipe.root,
		horizontalPipe.root,
		gloopPort,
		gloopSyphon,
		intersection.root,
		progress
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
			gloopPort,
			gloopSyphon,
			alertAnimation,
			alertScreen,
			boxArrivalAnimation,
			boxFillingAnimation
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
		progress: progress,
		dirty
	};
}
