import * as PIXI from 'pixi.js';
import {SCORE_MAX} from "../constants";
import {Simulate} from "react-dom/test-utils";
import progress = Simulate.progress;
import {lerpColor} from "./lerpColor";
import {TextureAssetLibrary} from "../types/TextureAssetLibrary";

export class ScoreBoard {
	public graphics: PIXI.Graphics;
	private assets: TextureAssetLibrary;
	private crates: PIXI.Sprite[];
	constructor(assets: TextureAssetLibrary) {
		this.graphics = new PIXI.Graphics();
		this.assets = assets;
		this.crates = [];
	}
	private width = 140;
	private height= 120;

	public set(score: number) {
		while (this.crates.length < score) {
			const crate = new PIXI.Sprite(this.assets["box-icon"].asset);
			this.crates.push(crate);
			this.graphics.addChild(crate);
		}

		const lineWidth = Math.round(this.width / 7);
		const lineHeight = Math.round(this.height / 11);
		const padding = this.assets["box-icon"].asset.width;

		for (let y = lineHeight - 1; y >= 0; y--) {
			for (let x = 0; x < lineWidth; x++) {
				const i = y * lineWidth + x;
				if (i >= this.crates.length) break;
				const width = this.width - 2 * padding - 5;
				this.crates[i].x = padding + x * (width / (lineWidth));
				this.crates[i].y = -3 + this.height - (y + 1) * lineHeight;
			}
		}

		// for (let i = 0; i < this.crates.length; i++) {
		// 	const padding = this.crates[i].width;
		// 	const width = 140 - 2 * padding;
		// 	const x = padding + i * width / (this.crates.length - 1);
		// 	this.crates[i].x = x - (this.crates[i].width / 2);
		// }

		this.graphics.clear();

		const width = this.width;
		const height = this.height;
		const x = 0;
		let y = 0;
		let progress = 0.06;

		this.graphics.beginFill(0x505D5A);
		this.graphics.drawPolygon([
			x, y,
			x + width, y,
			x + width, y + height,
			x, y + height,
		]);
		this.graphics.endFill();

		for (let i = 0; i < lineHeight; i++) {
			const y = (-i) * lineHeight;

			const colorFill = lerpColor(new PIXI.Color(0x524335), new PIXI.Color(0x229D3C), progress);
			const colorLine = lerpColor(new PIXI.Color(0x362625), new PIXI.Color(0x1A7A00), progress);

			this.graphics.beginFill(colorFill);
			this.graphics.lineStyle(1, colorLine, 1, 0);
			this.graphics.drawPolygon([
				x, y + Math.round(height * (1 - progress)),
				x + width, y + Math.round(height * (1 - progress)),
				x + width, y + height,
				x, y + height,
			]);
			this.graphics.endFill();
		}

		this.graphics.lineStyle(2, 0x38403E, 1, 0);
		this.graphics.drawPolygon([
			x, y,
			x + width, y,
			x + width, y + height,
			x, y + height,
		]);
	}
}
