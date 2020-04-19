import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Card } from './UI';

const getColorAtPixel = ({ width, data }, x, y) => ({
    r: data[4 * (width * y + x) + 0],
    g: data[4 * (width * y + x) + 1],
    b: data[4 * (width * y + x) + 2],
    a: data[4 * (width * y + x) + 3],
});

const setColorAtPixel = ({ width, data }, color, x, y) => {
    data[4 * (width * y + x) + 0] = color.r & 0xff;
    data[4 * (width * y + x) + 1] = color.g & 0xff;
    data[4 * (width * y + x) + 2] = color.b & 0xff;
    data[4 * (width * y + x) + 3] = color.a & 0xff;
};

const colorMatch = (a, b) => a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;

const hexToRgba = (hex, a = 255) => {
    const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
    return { r, g, b, a };
};

const floodFill = (imageData, newColor, x, y) => {
    const { width, height } = imageData;
    const stack = [];
    const baseColor = getColorAtPixel(imageData, x, y);
    let operator = { x, y };

    // Check if base color and new color are the same
    if (colorMatch(baseColor, newColor)) {
        return;
    }

    // Add the clicked location to stack
    stack.push({ x: operator.x, y: operator.y });

    while (stack.length) {
        operator = stack.pop();
        let contiguousDown = true; // Vertical is assumed to be true
        let contiguousUp = true; // Vertical is assumed to be true
        let contiguousLeft = false;
        let contiguousRight = false;

        // Move to top most contiguousDown pixel
        while (contiguousUp && operator.y >= 0) {
            operator.y--;
            contiguousUp = colorMatch(getColorAtPixel(imageData, operator.x, operator.y), baseColor);
        }

        // Move downward
        while (contiguousDown && operator.y < height) {
            setColorAtPixel(imageData, newColor, operator.x, operator.y);

            // Check left
            if (operator.x - 1 >= 0 && colorMatch(getColorAtPixel(imageData, operator.x - 1, operator.y), baseColor)) {
                if (!contiguousLeft) {
                    contiguousLeft = true;
                    stack.push({ x: operator.x - 1, y: operator.y });
                }
            } else {
                contiguousLeft = false;
            }

            // Check right
            if (
                operator.x + 1 < width &&
                colorMatch(getColorAtPixel(imageData, operator.x + 1, operator.y), baseColor)
            ) {
                if (!contiguousRight) {
                    stack.push({ x: operator.x + 1, y: operator.y });
                    contiguousRight = true;
                }
            } else {
                contiguousRight = false;
            }

            operator.y++;
            contiguousDown = colorMatch(getColorAtPixel(imageData, operator.x, operator.y), baseColor);
        }
    }
};

const useMouseMovePosition = (canvasRef) => {
    const [pos, setPos] = React.useState(null);
    React.useEffect(() => {
        if (!canvasRef) {
            return;
        }
        const canvas = canvasRef.current;
        const handler = (event) => {
            setPos({ x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop });
        };
        canvas.addEventListener('mousemove', handler);
        return () => {
            canvas.removeEventListener('mousemove', handler);
        };
    }, [canvasRef]);
    return pos;
};

const useMouseDownPosition = (canvasRef) => {
    const [pos, setPos] = React.useState(null);
    React.useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        const handler = (event) => {
            setPos({ x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop });
        };
        canvas.addEventListener('mousedown', handler);
        return () => {
            canvas.removeEventListener('mousedown', handler);
        };
    }, [canvasRef]);

    return pos;
};

const useMouseUpLeave = (canvasRef, callBack) => {
    React.useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        const handler = () => {
            callBack();
        };
        canvas.addEventListener('mouseup', handler);
        canvas.addEventListener('mouseleave', handler);
        return () => {
            canvas.removeEventListener('mouseup', handler);
            canvas.removeEventListener('mouseleave', handler);
        };
    }, [callBack, canvasRef]);
};

const Canvas = ({ canvasRef, isFillMode, color, size }) => {
    const [isPainting, setIsPainting] = React.useState(false);
    const [mousePosition, setMousePosition] = React.useState(null);

    const mouseDownPosition = useMouseDownPosition(canvasRef);
    const mouseMovePosition = useMouseMovePosition(canvasRef);
    // Stop drawing on mouse release
    useMouseUpLeave(canvasRef, () => setIsPainting(false));

    // Start drawing when the mouse is pressed.
    React.useEffect(() => {
        if (!mouseDownPosition) {
            return;
        }

        if (isFillMode) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            floodFill(imageData, hexToRgba(color), mouseDownPosition.x, mouseDownPosition.y);
            context.putImageData(imageData, 0, 0);
            return;
        }

        setMousePosition(mouseDownPosition);
        setIsPainting(true);
    }, [canvasRef, mouseDownPosition]); // eslint-disable-line react-hooks/exhaustive-deps

    // Draw the line on mouse move
    React.useEffect(() => {
        if (!isPainting) {
            return;
        }

        if (!mouseMovePosition) {
            return;
        }

        const drawLine = () => {
            const context = canvasRef.current.getContext('2d');
            context.strokeStyle = color;
            context.lineJoin = 'round';
            context.lineWidth = size;

            context.beginPath();
            context.moveTo(mousePosition.x, mousePosition.y);
            context.lineTo(mouseMovePosition.x, mouseMovePosition.y);
            context.closePath();

            context.stroke();
        };

        drawLine();
        setMousePosition(mouseMovePosition);
    }, [canvasRef, mouseMovePosition]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Card className="canvas">
            <canvas ref={canvasRef} />
            <style jsx>{`
                canvas {
                    width: 100%;
                    height: 100%;
                }
            `}</style>
        </Card>
    );
};

Canvas.propTypes = {
    canvasRef: PropTypes.shape({ current: PropTypes.any }),
    isFillMode: PropTypes.bool,
    color: PropTypes.string,
    size: PropTypes.number,
};

export default Canvas;
