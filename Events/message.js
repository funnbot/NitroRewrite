const bot = require("../bot.js");
const { executeFilter } = require("../Functions");
const { MessageHandler } = require("../Nitro");
const { MODLOG } = require("../config");

const handler = new MessageHandler(bot);

handler.on("new", async message => {
    filter(message);
})

handler.on("edit", async (oldMessage, message) => {
    bot.modlog.emit("messageEdit", oldMessage, message);
})

handler.on("editRaw", async message => {
    filter(message);
})


async function filter(m) {
    if (await executeFilter(m)) {
        m.delete();
    }
}