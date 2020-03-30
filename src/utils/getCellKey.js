import {UNIT} from 'config/consts';

export default function getCellKey(x, y) {
  return `${x * UNIT}${y * UNIT}`;
}
