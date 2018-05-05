const MODLOG = require("../config").MODLOG;
const bot = require("../bot");


bot.on("channelCreate", async channel => {
    if (!channel.guild) return;
    if (await disabled("channelCreate", channel.guild)) return;
    const ml = await modlog(channel.guild);
    if (!ml) return;

    const embed = bot.embed
        .setTitle("Channel Create")
        .setAuthor(channel.guild.name, channel.guild.iconURL())
        .addBetterField("Channel", channel)
        .addBetterField("Type", channel.type)

    return send(embed, ml);
})

bot.on("channelDelete", async channel => {
    if (!channel.guild) return;
    if (await disabled("channelCreate", channel.guild)) return;
    const ml = await modlog(channel.guild);
    if (!ml) return;

    const embed = bot.embed
        .setTitle("Channel Delete")
        .setAuthor(channel.guild.name, channel.guild.iconURL())
        .addBetterField("Channel", channel.name)

    return send(embed, ml);
})

bot.on("channelUpdate", (old, channel) => {
    if (!old.guild || !channel.guild) return;

    if (old.name !== channel.name) return channelUpdateName(old, channel);
    if (old.topic !== channel.topic) return channelUpdateTopic(old, channel);
})

async function channelUpdateTopic(old, channel) {
    if (await disabled("channelUpdateName", channel.guild)) return;
    const ml = await modlog(channel.guild);
    if (!ml) return;

    const embed = bot.embed
        .setTitle("Channel Topic Update")
        .setAuthor(channel.guild.name, channel.guild.iconURL())
        .addBetterField("Channel", channel)
        .addBetterField("Original", old.topic, true)
        .addBetterField("Edited", channel.topic);

    return send(embed, ml);
}

async function channelUpdateName(old, channel) {
    if (await disabled("channelUpdateName", channel.guild)) return;
    const ml = await modlog(channel.guild);
    if (!ml) return;

    const embed = bot.embed
        .setTitle("Channel Name Update")
        .setAuthor(channel.guild.name, channel.guild.iconURL())
        .addBetterField("Channel", channel)
        .addBetterField("Original", old.name, true);

    return send(embed, ml);
}

bot.on("messageDeleteBulk", async messages => {
    const m = messages.first();
    if (!m) return;
    if (await disabled("messageBulkDelete", m.guild)) return;
    const ml = await modlog(m.guild);
    if (!ml) return;

    const embed = bot.embed
        .setTitle("Message Bulk Delete")
        .setAuthor(m.guild.name, m.guild.iconURL())
        .addBetterField("Channel", m.channel)
        .addBetterField("Count", messages.size, true)

    return send(embed, ml);
})

bot.on("messageDelete", async message => {
    if (message.author.bot) return;
    if (await disabled("messageDelete", message.guild)) return;
    const ml = await modlog(message.guild);
    if (!ml) return;

    const embed = bot.embed
        .setTitle("Message Delete")
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .addBetterField("Channel", message.channel)
        .addBetterField("Content", message.content.substr(0, 900), true);

    let atts = attachs(message);
    if (atts) embed.addBetterField("Attachments", atts)

    return send(embed, ml);
})

bot.modlog.on("messageEdit", async (oldMessage, message) => {
    if (oldMessage.content === message.content) return;
    if (message.author.bot) return;
    if (await disabled("messageEdit", message.guild)) return;
    const ml = await modlog(message.guild);
    if (!ml) return;

    const embed = bot.embed
        .setTitle("Message Edit")
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .addBetterField("Channel", message.channel)
        .addBetterField("Original", oldMessage.content.substr(0, 900), true)
        .addBetterField("Edited", message.content.substr(0, 900))

    let atts = attachs(message);
    if (atts) embed.addBetterField("Attachments", atts);

    return send(embed, ml);
})

async function modlog(guild) {
    const ml = await guild.serverlog();
    if (!ml) return;
    const chan = bot.channels.get(ml);
    if (!chan) return;
    const perms = chan.permissionsFor(bot.user);
    if (!perms.has("SEND_MESSAGES") || !perms.has("EMBED_LINKS")) return;
    return chan;
}

async function send(embed, ml) {
    embed.nitroColor()
        .setTimestamp(new Date());

    try {
        return ml.send(embed);
    } catch {}
}

function attachs(message) {
    if (!message.attachments.size) return null;
    return Array.from(message.attachments.values()).map(a => a.url).join(", ");
}

async function disabled(event, inGuild) {
    const events = await inGuild.disabledEvents();
    return !!events[event];
}