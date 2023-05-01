import * as PIXI from "pixi.js";
import { TextureAssetNames } from "./TextureAssetNames";

export type TextureAssetLibrary = Record<TextureAssetNames, { asset: PIXI.Texture; }>;
