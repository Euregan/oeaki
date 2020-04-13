import React from 'react';
import { Flex, Box } from '@chakra-ui/core';

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
        <Flex direction="column" align="center">
            <Canvas canvasRef={canvasRef} isFillMode={isFillMode} color={color} size={size} />
            <Box marginTop="10px">
                <Actions
                    onClear={handleClear}
                    onFill={handleFill}
                    onChangeColor={handleChangeColor}
                    onChangeSize={handleChangeSize}
                />
            </Box>
        </Flex>
    );
};

export default Board;
