# **WebRTC-everywhere**

This is **just** an implementation of webRTC in node.js which can be modified for any use case.
</br>

# Getting Started

## Installation

- Clone this repo
- Install client-side dependencies

```
npm i
```

- Setup directory structure in json-server folder

```bash
mkdir Data
cd Data && mkdir Answers Offers
```

- The directory structure should be something like:

```
json-server
├───Data
│   ├───Answers
│   └───Offers
├───functions
├───node_modules
└───routes
```

- Finally, install all server-side dependencies

```
npm i
```

(In json-server folder)

## Usage

- After setting everything up, you need to run `node peerConn` in the base directory and `node app` in json-server directory in 2 seperate terminals.

- You should end up with 2 peers pinging each other every 10 seconds

## Troubleshooting

- You might need to use sudo if npm causes installation errors
- If npm throws an error like: `'node-pre-gyp' is not an internal or external command` just run

```
npm i -g node-gyp node-pre=gyp
```

## To-Do

- [x] Fix spelling of RECEIVE everywhere (The 'e' before 'i')
- [x] Change to ESM modules
- [ ] Make a single file sharing and auto-receiving function (Using the DataChannel class)
- [ ] Make a CLI
- [ ] Add a chat feature
- [ ] Make the cli inputs event based instead of async-await
- [ ] Make a React-Native version of the same

## (Sometime in the Future)

- Make an app for it on all platforms (~~even~~, especially command-line)
- Implement User Authentication with UUID
- Make a QR-code authenticator (For sharing profile info)
- Make a local-network share room option

## FYIs

- IMO, this script can only work as an interactive app. Making a new WebRTC connection everytime we want to send a file or a message will be very slow and inefficient
