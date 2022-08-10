// let needle = require("needle");
import needle from 'needle';

const SERVER_IP = "172.31.150.126"

async function postSDP(dir, id, sdp) {
    needle("post",
        `http://${SERVER_IP}:3000/${dir}/new`,
        JSON.stringify({ id: id, content: sdp }), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

async function getSDP(dir, id, t, resolve, duration) {
    try {
        let response = await needle("post",
            `http://${SERVER_IP}:3000/${dir}/get`,
            JSON.stringify({ id: id }), {
            headers: {
                'Content-Type': 'application/json'
            },
        });
        t.listenOut = response.body;
        setTimeout(resolve, duration)
    }
    catch (error) {
        console.log(error)
        resolve()
    }
}

export { postSDP, getSDP }