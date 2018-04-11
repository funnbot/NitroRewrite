const { Command, EMOTES: { STATUS } } = require("../../Nitro");
const moment = require("moment");
const { Guild } = require("discord.js");

class InfoCommand extends Command {
    onEnable() {
        this.registerSubCommands({
            user: UserInfoCommand,
            server: ServerInfoCommand
        })
    }

    async run({ message, bot, reply, t }) {
        const [sub] = message.args;
        return await this.runSubCommand(sub);
    }

    help = "Information about discord things.";
    cooldown = 5;
    arg = {
        type: "selection",
        typeText: "subcommand",
        example: "user",
        endWithoutRest: true
    }
}

class ServerInfoCommand extends Command {
    async run({ message, bot, reply, t }) {
        /** @type {Guild} */
        const guild = message.guild;

        const embed = bot.embed
            .setAuthor(`${guild.name} (${guild.id})`)
            .setThumbnail(guild.iconURL())
            .addBetterField("")
            .addField("Members", memberStatus(guild))
        reply(embed);
    }

    help = "Information about the server";
}

function memberStatus(guild) {
    const count = guild.memberCount;
    const stats = { online: 0, idle: 0, dnd: 0, offline: count };
    const memes = guild.members.array();
    for (let i = 0; i < memes.length; i++) {
        const mem = memes[i];
        const status = Object.accessChain(mem, "user", "presence", "status");
        if (!status || status === "offline") continue;
        stats["offline"]--;
        stats[status]++;
    }
    let str = `Total [${count}](#)`;
    for (let t of Object.keys(stats)) str += `\n  ${STATUS[t]} [${stats[t]}](http://)`;
    return str;
}

class UserInfoCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, { user, roles, nickname, displayColor, joinedTimestamp }] = message.args;
        const roleTxt = roles.sort((a, b) => b.position - a.position)
            .map(r => r.name)
            .filter(n => n !== '@everyone')
            .join(", "),
            status = Object.accessChain(user, "presence", "status"),
            statusTxt = `${status} ${STATUS[status]}`,
            activity = Object.accessChain(user, "presence", "activity");

        const embed = bot.embed
            .setAuthor(user.tag + ` (${user.id})`)
            .setThumbnail(user.avatarURL())
            .setColor(displayColor);

        (!status || embed.addBetterField("Status", statusTxt));
        (!nickname || embed.addBetterField("Nickname", nickname));
        (!activity || embed.addBetterField(activity.type, activity.name));


        embed.addBetterField("Joined", moment(joinedTimestamp).format("lll"), true)
            .addBetterField("Account Created", moment(user.createdAt).format("lll"))
            .addField("Roles", roleTxt);


        return reply(embed);
    }

    help = "Information about a user.";
    arg = {
        type: "member",
        info: "The user to get info about.",
        example: "@person",
        default: true
    }
}

module.exports = InfoCommand;