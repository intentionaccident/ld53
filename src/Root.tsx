import * as React from "react";
import {Application, Sprite, Texture} from "pixi.js";
import {GameFrame} from "./GameFrame";
import {UIRoot} from "./UIRoot";
import {PixiRoot} from "./PixiRoot";
import {useEffect, useState} from "react";

const app = new Application({
	width: 640,
	height: 480
});
const texture = Texture.from('assets/bunny.png');
const bunny = new Sprite(texture);
bunny.x = app.renderer.width / 2;
bunny.y = app.renderer.height / 2;
bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;
app.stage.addChild(bunny);
app.ticker.add(() => {
	bunny.rotation += 0.01;
});
// TODO: Use union type
interface GameEvent {
	type: 'KeyPressed' | 'KeyReleased',
	name: string
}
const eventQueue: GameEvent[] = [];

export function Root() {
	const [lastPressedKey, setLastPressedKey] = useState('');

	useEffect(() => {
		let keyDownListener = (event) => {
			const name = event.key;
			eventQueue.push({type: 'KeyPressed', name});
		};

		let gameLoop = (delta) => {
			while (eventQueue.length > 0) {
				const event = eventQueue.pop();
				if (event.type === 'KeyPressed') {
					bunny.anchor.x += 0.2;
					setLastPressedKey(event.name);
				}
			}

			bunny.rotation -= 0.01 * delta;
		};

		app.ticker.add(gameLoop);
		window.addEventListener('keydown', keyDownListener, false);
		return () => {
			app.ticker.remove(gameLoop);
			window.removeEventListener('keydown', keyDownListener);
		}
	}, []);

	return <div>
		<GameFrame>
			<PixiRoot app={app}/>
			<UIRoot lastPressedKey={lastPressedKey}/>
		</GameFrame>
	</div>;
}
