import * as PIXI from "pixi.js";
import { SoundAssetNames } from "./SoundAssetNames";

export type SoundAssetLibrary = Record<SoundAssetNames, { asset: PIXI.Texture; }>;
