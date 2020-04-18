import React from 'react';

export default (pool, username = 'anonymous') => {
    const [players, setPlayers] = React.useState({
        me: username,
    });
    const [playersQueue, setPlayersQueue] = React.useState([]);
    const addPlayer = (player) => setPlayers({ ...players, ...player });
    const onNewPlayer = (id) => setPlayersQueue([...playersQueue, id]);

    React.useEffect(() => {
        if (pool) {
            pool.listen('greetings', (id, username2) => {
                addPlayer({ [id]: username2 });
            });
        }
    }, [pool]);
    React.useEffect(() => {
        if (pool && playersQueue.length) {
            playersQueue.forEach((id) => {
                pool.sendTo(id, 'greetings', username);
            });
            setPlayersQueue([]);
        }
    }, [pool, playersQueue]);

    return [players, onNewPlayer];
};
