import * as PIXI from 'pixi.js';
import {LINE_SIZE} from "../constants";
import {TextureAssetLibrary} from "./TextureAssetLibrary";
import {TextureAssetNames} from "./TextureAssetNames";
import {Simulate} from "react-dom/test-utils";
import progress = Simulate.progress;

// We should make the progress bar display as "OLD PLANET ------SHIP>----- NEW PLANET"
export class ProgressBar {
	public width: number;
	public height: number;
	public root: PIXI.Container;
	private graphics: PIXI.Graphics;
	private ship: PIXI.Sprite;
	private moon: PIXI.Sprite;
	private saturn: PIXI.Sprite;
	private earth: PIXI.Sprite;

	public constructor(assets: TextureAssetLibrary, width: number, height: number) {
		this.width = width;
		this.height = height;
		this.root = new PIXI.Container();
		this.ship = new PIXI.Sprite(assets[TextureAssetNames.Ship].asset)
		this.moon = new PIXI.Sprite(assets[TextureAssetNames.Moon].asset)
		this.saturn = new PIXI.Sprite(assets[TextureAssetNames.Saturn].asset)
		this.earth = new PIXI.Sprite(assets[TextureAssetNames.Earth].asset)
		this.graphics = new PIXI.Graphics();
		this.root.addChild(
			this.graphics,
			this.moon,
			this.saturn,
			this.earth,
			this.ship,
		);

		this.graphics.clear();
		this.graphics
			.beginFill(0xffffff)
			.drawCircle(0, this.height / 2, 4)
			.endFill();
		const dotCount = 6;
		for (let i = 0; i < 3; i++) {
			const from = i * (this.width / 3);
			const to = (i + 1) * (this.width / 3);
			for (let j = 0; j < dotCount + 1; j++) {
				const x = from + j * (to - from) / dotCount;
				if (j == 0 || j === dotCount) continue;
				this.graphics
					.beginFill(0xffffff)
					.drawRect(x, this.height / 2, 2, 2)
					.endFill();
			}
		}
		this.set(0);
	}

	public set(progress: number) {
		progress = Math.max(Math.min(progress, 1), 0)
		const shipStart = -this.ship.width / 2;
		const shipEnd = this.width - this.ship.width / 2;
		this.ship.x = shipStart + Math.round((shipEnd - shipStart) * progress);
		this.ship.y = this.height / 2 - this.ship.height / 2 - 2;

		this.saturn.x = 1 * this.width / 3 - this.saturn.width / 2;
		this.saturn.y = this.height / 2 - this.saturn.height / 2;

		this.moon.x = 2 * this.width / 3 - this.moon.width / 2;
		this.moon.y = this.height / 2 - this.moon.height / 2;

		this.earth.x = 3 * this.width / 3 - this.earth.width / 2;
		this.earth.y = this.height / 2 - this.earth.height / 2;

		// const g = this.graphics;
		// g.clear();
		// // bg
		// g.beginFill(0x000000)
		// g.lineStyle(LINE_SIZE, 0x333333);
		// g.drawRect(0, 0, 400, 50);
		// g.endFill();
		//
		// // fg
		// g.beginFill(0xffffff)
		// g.lineStyle(LINE_SIZE, 0x333333);
		// progress = Math.max(Math.min(1, progress), 0);
		// g.drawRect(0, 0, progress * 400, 50);
	}
}
