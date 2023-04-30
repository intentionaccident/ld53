import * as React from "react";
import * as PIXI from "pixi.js";

export const AppContext = React.createContext<{
	app: PIXI.Application
}>({
	app: null
})
