import * as React from "react";
import { SoundAssetLibrary } from "./types/SoundAssetLibrary";
import {TextureAssetLibrary} from "./types/TextureAssetLibrary";

export const AssetContext = React.createContext<{
	textureAssets: TextureAssetLibrary,
	soundAssets: SoundAssetLibrary
}>({
	textureAssets: null,
	soundAssets: null
})
