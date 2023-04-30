import { RoomHandle } from "../types/RoomHandle";

export function setRoomVisibility(room: RoomHandle, isVisible: boolean) {
	room.graphics.room.root.visible = room.graphics.pipes.visible = isVisible;
}
