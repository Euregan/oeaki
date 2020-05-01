import React from 'react';

const initialState = {
    players: {},
    messages: [],
};

export const actionTypes = {
    newPlayer: 'NEW_PLAYER',
    newMessage: 'NEW_MESSAGE',
    removePlayer: 'REMOVE_PLAYER',
};

export const gameReducer = (state, { type, payload }) => {
    switch (type) {
        case actionTypes.newPlayer: {
            return { ...state, players: { ...state.players, ...payload } };
        }
        case actionTypes.newMessage: {
            return { ...state, messages: [payload, ...state.messages] };
        }
        case actionTypes.removePlayer: {
            const { [payload.id]: _, ...filteredPlayers } = state.players;
            return { ...state, players: filteredPlayers };
        }
        default: {
            throw new Error(`Unhandled type: ${type}`);
        }
    }
};

export const useGame = ({ reducer = gameReducer } = {}) => {
    const [{ messages, players }, dispatch] = React.useReducer(reducer, initialState);

    const newPlayer = (id, player) => {
        dispatch({ type: actionTypes.newPlayer, payload: { [id]: player } });
    };

    const newMessage = (emiterId, message) =>
        dispatch({ type: actionTypes.newMessage, payload: { emiterId, message } });

    const removePlayer = (id) => dispatch({ type: actionTypes.removePlayer, payload: { id } });

    return { messages, players, newPlayer, newMessage, removePlayer };
};
