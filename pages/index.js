import {useState, useEffect} from 'react';
import { Heading, Text, Flex, FormErrorMessage, FormControl, FormLabel, Button, Input } from '@chakra-ui/core';

const Home = ({webrtc}) => {
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

    const handleOnChange = ({ target: { name, value } }) => {
        setFormData({ ...formData, [name]: value });
    };
    
    return (
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
                                onChange={handleOnChange}
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Enter your username"
                            />
                            <FormErrorMessage>{formErrors.username}</FormErrorMessage>
                            <Button type="submit" variantColor="teal" size="lg" margin="auto">
                                Play!
                            </Button>
                        </Flex>
                    </FormControl>
                </form>
            </Flex>
        </Flex>
    );
};

export default Home;
