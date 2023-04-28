import * as React from 'react'
import styles from "./UIRoot.sass"

export const UIRoot = (props: {lastPressedKey: string}) => {
	return <div className={styles.uiRoot}>
		Hello World: {props.lastPressedKey}
	</div>
}
