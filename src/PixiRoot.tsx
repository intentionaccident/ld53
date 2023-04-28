import { Application, Texture, Sprite } from "pixi.js";
import { useRef, useEffect } from "react";
import * as React from "react";
import * as PIXI from 'pixi.js'

export const PixiRoot = (props: {app: PIXI.Application}) => {
	const ref: React.useRef<HTMLDivElement> = useRef(null);
	useEffect(() => {
		let view = props.app.view;
		ref.current.appendChild(view);
		return () => {
			ref.current.removeChild(view);
		}
	}, [ref]);
	return <div ref={ref} />;
}
