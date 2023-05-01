export type RoomLayout = {
	i?: '┼' | '┤' | '┴' | '┘' | '├' | '│' | '└' | '╵' | '┬' | '┐' | '─' | '╴' | '┌' | '╷' | '╶'
	f?: '+' | 't' | 'n' | 'r' | 'o',
	p?: '-' | '+' | '|',
	il?: any,
} | null;
// ┼  ┤  ┴  ┘  ├  │  └  ╵  ┬  ┐  ─  ╴  ┌  ╷  ╶
export const shipLayouts: RoomLayout[][][] = [
	[[{"i":"┌","il":true,"p":"+"},{"i":"┐","il":false,"f":"t","p":"+"},{"i":"┐","il":false,"p":"+"},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[{"i":"└","il":false,"p":"+"},{"i":"─","il":false,"p":"+"},{"i":"┐","il":false,"p":"|"},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[{"i":"└","il":false,"f":"n","p":"+"},{"i":"│","il":false,"p":"+"},{"i":"╵","il":false,"f":"+","p":"|"},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[{"i":"└","il":true,"p":"-"},{"i":"│","il":false,"p":"+"},{"i":"┘","il":false,"p":"+"},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[{"i":"╶","il":true,"f":"r","p":"-"},{"i":"┴","il":false,"p":"-"},{"i":"┘","il":true},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[null,null,{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[null,null,{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[null,null,{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[null,null,{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[null,null,{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[null,null,null,null,null,{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[null,null,null,null,null,{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[null,null,null,null,null,null,{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[null,null,null,null,null,null,{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}]],
	[[{"i":"┌","il":true,"p":"+"},{"i":"┌","il":false,"f":"t","p":"+"},{"i":"┌","il":false,"p":"+"},{"i":"┐","il":false,"p":"+"},{"i":"─","il":true,"f":"n","p":"-"},{"i":"┌","il":false,"p":"+"},{"i":"╴","il":true,"f":"n"},{"il":false,"p":"-"},{"il":false},{"il":false},{"il":false}],[{"i":"┌","il":false,"p":"+"},{"i":"│","il":false,"p":"+"},{"i":"┘","il":false,"p":"|"},{"i":"├","il":false,"p":"+"},{"i":"─","il":true,"p":"-"},{"i":"┘","il":false},{"il":false},{"il":false},{"il":false},{"i":"┐","il":false,"p":"|"},{"i":"┤","il":true,"f":"t","p":"|"}],[{"i":"┌","il":false,"f":"n","p":"+"},{"i":"│","il":false,"p":"+"},{"i":"╴","il":false,"f":"+","p":"|"},{"i":"│","il":true,"p":"|"},{"il":false,"p":"+"},{"i":"─","il":false,"p":"-"},{"il":false},{"il":false},{"il":false,"f":"o"},{"i":"┼","il":true,"p":"+"},{"i":"┤","il":true,"p":"|"}],[{"i":"└","il":true,"p":"-"},{"i":"│","il":false,"p":"+"},{"i":"┐","il":false,"p":"+"},{"i":"│","il":false,"p":"+"},{"i":"┘","il":true},{"il":false},{"il":false,"p":"|"},{"il":false},{"il":false},{"i":"┘","il":false,"p":"|"},{"i":"┤","il":true,"f":"t"}],[{"i":"╶","il":true,"f":"r","p":"-"},{"i":"┴","il":false,"p":"-"},{"i":"┘","il":true},{"i":"└","il":false,"p":"-"},{"i":"─","il":true,"p":"-"},{"i":"─","il":true,"p":"-"},{"i":"┴","il":true,"f":"r","p":"-"},{"i":"─","il":true,"p":"-"},{"i":"─","il":true,"p":"-"},{"i":"┘","il":true},{"il":false}],[null,null,{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[null,null,{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[null,null,{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[null,null,{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[null,null,{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[null,null,null,null,null,{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[null,null,null,null,null,{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[null,null,null,null,null,null,{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}],[null,null,null,null,null,null,{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false},{"il":false}]],
	[
		[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {"i":"┼"}],
		[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}, {"i":"┼"}],
		[null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, null, null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, null, null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, null, null, null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, null, null, null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}]
	],
	[
		[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {"i":"┼"}],
		[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}, {"i":"┼"}],
		[null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, null, null, null, {}, {}, {}, {}, {}, {}, {}, {}, {"i":"┼"}],
		[null, null, null, null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, null, null, null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}],
		[null, null, null, null, null, null, {}, {}, {}, {}, {}, {}, {}, {}, {}]
	],
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
		"           "
	], [
		"kkkkkkkkkkk",
		"kkkkkkkkkkk",
		"kkkkkkkkkkk",
		"kkkkkkkkkkk",
		"kkkkkkkkkkk",
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
		"kkkkkkkkkkk",
		"kkkkkkkkkkk",
		"kkkkkkkkkkk",
		"kkkkkkkkkkk",
		"kkkkkkkkkkk",
		"kkkkkkkkkkk",
		"kkkkkkkkkkk",
		"kkkkkkkkkkk",
		"kkkkkkkkkkk",
		"kkkkkkkkkkk",
		"           ",
		"           ",
		"           ",
		"           "
	]
];
