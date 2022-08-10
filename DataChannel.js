// const fs = require("fs");
import fs from 'fs';
import path from 'path';
import { getMessage } from './cli.js';

const saveDir = "./recv"

const packetSize = 5000;

const sleep = (ms = 10000) => new Promise(r => setTimeout(r, ms))

class DataChannel {
    constructor(isReceiver, dataChannel) {
        this.isReceiver = isReceiver;
        this.dataChannel = dataChannel;
        this.newMessage = true;
        this.sendingFile = false;
        this.header, this.recvFileName, this.packets, this.writable;
        this.sendMessage, this.message, this.readable, this.sendStatus;
        this.dataChannel.onopen = e => {
            if (this.newMessage) {
                this.send()
            }
        }
        this.dataChannel.onmessage = message => this.messageHandle(message.data)
    }

    messageHandle(data) {
        if (this.sendingFile) {
            this.sendStatus = JSON.parse(data)
        } else {
            if (this.newMessage) {

                // convert string to JSON
                // JSON format: {isFile:Boolean, data:{filename:String (Filename if file, or text data), packets:10 (Only if data is a packet)}}
                this.header = JSON.parse(data)
                if (this.header.isFile) {

                    // Check data type
                    this.recvFileName = this.header.data.filename
                    this.packets = this.header.data.packets

                    // set this.newMessage to false
                    this.newMessage = false;
                    this.writable = fs.createWriteStream(`${saveDir}/${this.recvFileName}`)

                    // send {status:"OK"}reply in JSON
                    this.dataChannel.send(JSON.stringify({ status: "OK" }))

                    // forward rest of packets to handler functions
                } else {
                    this.cout(this.header.data)
                }
            } else {
                this.saveFile(data)
            }
        }
    }

    saveFile(data) {
        if (data instanceof String) {
            this.newMessage = true;
            this.writable.end();
            return
        }
        this.writable.write(new Uint8Array(data))
    }

    cout(messageText) {
        console.log(messageText);
    }

    async send() {
        let inputs = (await getMessage());
        this.message = inputs.message
        this.messageType = inputs.messageType
        if (this.messageType === "file") {
            this.sendingFile = true
            this.sendFile()
        } else { this.sendText() }
    }
    async sendFile() {
        this.readable = fs.createReadStream(this.message)
        this.header = { isFile: true, data: { packets: Math.ceil(fs.statSync(this.message).size / packetSize), filename: path.basename(this.message) } }
        this.dataChannel.send(JSON.stringify(this.header));
        await new Promise(async resolve => {
            while (this.sendStatus?.status !== "OK") {
                await sleep(1000);
            }
            resolve()
            return
        })
        this.readable.on("readable", async () => {
            let packet;
            while ((packet = this.readable.read(packetSize)) !== null) {
                this.dataChannel.send(packet)
                await sleep(100);
            }
            this.dataChannel.send("END");
            this.sendingFile = false
        })
    }
    sendText() {
        this.header = { isFile: false, data: this.message }
        this.dataChannel.send(JSON.stringify(this.header))
    }
}

export { DataChannel }