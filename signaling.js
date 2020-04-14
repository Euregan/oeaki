const http = require('http');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;

const server = http.createServer();

server.listen(port, (err) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://localhost:${port}`);
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
