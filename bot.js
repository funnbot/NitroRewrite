const { NitroClient, MessageHandler } = require("./Nitro.js");
const bot = new NitroClient({
    disabledEvents: ["TYPING_START"],
    disabledEveryone: true,
    messageCacheMaxSize: 100,
    messageCacheLifetime: 120,
    messageSweepInterval: 120
})
module.exports = bot;

(async () => {
    await bot.init();
    require("./Events");
})()