import Head from 'next/head';
import { useState } from 'react';
import {
    Heading,
    Text,
    ThemeProvider,
    Flex,
    FormErrorMessage,
    FormControl,
    FormLabel,
    Button,
    Input,
} from '@chakra-ui/core';
import { withTheme } from 'emotion-theming';

const Home = () => {
    const [formData, setFormData] = useState({
        username: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const handleSubmit = (e) => {
        e.preventDefault();
        const { username } = formData;
        if (!username) {
            setFormErrors({ username: 'You have to enter an username to play' });
        } else {
            const { username: usernameError, ...errors } = formErrors;
            setFormErrors(errors);
        }
    };
    const handleOnChangeFactory = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });
    return (
        <ThemeProvider>
            <Head>
                <title>Oeaki</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Flex direction="column" justify="center" align="center">
                <Heading color="gray.500" fontSize="6xl" textAlign="center">
                    Oeaki
                    <Text color="gray.500" fontSize="3xl">
                        The drawing Game
                    </Text>
                </Heading>
                <Flex direction="column" justify="center" align="center">
                    <Text color="gray.700" fontSize="3xl">
                        Create a game
                    </Text>
                    <form onSubmit={handleSubmit}>
                        <FormControl isInvalid={Object.keys(formErrors).length > 0}>
                            <Flex direction="column" justify="center" align="center">
                                <FormLabel htmlFor="username">Username</FormLabel>
                                <Input
                                    value={formData.username}
                                    onChange={handleOnChangeFactory('username')}
                                    type="text"
                                    id="username"
                                    aria-describedby="email-helper-text"
                                    placeholder="JeanLeBgDu54"
                                />
                                <FormErrorMessage>{formErrors.username}</FormErrorMessage>
                                <Button type="submit" variantColor="teal" size="lg" margin="auto">
                                    Create
                                </Button>
                            </Flex>
                        </FormControl>
                    </form>
                </Flex>
            </Flex>
        </ThemeProvider>
    );
};

export default withTheme(Home);
