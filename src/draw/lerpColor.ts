import * as PIXI from "pixi.js";

export function lerpColor(fc: PIXI.Color, tc: PIXI.Color, t: number): PIXI.Color {
	return new PIXI.Color([
		fc.red + ((tc.red - fc.red) * t),
		fc.green + ((tc.green - fc.green) * t),
		fc.blue + ((tc.blue - fc.blue) * t)
	]);
}
