class Peer {
    constructor(signaling, channels, onShutdown, offerer) {
        this.connection = new RTCPeerConnection({
            iceServers: [
                {
                    urls: 'stun:stun.l.google.com:19302',
                },
            ],
        });

        // send any ice candidates to the other peer
        this.connection.onicecandidate = ({ candidate }) => {
            try {
                signaling.send({ candidate });
            } catch (error) {
                console.error(error);
            }
        };

        this.connection.onconnectionstatechange = () => {
            if (['disconnected', 'failed'].includes(this.connection.connectionState)) {
                onShutdown();
            }
        };

        // let the "negotiationneeded" event trigger offer generation
        this.connection.onnegotiationneeded = async () => {
            try {
                if (offerer) {
                    await this.connection.setLocalDescription(await this.connection.createOffer());
                    // send the offer to the other peer
                    signaling.send({ description: this.connection.localDescription });
                }
            } catch (error) {
                console.error(error);
            }
        };

        this.connection.ondatachannel = async ({ channel }) => {
            channel.onmessage = ({ data }) => this.listeners[channel.label].forEach((listener) => listener(data));
            channel.onerror = console.error;
        };

        signaling.listen(async ({ description, candidate }) => {
            try {
                if (candidate) {
                    await this.connection.addIceCandidate(candidate);
                    return;
                }

                if (!description) {
                    return;
                }

                switch (description.type) {
                    case 'offer':
                        await this.connection.setRemoteDescription(description);
                        await this.connection.setLocalDescription(await this.connection.createAnswer());
                        signaling.send({ description: this.connection.localDescription });
                        break;
                    case 'answer':
                        if (this.connection.signalingState !== 'stable') {
                            await this.connection.setRemoteDescription(description);
                        }
                        break;
                    default:
                        console.error('Unsupported SDP type.');
                        break;
                }
            } catch (error) {
                console.error(error);
            }
        });

        this.channels = {};
        this.listeners = {};
        channels.forEach((channel) => {
            this.listeners[channel] = [];
            this.channels[channel] = this.connection.createDataChannel(channel);
            this.channels[channel].onerror = console.error;
        });
    }

    listen(channel, listener) {
        this.listeners[channel].push(listener);
    }

    send(channel, message) {
        if (this.channels[channel].readyState === 'open') {
            this.channels[channel].send(message);
        }
    }
}

export default Peer;
