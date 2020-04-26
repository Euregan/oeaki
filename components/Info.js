import React from 'react';
import PropTypes from 'prop-types';

import { useGame } from '../lib/useGame';

const Countdown = ({ countdown, onCountdownChange }) => {
    React.useEffect(() => {
        const interval =
            countdown > 0 &&
            window.setInterval(() => {
                onCountdownChange(countdown - 1);
            }, 1000);

        return () => window.clearInterval(interval);
    }, [onCountdownChange, countdown]);

    return <span>{countdown}</span>;
};

Countdown.propTypes = {
    countdown: PropTypes.number.isRequired,
    onCountdownChange: PropTypes.func.isRequired,
};

const Word = ({ discoverWord }) => {
    return <span>{discoverWord}</span>;
};

Word.propTypes = {
    discoverWord: PropTypes.string.isRequired,
};

const Info = () => {
    const { countdown, discoverWord, sendCountdown } = useGame();

    return (
        <React.Fragment>
            <div className="left">
                <Countdown countdown={countdown} onCountdownChange={sendCountdown} />
                <div className="round">Round 0 of 3</div>
            </div>
            <div className="middle">
                <Word discoverWord={discoverWord} />
            </div>
            <style jsx>{`
                .left {
                    display: flex;
                    align-items: flex-start;
                    width: 100%;
                }
                .middle {
                    width: 100vw;
                }
                .round {
                    margin-left: 10px;
                }
            `}</style>
        </React.Fragment>
    );
};

export default Info;
