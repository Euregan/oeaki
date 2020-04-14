import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, List, ListItem, Icon } from '@chakra-ui/core';

const DisplayPlayer = ({ name, rank, points, isCurrent }) => {
    return (
        <Box>
            <p># {rank}</p>
            <p>{name}</p>
            <Avatar name={name} size="sm" />
            <p>points: {points}</p>
            {isCurrent && <Icon name="arrow-back" size="48px" />}
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
        <List spacing={3}>
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
