import * as React from 'react'
import styles from "./UIRoot.sass"

export const UIRoot = (props: { gloopAmount: number }) => {
	return <div className={styles.uiRoot}>
		Gloop: {props.gloopAmount}
	</div>
}
