export type RoomLayout = {
	i?: '┼' | '┤' | '┴' | '┘' | '├' | '│' | '└' | '╵' | '┬' | '┐' | '─' | '╴' | '┌' | '╷' | '╶'
	f?: '+' | 't' | 'n' | 'r',
	p?: '-' | '+' | '|',
	il?: any,
} | null;
// ┼  ┤  ┴  ┘  ├  │  └  ╵  ┬  ┐  ─  ╴  ┌  ╷  ╶
export const shipLayouts: RoomLayout[][][] = [

	[[{ "i": "┌", "il": true, "p": "+" }, { "i": "╶", "il": false, "f": "t", "p": "+" }, { "i": "┐", "il": false, "p": "|" }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }], [{ "i": "└", "il": false, "p": "+" }, { "i": "│", "il": false, "p": "+" }, { "i": "┤", "il": false, "p": "|" }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }], [{ "i": "│", "il": true, "p": "|" }, { "i": "─", "il": false, "p": "+" }, { "i": "╶", "il": false, "f": "+", "p": "|" }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }], [{ "i": "└", "il": true, "p": "-" }, { "i": "┼", "il": true, "p": "+" }, { "i": "┘", "il": false, "p": "|" }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }], [{ "i": "╶", "il": true, "f": "n", "p": "-" }, { "i": "┴", "il": false, "p": "-" }, { "i": "┘", "il": true }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }], [null, null, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }], [null, null, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }], [null, null, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }], [null, null, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }], [null, null, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }], [null, null, null, null, null, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }], [null, null, null, null, null, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }], [null, null, null, null, null, null, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }], [null, null, null, null, null, null, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }, { "il": false }]],
	[
		[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, null, null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, null, null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, null, null, null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, null, null, null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}]
	]
];

export const shipLayoutMasks: string[][] = [
	[
		"           ",
		"           ",
		"           ",
		"           ",
		"           ",
		"           ",
		"           ",
		"           ",
		"           ",
		"           ",
		"           ",
		"           ",
		"           ",
		"           "
	], [
		"kkk        ",
		"kkk        ",
		"kkk        ",
		"           ",
		"           ",
		"           ",
		"           ",
		"           ",
		"           ",
		"           ",
		"           ",
		"           ",
		"           ",
		"           "
	]
];
