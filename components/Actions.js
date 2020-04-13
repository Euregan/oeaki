import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box, Checkbox, Button } from '@chakra-ui/core';

const colorsFirstLine = ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB'];
const colorsSecondLine = ['#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB'];
const ColorPicker = ({ onChange }) => {
    const handleClick = (event) => onChange(event.target.name);

    return (
        <Flex direction="column">
            <Box>
                {colorsFirstLine.map((color, key) => (
                    <Button key={`color${key}`} backgroundColor={color} name={color} onClick={handleClick} />
                ))}
            </Box>
            <Box>
                {colorsSecondLine.map((color, key) => (
                    <Button key={`color${key}`} backgroundColor={color} name={color} onClick={handleClick} />
                ))}
            </Box>
        </Flex>
    );
};

ColorPicker.propTypes = {
    onChange: PropTypes.func,
};

const sizes = [2, 5, 10, 15];
const SizePicker = ({ onChange }) => {
    const handleClick = (event) => onChange(parseInt(event.target.name));

    return sizes.map((size, key) => (
        <Button key={`color${key}`} name={size} onClick={handleClick}>
            <Box backgroundColor="black" borderRadius="50%" width={`${2 * size}px`} height={`${2 * size}px`} />
        </Button>
    ));
};

SizePicker.propTypes = {
    onChange: PropTypes.func,
};

const Actions = ({ onClear, onFill, onChangeColor, onChangeSize }) => (
    <Flex direction="row">
        <Box paddingRight="10px">
            <Button onClick={onClear}>Clear</Button>
        </Box>
        <Box paddingRight="10px">
            <Checkbox onChange={(event) => onFill(event.target.checked)}>Fill</Checkbox>
        </Box>
        <Box paddingRight="10px">
            <ColorPicker onChange={onChangeColor} />
        </Box>
        <Box paddingRight="10px">
            <SizePicker onChange={onChangeSize} />
        </Box>
    </Flex>
);

Actions.propTypes = {
    onClear: PropTypes.func,
    onFill: PropTypes.func,
    onChangeColor: PropTypes.func,
    onChangeSize: PropTypes.func,
};

export default Actions;
