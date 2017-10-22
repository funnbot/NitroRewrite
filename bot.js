const Classes = require("./Nitro.js");

const bot = new Classes.NitroClient({
    disabledEvents: ["TYPING_START"]
})

const start = async () => {
    await bot.init();
    module.exports = bot;
}

start();