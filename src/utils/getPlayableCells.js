import {UNIT} from 'config/consts';
import getCellKey from 'utils/getCellKey';

export default function getPlayableCells(width, height, initialPlayersPositions) {
  const playableCells = [];
  for (let i = 0; i < width / UNIT; i++) {
    for (let j = 0; j < height / UNIT; j++) {
      const cellKey = getCellKey(i * UNIT, j * UNIT);
      if (!initialPlayersPositions.includes(cellKey)) {
        playableCells.push(cellKey);
      }
    }
  }
  return playableCells;
}
