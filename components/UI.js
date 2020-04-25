import React from 'react';
import PropTypes from 'prop-types';
import { Input as ChakraInput } from '@chakra-ui/core';

export const Rows = ({ children, className }) => (
    <div className={`rows ${className}`}>
        {children}
        <style jsx global>{`
            .rows {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            .rows > * ~ * {
                margin-top: 1rem;
            }

            .rows > .card {
                align-self: stretch;
            }
        `}</style>
    </div>
);

Rows.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string.isRequired,
};

Rows.defaultProps = {
    className: '',
};

export const Columns = ({ children, className }) => (
    <div className={`columns ${className}`}>
        {children}
        <style jsx global>{`
            .columns {
                display: flex;
                flex-direction: rows;
                justify-content: center;
                align-items: stretch;
            }

            .columns > * ~ * {
                margin-left: 1rem;
            }
        `}</style>
    </div>
);

Columns.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string.isRequired,
};

Columns.defaultProps = {
    className: '',
};

export const Card = ({ children, className }) => (
    <div className={`card ${className}`}>
        {children}
        <style jsx>{`
            .card {
                border: 1px var(--border-color) solid;
                border-radius: var(--static-border-radius);
                padding: 1rem;
            }
        `}</style>
    </div>
);

Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string.isRequired,
};

Card.defaultProps = {
    className: '',
};

export const Input = (props) => (
    <ChakraInput
        borderColor="var(--border-color)"
        borderRadius="var(--active-border-radius)"
        boxSizing="border-box"
        {...props}
    />
);

export const Button = ({ children, ...props }) => (
    <button {...props}>
        {children}
        <style jsx>{`
            button {
                padding: var(--active-border-radius) 1rem;
                border-radius: var(--active-border-radius);
                border: none;
                cursor: pointer;
                background-color: var(--main-color);
                color: white;
                font-size: 1rem;
            }
        `}</style>
    </button>
);

Button.propTypes = {
    children: PropTypes.node.isRequired,
};
