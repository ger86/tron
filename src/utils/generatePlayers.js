import {DIRECTIONS, UNIT, PLAYER_ONE, PLAYER_TWO} from 'config/consts';

export default function generatePlayers() {
  const playerOne = {
    id: PLAYER_ONE.ID,
    position: {x: UNIT * 6, y: UNIT * 6},
    direction: DIRECTIONS.RIGHT,
    color: PLAYER_ONE.COLOR,
    keysMap: PLAYER_ONE.KEYS,
    hasDied: false,
    instructions: 'Arrows'
  };

  const playerTwo = {
    id: PLAYER_TWO.ID,
    direction: DIRECTIONS.LEFT,
    position: {x: UNIT * 43, y: UNIT * 43},
    color: PLAYER_TWO.COLOR,
    keysMap: PLAYER_TWO.KEYS,
    hasDied: false,
    instructions: 'WASD'
  };

  const players = [playerOne, playerTwo];

  return players;
}
