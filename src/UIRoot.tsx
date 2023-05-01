import * as React from 'react'
import styles from "./UIRoot.sass"
import {formatTimeSpan} from "./formatTimeSpan";
import {MouseEventHandler} from "react";

function TextBox(props: {message: string, handleMessageBoxClosed: MouseEventHandler}) {
	return <div>
		{props.message}
		<button onClick={props.handleMessageBoxClosed}>OK</button>
	</div>;
}

export const UIRoot = (props: { text: string, score: number, timeLeft: number, handleMessageBoxClosed: MouseEventHandler }) => {
	const timeLeftMessage = props.timeLeft > 0
		? <>
			Score: {props.score}<br />
			Time left: {formatTimeSpan(props.timeLeft)}
		</>
		: <h1>Game Over!</h1>;
	return <div className={`${styles.uiRoot} ${props.text === '' ? styles.disableMouse : ''}`}>
		{props.text === '' ? timeLeftMessage : <TextBox handleMessageBoxClosed={props.handleMessageBoxClosed} message={props.text}/>}
	</div>
}
