(async () => {
    const { NitroClient, MessageHandler } = require("./Nitro.js");
    const bot = new NitroClient({
        disabledEvents: ["TYPING_START"]
    })
    await bot.init();
    module.exports = bot;
    require("./Events/guild.js");
    require("./Events/member.js");
    (new MessageHandler(bot));
})()