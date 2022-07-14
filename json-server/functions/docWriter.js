const fs = require("fs")
const path = require("path")

function createDoc(body, dir) {
    fs.writeFileSync(path.resolve(__dirname, `../Data/${dir}/${body.id}.json`), JSON.stringify(body.content))
}

function getDoc(body, dir) {
    dir = path.resolve(__dirname, `../Data/${dir}`)
    let response = { result: false, content: "" }
    while (body.id.startsWith(".") || body.id.startsWith("/")) {
        body.id = body.id.substring(1)
    }
    fs.readdirSync(dir).forEach(file => {
        if (file === `${body.id}.json`) {
            response = { result: true, content: JSON.parse(fs.readFileSync(`${dir}/${body.id}.json`)) }
        }
    })
    return response
}

module.exports = { getDoc, createDoc }