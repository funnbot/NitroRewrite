const { NitroClient, MessageHandler } = require("./Nitro.js");
const bot = new NitroClient({
    disabledEvents: ["TYPING_START"],
    disabledEveryone: true
})
module.exports = bot;

(async () => {
    await bot.init();
    require("./Events/guild.js");
    require("./Events/member.js");
    require("./Events/message.js")
    require("./Events/serverlog.js");
    require("./Events/dbotsVoting.js");
})()