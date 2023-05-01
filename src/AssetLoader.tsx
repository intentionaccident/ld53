import * as React from "react";
import * as PIXI from "pixi.js";
import { AssetContext } from "./AssetContext";
import { SoundAssetLibrary } from "./types/SoundAssetLibrary";
import { TextureAssetNames } from "./types/TextureAssetNames";
import {SoundAssetNames} from "./types/SoundAssetNames";
import {TextureAssetLibrary} from "./types/TextureAssetLibrary";
import {Sound} from "@pixi/sound";

function loadSound(name: string): Promise<Sound> {
	return new Promise<Sound>((resolve, reject) => {
		Sound.from({
			url: `assets/${name}.mp3`,
			preload: true,
			loaded: function (err, sound) {
				if (err) reject(err)
				else resolve(sound)
			}
		})
	});
}

export const AssetLoader: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [textureAssets, setTextureAssets] = React.useState<TextureAssetLibrary>(null)
	const [soundAssets, setSoundAssets] = React.useState<SoundAssetLibrary>(null)
	React.useEffect(() => {
		Promise.all(
			Object.values(TextureAssetNames).map(
				name => PIXI.Assets.load(`assets/${name}.png`)
					.then(asset => ({ name, asset }))
			)
		).then(assets => setTextureAssets(
			assets.reduce(
				(total, next) => (total[next.name] = { asset: next.asset }, total),
				{} as TextureAssetLibrary
			)
		))
		Promise.all(
			Object.values(SoundAssetNames).map(
				name => loadSound(name)
					.then(asset => ({ name, asset }))
			)
		).then(assets => setSoundAssets(
			assets.reduce(
				(total, next) => (total[next.name] = { asset: next.asset }, total),
				{} as SoundAssetLibrary
			)
		))
	}, [])

	return <AssetContext.Provider value={{ soundAssets, textureAssets }}>
		{(textureAssets && soundAssets) ? children : null}
	</AssetContext.Provider>
}
