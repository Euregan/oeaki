import React from 'react';
import PropTypes from 'prop-types';

import { useGame, GameProvider } from '../../lib/useGame';

import { Columns, Rows } from '../../components/UI';
import LobbyPlayers from '../../components/LobbyPlayers';
import Chat from '../../components/Chat';
import Board from '../../components/Board';
import Info from '../../components/Info';

const WaitingLobby = ({ onStartDrawing }) => {
    return (
        <Columns className="container">
            <Columns className="game">
                <button onClick={onStartDrawing}>Start drawing</button>
                <Rows className="players">
                    <LobbyPlayers />
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
    );
};

WaitingLobby.propTypes = {
    onStartDrawing: PropTypes.func,
};

const DrawingLobby = () => {
    return (
        <Columns className="container">
            <Rows className="row">
                <Info />
            </Rows>
            <Columns className="game">
                <Board />
                <Rows className="players">
                    <LobbyPlayers />
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
    );
};

const Game = () => {
    const { isDrawingStart, setIsDrawingStart } = useGame();

    const handleStartDrawing = () => {
        setIsDrawingStart(true);
    };

    if (isDrawingStart) {
        return <DrawingLobby />;
    }

    return <WaitingLobby onStartDrawing={handleStartDrawing} />;
};

const Lobby = () => (
    <GameProvider>
        <Game />
    </GameProvider>
);

export default Lobby;
