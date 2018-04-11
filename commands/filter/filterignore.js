const { Command } = require("../../Nitro");

class ExemptCommand extends Command {
    onEnable() {
        this.registerSubCommands({
            channel: ExemptChannelCommand,
            user: ExemptUserCommand
        })
    }

    async run({ message, bot, reply, t }) {
        const [sub] = message.args;
        await this.runSubCommand(sub);
    }

    help = "Exempt from filters.";
    userPerm = "MANAGE_GUILD";
    alias = "unexempt";
    args = {
        type: "selection",
        typeText: "subcommand",
        example: "user",
        endWithoutRest: true
    };
}

class ExemptChannelCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, filt, channel] = message.args;

        const filters = await message.guild.filters();
        if (!filters[name]) return reply.warn(`Filter ${filt} does not exist`);
        const filter = filters[name];
        const exempt = filter.exempt;

        if (exempt[channel.id]) {
            delete exempt[channel.id];
            reply.succ(`The filter ${filt} will no longer ignore: `, channel.toString());
        } else {
            exempt[channel.id] = 1;
            reply.succ(`The filter ${filt} will ignore: `, channel.toString());
        }

        filter.exempt = exempt;
        filters[name] = filter;
        return await message.guild.filters(filters);
    }

    help = "Make filters ignore a channel.";
    args = [{
        type: "string",
        info: "The filter to add the ignore.",
        example: "badwords"
    }, {
        type: "channel",
        info: "The channel to be ignored by filters.",
        example: "#advertisements",
        default: true
    }];
}

class ExemptUserCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, filt, user] = message.args;

        const filters = await message.guild.filters();
        if (!filters[name]) return reply.warn(`Filter ${filt} does not exist`);
        const filter = filters[name];
        const exempt = filter.exempt;

        if (exempt[user.id]) {
            delete exempt[user.id];
            reply.succ(`The filter ${filt} will no longer ignore: `, user.username);
        } else {
            exempt[user.id] = 1;
            reply.succ(`The filter ${filt} will ignore: `, user.username);
        }

        filter.exempt = exempt;
        filters[name] = filter;
        return await message.guild.filters(filters);
    }

    help = "Make filters ignore a channel.";
    args = [{
        type: "string",
        info: "The filter to add the ignore.",
        example: "badwords"
    }, {
        type: "user",
        info: "The user to be ignored by filters.",
        example: "@user",
        default: true
    }];
}

class ExemptRoleCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, filt, role] = message.args;

        const filters = await message.guild.filters();
        if (!filters[name]) return reply.warn(`Filter ${filt} does not exist`);
        const filter = filters[name];
        const exempt = filter.exempt;

        if (exempt[role.id]) {
            delete exempt[role.id];
            reply.succ(`The filter ${filt} will no longer ignore: `, role.name);
        } else {
            exempt[role.id] = 1;
            reply.succ(`The filter ${filt} will ignore: `, role.name);
        }

        filter.exempt = exempt;
        filters[name] = filter;
        return await message.guild.filters(filters);
    }

    help = "Make filters ignore a channel.";
    args = [{
        type: "string",
        info: "The filter to add the ignore.",
        example: "badwords"
    }, {
        type: "user",
        info: "The user to be ignored by filters.",
        example: "@user",
        default: true
    }];
}

module.exports = ExemptChannelCommand;