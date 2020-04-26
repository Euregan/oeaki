import React from 'react';
import { Columns, Rows } from '../../components/UI';
import Lobby from '../../components/Lobby';
import Chat from '../../components/Chat';
import Board from '../../components/Board';
import Info from '../../components/Info';
import { GameProvider } from '../../lib/useGame';

const Game = () => (
    <GameProvider>
        <Columns className="container">
            <Rows className="row">
                <Info />
            </Rows>
            <Columns className="game">
                <Board />
                <Rows className="players">
                    <Lobby />
                    <Chat />
                </Rows>
                <style jsx global>{`
                    .container {
                        flex-direction: column;
                    }

                    .game {
                        height: 100vh;
                        width: 100vw;
                        padding: 1rem;
                        box-sizing: border-box;
                    }

                    .row {
                        flex-direction: row;
                        width: 100vw;
                        padding: 1rem;
                        margin-left: 1rem;
                        box-sizing: border-box;
                    }

                    .chat,
                    .board {
                        flex-grow: 1;
                    }
                `}</style>
            </Columns>
        </Columns>
    </GameProvider>
);

export default Game;
