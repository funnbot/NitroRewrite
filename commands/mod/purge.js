const { Command, TIME } = require("../../Nitro");

class PurgeCommand extends Command {
    onEnable() {
        this.registerSubCommands({
            count: PurgeCountSubCommand,
            match: PurgeMatchSubCommand,
            user: PurgeUserSubCommand,
            id: PurgeIdSubCommand,
            channel: PurgeChannelSubCommand,
            images: PurgeImagesSubCommand,
            embeds: PurgeEmbedsSubCommand,
            small: PurgeSmallSubCommand,
            large: PurgeLargeSubCommand,
            newusers: PurgeNewUsersSubCommand
            // role: PurgeRoleSubCommand
        })
    }

    async run({ message, bot, reply, t }) {
        const [sub] = message.args;
        await this.runSubCommand(sub);
    }

    help = "Purge messages.";
    userPerm = "MANAGE_MESSAGES";
    botPerm = "MANAGE_MESSAGES";
    arg = {
        type: "selection",
        typeText: "subcommand",
        /*items: [],
        info: "",*/
        example: "count",
        endWithoutRest: true
    }
}

const IntArg = {
    type: "int",
    info: "The amount of messages to collect.",
    example: "100",
    min: 3,
    max: 100,
    default: 100
}

class PurgeNewUsersSubCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, minDays, num] = message.args;

        const now = Date.now();
        const filter = m => now - m.author.createdTimestamp < TIME.day * minDays;
        return await purgeMessages(message.channel, filter, num);
    }

    help = "Purge messages sent by users less than days old";
    args = [{
        type: "int",
        info: "Number of days old to be a new user.",
        example: "1",
        min: 1,
        max: 7,
    }, IntArg]
}

class PurgeSmallSubCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, length, num] = message.args;

        const filter = m => m.content.length <= length;
        return await purgeMessages(message.channel, filter, num);
    }

    help = "Purge messages less than a certain length.";
    args = [{
        type: "int",
        info: "The maximum length of a message to purge",
        example: "5",
        min: 1,
        max: 500,
    }, IntArg];
}

class PurgeLargeSubCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, length, num] = message.args;

        const filter = m => m.content.length >= length;
        return await purgeMessages(message.channel, filter, num);
    }

    help = "Purge messages greater than a certain length.";
    args = [{
        type: "int",
        info: "The minimum length of a message to purge",
        example: "1000",
        min: 500,
        max: 2000,
    }, IntArg];
}

class PurgeEmbedsSubCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, num] = message.args;

        const filter = m => m.embeds.length > 0;
        return await purgeMessages(message.channel, filter, num);
    }

    help = "Purge messages that have a link embed"
    arg = IntArg;
}

class PurgeImagesSubCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, num] = message.args;

        const filter = m => m.attachments.size > 0;
        return await purgeMessages(message.channel, filter, num);
    }

    help = "Purge messages that have an attachment.";
    arg = IntArg;
}

class PurgeChannelSubCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, channel] = message.args;

        await reply("**Are you sure you want to completely purge the channel " + channel.toString() + ", this will give the channel a new id, invites linked to this channel will be removed, and it is not reversible.** `yes/no`");
        const failsafe = await message.channel.collectMessage(message.author);
        if (!failsafe) return await reply.edit("**Cancelled.**");

        const clone = await channel.clone({ reason: "channel purge" });
        await channel.delete("channel purge");

        clone.send("**Channel purged.**");
    }

    help = "Clone and delete a channel to purge all of its messages.";
    userPerm = "MANAGE_CHANNELS";
    botPerm = "MANAGE_CHANNELS";
    arg = {
        type: "channel",
        info: "The channel to purge.",
        example: "#spam-channel",
        default: true
    }
}

class PurgeIdSubCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, id, num] = message.args;

        const filter = m => m.author.id === id;
        return await purgeMessages(message.channel, filter, num);
    }

    help = "Purge messages sent by a user by their id";
    args = [{
        type: "id",
        info: "The id of the user to purge.",
        example: "359083453020635137"
    }, IntArg]
}

class PurgeUserSubCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, user, num] = message.args;

        const filter = m => m.author.id === user.id;
        return await purgeMessages(message.channel, filter, num);
    }

    help = "Purge messages sent by a user.";
    args = [{
        type: "user",
        info: "The user to purge.",
        example: "@baduser"
    }, IntArg]
}

class PurgeMatchSubCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, match, num] = message.args;

        const filter = m => m.content.toLowerCase().includes(match.toLowerCase());
        return await purgeMessages(message.channel, filter, num);
    }

    help = "Purge messages which match a string."
    args = [{
        type: "string",
        info: "The string to match.",
        example: "badword"
    }, IntArg]
}

class PurgeCountSubCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, num] = message.args;

        await message.channel.bulkDelete(num, true);
        await reply(`**Purged ${num} messages.**`);
    }

    help = "Purge a number of messages.";
    arg = IntArg;
}

async function purgeMessages(channel, filter, amount) {
    const msgs = await channel.messages.fetch({ limit: 100 });
    const sorted = msgs.sort((a, b) => b.createdTimestamp - a.createdTimestamp)
    const filtered = sorted.filter(filter);
    const limited = filtered.array().slice(0, amount);
    await channel.bulkDelete(limited, true);
    return await channel.send(`**Purged ${limited.length} messages.**`);
}

module.exports = PurgeCommand;