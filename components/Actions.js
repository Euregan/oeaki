import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@chakra-ui/core';
import { Card, Columns, Button } from './UI';

const colors = [
    '#000000',
    '#B80000',
    '#DB3E00',
    '#FCCB00',
    '#008B02',
    '#006B76',
    '#1273DE',
    '#004DCF',
    '#5300EB',
    '#9D9D9D',
    '#EB9694',
    '#FAD0C3',
    '#FEF3BD',
    '#C1E1C5',
    '#BEDADC',
    '#C4DEF6',
    '#BED3F3',
    '#D4C4FB',
];
const ColorPicker = ({ onChange }) => {
    const handleClick = (event) => onChange(event.target.name);

    return (
        <div className="color-picker">
            {colors.map((color, key) => (
                <button key={`color-${key}`} style={{ backgroundColor: color }} name={color} onClick={handleClick} />
            ))}
            <style jsx>{`
                .color-picker {
                    display: grid;
                    grid-template-columns: repeat(9, 1fr);
                    grid-auto-rows: 1fr;
                    grid-gap: 0.25rem;
                }

                .color-picker::before {
                    content: '';
                    width: 0;
                    padding-bottom: 100%;
                    grid-row: 1 / 1;
                    grid-column: 1 / 1;
                }

                .color-picker > *:first-child {
                    grid-row: 1 / 1;
                    grid-column: 1 / 1;
                }

                button {
                    cursor: pointer;
                    border: none;
                    width: 3rem;
                    border-radius: var(--active-border-radius);
                }
            `}</style>
        </div>
    );
};

ColorPicker.propTypes = {
    onChange: PropTypes.func,
};

const sizes = [1, 2, 3, 4];
const SizePicker = ({ onChange }) => {
    const handleClick = (event) => onChange(parseInt(event.target.name));

    return sizes.map((size, key) => (
        <button
            key={`size-${key}`}
            name={size}
            style={{ width: size * 1.125 + 'rem', height: size * 1.125 + 'rem' }}
            onClick={handleClick}
        >
            <style jsx>{`
                button {
                    cursor: pointer;
                    border: none;
                    background-color: black;
                    border-radius: 50%;
                }
            `}</style>
        </button>
    ));
};

SizePicker.propTypes = {
    onChange: PropTypes.func,
};

const Actions = ({ onClear, onFill, onChangeColor, onChangeSize }) => (
    <Card className="actions">
        <Columns>
            <Button onClick={onClear}>Clear</Button>
            <Checkbox onChange={(event) => onFill(event.target.checked)} borderColor="var(--border-color)">
                Fill
            </Checkbox>
            <ColorPicker onChange={onChangeColor} />
            <SizePicker onChange={onChangeSize} />
        </Columns>
        <style jsx global>{`
            .actions > .columns > * {
                align-self: start;
            }
        `}</style>
    </Card>
);

Actions.propTypes = {
    onClear: PropTypes.func,
    onFill: PropTypes.func,
    onChangeColor: PropTypes.func,
    onChangeSize: PropTypes.func,
};

export default Actions;
