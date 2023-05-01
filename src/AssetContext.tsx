import * as React from "react";
import { SoundAssetLibrary } from "./types/SoundAssetLibrary";
import { TextureAssetLibrary } from "./types/TextureAssetLibrary";
import { AnimationAssetLibrary } from "./types/AnimationAssetLibrary";

export const AssetContext = React.createContext<{
	textureAssets: TextureAssetLibrary,
	soundAssets: SoundAssetLibrary,
	animationAssets: AnimationAssetLibrary,
}>({
	textureAssets: null,
	soundAssets: null,
	animationAssets: null,
})
