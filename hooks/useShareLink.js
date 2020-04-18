import React from 'react';

export default () => {
    const [shareClicked, setSharedClicked] = React.useState(false);

    React.useEffect(() => {
        if (shareClicked) {
            const timeout = setTimeout(() => setSharedClicked(false), 2000);
            return () => clearTimeout(timeout);
        }
    }, [shareClicked]);
    const onShareLink = () => {
        navigator.clipboard
            .writeText(window.location.href)
            .then(() => {
                setSharedClicked(true);
            })
            .catch((err) => {
                // This can happen if the user denies clipboard permissions:
                console.error('Could not copy text: ', err);
            });
    };

    return [shareClicked, onShareLink];
};
