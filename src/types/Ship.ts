import {RoomHandle} from "./RoomHandle";

export interface Ship {
	gloopAmount: number;
	landingGearFuel: number;
	requiredLandingGearFuel: number;
	roomHandles: RoomHandle[][];
	eventQueue: GameEvent[];
}
