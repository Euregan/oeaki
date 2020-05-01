import React from 'react';
import PropTypes from 'prop-types';

import useWebRTC from './webrtc/useWebRTC';
import useLocalStorage from './useLocalStorage';

const initialState = {
    countdown: 60,
    discoverWord: 'pomme',
    word: '',
    players: {},
    messages: [],
};

const actionTypes = {
    newPlayer: 'NEW_PLAYER',
    newMessage: 'NEW_MESSAGE',
    removePlayer: 'REMOVE_PLAYER',
    setCountdow: 'SET_COUNTDOWN',
};

const gameReducer = (state, { type, payload }) => {
    switch (type) {
        case actionTypes.newPlayer: {
            const { id, player } = payload;

            const messages = [...state.messages];
            // if (id !== 'me') {
            //     messages.unshift({ emiterId: id, message: `${player.username} joined!` });
            // }

            return {
                ...state,
                messages,
                players: { ...state.players, [id]: player },
            };
        }
        case actionTypes.newMessage: {
            const { id, message } = payload;
            return { ...state, messages: [{ id, message }, ...state.messages] };
        }
        case actionTypes.removePlayer: {
            const { id } = payload;
            const { [id]: _, ...filteredPlayers } = state.players;
            return { ...state, players: filteredPlayers };
        }
        case actionTypes.setCountdow: {
            const { countdown } = payload;
            return { ...state, countdown };
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
        ...initialState,
        players: { me },
    });

    const removePlayer = (id) => dispatch({ type: actionTypes.removePlayer, payload: { id } });
    const { pool } = useWebRTC(me, removePlayer);

    React.useEffect(() => {
        if (!pool) {
            return;
        }

        pool.listen('greetings', (id, newFriend) => {
            dispatch({ type: actionTypes.newPlayer, payload: { id, player: JSON.parse(newFriend) } });
        });

        pool.listen('chat', (id, message) => {
            dispatch({ type: actionTypes.newMessage, payload: { id, message } });
        });
    }, [pool]);

    const sendMessage = (id, message) => {
        pool.send('chat', message);
        dispatch({ type: actionTypes.newMessage, payload: { id, message } });
    };

    const setCountdown = (countdown) => {
        dispatch({ type: actionTypes.setCountdow, payload: { countdown } });
    };

    return (
        <GameContext.Provider value={{ ...state, pool, sendMessage, setCountdown }}>{children}</GameContext.Provider>
    );
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
