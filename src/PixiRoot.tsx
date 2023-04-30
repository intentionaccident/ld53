import { useRef, useEffect } from "react";
import * as React from "react";
import { AppContext } from "./AppContext";

export const PixiRoot = () => {
	const { app } = React.useContext(AppContext)
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const view = app.view as any as Node;
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
