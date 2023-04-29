import * as PIXI from "pixi.js";
import { lerpColor } from "./lerpColor";


export function getPipeColor(fluid: number, capacity: number): PIXI.Color {
	return lerpColor(new PIXI.Color(0x000000), new PIXI.Color(0x0000ff), fluid / capacity);
}
