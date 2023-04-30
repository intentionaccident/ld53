import * as PIXI from "pixi.js";
import { AssetNames } from "./AssetNames";

export type AssetLibrary = Record<AssetNames, { asset: PIXI.Texture; }>;
