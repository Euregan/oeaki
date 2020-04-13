import React from 'react';
import Head from 'next/head';
import { useState, useEffect } from 'react'
import Pool from '../lib/webrtc/Pool'

import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core';

import theme from '../lib/theme';


const App = ({ Component }) => {
    const [pool, setPool] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.pool = new Pool(`ws://${window.location.host}`)
            setPool(pool);
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CSSReset />
            <ColorModeProvider>
                <Head>
                    <title>Oeaki</title>
                    <link rel="shortcut icon" href="/favicon.ico" />
                </Head>
            <Component webrtc={pool}/>
            </ColorModeProvider>
        </ThemeProvider>
    );
}


export default App;
