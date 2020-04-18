import React from 'react';
export default (addMessage) => {
    const [queuedMessage, setQueuedMessage] = React.useState();

    React.useEffect(() => {
        if (queuedMessage) {
            addMessage(queuedMessage);
        }
    }, [queuedMessage]);

    return (emiterId, message) => setQueuedMessage({ emiterId, message });
};
