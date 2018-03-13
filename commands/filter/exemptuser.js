const { Command } = require("../../Nitro");

class ExemptUserCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [user] = message.args;
        const filterexempt = await message.guild.filterexempt();

        if (filterexempt[user.id]) {
            filterexempt[user.id] = null;
            await message.guild.filterexempt(filterexempt);
            return await reply.succ("The filter will no longer ignore: ", user.username);
        } else {
            filterexempt[user.id] = 1;
            await message.guild.filterexempt(filterexempt);
            return await reply.succ("The filter will ignore: ", user.username);
        }
    }

    options() {
        return {
            help: "Make filters ignore a user.",
            userPerms: ["MANAGE_GUILD"],
            alias: "unexemptuser",
            arg: {
                type: "user",
                info: "The user to be ignored by filters.",
                example: "@MrKing",
                default: true
            }
        }
    }
}

module.exports = ExemptUserCommand;