import Server from './Server';
import Peer from './Peer';

class Pool {
    constructor(websocketSignalingUrl, channels) {
        this.server = new Server(websocketSignalingUrl);
        this.peers = {};
        this.listeners = {};
        channels.forEach((channel) => {
            this.listeners[channel] = [];
        });

        this.server.listen(({ type, sender }) => {
            switch (type) {
                case 'hello':
                    if (!this.peers[sender]) {
                        this.peers[sender] = new Peer(
                            this.server.filter(sender),
                            channels,
                            () => this.deleteConnection(sender),
                            false
                        );
                        channels.forEach((channel) =>
                            this.listeners[channel].forEach((listener) => this.peers[sender].listen(channel, listener))
                        );
                        this.server.send({ type: 'welcome' });
                    }
                    break;
                case 'welcome':
                    if (!this.peers[sender]) {
                        this.peers[sender] = new Peer(
                            this.server.filter(sender),
                            channels,
                            () => this.deleteConnection(sender),
                            true
                        );
                        channels.forEach((channel) =>
                            this.listeners[channel].forEach((listener) => this.peers[sender].listen(channel, listener))
                        );
                    }
                    break;
            }
        });

        this.server.send({ type: 'hello' });
    }

    deleteConnection(id) {
        delete this.peers[id];
    }

    send(channel, message) {
        Object.keys(this.peers).forEach((id) => this.peers[id].send(channel, message));
    }

    listen(channel, listener) {
        this.listeners[channel].push(listener);
        Object.keys(this.peers).forEach((id) => this.peers[id].listen(channel, listener));
    }
}

export default Pool;
