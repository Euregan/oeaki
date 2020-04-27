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

const gameReducer = (state, { type, ...action }) => {
    switch (type) {
        case actionTypes.newPlayer: {
            const { id, player } = action;

            const messages = [...state.messages];
            if (id !== 'me') {
                messages.unshift({ emiterId: id, message: `${player.username} joined!` });
            }

            return {
                ...state,
                messages,
                players: { ...state.players, [id]: player },
            };
        }
        case actionTypes.newMessage: {
            const { emiterId, message } = action;
            return { ...state, messages: [{ emiterId, message }, ...state.messages] };
        }
        case actionTypes.removePlayer: {
            const { id } = action;
            const { [id]: _, ...filteredPlayers } = state.players;
            return { ...state, players: filteredPlayers };
        }
        case actionTypes.setCountdow: {
            const { countdown } = action;
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

    const removePlayer = (id) => dispatch({ type: actionTypes.removePlayer, payload: { id } });

    const { pool } = useWebRTC(me, removePlayer);

    const sendMessage = (emiterId, message) => {
        pool.send('chat', message);
        dispatch({ type: actionTypes.newMessage, payload: { emiterId, message } });
    };

    const sendCountdown = (countdown) => {
        console.log('send game', countdown);
        pool.send('game', countdown);
        setCountdow(countdown);
    };

    return (
        <GameContext.Provider value={{ ...state, pool, sendMessage, sendCountdown }}>{children}</GameContext.Provider>
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
