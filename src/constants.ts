export const TILE_HEIGHT = 32;
export const TILE_WIDTH = 48;
export const LINE_SIZE = 2;
export const SLANT = 16;
export const SLANTEDNESS = SLANT / TILE_HEIGHT;
export const INTERSECTION_RADIUS = 8;
export const ROOM_UPDATE_INTERVAL = 25;
export const ANIMATION_UPDATE_INTERVAL = 10;
export const SINK_CAPACITY = {
	thrusters: 2,
	navigation: 1,
	reactor: 3
}

export const SINK_BUSY_TICKS = {
	thrusters: 15,
	navigation: 10,
	reactor: 25
}

const sinkRequestTimeout = Number.POSITIVE_INFINITY;
export const SINK_REQUEST_TIMEOUT = {
	thrusters: sinkRequestTimeout,
	navigation: sinkRequestTimeout,
	reactor: sinkRequestTimeout,
}

export const DEFAULT_PIPE_CAPACITY = 1;

export const DELIVERY_TIME_LIMIT = 5 * 60;

export const MAX_CONCURRENT_DIRTY_ROOMS = 2;
