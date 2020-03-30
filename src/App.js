import React, {useEffect, useReducer} from 'react';
import Board from 'components/Board';
import Result from 'components/Result';
import Start from 'components/Start';
import useInterval from 'hooks/useInterval';
import {DELAY, GAME_READY, GAME_PLAYING, GAME_ENDED, WIDTH, HEIGHT} from 'config/consts';
import generatePlayers from 'utils/generatePlayers';
import getCellKey from 'utils/getCellKey';
import getPlayableCells from 'utils/getPlayableCells';
import sumCoordinates from 'utils/sumCoordinates';
import playerCanChangeToDirection from 'utils/playerCanChangeToDirection';
import './App.css';

const players = generatePlayers();
const KEYS_FOR_PLAYING = players.map(player => Object.keys(player.keysMap)).flat();

const initialGame = {
  players,
  playableCells: getPlayableCells(
    WIDTH,
    HEIGHT,
    players.map(player => getCellKey(player.position.x, player.position.y))
  ),
  gameStatus: GAME_READY
};

function updateGame(state, action) {
  if (action.type === 'start') {
    return {...initialGame, gameStatus: GAME_PLAYING};
  }
  if (action.type === 'restart') {
    return {...initialGame, gameStatus: GAME_READY};
  }
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
      players,
      gameStatus: players.filter(player => player.hasDied).length === 0 ? GAME_PLAYING : GAME_ENDED
    };
  }
  if (action.type === 'changeDirection') {
    return {
      gameStatus: state.gameStatus,
      playableCells: state.playableCells,
      players: state.players.map(player => ({
        ...player,
        direction:
          player.keysMap[action.key] &&
          playerCanChangeToDirection(player.direction, player.keysMap[action.key])
            ? player.keysMap[action.key]
            : player.direction
      }))
    };
  }
  return state;
}

function App() {
  const [game, gameDispatch] = useReducer(updateGame, initialGame);
  let result = '';

  useInterval(
    function() {
      gameDispatch({type: 'move'});
    },
    game.gameStatus === GAME_PLAYING ? DELAY : null
  );

  function handleStart() {
    gameDispatch({type: 'start'});
  }

  function handleRestart() {
    gameDispatch({type: 'restart'});
  }

  useEffect(() => {
    function handleKeyPress(event) {
      const key = `${event.keyCode}`;
      if (KEYS_FOR_PLAYING.includes(key)) {
        event.preventDefault();
        gameDispatch({type: 'changeDirection', key});
      }
      if (key === '13') {
        if (game.gameStatus === GAME_READY) {
          handleStart()
        }
        if (game.gameStatus === GAME_ENDED) {
          handleRestart();
        }
      }
    }
    document.addEventListener('keydown', handleKeyPress);

    return function cleanUp() {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [game.gameStatus]);

  if (game.gameStatus === GAME_ENDED) {
    const winningPlayers = game.players.filter(player => !player.hasDied);
    if (winningPlayers.length === 0) {
      result = 'Empate';
    } else {
      result = `Ganador: ${winningPlayers.map(player => `Jugador ${player.id}`).join(',')}`;
    }
  }


  return (
    <>
      <h1 className="title">Reacted Tron</h1>
      <Board players={game.players} gameStatus={game.gameStatus} width={WIDTH} height={HEIGHT} />
      {game.gameStatus === GAME_ENDED && <Result onClick={handleRestart} result={result} />}
      {game.gameStatus === GAME_READY && <Start onClick={handleStart} />}
    </>
  );
}

export default App;
