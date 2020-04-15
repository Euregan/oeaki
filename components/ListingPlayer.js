import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, List, ListItem, Icon } from '@chakra-ui/core';

const DisplayPlayer = ({ name, rank, points, isCurrent }) => {
    return (
        <Box padding={4} display="flex" alignItems="center">
            <Box as="span" fontWeight="bold" margin="2">
                #{rank}
            </Box>
            <Box display="flex" flexDirection="column" margin="2" width="35%">
                <Box as="span" fontWeight="bold" textTransform="uppercase" isTruncated>
                    {name}
                </Box>
                <Box as="span" ml="2" color="gray.400" fontSize="sm">
                    points:{' '}
                    <Box as="span" color="black" fontWeight="bold">
                        {points}
                    </Box>
                </Box>
            </Box>
            {isCurrent && <Icon name="arrow-back" size="24px" />}
            <Avatar name={name} size="sm" margin="2" />
        </Box>
    );
};

DisplayPlayer.propTypes = {
    name: PropTypes.string,
    points: PropTypes.number,
    rank: PropTypes.number,
    isCurrent: PropTypes.bool,
};

const ListingPlayer = ({ players, current }) => {
    return (
        <List spacing={3} width="100%" borderWidth="1px" rounded="lg">
            {players.map((player) => {
                return (
                    <ListItem key={player.id}>
                        <DisplayPlayer {...player} isCurrent={player.id === current} />
                    </ListItem>
                );
            })}
        </List>
    );
};

ListingPlayer.propTypes = {
    players: PropTypes.arrayOf(PropTypes.object),
    current: PropTypes.string,
};

export default ListingPlayer;
