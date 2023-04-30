import * as React from 'react'
import styles from "./UIRoot.sass"
import {Ship} from "./types/Ship";

export const UIRoot = (props: { ship: Ship }) => {
	return <div className={styles.uiRoot}>
		Gloop: {props.ship?.gloopAmount}<br/>
		Score: {props.ship?.score}<br/>
		Time left: {props.ship?.timeLeft}
	</div>
}
