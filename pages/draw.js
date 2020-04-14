import React from 'react';
import { Box, Flex } from '@chakra-ui/core';

import Board from '../components/Board';
import ListingPlayer from '../components/ListingPlayer';

const game = {
    currentPlayer: '1',
    players: [
        { id: '1', name: 'Max', points: 0, rank: 2 },
        { id: '2', name: 'Julie', points: 10, rank: 1 },
    ],
};

const Draw = () => {
    return (
        <Flex direction="row" align="center">
            <Box>
                <ListingPlayer players={game.players} current={game.currentPlayer} />
            </Box>
            <Board />
        </Flex>
    );
};

export default Draw;
