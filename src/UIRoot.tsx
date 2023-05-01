import * as React from 'react'
import styles from "./UIRoot.sass"
import { formatTimeSpan } from "./formatTimeSpan";

export const UIRoot = (props: { score: number, timeLeft: number }) => {
	const timeLeftMessage = props.timeLeft > 0
		? <>
			Score: {props.score}<br />
			Time left: {formatTimeSpan(props.timeLeft)}
		</>
		: <h1>Game Over!</h1>;
	return <div className={styles.uiRoot}>
		{timeLeftMessage}
	</div>
}
