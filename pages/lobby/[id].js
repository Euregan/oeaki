import React from 'react';
import { Columns, Rows } from '../../components/UI';
import Lobby from '../../components/Lobby';
import Chat from '../../components/Chat';
import Board from '../../components/Board';
import useQueuedMessage from '../../hooks/useQueuedMessage';
import useWebRTC from '../../hooks/useWebRTC';

const Game = () => {
    const [messages, setMessages] = React.useState([]);
    const newMessage = (message) => setMessages([message, ...messages]);
    const addQueuedMessage = useQueuedMessage(newMessage);
    const { pool, players } = useWebRTC([{ channel: 'chat', listener: addQueuedMessage }]);

    const sendMessage = (message) => {
        pool.send('chat', message);
        newMessage({ emiterId: 'me', message });
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
