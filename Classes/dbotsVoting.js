const { DBL_PASS, DBL_PORT } = require("../config.js");
const bot = require("../bot.js");
const { createServer } = require("http");

const app = createServer(handleRequest);

logger.info(`Voting server started on ${DBL_PORT}`);

function handler(req, res) {
    await handleRequest(req);
    res.end();
}

async function handleRequest(req) {
    console.log(req);
    if (!isAuthorized(req)) return;
    const body = await readData(req);
    const data = parseData(body) || {};

    const { bot: botID, user, type } = data;
    if (!botID || !user || !type) return;
    if (type !== "upvote") return;
    if (bot.user.id !== botID) return;

    await addDailies(user);
}

async function addDailies(id) {
    const user = await bot.users.fetch(id);
    if (!user) return;
    logger.info(`${user.username}(${user.id}) voted`);
    user.wallet.add(50);
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
    return auth && auth === DBL_PASS;
}

app.listen(DBL_PORT);