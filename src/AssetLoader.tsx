import * as React from "react";
import * as PIXI from "pixi.js";
import { AssetContext } from "./AssetContext";
import { AssetLibrary } from "./types/AssetLibrary";
import { AssetNames } from "./types/AssetNames";

export const AssetLoader: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [assets, setAssets] = React.useState<AssetLibrary>(null)
	React.useEffect(() => {
		Promise.all(
			Object.values(AssetNames).map(
				name => PIXI.Assets.load(`assets/${name}.png`)
					.then(asset => ({ name, asset }))
			)
		).then(assets => setAssets(
			assets.reduce(
				(total, next) => (total[next.name] = { asset: next.asset }, total),
				{} as AssetLibrary
			)
		))
	}, [])

	return <AssetContext.Provider value={{ assets }}>
		{assets ? children : null}
	</AssetContext.Provider>
}