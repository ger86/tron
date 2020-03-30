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

        context.beginPath();
        context.strokeStyle = '#001900';
        for (let i = UNIT * 2; i <= height; i += UNIT * 2) {
          context.moveTo(i, 0);
          context.lineTo(i, height);
        }
        for (let i = UNIT * 2; i <= width; i += UNIT * 2) {
          context.moveTo(0, i);
          context.lineTo(width, i);
        }
        context.stroke();
        context.closePath();

        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = '#000';
        for (let i = UNIT; i <= height; i += UNIT * 2) {
          context.moveTo(i, 0);
          context.lineTo(i, height);
        }
        for (let i = UNIT; i <= width; i += UNIT * 2) {
          context.moveTo(0, i);
          context.lineTo(width, i);
        }
        context.stroke();
        context.closePath();
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
