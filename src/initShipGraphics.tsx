import * as PIXI from "pixi.js";
import { Ship } from "./types/Ship";
import { ProgressBar } from "./types/ProgressBar";
import { TextureAssetNames } from "./types/TextureAssetNames";
import { TextureAssetLibrary } from "./types/TextureAssetLibrary";

export function initShipGraphics(app: PIXI.Application, assets: TextureAssetLibrary): Ship['graphics'] {
	const shipContainer = new PIXI.Container();
	shipContainer.x = 64 + 32;
	shipContainer.y = 16;
	app.stage.addChild(shipContainer);

	const backgroundContainer = new PIXI.Container();
	shipContainer.addChild(backgroundContainer);

	const engine = new PIXI.Sprite(assets[TextureAssetNames.Engine].asset)
	engine.x = 440
	engine.y = -4
	shipContainer.addChild(engine)

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
