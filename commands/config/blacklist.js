const { Command, FUNNBOT } = require("../../Nitro");

class BlacklistCommand extends Command {
    onEnable() {
        this.registerSubCommands({
            user: BlackListUserCommand,
            channel: BlackListChannelCommand,
            role: BlackListRoleCommand
        })
    }

    async run({ message, bot, reply, t }) {
        const [sub] = message.args;
        await this.runSubCommand(sub);
    }

    help = "Blacklist from usage of the bot";
    userPerm = "MANAGE_GUILD";
    alias = ["unblacklist", "whitelist"];
    arg = {
        type: "selection",
        typeText: "subcommand",
        example: "user",
        endWithoutRest: true
    }
}

class BlackListUserCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [mem] = message.args;

        if (mem.user.id === FUNNBOT ||
            mem.roles.highest.position >=
            message.member.roles.highest.position)
            return await reply.warn("You cannot blacklist this user.");

        const bl = await message.guild.blacklist();
        if (bl[mem.user.id]) {
            delete bl[mem.user.id];
            await message.guild.blacklist(bl);
            return await reply.succ("Unblacklisted user: ", mem.user.username);
        } else {
            bl[mem.user.id] = 1;
            await message.guild.blacklist(bl);
            return await reply.succ("Blacklisted user: ", mem.user.username);
        }
    }

    help = "Blacklist a user from running commands.";
    userPerm = "MANAGE_GUILD";
    arg = {
        type: "member",
        info: "The user to blacklist",
        example: "@badboi",
    }
}

class BlackListChannelCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [chan] = message.args;

        const bl = await message.guild.blacklist();
        if (bl[chan.id]) {
            delete bl[chan.id];
            await message.guild.blacklist(bl);
            return reply.succ("Unblacklisted channel: ", chan.toString());
        } else {
            bl[chan.id] = 1;
            await message.guild.blacklist(bl);
            return await reply.succ("Blacklisted channel: ", chan.toString());
        }
    }

    help = "Blacklist all commands from a channel.";
    userPerm = "MANAGE_GUILD";
    arg = {
        type: "channel",
        info: "The channel to blacklist",
        example: "#nocommands",
    }
}

class BlackListRoleCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [role] = message.args;
        const mem = message.member;

        if (roles.position >= mem.roles.highest.position)
            return reply.warn("You cannot blacklist this role.");

        const bl = await message.guild.blacklist();
        if (bl[role.id]) {
            delete bl[role.id];
            await message.guild.blacklist(bl);
            return reply.succ("Unblacklisted role: ", role.name);
        } else {
            bl[role.id] = 1;
            await message.guild.blacklist(bl);
            return reply.succ("Blacklisted role: ", role.name);
        }
    }

    help = "Blacklist all commands from a role.";
    userPerm = "MANAGE_GUILD";
    arg = {
        type: "role",
        info: "The role to blacklist",
        example: "@users",
    }
}

module.exports = BlackListUserCommand;