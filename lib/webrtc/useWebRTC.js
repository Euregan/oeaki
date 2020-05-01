import React from 'react';
import Pool from './Pool';

const channels = ['chat', 'drawing', 'game', 'greetings'];

export default (me, removePlayer) => {
    const [pool, setPool] = React.useState(null);
    const [playersQueue, setPlayersQueue] = React.useState([]);

    React.useEffect(() => {
        const onNewPlayer = (id) => setPlayersQueue([...playersQueue, id]);
        const onPlayerDisconnected = (id) => removePlayer(id);

        const pool = new Pool(process.env.WEBSOCKET_URL, channels, onNewPlayer, onPlayerDisconnected);
        window.pool = pool;

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
