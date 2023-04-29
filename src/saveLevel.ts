import {Ship} from "./types/Ship";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

export function saveLevel(ship: Ship): string {
	function toChar(up: boolean, left: boolean, down: boolean, right: boolean) {
			if (up && left && down && right) return '┼';
			if (up && left && down && !right) return '┤';
			if (up && left && !down && right) return '┴';
			if (up && left && !down && !right) return '┘';
			if (up && !left && down && right) return '├';
			if (up && !left && down && !right) return '│';
			if (up && !left && !down && right) return '└';
			if (up && !left && !down && !right) return '╵';
			if (!up && left && down && right) return '┬';
			if (!up && left && down && !right) return '┐';
			if (!up && left && !down && right) return '─';
			if (!up && left && !down && !right) return '╴';
			if (!up && !left && down && right) return '┌';
			if (!up && !left && down && !right) return '╷';
			if (!up && !left && !down && right) return '╶';
			if (!up && !left && !down && !right) return undefined;
			console.error('Unreachable');
	}

	return 'export const shipLayout: RoomLayout[][] = ' + JSON.stringify(ship.roomHandles.map(rows =>
		rows.map(roomHandle => {
			const d = roomHandle.data;
			let f = undefined;
			const feature = roomHandle.data.feature;
			if (feature.type === 'source') {
				f = '+';
			} else if (feature.type === 'sink' && feature.subtype === 'thrusters') {
				f = 't';
			} else if (feature.type === 'sink' && feature.subtype === 'navigation') {
				f = 'n';
			} else if (feature.type === 'sink' && feature.subtype === 'reactor') {
				f = 'r';
			}
			let p = undefined;
			if (d.bottomPipeCapacity > 0 && d.rightPipeCapacity > 0) {
				p = '+';
			} else if (d.bottomPipeCapacity > 0) {
				p = '|';
			} else if (d.rightPipe > 0) {
				p = '-';
			}
			return d.hidden
				? null
				: {
					i: toChar(d.topOpen, d.leftOpen, d.bottomOpen, d.rightOpen),
					f: f,
					p: p
				};
		})
	)) + ';';
}
