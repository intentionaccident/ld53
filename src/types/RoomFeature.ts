export type RoomFeature = SourceFeature | SinkFeature | EmptyFeature;

export type SourceFeature = {
	type: 'source'
}

export type SinkFeature = {
	type: 'sink',
	storage: number,
	capacity: number
}

export type EmptyFeature = {
	type: 'empty'
}
