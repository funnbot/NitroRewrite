const { Command, EMOTES } = require("../../Nitro");
const moment = require("moment");

class InfoCommand extends Command {
    onEnable() {
        this.registerSubCommands({
            user: UserInfoCommand
        })
    }

    async run({ message, bot, reply, t }) {
        const [sub] = message.args;
        return await this.runSubCommand(sub);
    }

    help = "Information about discord things.";
    arg = {
        type: "selection",
        typeText: "subcommand",
        example: "user",
        endWithoutRest: true
    }
}

class UserInfoCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, { user, roles, nickname, displayColor, joinedTimestamp }] = message.args;
        const roleTxt = roles.sort((a, b) => b.position - a.position)
            .map(r => r.name)
            .filter(n => n !== '@everyone')
            .join(", "),
            status = Object.accessChain(user, "presence", "status"),
            statusTxt = `${status} ${EMOTES.STATUS[status]}`,
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