const { NitroClient, MessageHandler } = require("./Nitro.js");
const bot = new NitroClient({
    disabledEvents: ["TYPING_START"],
    disabledEveryone: true
})
module.exports = bot;

(async () => {
    await bot.init();
    require("./Events");
})()