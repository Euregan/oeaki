const http = require('http');
const WebSocket = require('ws');
const { v4 } = require('uuid');

const PORT = process.env.PORT || 3001;

const server = http.createServer();

server.listen(PORT, (err) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://localhost:${PORT}`);
});

let rooms = {};

new WebSocket.Server({ server }).on('connection', (ws, request) => {
    const id = v4();
    const room = request.url;

    // Adding the client to the room
    if (!rooms[room]) {
        rooms[room] = {};
    }
    rooms[room][id] = ws;

    // Transmitting the messages
    ws.on('message', (raw) => {
        // Parsing the message and adding the sender
        const message = {
            ...JSON.parse(raw),
            sender: id,
        };
        // For each client in the room
        Object.keys(rooms[room]).forEach((peerId) => {
            // If there is no particular recipient, or if the recipient is the current client
            if (peerId !== id && (!message.recipient || message.recipient === peerId)) {
                // Forward the message
                rooms[room][peerId].send(JSON.stringify(message));
            }
        });
    });

    // Cleaning up after a client has left
    ws.on('close', () => {
        delete rooms[room][id];
        if (Object.keys(rooms[room]).length === 0) {
            delete rooms[room];
        }
    });
});
