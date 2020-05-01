import React from 'react';
import PropTypes from 'prop-types';

import useWebRTC from './webrtc/useWebRTC';
import useLocalStorage from './useLocalStorage';

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
    const [username] = useLocalStorage('username', 'Anonymous');
    const me = { username, points: 0 };
    const [state, dispatch] = React.useReducer(gameReducer, {
        players: { me },
        messages: [],
    });

    const removePlayer = (id) => dispatch({ type: actionTypes.removePlayer, payload: { id } });

    const { pool } = useWebRTC(me, removePlayer);

    React.useEffect(() => {
        if (!pool) {
            return;
        }

        pool.listen('greetings', (emiterId, newFriend) => {
            dispatch({ type: actionTypes.newPlayer, payload: { [emiterId]: JSON.parse(newFriend) } });
        });

        pool.listen('chat', (emiterId, message) => {
            dispatch({ type: actionTypes.newMessage, payload: { emiterId, message } });
        });
    }, [pool]);

    const sendMessage = (emiterId, message) => {
        pool.send('chat', message);
        dispatch({ type: actionTypes.newMessage, payload: { emiterId, message } });
    };

    return <GameContext.Provider value={{ ...state, pool, sendMessage }}>{children}</GameContext.Provider>;
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
