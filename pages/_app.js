import React from 'react';
import Head from 'next/head';

import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core';

import theme from './_theme';

const App = ({ Component }) => (
    <ThemeProvider theme={theme}>
        <CSSReset />
        <ColorModeProvider>
            <Head>
                <title>Oeaki</title>
                <link rel="shortcut icon" href="/favicon.ico" />
            </Head>
            <Component />
        </ColorModeProvider>
    </ThemeProvider>
);

export default App;
