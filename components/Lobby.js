import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text, Button, Flex, Heading, Avatar, List, ListItem } from '@chakra-ui/core';
import useShareLink from '../lib/useShareLink';

const ShareButton = () => {
    const [shareClicked, onShareLink] = useShareLink();

    if (shareClicked) {
        return (
            <Button variantColor="green" width="150px">
                Copied
            </Button>
        );
    }

    return (
        <Button variantColor="teal" width="150px" onClick={onShareLink}>
            Invite Friends
        </Button>
    );
};

const Lobby = ({ players, ...props }) => (
    <Box borderWidth="2px" rounded="lg" {...props}>
        <Flex direction="column" align="center" justify="space-between" height="100%">
            <Heading color="gray.500" fontSize="4xl">
                Lobby
            </Heading>
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
        </Flex>
    </Box>
);

Lobby.propTypes = {
    players: PropTypes.object.isRequired,
};

export default Lobby;
