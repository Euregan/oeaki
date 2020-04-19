import Server from './Server';
import Peer from './Peer';

class Pool {
    constructor(websocketSignalingUrl, channels, onNewPeer) {
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
                        onNewPeer(sender);
                        channels.forEach((channel) =>
                            this.listeners[channel].forEach((listener) =>
                                this.peers[sender].listen(channel, (data) => listener(sender, data))
                            )
                        );
                        this.server.send({ type: 'welcome', recipient: sender });
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
                        onNewPeer(sender);
                        channels.forEach((channel) =>
                            this.listeners[channel].forEach((listener) =>
                                this.peers[sender].listen(channel, (data) => listener(sender, data))
                            )
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

    sendTo(id, channel, message) {
        this.peers[id].send(channel, message);
    }

    listen(channel, listener) {
        this.listeners[channel].push(listener);
        Object.keys(this.peers).forEach((id) => this.peers[id].listen(channel, (data) => listener(id, data)));
    }
}

export default Pool;
