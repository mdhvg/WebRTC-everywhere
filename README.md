# **WebRTC-everywhere**

This is **just** an implementation of webRTC in node.js which can be modified for any use case.

# Getting Started

## Installation (Both client and server)

- Clone this repo along with server repo

```bash
git clone --recursive https://github.com/MadhavGoyal-6/WebRTC-everywhere.git
```

- Set server address in environment variable `SERVER` or use [dotenv](https://www.npmjs.com/package/dotenv)

- Install client-side dependencies

```bash
npm i
```

- Refer to [server README.md](https://github.com/MadhavGoyal-6/WebRTC-server/blob/main/README.md) for server-side setup

## Usage

- Run `npm start`
- Wait until the prompt for sending file or text appears in the CLI.
- Select whatever you want to send.

## Troubleshooting

- You might need to use sudo if npm causes installation errors
- If npm throws an error like: `'node-pre-gyp' is not an internal or external command` just run

```
npm i -g node-gyp node-pre-gyp
```

## To-Do

- [x] Fix spelling of RECEIVE everywhere (The 'e' before 'i')
- [x] Change to ESM modules
- [x] Make a single file sharing and auto-receiving function (Using the DataChannel class)
- [x] Make a CLI
- [ ] Make the cli inputs event based instead of async-await
- [ ] Add a chat feature
- [ ] Make a React-Native version of the same

## (Sometime in the Future)

- Make an app for it on all platforms (~~even~~, especially command-line)
- Implement User Authentication with UUID
- Make a QR-code authenticator (For sharing profile info)
- Make a local-network share room option
- Make the entire system websocket based

## FYIs

- IMO, this script can only work as an interactive app. Making a new WebRTC connection everytime we want to send a file or a message will be very slow and inefficient
