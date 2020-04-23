import React from 'react';

const useLocalStorage = (key, initialValue) => {
    // SSR
    if (typeof window === 'undefined') {
        return [initialValue, () => {}];
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [storedValue, setStoredValue] = React.useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If user is in private mode or has storage restriction
            // localStorage can throw. Also JSON.parse can throw
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            // If user is in private mode or has storage restriction
            // localStorage can throw. Also JSON.stringify can throw
            console.error(error);
        }
    };

    return [storedValue, setValue];
};

export default useLocalStorage;
