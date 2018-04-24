const snekfetch = require("snekfetch");
const Long = require("long");
const bot = require("../bot.js");
const { carbonitex, discordbots } = require("../config.js");

const embed = bot.embed
embed.setTitle("So, you invited Nitro...")
    .addField("Getting Started", "Get the commands with `n!help`")
    .addField("Support Server", "https://discord.gg/aZ2PYhn")
    .setFooter("Hello")
    .setTimestamp(new Date())
    .nitroColor();


bot.on("guildCreate", guild => {
    if (guild.members.filter(m => m.user.bot).size > 30)
        return guild.leave().catch(console.error);

    const defchannel = defaultChannel(guild) || guild.owner;
    defchannel.send({embed}).catch(console.error);

    postStats();
});

bot.on("guildDelete", guild => postStats());

const postStats = async() => {
    if (bot.isBeta) return;
    let guildcount = await bot.shard.clientValuesReduced("guilds.size");

    makeRequest("https://discordbots.org/api/bots/264087705124601856/stats", {
        shard_id: bot.shard.id,
        shard_count: bot.shard.count,
        server_count: bot.guilds.size
    }, discordbots);

    makeRequest("https://www.carbonitex.net/discord/data/botdata.php", {
        key: carbonitex,
        servercount: guildcount || 0,
        shardcount: bot.shard.count
    })
}

const makeRequest = (url, body, auth) => {
    const req = snekfetch.post(url);
    auth && req.set("Authorization", auth);
    req.set("Content-Type", "application/json")
        .send(body)
        .then().catch(e => logger.warn(e));
}

const defaultChannel = guild => guild.channels
    .filter(c => c.type === "text" &&
        c.permissionsFor(bot.user).has("SEND_MESSAGES"))
    .sort((a, b) => a.position - b.position ||
        Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
    .first();

