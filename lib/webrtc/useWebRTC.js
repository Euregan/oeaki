import React from 'react';
import Pool from './Pool';
import useLocalStorage from '../useLocalStorage';

const channels = ['chat', 'drawing', 'game', 'greetings'];

export default (newPlayer, newMessage, removePlayer) => {
    const [pool, setPool] = React.useState(null);
    const [playersQueue, setPlayersQueue] = React.useState([]);

    const [username] = useLocalStorage('username', 'Anonymous');
    const me = { username, points: 0 };

    React.useEffect(() => {
        const onNewPlayer = (id) => setPlayersQueue([...playersQueue, id]);
        const onPlayerDisconnected = (id) => removePlayer(id);

        const pool = new Pool(process.env.WEBSOCKET_URL, channels, onNewPlayer, onPlayerDisconnected);
        window.pool = pool;

        newPlayer('me', me);

        pool.listen('greetings', (id, newFriend) => {
            newPlayer(id, JSON.parse(newFriend));
        });

        pool.listen('chat', (emiterId, message) => {
            newMessage(emiterId, message);
        });

        setPool(pool);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(() => {
        if (playersQueue.length) {
            playersQueue.forEach((id) => {
                pool.sendTo(id, 'greetings', JSON.stringify(me));
            });
            setPlayersQueue([]);
        }
    }, [pool, playersQueue, setPlayersQueue, me]);

    return { pool };
};
