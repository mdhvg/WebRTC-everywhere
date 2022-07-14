let needle = require("needle");

async function postSDP(dir, id, sdp) {
    needle("post",
        `http://192.168.29.69:3000/${dir}/new`,
        JSON.stringify({ id: id, content: sdp }), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

async function getSDP(dir, id, t, resolve, duration) {
    try {
        let response = await needle("post",
            `http://192.168.29.69:3000/${dir}/get`,
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
        setTimeout(resolve, duration)
    }
}

module.exports = { postSDP, getSDP }