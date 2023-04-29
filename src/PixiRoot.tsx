import { useRef, useEffect } from "react";
import * as React from "react";
import * as PIXI from 'pixi.js'

export const PixiRoot = (props: { app: PIXI.Application }) => {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		let view = props.app.view;
		ref.current.appendChild(view);
		return () => {
			ref.current.removeChild(view);
		}
	}, [ref]);
	return <div ref={ref} />;
}
