import * as PIXI from "pixi.js";
import { AnimationAssetNames } from "./AnimationAssetNames";

export type AnimationAssetLibrary = Record<AnimationAssetNames, { textures: PIXI.Texture[]; }>;
