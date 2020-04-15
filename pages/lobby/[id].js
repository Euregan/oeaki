import React, { useCallback } from 'react';
import { Box, Text, Input, Button } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import Pool from '../../lib/webrtc/Pool';

const useWebRtcConnexion = (lobbyId, listeners = []) => {
    const [pool, setPool] = React.useState(null);

    React.useEffect(() => {
        if (typeof window !== 'undefined' && lobbyId) {
            const pool = new Pool(process.env.WEBSOCKET_URL, lobbyId);
            window.pool = pool;
            setPool(pool);
            listeners.forEach((listener) => pool.listen(listener));
        }
        // Should return a connexion clean up
    }, [lobbyId]);

    return pool;
};

const useQueuedMessage = (addMessage) => {
    const [queuedMessage, setQueuedMessage] = React.useState();

    React.useEffect(() => {
        if (queuedMessage) {
            addMessage(queuedMessage);
        }
    }, [queuedMessage]);

    return setQueuedMessage;
};

const Lobby = () => {
    const [message, setMessage] = React.useState('');
    const [messages, setMessages] = React.useState([]);
    const newMessage = (message) => setMessages([...messages, message]);
    const addQueuedMessage = useQueuedMessage(newMessage);
    const {
        query: { id },
    } = useRouter();
    const pool = useWebRtcConnexion(id, [addQueuedMessage]);
    const sendMessage = (message) => {
        pool.send(message);
        newMessage(message);
        setMessage('');
    };
    return (
        <Box>
            <Text>Lobby</Text>
            {messages.map((message, index) => (
                <p key={index}>{message}</p>
            ))}
            <Input value={message} onChange={(e) => setMessage(e.target.value)} type="text" />
            <Button variantColor="teal" size="lg" margin="auto" onClick={() => sendMessage(message)}>
                Play!
            </Button>
        </Box>
    );
};

export default Lobby;
