import { useRef, useEffect } from "react";
import * as React from "react";
import * as PIXI from 'pixi.js'

export const PixiRoot = (props: { app: PIXI.Application }) => {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const view = props.app.view as any as Node;
		view.addEventListener('contextmenu', (event) => {
			event.preventDefault();
		});
		ref.current.appendChild(view);
		return () => {
			ref.current.removeChild(view);
		}
	}, [ref]);
	return <div ref={ref} />;
}
