import React from 'react';
import { Flex } from '@chakra-ui/core';
import Lobby from '../../components/Lobby';
import Chat from '../../components/Chat';
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
        <Flex direction="row" justify="space-between" padding={10} height={500} width="80%" margin="auto">
            <Lobby players={players} width="49%" />
            <Chat onSubmit={sendMessage} messages={messages} players={players} width="49%" />
        </Flex>
    );
};

export default Game;
