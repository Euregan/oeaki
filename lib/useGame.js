import React from 'react';
import PropTypes from 'prop-types';

import useWebRTC from './webrtc/useWebRTC';

const initialState = {
    players: {},
    messages: [],
};

const actionTypes = {
    newPlayer: 'NEW_PLAYER',
    newMessage: 'NEW_MESSAGE',
    removePlayer: 'REMOVE_PLAYER',
};

const gameReducer = (state, { type, payload }) => {
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

const GameContext = React.createContext();

export const GameProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(gameReducer, initialState);

    const newPlayer = (id, player) => {
        dispatch({ type: actionTypes.newPlayer, payload: { [id]: player } });
    };

    const newMessage = (emiterId, message) =>
        dispatch({ type: actionTypes.newMessage, payload: { emiterId, message } });

    const removePlayer = (id) => dispatch({ type: actionTypes.removePlayer, payload: { id } });

    const { pool } = useWebRTC(newPlayer, newMessage, removePlayer);

    const sendMessage = (emiterId, message) => {
        pool.send('chat', message);
        newMessage(emiterId, message);
    };

    return <GameContext.Provider value={{ ...state, sendMessage }}>{children}</GameContext.Provider>;
};

GameProvider.propTypes = {
    children: PropTypes.element.isRequired,
};

export const useGame = () => {
    const context = React.useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
