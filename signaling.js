const http = require('http');
const WebSocket = require('ws');
const uuid = require('uuid');

const PORT = process.env.PORT || 3001;

const server = http.createServer();

server.listen(PORT, (err) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://localhost:${PORT}`);
});

const rooms = {};

new WebSocket.Server({ server }).on('connection', (ws) => {
    ws.on('connection', (ws) => {
        ws.id = uuid.v4();
    });
    ws.on('message', (message) => {
        const { type, id: lobbyId } = JSON.parse(message);
        if (type === 'lobby-subscription') {
            rooms[lobbyId] = [...(rooms[lobbyId] || []), ws];
            ws.lobbyId = lobbyId;
            ws.send(JSON.stringify({ type: 'lobby-subscription-reply' }));
        } else {
            const room = rooms[ws.lobbyId];
            if (!room) {
                return;
            }
            room.forEach((client) => {
                if (client !== ws) {
                    client.send(message);
                }
            });
        }
    });
    ws.on('close', () => {
        const { lobbyId } = ws;
        if (lobbyId) {
            rooms[lobbyId] = (rooms[lobbyId] || []).filter(({ id }) => id !== ws.id);
        }
    });
});
