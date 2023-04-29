import { RoomHandle } from "../types/RoomHandle";

export function setRoomVisibility(room: RoomHandle, isVisible: boolean) {
	room.graphics.room.visible = room.graphics.pipes.visible = isVisible;
}
