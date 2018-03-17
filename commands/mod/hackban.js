const { Command } = require("../../Nitro");

class HackBanCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [id, reason] = message.args;

        let txt = `Are you sure you want to ban the id ${id}`;
        const m = await message.channel.ask(message.author, txt);
        const failsafe = await message.channel.collectMessage(message.author);
        if (!failsafe) return await m.edit("**Aborted.**", { embed: null });
        else await m.edit(`**Banning...**`, { embed: null });
        try {
            await message.guild.members.ban(id, { reason, days: 1 });
        } catch (e) {
            return await m.edit("**Ban failed**");
        }
        await message.guild.userAction(id, "ban", reason);
        await message.guild.modAction(message.author.id, "ban");
        await m.edit("**User banned**");

        const modlogID = await message.guild.modlog();
        const modlog = bot.channels.get(modlogID);
        if (modlog) modlog.createCase({
            action: "ban",
            user: id,
            mod: message.author,
            reason
        });
    }

    help = "Ban a user by their ID if they are not on the server.";
    botPerms = ["BAN_MEMBERS"];
    userPerms = ["BAN_MEMBERS"];
    args = [{
        type: "string",
        info: "The id of a user",
        example: "2640877062357701856",
    }, {
        type: "string",
        info: "The reason for banning",
        example: "They are a scammer",
        default: "unspecified"
    }];
}

module.exports = HackBanCommand;

/* const Nitro = require("../../../Nitro.js")

module.exports = new Nitro.Command({
    help: "",
    example: "",
    argExample: "",
    dm: false,
    coolDown: 1,
    userPerms: 1,
    botPerms: [],

    args: [],

    run: async(message, bot, send) => {
        // TODO: Finish hackban
        return send("**This command is WIP**")
    }
})*/