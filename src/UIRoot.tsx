import * as React from 'react'
import styles from "./UIRoot.sass"

export const UIRoot = (props: { gloopAmount: string, landingGearFuel: number, requiredLandingGearFuel: number }) => {
	return <div className={styles.uiRoot}>
		Gloop: {props.gloopAmount}<br/>
		{props.landingGearFuel}/{props.requiredLandingGearFuel} {props.landingGearFuel >= props.requiredLandingGearFuel ? 'Landing gear extended!' : ''}
	</div>
}
