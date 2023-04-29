export type RoomFeature = SourceFeature | SinkFeature | EmptyFeature;

export type SourceFeature = {
	type: 'source',
	queued: number
}

export type SinkFeature = {
	type: 'sink',
	subtype: 'thrusters' | 'navigation' | 'reactor',
	storage: number,
	capacity: number
}

export type EmptyFeature = {
	type: 'empty'
}
