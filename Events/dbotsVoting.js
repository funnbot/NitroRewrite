const { DBL_PASS, DBL_PORT } = require("../config.js");
const net = require("net");
const bot = require("../bot.js");
const { createServer } = require("http");

const app = createServer(handler);

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
    if (type !== "upvote" && type !== "test") return;
    if (bot.user.id !== botID) return;

    await addDailies(user);
}

async function addDailies(id) {
    const user = await bot.users.fetch(id);
    if (!user) return;
    logger.info(`${user.id} voted`);
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

async function startServer() {
    try {
        await isRunning();
        app.listen(DBL_PORT)
        logger.info(`Voting server started on ${DBL_PORT}`);
    } catch {}
}

startServer();

function isRunning() {
    return new Promise((resolve, reject) => {
        const tester = net.createServer()
            .once('error', e => {
                if (e.code != 'EADDRINUSE') return reject(e);
                return reject(e);
            })
            .once('listening', () => {
                tester.once('close', () => resolve()).close();
            })
            .listen(DBL_PORT);
    })
}