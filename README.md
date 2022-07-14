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
- If npm throws an error: `'node-pre-gyp' is not an internal or external command` just run

```
npm i -g node-gyp node-pre=gyp
```
