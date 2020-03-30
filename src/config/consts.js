export const UNIT = 15;
export const WIDTH = 750;
export const HEIGHT = 750;
export const DIRECTIONS = {
  RIGHT: {x: UNIT, y: 0},
  LEFT: {x: -UNIT, y: 0},
  UP: {x: 0, y: -UNIT},
  DOWN: {x: 0, y: UNIT}
};

export const PLAYER_ONE = {
  COLOR: '#CC0000',
  ID: '1',
  KEYS: {
    '38': DIRECTIONS.UP,
    '39': DIRECTIONS.RIGHT,
    '40': DIRECTIONS.DOWN,
    '37': DIRECTIONS.LEFT
  }
};

export const PLAYER_TWO = {
  COLOR: '#0000CC',
  ID: '2',
  KEYS: {
    '87': DIRECTIONS.UP,
    '68': DIRECTIONS.RIGHT,
    '83': DIRECTIONS.DOWN,
    '65': DIRECTIONS.LEFT
  }
};
