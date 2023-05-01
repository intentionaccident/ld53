import * as React from 'react'
import { MouseEventHandler } from 'react'
import styles from "./UIRoot.sass"
import { formatTimeSpan } from "./formatTimeSpan";
import { TextBox } from "./TextBox";

export const UIRoot = (props: { text: string, score: number, timeLeft: number, handleMessageBoxClosed: MouseEventHandler }) => {
	const timeLeftMessage = props.timeLeft > 0
		? <>
			Score: {(props.score)}
		</>
		: <h1>Game Over!</h1>;
	return <div className={`${styles.uiRoot} ${props.text === '' ? styles.disableMouse : ''}`}>
		{props.text === '' ? timeLeftMessage : <TextBox handleMessageBoxClosed={props.handleMessageBoxClosed} message={props.text} />}
	</div>
}
