const http = require('http');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3001;

const server = http.createServer();

server.listen(PORT, (err) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://localhost:${PORT}`);
});

const wsServer = new WebSocket.Server({ server }).on('connection', (ws) => {
    ws.on('message', (message) => {
        wsServer.clients.forEach((client) => {
            if (client !== ws) {
                client.send(message);
            }
        });
    });
});