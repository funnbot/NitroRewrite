const { Command, util } = require("../../Nitro");
const Discord = require("discord.js");
const os = require("os");
const moment = require("moment");

class StatsCommand extends Command {

    async run({ message, bot, reply, t }) {
        if (!bot.stats) return await reply.warn("Something went wrong fetching stats.");
        const s = await fetchStuff(bot);
        if (!s) return await reply.warn("Something went wrong fetching stats.");

        const shards = "**```http\n" + [
            `Count    :: ${s.SHARDCOUNT}`,
            `Guilds    :: ${s.TOTAL_GUILDS}`,
            `Channels  :: ${s.TOTAL_CHANNELS}`,
            `Users     :: ${s.TOTAL_USERS}`
        ].join("\n") + "```**";

        const mods = "**```http\n" + [
            `Memory GB :: ${s.TOTAL_MEM + "MB"}`,
            `CPU       :: ${s.TOTAL_CPU + "%"}`,
            `Ping MS   :: ${s.PING + "MS"}`,
            `Uptime    :: ${s.UPTIME}`
        ].join("\n") + "```**";

        const envir = "**```http\n" + [
            `NodeJS    :: ${s.NODE_V}`,
            `OS        :: ${s.OS}`,
            `Library   :: ${s.LIBRARY}`,
            `Version   :: ${s.LIBRARY_V}`,
        ].join("\n") + "```**";

        const info = "**```http\n" + [
            `Creator   :: ${s.CREATOR}`,
            `Modules   :: ${s.MODULES}`,
            `Commands  :: ${s.COMMANDS}`,
            "Website   :: none",
            "Patreon   :: patreon.com/nitrobot",
            "PayPal    :: paypal.me/funnbot"
        ].join("\n") + "```**";

        const embed = new bot.Embed()
            .addField("—— Shards ——", shards, true)
            .addField("—— Usage ——", mods, true)
            .addField("—— Environment ——", envir, true)
            .addField("—— Information ——", info, true)
            .nitroColor()
        if (message.channel.permissionsFor(bot.user).has("EMBED_LINKS"))
            return reply(embed);
        else return reply(embed.asMessage());
    }

    help = "Stats";
    alias = ["botinfo", "statistics"];
}

module.exports = StatsCommand;

async function fetchStuff(bot) {
    let s = {};

    s.GUILDS = bot.guilds.size;
    s.CHANNELS = bot.channels.size;
    s.USERS = bot.users.size;
    s.SHARDID = bot.shard.id + 1;
    s.SHARDCOUNT = bot.shard.count;
    s.NODE_V = process.version;
    s.LIBRARY_V = Discord.version;
    s.LIBRARY = "discord.js";
    s.CREATOR = "Funnbot#1337";
    s.OS = process.platform;
    s.PING = util.round100(bot.ping);

    try {
        s.TOTAL_GUILDS = await bot.shard.clientValuesReduced("stats.guildCount");
        s.TOTAL_CHANNELS = await bot.shard.clientValuesReduced("stats.channelCount");
        s.TOTAL_USERS = await bot.shard.clientValuesReduced("stats.userCount");
        s.TOTAL_MEM = await bot.shard.clientValuesReduced("stats.memUsage");
        s.TOTAL_CPU = await bot.shard.clientValuesReduced("stats.cpuUsage");
        s.TOTAL_MEM = util.round(s.TOTAL_MEM, 3);
        s.TOTAL_CPU = util.round(s.TOTAL_CPU, 0);
    } catch (e) {
        console.log(e);
        return null;
    }

    s.CPU = Math.ceil(bot.stats.cpuUsage * 100) / 10;
    s.MEMORY = Math.round(bot.stats.memUsage);
    s.UPTIME = moment.duration(bot.uptime).humanize();
    s.MODULES = Object.keys(bot.CommandLoader.groups).length;
    s.COMMANDS = Object.keys(bot.commands).length;

    return s;
}