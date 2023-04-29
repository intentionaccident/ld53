import * as PIXI from "pixi.js";
import { lerpColor } from "./lerpColor";


export function getPipeColor(fluid: number, capacity: number): PIXI.Color {
	if (fluid == 0) {
		return new PIXI.Color(0x000000);
	} else {
		return lerpColor(new PIXI.Color(0x7777ff), new PIXI.Color(0x1111aa), fluid / capacity);
	}
}
