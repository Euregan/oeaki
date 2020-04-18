import React from 'react';
import useGreetings from './useGreetings';
import Pool from '../lib/webrtc/Pool';

const channels = ['chat', 'drawing', 'game', 'greetings'];

export default (listeners = {}) => {
    const [pool, setPool] = React.useState(null);
    const [players, onNewPlayer] = useGreetings(pool);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const pool = new Pool(process.env.WEBSOCKET_URL, channels, onNewPlayer);
            window.pool = pool;
            setPool(pool);
        }
    }, []);

    React.useEffect(() => {
        if (pool) {
            listeners.forEach(({ channel, listener }) => pool.listen(channel, listener));
        }
    }, [pool]);

    return { pool, players };
};
