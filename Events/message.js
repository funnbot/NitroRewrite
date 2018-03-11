const bot = require("../bot.js");
const { MessageHandler } = require("../Nitro");
const { MODLOG } = require("../config");

const handler = new MessageHandler(bot);

handler.on("new", async message => {

})

handler.on("edit", async (oldMessage, message) => {
    bot.modlog.emit(MODLOG.messageEdit, oldMessage, message);
})

handler.on("editRaw", async edit => {

})