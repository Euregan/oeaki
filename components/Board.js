import React from 'react';

import { Rows } from './UI';
import Canvas from './Canvas';
import Actions from './Actions';
import { useGame } from '../lib/useGame';

const Board = () => {
    const { pool } = useGame();
    const canvasRef = React.useRef(null);
    const [isFillMode, setIsFillMode] = React.useState(false);
    const [color, setColor] = React.useState('#B80000');
    const [size, setSize] = React.useState(5);

    // Replicating the drawing from peers
    React.useEffect(() => {
        if (!pool) {
            return;
        }

        pool.listen('drawing', (_, drawing) => {
            const { color, size, fromX, fromY, toX, toY } = JSON.parse(drawing);

            const context = canvasRef.current.getContext('2d');
            context.strokeStyle = color;
            context.lineJoin = 'round';
            context.lineWidth = size * 10;

            context.beginPath();
            context.moveTo(fromX, fromY);
            context.lineTo(toX, toY);
            context.closePath();

            context.stroke();
        });
    }, [pool]);

    const handleClear = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    };
    const handleFill = (active) => setIsFillMode(active);
    const handleChangeColor = (color) => setColor(color);
    const handleChangeSize = (size) => setSize(size);
    const handNewDrawLine = (color, size, mousePosition, mouseMovePosition) => {
        pool.send(
            'drawing',
            JSON.stringify({
                color,
                size,
                fromX: mousePosition.x,
                fromY: mousePosition.y,
                toX: mouseMovePosition.x,
                toY: mouseMovePosition.y,
            })
        );
    };

    return (
        <Rows className="board">
            <Canvas
                canvasRef={canvasRef}
                isFillMode={isFillMode}
                color={color}
                size={size}
                onNewDrawLine={handNewDrawLine}
            />
            <Actions
                onClear={handleClear}
                onFill={handleFill}
                onChangeColor={handleChangeColor}
                onChangeSize={handleChangeSize}
            />
            <style jsx global>{`
                .board > .canvas {
                    box-sizing: border-box;
                    width: 100%;
                    height: 100%;
                }
            `}</style>
        </Rows>
    );
};

export default Board;
