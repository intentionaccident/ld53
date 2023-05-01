import * as React from "react";
import * as PIXI from "pixi.js";
import { AssetContext } from "./AssetContext";
import { SoundAssetLibrary } from "./types/SoundAssetLibrary";
import { TextureAssetNames } from "./types/TextureAssetNames";
import { SoundAssetNames } from "./types/SoundAssetNames";
import { TextureAssetLibrary } from "./types/TextureAssetLibrary";
import { Sound } from "@pixi/sound";
import { AnimationAssetNames } from "./types/AnimationAssetNames";
import { AnimationAssetLibrary } from "./types/AnimationAssetLibrary";

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

const animationLengths: Record<AnimationAssetNames, number> = {
	[AnimationAssetNames.Alert]: 11,
	[AnimationAssetNames.Box]: 28,
	[AnimationAssetNames.InteractableIntersetion]: 2
}

export const AssetLoader: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [textureAssets, setTextureAssets] = React.useState<TextureAssetLibrary>(null)
	const [soundAssets, setSoundAssets] = React.useState<SoundAssetLibrary>(null)
	const [animationAssets, setAnimationAssets] = React.useState<AnimationAssetLibrary>(null)
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

		Promise.all(
			Object.keys(animationLengths)
				.map(name => Promise.all(
					[...Array(animationLengths[name])].map(
						(_, i) => PIXI.Assets.load(`assets/${name}${i + 1}.png`)
							.then(asset => ({ asset, i }))
					)
				).then(assets => ({ assets, name })))
		).then(assets => setAnimationAssets(
			assets.reduce(
				(total, next) => (total[next.name] = { textures: next.assets.map(a => a.asset) }, total),
				{} as AnimationAssetLibrary
			)
		))
	}, [])

	return <AssetContext.Provider value={{ soundAssets, textureAssets, animationAssets }}>
		{(textureAssets && soundAssets && animationAssets) ? children : null}
	</AssetContext.Provider>
}
