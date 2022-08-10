import inquirer from 'inquirer';

const sleep = (ms = 10000) => new Promise(r => setTimeout(r, ms))

async function getMessage() {
    let messageType = (await inquirer.prompt({
        type: "list",
        message: "Select what you wanna send:",
        name: "messageType",
        choices: ["file", "text"]
    })).messageType;
    let message = (await inquirer.prompt({
        type: "input",
        message: messageType === "file" ? "Enter filename:" : "Type message:",
        name: "message",
    })).message;
    console.log(message)
    return { messageType, message }
}

async function getId() {
    let selfId = (await inquirer.prompt({
        type: "input",
        message: "Enter your ID",
        name: "selfId"
    })).selfId
    let partnerId = (await inquirer.prompt({
        type: "input",
        message: "Enter partner's ID",
        name: "partnerId"
    })).partnerId
    return { selfId, partnerId }
}

export { getMessage, getId }