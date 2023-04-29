export type RoomLayout = {
	i?: '-' | '+' | '|' | '>' | '<' | 'L' | 'J'
	f?: '+' | '-'
};
export const shipLayout: RoomLayout[][] = [
	[{i: '+'}, {i: '-'}, {i: '|'}, {i: '+'}, {i: '+'}, {i: '+'}],
	[{i: '|'}, {i: 'J', f: '+'}, {i: '+'}, {i: '+'}, {i: '+'}, {i: '+'}],
	[{i: '-'}, {i: '-'}, {i: '-'}, {i: '-'}, {i: '+'}, {i: '+'}],
	[{i: '+'}, {i: '+'}, {i: '+'}, {i: '+', f: '-'}, {i: '+'}, {i: '+'}],
];
