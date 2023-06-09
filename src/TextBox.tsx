import * as React from "react";
import {MouseEventHandler} from "react";
import styles from "./TextBox.sass";

export function TextBox(props: { message: string, handleMessageBoxClosed: MouseEventHandler }) {
	return <div className={styles.container}>
		<div className={styles.box}>
			<pre className={styles.text}>
				{props.message}
			</pre>
			<div className={styles.buttonContainer}>
				<button className={styles.button} onClick={props.handleMessageBoxClosed}>OK</button>
			</div>
		</div>
	</div>;
}
