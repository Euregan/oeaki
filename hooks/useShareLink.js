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
        navigator.clipboard.writeText(window.location.href).then(() => {
            setSharedClicked(true);
        });
    };

    return [shareClicked, onShareLink];
};
