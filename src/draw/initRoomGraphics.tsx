import * as PIXI from "pixi.js";
import { RoomHandle } from "../types/RoomHandle";
import { INTERSECTION_RADIUS, SLANT, TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { Ship } from "../types/Ship";

export function initRoomGraphics(coord: PIXI.Point, graphics: Ship['graphics']): RoomHandle['graphics'] {
	const roomGraphics = new PIXI.Graphics();
	roomGraphics.x = TILE_WIDTH * coord.x - SLANT * coord.y;
	roomGraphics.y = TILE_HEIGHT * coord.y;
	graphics.background.addChild(roomGraphics);

	const pipeGraphics = new PIXI.Container();
	graphics.foreground.addChild(pipeGraphics);
	pipeGraphics.x = TILE_WIDTH * coord.x - SLANT * coord.y + TILE_WIDTH / 2 - SLANT / 2;
	pipeGraphics.y = TILE_HEIGHT * coord.y + TILE_HEIGHT / 2;

	const verticalPipe = new PIXI.Graphics();
	const horizontalPipe = new PIXI.Graphics();
	const intersection = new PIXI.Graphics();
	const feature = new PIXI.Graphics();
	pipeGraphics.addChild(
		feature,
		verticalPipe,
		horizontalPipe,
		intersection
	);

	intersection.interactive = true;
	intersection.cursor = 'pointer';
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
		room: roomGraphics,
		verticalPipe,
		horizontalPipe,
		intersection,
		features: feature,
	};
}
