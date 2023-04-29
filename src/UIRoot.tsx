import * as React from 'react'
import styles from "./UIRoot.sass"

<<<<<<< HEAD
export const UIRoot = (props: { gloopAmount: string, landingGearFuel: number, requiredLandingGearFuel: number }) => {
=======
export const UIRoot = (props: { lastPressedKey: string }) => {
	return null
>>>>>>> c853c5a (add interactivity on events)
	return <div className={styles.uiRoot}>
		Gloop: {props.gloopAmount}<br/>
		{props.landingGearFuel}/{props.requiredLandingGearFuel} {props.landingGearFuel >= props.requiredLandingGearFuel ? 'Landing gear extended!' : ''}
	</div>
}
