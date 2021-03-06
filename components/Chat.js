import React from 'react';
import { Text, Box, Flex, Avatar } from '@chakra-ui/core';
import { Card, Rows, Columns, Button, Input } from './UI';
import { useGame } from '../lib/useGame';

const Chat = () => {
    const { players, messages, sendMessage } = useGame();
    const [message, setMessage] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        sendMessage('me', message);
        setMessage('');
    };

    return (
        <Card className="chat">
            <Rows>
                <Flex direction="column-reverse" width="100%" className="messages">
                    {messages.map(({ emiterId, message }, index) => {
                        const player = players[emiterId];
                        if (!player) {
                            return null;
                        }

                        return (
                            <Box key={index} rounded="lg" backgroundColor="tomato">
                                <Flex align="center">
                                    <Avatar name={player.username} />
                                    <Text marginLeft="2" color="white">
                                        {message}
                                    </Text>
                                </Flex>
                            </Box>
                        );
                    })}
                </Flex>
                <form onSubmit={handleSubmit}>
                    <Columns>
                        <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            type="text"
                            placeholder="Your message"
                        />
                        <Button type="submit">Send</Button>
                    </Columns>
                </form>
            </Rows>
            <style jsx global>{`
                .chat > .rows {
                    height: 100%;
                }

                .chat .messages {
                    flex-grow: 1;
                }
            `}</style>
        </Card>
    );
};

export default Chat;
