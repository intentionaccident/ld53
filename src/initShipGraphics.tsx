import * as PIXI from "pixi.js";
import { Ship } from "./types/Ship";
import { app } from "./Root";

export function initShipGraphics(): Ship['graphics'] {
	const shipContainer = new PIXI.Container();
	shipContainer.x = 64 + 32;
	shipContainer.y = 16;
	app.stage.addChild(shipContainer);

	const backgroundContainer = new PIXI.Container();
	shipContainer.addChild(backgroundContainer);

	const foregroundContainer = new PIXI.Container();
	shipContainer.addChild(foregroundContainer);

	return {
		root: shipContainer,
		background: backgroundContainer,
		foreground: foregroundContainer,
	};
}
