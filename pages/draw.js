import React from 'react';

import Canvas from '../components/Canvas';
import Actions from '../components/Actions';

const canvasStyles = { border: '2px solid #000' };
const width = 500;
const height = 500;

const Draw = () => {
    const canvasRef = React.useRef(null);
    const [isFillMode, setIsFillMode] = React.useState(false);
    const [color, setColor] = React.useState('#B80000');
    const [size, setSize] = React.useState(5);
    const [snapshots, setSnapshots] = React.useState([]);

    const handleClear = () => {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, width, height);
    };
    const handleFill = (active) => setIsFillMode(active);
    const handleChangeColor = (color) => setColor(color);
    const handleChangeSize = (size) => setSize(size);

    const handleUndo = () => {
        const context = canvasRef.current.getContext('2d');
        context.putImageData(snapshots[snapshots.length - 2], 0, 0);
        setSnapshots(snapshots.slice(0, -1));
    };

    const addSnapShot = (snapshot) => {
        setSnapshots([...snapshots, snapshot]);
    };

    return (
        <div className="board">
            <Canvas
                canvasRef={canvasRef}
                isFillMode={isFillMode}
                addSnapShot={addSnapShot}
                color={color}
                size={size}
                width={width}
                height={height}
                style={canvasStyles}
            />
            <div className="actions">
                <Actions
                    onClear={handleClear}
                    onUndo={handleUndo}
                    onFill={handleFill}
                    onChangeColor={handleChangeColor}
                    onChangeSize={handleChangeSize}
                />
            </div>
        </div>
    );
};

export default Draw;
