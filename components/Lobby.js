import React from 'react';
import { Box, Text, Flex, Avatar, List, ListItem } from '@chakra-ui/core';
import { Card, Rows, Button } from './UI';
import useShareLink from '../lib/useShareLink';
import { useGame } from '../lib/useGame';

const ShareButton = () => {
    const [shareClicked, onShareLink] = useShareLink();

    if (shareClicked) {
        return <Button>Copied</Button>;
    }

    return <Button onClick={onShareLink}>Invite Friends</Button>;
};

const Lobby = () => {
    const { players } = useGame();

    return (
        <Card>
            <Rows>
                <List spacing={3} width="100%" marginLeft={5}>
                    {Object.entries(players).map(([id, { username, points }]) => (
                        <ListItem key={id}>
                            <Flex align="center">
                                <Avatar name={username} />
                                <Box display="flex" flexDirection="column" marginLeft={5}>
                                    <Text as="span" fontWeight="bold" textTransform="uppercase" isTruncated>
                                        {username}
                                        <Text as="span" fontWeight="normal" textTransform="initial" marginLeft="2">
                                            {id === 'me' && '(you)'}
                                        </Text>
                                    </Text>
                                    <Text as="span" ml="2" color="gray.400" fontSize="sm">
                                        points:
                                        <Text as="span" color="black" fontWeight="bold" marginLeft="2">
                                            {points}
                                        </Text>
                                    </Text>
                                </Box>
                            </Flex>
                        </ListItem>
                    ))}
                </List>
                <ShareButton />
            </Rows>
        </Card>
    );
};

export default Lobby;
