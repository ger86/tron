import React, {useEffect, useReducer, useState} from 'react';
import Board from 'components/Board';
import useInterval from 'hooks/useInterval';
import {DIRECTIONS, UNIT, PLAYER_ONE, PLAYER_TWO, WIDTH, HEIGHT} from 'config/consts';
import './App.css';

const playerOne = {
  id: PLAYER_ONE.ID,
  position: {x: UNIT * 6, y: UNIT * 6},
  direction: DIRECTIONS.RIGHT,
  color: PLAYER_ONE.COLOR,
  keysMap: PLAYER_ONE.KEYS,
  hasDied: false
};

const playerTwo = {
  id: PLAYER_TWO.ID,
  direction: DIRECTIONS.LEFT,
  position: {x: UNIT * 43, y: UNIT * 43},
  color: PLAYER_TWO.COLOR,
  keysMap: PLAYER_TWO.KEYS,
  hasDied: false
};

const players = [playerOne, playerTwo];

function sumCoordinates(coordA, coordB) {
  return Object.keys(coordA).reduce(
    (positionObject, coordinate) => ({
      ...positionObject,
      [coordinate]: coordA[coordinate] + coordB[coordinate]
    }),
    {}
  );
}

function canChangeDirection(currentDirection, nextDirection) {
  const result = sumCoordinates(currentDirection, nextDirection);
  return Object.keys(result).filter(coordinate => result[coordinate] !== 0).length > 0;
}

function getCellKey(x, y) {
  return `${x * UNIT}${y * UNIT}`;
}

function getPlayableCells(width, height, initialPlayersPositions) {
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

const initialGame = {
  players,
  playableCells: getPlayableCells(
    WIDTH,
    HEIGHT,
    players.map(player => getCellKey(player.position.x, player.position.y))
  )
};

function updateGame(state, action) {
  if (action.type === 'move') {
    let players = state.players.map(player => ({
      ...player,
      position: sumCoordinates(player.position, player.direction)
    }));

    players = players.map(player => {
      const myCellKey = getCellKey(player.position.x, player.position.y);
      return {
        ...player,
        hasDied:
          !state.playableCells.includes(myCellKey) ||
          players
            .filter(p => p.id !== player.id)
            .map(p => getCellKey(p.position.x, p.position.y))
            .includes(myCellKey)
      };
    });

    const newOcupiedCells = state.players.map(player =>
      getCellKey(player.position.x, player.position.y)
    );
    const playableCells = state.playableCells.filter(playableCell => {
      return !newOcupiedCells.includes(playableCell);
    });

    return {
      playableCells,
      players
    };
  }
  if (action.type === 'changeDirection') {
    return {
      playableCells: state.playableCells,
      players: state.players.map(player => ({
        ...player,
        direction:
          player.keysMap[action.key] &&
          canChangeDirection(player.direction, player.keysMap[action.key])
            ? player.keysMap[action.key]
            : player.direction
      }))
    };
  }
  return state;
}

function App() {
  const [game, gameDispatch] = useReducer(updateGame, initialGame);
  const [delay, setDelay] = useState(100);

  const diedPlayers = game.players.filter(player => player.hasDied);
  if (diedPlayers.length > 0 && delay) {
    setDelay(null);
    console.log(diedPlayers.map(player => player.id));
  }

  useInterval(function() {
    gameDispatch({type: 'move'});
  }, delay);

  useEffect(() => {
    function handleKeyPress(event) {
      const key = `${event.keyCode}`;
      if ([...Object.keys(PLAYER_ONE.KEYS), ...Object.keys(PLAYER_TWO.KEYS)].includes(key)) {
        event.preventDefault();
        gameDispatch({type: 'changeDirection', key});
      }
    }
    document.addEventListener('keydown', handleKeyPress);

    return function cleanUp() {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return <Board players={game.players} width={WIDTH} height={HEIGHT} />;
}

export default App;
