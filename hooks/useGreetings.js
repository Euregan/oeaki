import React from 'react';
import useLocalStorage from '../lib/useLocalStorage';

export default (pool, dispatch) => {
    const [username] = useLocalStorage('username', 'Anonymous');
    const [playersQueue, setPlayersQueue] = React.useState([]);
    const onNewPlayer = (id) => setPlayersQueue([...playersQueue, id]);
    const onPlayerDisconnected = (id) => dispatch({ type: 'remove_player', id });

    React.useEffect(() => {
        dispatch({ type: 'new_player', id: 'me', username });
    }, [username, dispatch]);

    React.useEffect(() => {
        if (pool) {
            pool.listen('greetings', (id, newPlayer) => {
                dispatch({ type: 'new_player', id, username: JSON.parse(newPlayer) });
            });
        }
    }, [pool, dispatch]);

    React.useEffect(() => {
        if (pool && playersQueue.length) {
            playersQueue.forEach((id) => {
                pool.sendTo(id, 'greetings', JSON.stringify(me));
            });
            setPlayersQueue([]);
        }
    }, [pool, playersQueue, setPlayersQueue, username]);

    return [onNewPlayer, onPlayerDisconnected];
};
