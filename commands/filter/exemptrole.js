const { Command } = require("../../Nitro");

class ExemptRoleCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [role] = message.args;
        const filterexempt = await message.guild.filterexempt();

        if (filterexempt[role.id]) {
            filterexempt[role.id] = null;
            await message.guild.filterexempt(filterexempt);
            return await reply.succ("The filter will no longer ignore: ", role.name);
        } else {
            filterexempt[role.id] = 1;
            await message.guild.filterexempt(filterexempt);
            return await reply.succ("The filter will ignore: ", role.name);
        }
    }

    options() {
        return {
            help: "Make filters ignore a role",
            userPerms: ["MANAGE_GUILD"],
            alias: "unexemptrole",
            arg: {
                type: "role",
                info: "The role to be ignored by filters.",
                example: "@MrKing",
            }
        }
    }
}

module.exports = ExemptRoleCommand;