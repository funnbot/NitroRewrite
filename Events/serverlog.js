const MODLOG = require("../config").MODLOG;
const bot = require("../bot");

bot.modlog.on(MODLOG.messageEdit, async (oldMessage, message) => {
    if (oldMessage.content === message.content) return;
    if (message.author.bot) return;
    if (await disabled(MODLOG.messageEdit, message.guild)) return;

    const embed = bot.embed
        .setTitle("Message Edit")
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .addBetterField("Channel", message.channel)
        .addBetterField("Original", oldMessage.content.substr(0, 900), true)
        .addBetterField("Edited", message.content.substr(0, 900))
        .nitroColor()
        .setTimestamp(new Date());

    return await send(embed, message.guild);
})

async function send(embed, toGuild) {
    const modlog = await toGuild.serverlog();
    if (!modlog) return;
    const chan = bot.channels.get(modlog);
    if (!chan) return;
    const perms = chan.permissionsFor(bot.user);
    if (!perms.has("SEND_MESSAGES") || !perms.has("EMBED_LINKS")) return;

    try {
        return await chan.send(embed);
    } catch (e) {
        return logger.debug(e);
    }
}

async function disabled(event, inGuild) {
    const events = await inGuild.disabledEvents();
    return !!events[event];
}