const wrtc = require('wrtc');
const { getSDP, postSDP } = require('./api');

const sleep = (ms = 10000) => new Promise(r => setTimeout(r, ms))

class PeerConnection {
    constructor(isListener = false, selfId, partnerId) {
        this.isListener = isListener
        this.peer = new wrtc.RTCPeerConnection({
            iceServers: [
                { urls: ["stun:stun.l.google.com:19302"] },
                { urls: ["stun:stun1.l.google.com:19302"] },
                { urls: ["stun:stun2.l.google.com:19302"] },
                { urls: ["stun:stun3.l.google.com:19302"] },
                { urls: ["stun:stun4.l.google.com:19302"] },
            ],
        });
        this.dataChannel, this.listenOut, this.selfAnswer, this.selfOffer, this.partnerOffer, this.partnerAnswer;
        this.selfId = selfId;
        this.partnerId = partnerId;
        this.peer.onsignalingstatechange = s => console.log(this.peer.connectionState, this.peer.signalingState)
    }

    // this.listen args: dir("offers" or "answers"), id(selfId or partnerId), res(variable to store received SDP to)
    async listen(dir, id) {
        return new Promise(async (resolveListen) => {
            while (true) {
                if (this.listenOut?.result) {
                    resolveListen()
                    break;
                } else {
                    await new Promise(resolve => getSDP(dir, id, this, resolve, 5000))
                }
            }
        });
    }

    async recieveChannel() {
        // when new iceCandidates are found, update this.selfOffer
        this.peer.onicecandidate = e => {
            if (e.candidate !== null) {
                console.log("Got Answer 🧊")
                this.selfAnswer = this.peer.localDescription
            }
        }
        this.peer.ondatachannel = dc => {
            this.dataChannel = dc.channel;
            this.dataChannel.onopen = event => {
                this.dataChannel.send(`Hello from ${this.selfId}`)
            }
            this.dataChannel.onmessage = async event => {
                console.log(event.data)
                await sleep()
                this.dataChannel.send(`Hello from ${this.selfId}`)
            }
        }
    }
    async sendChannel() {
        // when new iceCandidates are found, update this.selfAnswer
        this.peer.onicecandidate = e => {
            if (e.candidate !== null) {
                console.log("Got Offer 🧊")
                this.selfOffer = this.peer.localDescription
            }
        }
        console.log(this.dataChannel?.readyState)
        this.dataChannel.onopen = event => {
            this.dataChannel.send(`Hello from ${this.selfId}`)
        }
        this.dataChannel.onmessage = async event => {
            console.log(event.data)
            await sleep()
            this.dataChannel.send(`Hello from ${this.selfId}`)
        }
    }

    async runOrder() {
        return new Promise(async r => {
            if (this.isListener) {
                this.recieveChannel()
                // Listen for offers and store it in this.partnerOffer
                await this.listen("offers", this.partnerId);

                // set this.partnerOffer as remote description
                this.partnerOffer = this.listenOut.content
                this.peer.setRemoteDescription(this.partnerOffer)
                this.listenOut = undefined

                // generate answer
                this.selfAnswer = await this.peer.createAnswer()

                // set answer as local description
                this.peer.setLocalDescription(this.selfAnswer)

                // post answer after gathering all possible ice candidates
                this.peer.onicegatheringstatechange = e => {
                    if (this.peer.iceGatheringState === "complete") {
                        postSDP("answers", this.selfId, this.selfAnswer)
                    }
                }

                //resolve Promise
                return r();
            } else {
                // make datachannel
                this.dataChannel = this.peer.createDataChannel("dc");
                this.sendChannel()

                // create offer
                this.selfOffer = await this.peer.createOffer();

                // set offer as local description
                this.peer.setLocalDescription(this.selfOffer)

                // post offer after gathering all possible ice candidates
                this.peer.onicegatheringstatechange = e => {
                    if (this.peer.iceGatheringState === "complete") {
                        postSDP("offers", this.selfId, this.selfOffer)
                    }
                }

                // listen for answers
                await this.listen("answers", this.partnerId)

                // set answer as remote description
                this.partnerAnswer = this.listenOut.content;
                await this.peer.setRemoteDescription(this.partnerAnswer);
                this.listenOut = undefined

                //resolve Promise
                return r();
            }
        })
    }
}

let p1 = new PeerConnection(true, "p1", "p2")
p1.runOrder()

let p2 = new PeerConnection(false, "p2", "p1")
p2.runOrder()