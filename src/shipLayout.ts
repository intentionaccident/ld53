export type RoomLayout = {
	i: '-' | '+' | '|' | '>' | '<'
	f?: '+' | '-'
};
export const shipLayout: RoomLayout[][] = [
	[{i: '+'}, {i: '-'}, {i: '|'}, {i: '+'}, {i: '+'}, {i: '+'}],
	[{i: '|'}, {i: '>', f: '+'}, {i: '+'}, {i: '+'}, {i: '+'}, {i: '+'}],
	[{i: '-'}, {i: '-'}, {i: '-'}, {i: '-'}, {i: '+'}, {i: '+'}],
	[{i: '+'}, {i: '+'}, {i: '+'}, {i: '+', f: '-'}, {i: '+'}, {i: '+'}],
];
