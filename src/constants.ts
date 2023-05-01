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
	reactor: 17
}

export const DEFAULT_PIPE_CAPACITY = 1;

export const MAX_CONCURRENT_DIRTY_ROOMS = [
	{level: 0, value: 0},
	{level: 0.5, value: 1},
	{level: 1, value: 2},
	{level: 2, value: 3},
]

export const PROGRESS_MODIFIER = [
	1.4,
	0.8,
	0.5
]

export const REQUEST_DELAY_IN_TICKS = 4;

export const DIRTY_ROOM_DELAY_IN_TICKS = 5;

export const SHOW_WELCOME_MESSAGE = false;
export const SCORE_MAX = 50;
export const BOX_DELIVERY_SCORE = 1;

export const DEBUG = false;
