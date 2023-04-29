export const TILE_HEIGHT = 32;
export const TILE_WIDTH = 48;
export const LINE_SIZE = 2;
export const SLANT = 16;
export const SLANTEDNESS = SLANT / TILE_HEIGHT;
export const INTERSECTION_RADIUS = 8;

export const SINK_CAPACITY = {
	thrusters: 30,
	navigation: 5,
	reactor: 10
}

export const SINK_BUSY_TIME = {
	thrusters: 10,
	navigation: 5,
	reactor: 30
}

export const SINK_REQUEST_TIMEOUT = {
	thrusters: 60,
	navigation: 60,
	reactor:  60,
}
