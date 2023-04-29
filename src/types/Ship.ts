import {RoomHandle} from "./RoomHandle";
import {GameEvent} from "./GameEvent";

export interface Ship {
	gloopAmount: number;
	landingGearFuel: number;
	requiredLandingGearFuel: number;
	roomHandles: RoomHandle[][];
	eventQueue: GameEvent[];
}
