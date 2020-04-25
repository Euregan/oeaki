import React from 'react';
import { Box, Flex } from '@chakra-ui/core';

import Board from '../components/Board';
import ListingPlayer from '../components/ListingPlayer';

const game = {
    currentPlayer: '1',
    players: [
        { id: '1', name: 'Max', points: 0, rank: 2 },
        { id: '2', name: 'Julie', points: 10, rank: 2 },
        { id: '3', name: 'Super long pseudo de la mort', points: 100, rank: 1 },
    ],
};

// const playerWithRank = (players) => {
//     return players
//         .sort((a, b) => b.points - a.points)
//         .reduce((acc, player, index) => {
//             let rank = index + 1;

//             const playerAbove = index !== 0 && acc[index - 1];
//             if (playerAbove) {
//                 rank = player.points === playerAbove.points ? playerAbove.rank : playerAbove.rank + 1;
//             }

//             return [...acc, { ...player, rank }];
//         }, []);
// };

const Draw = () => {
    return (
        <Flex direction="row">
            <Box>
                <ListingPlayer players={game.players} current={game.currentPlayer} />
            </Box>
            <Board />
        </Flex>
    );
};

export default Draw;
