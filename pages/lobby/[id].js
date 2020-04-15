import React from 'react';
import { Box, Text, Input, Button, Flex, Divider, Heading, Badge } from '@chakra-ui/core';
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

const useShareLink = () => {
    const [shareClicked, setSharedClicked] = React.useState(false);

    React.useEffect(() => {
        if (shareClicked) {
            const timeout = setTimeout(() => setSharedClicked(false), 2000);
            return () => clearTimeout(timeout);
        }
    }, [shareClicked]);
    const onShareLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setSharedClicked(true);
        });
    };

    return [shareClicked, onShareLink];
};

const Lobby = () => {
    const [message, setMessage] = React.useState('');
    const [messages, setMessages] = React.useState([]);
    const newMessage = (message) => setMessages([message, ...messages]);
    const addQueuedMessage = useQueuedMessage(newMessage);
    const {
        query: { id },
    } = useRouter();
    const pool = useWebRtcConnexion(id, [addQueuedMessage]);
    const [shareClicked, onShareLink] = useShareLink();

    const sendMessage = (message) => {
        pool.send(message);
        newMessage(message);
        setMessage('');
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (message) {
            sendMessage(message);
        }
    };

    return (
        <Flex direction="row" justify="space-between" padding={10} height={500} width="80%" margin="auto">
            <Box borderWidth="2px" rounded="lg" width="49%">
                <Flex direction="column" align="center" justify="space-between" height="100%">
                    <Heading color="gray.500" fontSize="4xl">
                        Lobby
                    </Heading>
                    {shareClicked ? (
                        <Button variantColor={'green'} width="150px">
                            Copied
                        </Button>
                    ) : (
                        <Button variantColor="teal" width="150px" onClick={onShareLink}>
                            Invite Friends
                        </Button>
                    )}
                </Flex>
            </Box>
            <Box borderWidth="2px" rounded="lg" width="49%">
                <Flex direction="column" height="100%">
                    <Flex height="80%" overflow="auto" direction="column-reverse">
                        {messages.map((message, index) => (
                            <Box
                                key={index}
                                width="80%"
                                padding="5px 10px"
                                margin="5px"
                                rounded="lg"
                                backgroundColor="tomato"
                            >
                                <Text color="white">{message}</Text>
                            </Box>
                        ))}
                    </Flex>
                    <Divider borderColor="tomato" />
                    <form onSubmit={handleSubmit} style={{ padding: 5, height: '20%', textAlign: 'center' }}>
                        <Input
                            height="50%"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            type="text"
                            placeholder="Your message"
                            marginBottom={1}
                        />
                        <Button type="submit" height="50%" variantColor="teal" size="lg" margin="auto">
                            Send
                        </Button>
                    </form>
                </Flex>
            </Box>
        </Flex>
    );
};

export default Lobby;
