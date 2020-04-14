import React from 'react';
import PropTypes from 'prop-types';

import Head from 'next/head';
import Pool from '../lib/webrtc/Pool';

import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core';

import theme from '../components/theme';

const App = ({ Component }) => {
    const [pool, setPool] = React.useState(null);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            window.pool = new Pool(process.env.WEBSOCKET_URL);
            setPool(pool);
        }
    }, [pool]);

    return (
        <ThemeProvider theme={theme}>
            <CSSReset />
            <ColorModeProvider>
                <Head>
                    <title>Oeaki</title>
                    <link rel="shortcut icon" href="/favicon.ico" />
                </Head>
                <Component webrtc={pool} />
            </ColorModeProvider>
        </ThemeProvider>
    );
};

App.propTypes = {
    Component: PropTypes.elementType,
};

export default App;
