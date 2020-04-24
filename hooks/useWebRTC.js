import React from 'react';
import useGreetings from './useGreetings';
import Pool from '../lib/webrtc/Pool';

const channels = ['chat', 'drawing', 'game', 'greetings'];

export default (dispatch) => {
    const [pool, setPool] = React.useState(null);
    const [onNewPlayer, onPlayerDisconnected] = useGreetings(pool, dispatch);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const pool = new Pool(process.env.WEBSOCKET_URL, channels, onNewPlayer, onPlayerDisconnected);
            window.pool = pool;
            setPool(pool);
        }
    }, [setPool]);

    React.useEffect(() => {
        if (pool) {
            pool.listen('chat', (emiterId, message) => dispatch({ type: 'new_message', emiterId, message }));
        }
    }, [pool, dispatch]);

    return { pool };
};
