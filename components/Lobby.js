import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text, Flex, Heading, Avatar, List, ListItem } from '@chakra-ui/core';
import { Card, Rows, Button } from './UI';
import useShareLink from '../lib/useShareLink';

const ShareButton = () => {
    const [shareClicked, onShareLink] = useShareLink();

    if (shareClicked) {
        return <Button>Copied</Button>;
    }

    return <Button onClick={onShareLink}>Invite Friends</Button>;
};

const Lobby = ({ players }) => (
    <Card>
        <Rows>
            <List spacing={3} width="100%" marginLeft={5}>
                {Object.entries(players).map(([id, username]) => (
                    <ListItem key={id}>
                        <Flex align="center">
                            <Avatar name={username} />
                            <Text marginLeft={5}>
                                {username} {id === 'me' && '(you)'}
                            </Text>
                        </Flex>
                    </ListItem>
                ))}
            </List>
            <ShareButton />
        </Rows>
    </Card>
);

Lobby.propTypes = {
    players: PropTypes.object.isRequired,
};

export default Lobby;
