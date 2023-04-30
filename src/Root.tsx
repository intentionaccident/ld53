import * as React from "react";
import { Application } from "pixi.js";
import { GameFrame } from "./GameFrame";
import { AppContext } from "./AppContext";
import { AssetLoader } from "./AssetLoader";
import { Game } from "./Game";

export const app = new Application({
	width: 640,
	height: 480,
	antialias: true
});

export const Root: React.FC = () => {
	return <div>
		<AppContext.Provider value={{ app }}>
			<GameFrame>
				<AssetLoader>
					<Game />
				</AssetLoader>
			</GameFrame>
		</AppContext.Provider>
	</div >;
}
