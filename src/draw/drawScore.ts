import * as PIXI from 'pixi.js';
import {SCORE_MAX} from "../constants";
import {Simulate} from "react-dom/test-utils";
import progress = Simulate.progress;
import {lerpColor} from "./lerpColor";

export function drawScore(g: PIXI.Graphics, score: number) {
	g.clear();

	const width = 140;
	const height = 120;
	const x = 0;
	const y = 0;
	let progress = score / SCORE_MAX;
	progress = Math.min(progress, 1);
	progress = Math.max(progress, 0);
	if (progress >= 0 && progress < 0.75) {
		progress = (progress / 0.75) * 0.50
	}
	if (progress >= 0.75 && progress <= 1) {
		progress = 0.50 + ((progress - 0.75) / 0.25) * 0.50
	}
	progress = (progress) * 0.924 + 0.06;

	g.beginFill(0x7A9E96);
	g.drawPolygon([
		x, y,
		x + width, y,
		x + width, y + height,
		x, y + height,
	]);
	g.endFill();

	const colorFill = lerpColor(new PIXI.Color(0x524335), new PIXI.Color(0x229D3C), progress);
	const colorLine = lerpColor(new PIXI.Color(0x362625), new PIXI.Color(0x1A7A00), progress);

	g.beginFill(colorFill);
	g.lineStyle(1, colorLine, 1, 0);
	g.drawPolygon([
		x, y + Math.round(height * (1 - progress)),
		x + width, y + Math.round(height * (1 - progress)),
		x + width, y + height,
		x, y + height,
	]);
	g.endFill();

	g.lineStyle(1, 0x48524F, 1, 0);
	g.drawPolygon([
		x, y,
		x + width, y,
		x + width, y + height,
		x, y + height,
	]);
}
