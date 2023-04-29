// TODO: Use Discriminating Unions for `GameEvent`s
export interface GameEvent {
	type: 'KeyPressed' | 'KeyReleased' | 'RotateIntersection' | 'CounterRotateIntersection',
	key?: string,
	x?: number,
	y?: number,
}
