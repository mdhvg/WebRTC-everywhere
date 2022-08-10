// const wrtc = require('wrtc');
import wrtc from 'wrtc';

// const { getSDP, postSDP } = require('./api');
import { getSDP, postSDP } from './api.js';
import { getId } from './cli.js';

// const { DataChannel } = require('./DataChannel');
import { DataChannel } from './DataChannel.js'

const sleep = (ms = 10000) => new Promise(r => setTimeout(r, ms))

class PeerConnection {
    constructor() {
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
        // this.peer.onsignalingstatechange = s => console.log(this.peer.connectionState, this.peer.signalingState)

        this.receiveChannel()
        getId().then(value => {
            this.selfId = value.selfId;
            this.partnerId = value.partnerId;
            console.log(this.selfId, this.partnerId)

            // Check if partner offer exists
            this.checkOffers().then(() => { this.connect() })
        })
    }

    // this.listen args: dir("offers" or "answers"), id(selfId or partnerId), res(variable to store received SDP to)
    async listen(dir, id) {
        return new Promise(async (resolveListen) => {
            while (true) {
                if (this.listenOut?.result && this.listenOut.content !== "pending") {
                    resolveListen()
                    break;
                } else {
                    await new Promise(resolve => getSDP(dir, id, this, resolve, 5000))
                }
            }
        });
    }

    async checkOffers() {
        return new Promise(async (resolve) => {
            await getSDP("offers", this.partnerId, this, resolve, 0)
        })
    }

    async receiveChannel() {
        this.peer.ondatachannel = dc => {
            this.dataChannel = new DataChannel(true, dc.channel);
        }
    }

    async connect() {
        if (this.listenOut.result || this.listenOut.content === "pending") {
            console.log("Receiver")
            // set this.partnerOffer as remote description
            this.partnerOffer = this.listenOut.content
            if (this.partnerOffer === "pending") {
                await this.listen("offers", this.partnerId)
                this.partnerOffer = this.listenOut.content
            }
            this.peer.setRemoteDescription(this.partnerOffer)
            this.listenOut = undefined

            // generate answer
            this.selfAnswer = await this.peer.createAnswer()

            // set answer as local description
            this.peer.setLocalDescription(this.selfAnswer)

            // when new iceCandidates are found, update this.selfOffer
            this.peer.onicecandidate = e => {
                if (e.candidate !== null) {
                    // console.log("Got Answer 🧊")
                    console.log(this.peer.localDescription)
                    this.selfAnswer = this.peer.localDescription
                }
            }

            // post answer after gathering all possible ice candidates
            this.peer.onicegatheringstatechange = e => {
                if (this.peer.iceGatheringState === "complete") {
                    postSDP("answers", this.selfId, this.selfAnswer)
                }
            }
        } else {
            console.log("Listener")

            // send dummy offer
            postSDP("offers", this.selfId, "pending")

            // make datachannel
            this.dataChannel = new DataChannel(false, this.peer.createDataChannel("dc"));

            // create offer
            this.selfOffer = await this.peer.createOffer();

            // set offer as local description
            this.peer.setLocalDescription(this.selfOffer)

            // when new iceCandidates are found, update this.selfAnswer
            this.peer.onicecandidate = e => {
                if (e.candidate !== null) {
                    // console.log("Got Offer 🧊")
                    console.log(this.peer.localDescription)
                    this.selfOffer = this.peer.localDescription
                }
            }

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

        }
    }
}

let p1 = new PeerConnection()

export { PeerConnection }