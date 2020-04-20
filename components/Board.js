import React from 'react';
import { Rows } from './UI';

import Canvas from './Canvas';
import Actions from './Actions';

const Board = () => {
    const canvasRef = React.useRef(null);
    const [isFillMode, setIsFillMode] = React.useState(false);
    const [color, setColor] = React.useState('#B80000');
    const [size, setSize] = React.useState(5);

    const handleClear = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    };
    const handleFill = (active) => setIsFillMode(active);
    const handleChangeColor = (color) => setColor(color);
    const handleChangeSize = (size) => setSize(size);

    return (
        <Rows className="board">
            <Canvas canvasRef={canvasRef} isFillMode={isFillMode} color={color} size={size} />
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
