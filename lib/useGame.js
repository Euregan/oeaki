import React from 'react';
import PropTypes from 'prop-types';

import useWebRTC from './webrtc/useWebRTC';
import useLocalStorage from './useLocalStorage';

const initialState = {
    isDrawingStart: false,
    countdown: 60,
    discoverWord: 'pomme',
    word: '',
    players: {},
    messages: [],
};

const actionTypes = {
    setIsDrawingStart: 'SET_IS_DRAWING_START',
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
            if (id !== 'me') {
                messages.unshift({ id, message: `${player.username} joined!` });
            }

            return {
                ...state,
                messages,
                players: { ...state.players, [id]: player },
            };
        }
        case actionTypes.newMessage: {
            return { ...state, messages: [payload, ...state.messages] };
        }
        case actionTypes.removePlayer: {
            const { [payload.id]: _, ...filteredPlayers } = state.players;
            return { ...state, players: filteredPlayers };
        }
        case actionTypes.setCountdow: {
            const { countdown } = payload;
            return { ...state, countdown };
        }
        case actionTypes.setIsDrawingStart: {
            const { isDrawingStart } = payload;
            return { ...state, isDrawingStart };
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

    const setCountdown = (countdown) => {
        dispatch({ type: actionTypes.setCountdow, payload: { countdown } });
    };

    const dataToNewPlayer = { me, countdown: state.countdown };
    const { pool } = useWebRTC(dataToNewPlayer, removePlayer);

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

        pool.listen('game', (id, newGameInfo) => {
            const { countdown, isDrawingStart } = JSON.parse(newGameInfo);
            console.log('new countdown', countdown, id);
            setCountdown(countdown);
            dispatch({ type: actionTypes.setIsDrawingStart, payload: { isDrawingStart } });
        });
    }, [pool]);

    const sendMessage = (id, message) => {
        pool.send('chat', message);
        dispatch({ type: actionTypes.newMessage, payload: { id, message } });
    };

    const setIsDrawingStart = (isDrawingStart) => {
        pool.send('game', JSON.stringify({ isDrawingStart }));
        dispatch({ type: actionTypes.setIsDrawingStart, payload: { isDrawingStart } });
    };

    return (
        <GameContext.Provider value={{ ...state, pool, setIsDrawingStart, sendMessage, setCountdown }}>
            {children}
        </GameContext.Provider>
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
