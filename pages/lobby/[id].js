import React from 'react';
import { Columns, Rows } from '../../components/UI';
import Lobby from '../../components/Lobby';
import Chat from '../../components/Chat';
import Board from '../../components/Board';
import useWebRTC from '../../lib/webrtc/useWebRTC';
import { useGame } from '../../lib/useGame';

const Game = () => {
    const { messages, players, newPlayer, newMessage, removePlayer } = useGame();
    const { pool } = useWebRTC(newPlayer, newMessage, removePlayer);

    const sendMessage = (message) => {
        pool.send('chat', message);
        newMessage('me', message);
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
