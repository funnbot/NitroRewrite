const Classes = require("./Nitro.js");

const bot = new Classes.NitroClient({
    disabledEvents: ["TYPING_START"]
})

const start = async () => {
    await bot.init();
    module.exports = bot;
    require("./Events/guild.js");
    require("./Events/member.js");
    const message = new Classes.MessageHandler(bot);
}
start();