import { INTERSECTION_RADIUS, LINE_SIZE, SLANT, SLANTEDNESS } from "../constants";
import { RoomHandle } from "../types/RoomHandle";
import { IntersectionDirection } from "../types/IntersectionDirection";

export function drawIntersection(room: RoomHandle) {
	const allOn = room.data.intersectionStates.filter(s => s).length == 4;

	for (let i = 0; i < 4; i++) {
		room.graphics.intersection.clamps[i].visible =
			allOn ? false : room.data.intersectionStates[i];
	}
	room.graphics.intersection.interactive.visible = !allOn;

	const graphics = room.graphics.intersection.base.primitive;

	graphics.clear();
	graphics.beginFill((room.data.intersectionStates.find(i => i)) ? 0x999999 : 0x990000);
	graphics.lineStyle(LINE_SIZE, 0x00FFFF, 1);
	graphics.drawCircle(0, 0, INTERSECTION_RADIUS);
	graphics.endFill();

	if (room.data.intersectionStates[IntersectionDirection.Left]) {
		graphics.lineStyle(LINE_SIZE, 0x333333, 1);
		graphics.lineTo(-INTERSECTION_RADIUS, 0);
		graphics.endFill();
	}

	if (room.data.intersectionStates[IntersectionDirection.Right]) {
		graphics.lineStyle(LINE_SIZE, 0x333333, 1);
		graphics.lineTo(INTERSECTION_RADIUS, 0);
		graphics.endFill();
	}

	if (room.data.intersectionStates[IntersectionDirection.Top]) {
		graphics.lineStyle(LINE_SIZE, 0x333333, 1);
		graphics.lineTo(INTERSECTION_RADIUS * SLANTEDNESS, -INTERSECTION_RADIUS);
		graphics.endFill();
	}

	if (room.data.intersectionStates[IntersectionDirection.Bottom]) {
		graphics.lineStyle(LINE_SIZE, 0x333333, 1);
		graphics.lineTo(-INTERSECTION_RADIUS * SLANTEDNESS, INTERSECTION_RADIUS);
		graphics.endFill();
	}
}
