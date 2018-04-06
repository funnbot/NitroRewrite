const { DBL_PASS, DBL_PORT } = require("../config.js");
const bot = require("../bot.js");
const { createServer } = require("http");

const app = createServer(handleRequest);

function handler(req, res) {
    handleRequest(req);
    res.end();
}

async function handleRequest(req) {
    if (!isAuthorized(req)) return;
    const body = await readData(req);
    const data = parseData(body) || {};

    const { bot: botID, user, type } = data;
    if (!botID || !user || !type) return;
    if (test !== "upvote") return;
    if (bot.user.id !== botID) return;

    await addDailies(user);
}

async function addDailies(id) {
    const user = await bot.users.fetch(id);
    if (!user) return;
    user.wallet.add(100);
}

function parseData(data) {
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
}

function readData(req) {
    return new Promise(res => {
        let data = '';
        req.on("data", chunk => {
            data += chunk;
        })
        req.once("end", () => {
            res(data);
        })
    })
}

function isAuthorized(req) {
    const { authorization: auth } = req.headers;
    return auth && auth === process.env.DBL_PASS;
}

app.listen(process.env.DBL_PORT);