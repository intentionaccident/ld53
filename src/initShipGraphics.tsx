import * as PIXI from "pixi.js";
import { Ship } from "./types/Ship";
import { ProgressBar } from "./types/ProgressBar";
import { TextureAssetNames } from "./types/TextureAssetNames";
import { TextureAssetLibrary } from "./types/TextureAssetLibrary";
import {ScoreBoard} from "./draw/drawScore";

export function initShipGraphics(app: PIXI.Application, assets: TextureAssetLibrary): Ship['graphics'] {
	const shipContainer = new PIXI.Container();
	shipContainer.x = 64 + 32;
	shipContainer.y = 16;
	app.stage.addChild(shipContainer);

	const backgroundContainer = new PIXI.Container();
	shipContainer.addChild(backgroundContainer);

	const topEngine = new PIXI.Sprite(assets[TextureAssetNames.Engine].asset)
	topEngine.x = 445
	topEngine.y = -4
	shipContainer.addChild(topEngine)

	const bottomEngine = new PIXI.Sprite(assets[TextureAssetNames.Engine].asset)
	bottomEngine.x = 414
	bottomEngine.y = 155
	shipContainer.addChild(bottomEngine)

	const foregroundContainer = new PIXI.Container();
	shipContainer.addChild(foregroundContainer);

	const progressBar = new ProgressBar(assets, 360, 50);
	progressBar.root.x = 215;
	progressBar.root.y = app.renderer.height - progressBar.root.height - 58;
	app.stage.addChild(progressBar.root);

	const scoreBar = new ScoreBoard(assets);
	scoreBar.graphics.x = 10;
	scoreBar.graphics.y = 350;
	app.stage.addChild(scoreBar.graphics);

	return {
		root: shipContainer,
		background: backgroundContainer,
		foreground: foregroundContainer,
		progressBar: progressBar,
		scoreBar: scoreBar
	};
}
