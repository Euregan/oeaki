import React from 'react';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/router';
import { FormErrorMessage, FormControl, FormLabel } from '@chakra-ui/core';

import { Rows, Columns, Card, Input, Button } from '../components/UI';
import useLocalStorage from '../lib/useLocalStorage';

const Home = () => {
    const router = useRouter();
    const [username, setUserName] = useLocalStorage('username', '');
    const [formData, setFormData] = React.useState({
        username,
    });
    const [formErrors, setFormErrors] = React.useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const { username } = formData;
        if (!username) {
            setFormErrors({ username: 'You have to enter an username to play' });
            return;
        }

        setUserName(username);
        router.push({
            pathname: `/lobby/${uuid()}`,
        });
    };

    const handleOnChange = ({ target: { name, value } }) => {
        setFormData({ ...formData, [name]: value });
    };

    return (
        <Rows>
            <h1>Oeaki</h1>
            <h2>The drawing Game</h2>
            <Columns>
                <Card>
                    <form onSubmit={handleSubmit}>
                        <FormControl isInvalid={Object.keys(formErrors).length > 0}>
                            <Rows>
                                <h3>Create a game</h3>
                                <FormLabel htmlFor="username">Username</FormLabel>
                                <Input
                                    value={formData.username}
                                    onChange={handleOnChange}
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Enter your username"
                                />
                                <FormErrorMessage>{formErrors.username}</FormErrorMessage>
                                <Button type="submit">Play!</Button>
                            </Rows>
                        </FormControl>
                    </form>
                </Card>
            </Columns>
        </Rows>
    );
};

export default Home;
