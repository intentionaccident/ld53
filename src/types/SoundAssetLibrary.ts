import {Sound} from '@pixi/sound';
import { SoundAssetNames } from "./SoundAssetNames";
export type SoundAssetLibrary = Record<SoundAssetNames, { asset: Sound; }>;
