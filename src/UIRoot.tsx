import * as React from 'react'
import { MouseEventHandler } from 'react'
import styles from "./UIRoot.sass"
import { formatTimeSpan } from "./formatTimeSpan";
import { TextBox } from "./TextBox";

export const UIRoot = (props: { text: string, handleMessageBoxClosed: MouseEventHandler }) => {
	return <div className={`${styles.uiRoot} ${props.text === '' ? styles.disableMouse : ''}`}>
		{props.text === '' ? <></> : <TextBox handleMessageBoxClosed={props.handleMessageBoxClosed} message={props.text} />}
	</div>
}
