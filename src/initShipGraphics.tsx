import * as PIXI from "pixi.js";
import { Ship } from "./types/Ship";
import { app } from "./Root";
import {ProgressBar} from "./types/ProgressBar";

export function initShipGraphics(): Ship['graphics'] {
	const shipContainer = new PIXI.Container();
	shipContainer.x = 64 + 32;
	shipContainer.y = 16;
	app.stage.addChild(shipContainer);

	const backgroundContainer = new PIXI.Container();
	shipContainer.addChild(backgroundContainer);

	const foregroundContainer = new PIXI.Container();
	shipContainer.addChild(foregroundContainer);

	const progressBar = new ProgressBar();
	const MARGIN = 6;
	progressBar.graphics.x = app.renderer.width - progressBar.graphics.width - MARGIN;
	progressBar.graphics.y = MARGIN
	app.stage.addChild(progressBar.graphics);

	return {
		root: shipContainer,
		background: backgroundContainer,
		foreground: foregroundContainer,
		progressBar: progressBar
	};
}
