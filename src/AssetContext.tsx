import * as React from "react";
import { AssetLibrary } from "./types/AssetLibrary";

export const AssetContext = React.createContext<{
	assets: AssetLibrary
}>({
	assets: null
})