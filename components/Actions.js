import React from 'react';
import PropTypes from 'prop-types';

const colors = ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB'];
const buttonStyles = { width: '30px', height: '30px', border: 'none', backgroundColor: 'white' };

const ColorPicker = ({ onChange }) => {
    const handleClick = (color) => () => onChange(color);

    return colors.map((color, key) => (
        <button key={`color${key}`} style={{ ...buttonStyles, backgroundColor: color }} onClick={handleClick(color)} />
    ));
};

const sizes = [2, 5, 10, 15];
const circleStyles = { backgroundColor: 'black', borderRadius: '50%' };

const SizePicker = ({ onChange }) => {
    const handleClick = (size) => () => onChange(size);

    return sizes.map((size, key) => (
        <button key={`color${key}`} style={buttonStyles} onClick={handleClick(size)}>
            <div style={{ ...circleStyles, width: `${2 * size}px`, height: `${2 * size}px` }} />
        </button>
    ));
};

const containerStyles = { display: 'flex', flexDirection: 'row' };

const Actions = ({ onClear, onFill, onChangeColor, onChangeSize }) => (
    <div style={containerStyles}>
        <button onClick={onClear}>Clear</button>
        <div>
            <input onClick={onFill} type="checkbox" onChange={(event) => onFill(event.target.checked)} />
            <label htmlFor="scales">Fill</label>
        </div>
        <ColorPicker onChange={onChangeColor} />
        <SizePicker onChange={onChangeSize} />
    </div>
);

Actions.propTypes = {
    onClear: PropTypes.func,
    onFill: PropTypes.func,
    onChangeColor: PropTypes.func,
    onChangeSize: PropTypes.func,
};

export default Actions;
