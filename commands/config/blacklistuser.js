const { Command, FUNNBOT } = require("../../Nitro");

class BlackListUserCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [user] = message.args;

        const mem = await message.guild.members.fetch(user);
        if (user.id === FUNNBOT ||
            mem.roles.highest.position >=
            message.member.roles.highest.position)
            return await reply.warn("You cannot blacklist this user.");

        const bl = await message.guild.blacklist();
        if (bl[user.id]) {
            bl[user.id] = null;
            await message.guild.blacklist(bl);
            return await reply.succ("Unblacklisted user: ", user.username);
        } else {
            bl[user.id] = true;
            await message.guild.blacklist(bl);
            return await reply.succ("Blacklisted user: ", user.username);
        }
    }

    help = "Blacklist a user from running commands.";
    userPerm = "BAN_MEMBERS";
    alias = ["bluser", "unblacklistuser", "unbluser"];
    arg = {
        type: "user",
        info: "The user to blacklist",
        example: "@badboi",
    }
}

module.exports = BlackListUserCommand;