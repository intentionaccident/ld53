export type RoomFeature = SourceFeature | SinkFeature | EmptyFeature;

export type SourceFeature = {
	type: 'source',
	storage: number,
	enRoute: number,
	capacity: number
}

export type SinkFeature = {
	type: 'sink',
	subtype: 'thrusters' | 'navigation' | 'reactor',
	storage: number,
	enRoute: number,
	capacity: number,
	state: 'idle' | 'requesting' | 'busy' | 'done' | 'releasing';
	ticksLeft: number
	maxTicks: number
}

export type EmptyFeature = {
	type: 'empty'
}
