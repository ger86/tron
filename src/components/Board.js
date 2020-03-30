import React, {useEffect, useRef} from 'react';
import {UNIT} from 'config/consts';

export default function Board({players, width, height}) {
  const canvasRef = useRef();

  useEffect(function() {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    function drawBackground() {
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

    drawBackground();
  }, [height, width]);

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');

    players.forEach(player => {
      context.fillStyle = player.color;
      context.fillRect(player.position.x, player.position.y, UNIT, UNIT);
      context.strokeStyle = 'black';
      context.strokeRect(player.position.x, player.position.y, UNIT, UNIT);
    });
  }, [players]);

  return <canvas ref={canvasRef} id="tronBoard" width={width} height={height} />;
}
