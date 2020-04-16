import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text, Button, Flex, Avatar, Divider, Input } from '@chakra-ui/core';

const Chat = ({ onSubmit, messages, players, ...props }) => {
    const [message, setMessage] = React.useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(message);
        setMessage('');
    };
    return (
        <Box borderWidth="2px" rounded="lg" {...props}>
            <Flex direction="column" height="100%">
                <Flex height="80%" overflow="auto" direction="column-reverse">
                    {messages.map(({ emiterId, message }, index) => (
                        <Box
                            key={index}
                            width="80%"
                            padding="5px 10px"
                            margin="5px"
                            rounded="lg"
                            backgroundColor="tomato"
                        >
                            <Flex align="center">
                                <Avatar name={players[emiterId]}></Avatar>
                                <Text marginLeft="2" color="white">
                                    {message}
                                </Text>
                            </Flex>
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
    );
};

Chat.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    messages: PropTypes.array.isRequired,
    players: PropTypes.object.isRequired,
};

export default Chat;
