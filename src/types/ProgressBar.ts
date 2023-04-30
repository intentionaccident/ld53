import * as PIXI from 'pixi.js';
import {LINE_SIZE} from "../constants";

// We should make the progress bar display as "OLD PLANET ------SHIP>----- NEW PLANET"
export class ProgressBar {
	public graphics: PIXI.Graphics;
	public constructor() {
		this.graphics = new PIXI.Graphics();
		this.set(0);
	}

	public set(progress: number) {
		const g = this.graphics;

		g.clear();

		// bg
		g.beginFill(0x000000)
		g.lineStyle(LINE_SIZE, 0x333333);
		g.drawRect(0, 0, 100, 10);
		g.endFill();

		// fg
		g.beginFill(0xffffff)
		g.lineStyle(LINE_SIZE, 0x333333);
		progress = Math.min(1, progress);
		g.drawRect(0, 0, progress * 100, 10);
	}
}
