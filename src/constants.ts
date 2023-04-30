export const TILE_HEIGHT = 32;
export const TILE_WIDTH = 48;
export const LINE_SIZE = 2;
export const SLANT = 16;
export const SLANTEDNESS = SLANT / TILE_HEIGHT;
export const INTERSECTION_RADIUS = 8;
export const ROOM_UPDATE_INTERVAL = 10;
export const SINK_CAPACITY = {
	thrusters: 15,
	navigation: 5,
	reactor: 30
}

export const SINK_BUSY_TICKS = {
	thrusters: 15,
	navigation: 10,
	reactor: 25
}

const sinkRequestTimeout = parseFloat('inf');
export const SINK_REQUEST_TIMEOUT = {
	thrusters: sinkRequestTimeout,
	navigation: sinkRequestTimeout,
	reactor: sinkRequestTimeout,
}

export const SOURCE_RELEASE_SPEED = 2;
const sinkReleaseSpeed = 6;
export const SINK_RELEASE_SPEED = {
	thrusters: sinkReleaseSpeed,
	navigation: sinkReleaseSpeed,
	reactor: sinkReleaseSpeed,
}

export const DEFAULT_PIPE_CAPACITY = 1;

export const DELIVERY_TIME_LIMIT = 5 * 60;

export const MAX_CONCURRENT_DIRTY_ROOMS = 2;
export const MAX_DONE_SINKS = 9999;

export const GLOOP_AMOUNT = 40;
