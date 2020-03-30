import React, {useEffect, useRef} from 'react';
import {GAME_READY, UNIT} from 'config/consts';

export default function Board({gameStatus, players, width, height}) {
  const canvasRef = useRef();

  useEffect(
    function() {
      if (gameStatus === GAME_READY) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.strokeStyle = '#001900';
        for (let i = 0; i <= width / UNIT + 2; i += 2) {
          for (let j = 0; j <= height / UNIT + 2; j += 2) {
            context.strokeRect(0, 0, UNIT * i, UNIT * j);
          }
        }
        context.strokeStyle = '#000000';
        context.lineWidth = 2;
        for (let i = 1; i <= width / UNIT; i += 2) {
          for (let j = 1; j <= height / UNIT; j += 2) {
            context.strokeRect(0, 0, UNIT * i, UNIT * j);
          }
        }
        context.lineWidth = 1;
      }
    },
    [height, width, gameStatus]
  );

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');

    players.forEach(player => {
      context.fillStyle = player.color;
      context.fillRect(player.position.x, player.position.y, UNIT, UNIT);
      context.strokeStyle = 'black';
      context.strokeRect(player.position.x, player.position.y, UNIT, UNIT);
    });
  }, [players]);

  return (
    <>
      <canvas ref={canvasRef} id="tronBoard" width={width} height={height} />
      <div className="instructions">
        {players.map(player => (
          <div
            className="instructions__player"
            key={`player--${player.id}`}
            style={{color: player.color}}
          >
            {`${player.id} : ${player.instructions}`}
          </div>
        ))}
      </div>
    </>
  );
}
