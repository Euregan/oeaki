import React from 'react';
import { Columns, Rows } from '../../components/UI';
import Lobby from '../../components/Lobby';
import Chat from '../../components/Chat';
import Board from '../../components/Board';
import useWebRTC from '../../hooks/useWebRTC';
import { reducer, initialState } from '../../lib/gameReducer';
import { useRouter } from 'next/router';

const Game = () => {
    const router = useRouter();
    const { id: lobbyId } = router.query;
    const [{ messages, players }, dispatch] = React.useReducer(reducer, initialState);
    const { pool } = useWebRTC(lobbyId, dispatch);
    const sendMessage = (message) => {
        pool.send('chat', message);
        dispatch({ type: 'new_message', emiterId: 'me', message });
    };

    return (
        <Columns className="game">
            <Board />
            <Rows className="players">
                <Lobby players={players} />
                <Chat onSubmit={sendMessage} messages={messages} players={players} />
            </Rows>
            <style jsx global>{`
                .game {
                    height: 100vh;
                    width: 100vw;
                    padding: 1rem;
                    box-sizing: border-box;
                }

                .chat,
                .board {
                    flex-grow: 1;
                }
            `}</style>
        </Columns>
    );
};

export default Game;
