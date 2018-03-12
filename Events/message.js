const bot = require("../bot.js");
const { executeFilter } = require("../Functions");
const { MessageHandler } = require("../Nitro");
const { MODLOG } = require("../config");

const handler = new MessageHandler(bot);

handler.on("new", async message => {
    executeFilter(message);
})

handler.on("edit", async (oldMessage, message) => {
    bot.modlog.emit(MODLOG.messageEdit, oldMessage, message);
})

handler.on("editRaw", async edit => {
    executeFilter(edit);
})