import React from 'react';
import PropTypes from 'prop-types';

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

const Canvas = ({ canvasRef, addSnapShot, isFillMode, color, size, ...props }) => {
    const [isPainting, setIsPainting] = React.useState(false);
    const [mousePosition, setMousePosition] = React.useState(null);

    const getCoordinates = (event) => {
        const canvas = canvasRef.current;
        return { x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop };
    };

    const drawLine = (originalMousePosition, newMousePosition) => {
        const context = canvasRef.current.getContext('2d');
        context.strokeStyle = color;
        context.lineJoin = 'round';
        context.lineWidth = size;

        context.beginPath();
        context.moveTo(originalMousePosition.x, originalMousePosition.y);
        context.lineTo(newMousePosition.x, newMousePosition.y);
        context.closePath();

        context.stroke();
    };

    const fill = ({ x, y }) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        floodFill(imageData, hexToRgba(color), x, y);
        context.putImageData(imageData, 0, 0);
    };

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        addSnapShot(imageData);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    //Start drawing when the mouse is pressed.
    React.useEffect(() => {
        const startPaint = (event) => {
            const coordinates = getCoordinates(event);
            if (isFillMode) {
                fill(coordinates);
                return;
            }

            setMousePosition(coordinates);
            setIsPainting(true);
        };

        const canvas = canvasRef.current;
        canvas.addEventListener('mousedown', startPaint);
        return () => {
            canvas.removeEventListener('mousedown', startPaint);
        };
    });

    //Draw the line on mouse move
    React.useEffect(() => {
        const paint = (event) => {
            if (!isPainting) {
                return;
            }

            const newMousePosition = getCoordinates(event);
            drawLine(mousePosition, newMousePosition);
            setMousePosition(newMousePosition);
        };

        const canvas = canvasRef.current;
        canvas.addEventListener('mousemove', paint);
        return () => {
            canvas.removeEventListener('mousemove', paint);
        };
    });

    //Stop drawing on mouse release
    React.useEffect(() => {
        const mouseup = () => {
            setIsPainting(false);

            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            addSnapShot(imageData);
        };

        const mouseleave = () => {
            setIsPainting(false);
        };

        const canvas = canvasRef.current;
        canvas.addEventListener('mouseup', mouseup);
        canvas.addEventListener('mouseleave', mouseleave);
        return () => {
            canvas.removeEventListener('mouseup', mouseup);
            canvas.removeEventListener('mouseleave', mouseleave);
        };
    });

    return <canvas {...props} ref={canvasRef} />;
};

Canvas.propTypes = {
    canvasRef: PropTypes.shape({ current: PropTypes.any }),
    addSnapShot: PropTypes.func,
    isFillMode: PropTypes.bool,
    color: PropTypes.string,
    size: PropTypes.number,
};

export default Canvas;
