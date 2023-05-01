import { RoomHandle } from "../types/RoomHandle";

export function updateRoomSprites(room: RoomHandle) {
	room.graphics.room.alertScreen.visible = room.data.feature.type !== "empty";
	if (room.data.feature.type === "sink") {
		room.graphics.room.alertAnimation.visible = room.data.feature.state === "requesting";
	}
}
