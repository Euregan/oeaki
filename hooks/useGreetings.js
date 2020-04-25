import React from 'react';
import useLocalStorage from '../lib/useLocalStorage';

export default (pool) => {
    const [username] = useLocalStorage('username', 'Anonymous');
    const me = { username, points: 0 };

    const [players, setPlayers] = React.useState({ me });
    const [playersQueue, setPlayersQueue] = React.useState([]);
    const addPlayer = (player) => setPlayers({ ...players, ...player });
    const onNewPlayer = (id) => setPlayersQueue([...playersQueue, id]);

    React.useEffect(() => {
        if (pool) {
            pool.listen('greetings', (id, myFriend) => {
                addPlayer({ [id]: JSON.parse(myFriend) });
            });
        }
    }, [pool]);
    React.useEffect(() => {
        if (pool && playersQueue.length) {
            playersQueue.forEach((id) => {
                pool.sendTo(id, 'greetings', JSON.stringify(me));
            });
            setPlayersQueue([]);
        }
    }, [pool, playersQueue]);

    return [players, onNewPlayer];
};
