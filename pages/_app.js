import React from 'react';
import PropTypes from 'prop-types';

import Head from 'next/head';

import { ThemeProvider, ColorModeProvider } from '@chakra-ui/core';

import theme from '../components/theme';

import './app.css';

const App = ({ Component }) => {
    return (
        <ThemeProvider theme={theme}>
            <ColorModeProvider>
                <Head>
                    <title>Oeaki</title>
                    <link rel="shortcut icon" href="/favicon.ico" />
                </Head>
                <Component />
            </ColorModeProvider>
        </ThemeProvider>
    );
};

App.propTypes = {
    Component: PropTypes.elementType,
};

export default App;
