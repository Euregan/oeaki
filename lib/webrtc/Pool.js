import Server from './Server';
import Peer from './Peer';

class Pool {
    constructor(websocketSignalingUrl) {
        this.server = new Server(websocketSignalingUrl);
        this.peers = {};
        this.listeners = [];

        this.server.listen(({ type, sender }) => {
            switch (type) {
                case 'hello':
                    if (!this.peers[sender]) {
                        this.peers[sender] = new Peer(
                            this.server.filter(sender),
                            () => this.deleteConnection(sender),
                            false
                        );
                        this.listeners.forEach((listener) => this.peers[sender].listen(listener));
                        this.server.send({ type: 'welcome' });
                    }
                    break;
                case 'welcome':
                    if (!this.peers[sender]) {
                        this.peers[sender] = new Peer(
                            this.server.filter(sender),
                            () => this.deleteConnection(sender),
                            true
                        );
                        this.listeners.forEach((listener) => this.peers[sender].listen(listener));
                    }
                    break;
            }
        });

        this.server.send({ type: 'hello' });
    }

    deleteConnection(id) {
        delete this.peers[id];
    }

    send(message) {
        Object.keys(this.peers)
            .filter((id) => this.peers[id].communication.readyState === 'open')
            .forEach((id) => this.peers[id].communication.send(message));
    }

    listen(listener) {
        this.listeners.push(listener);
        Object.keys(this.peers).forEach((id) => this.peers[id].listen(listener));
    }
}

export default Pool;
