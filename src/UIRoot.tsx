import * as React from 'react'
import styles from "./UIRoot.sass"
import {formatTimeSpan} from "./formatTimeSpan";

export const UIRoot = (props: { gloopAmount: number, score: number, timeLeft: number }) => {
	const timeLeftMessage = props.timeLeft > 0
		? <>
			Gloop: {props.gloopAmount}<br/>
			Score: {props.score}<br/>
			Time left: {formatTimeSpan(props.timeLeft)}
		</>
		: <h1>GAME OVER!</h1>;
	return <div className={styles.uiRoot}>
		{timeLeftMessage}
	</div>
}
