import { RoomEditTarget } from "./RoomEditTarget";


export interface RoomPipeEdit {
	target: RoomEditTarget.Pipe;
	horizontal?: boolean;
	vertical?: boolean;
}
