const { Command, util: { cap, round } } = require("../../Nitro");

class MLMessageCommand extends Command {

    async run ({message, bot, reply, t}) {
        const [ when, type, msg ] = message.args;

        if (type === "disable") {
            await message.guild[`ml${when}`](false);
            return await reply.succ("Disabled `" + when +"` messages.");
        }

        if (type === "text" && !msg) return await reply.fail("Type text needs a message.");

        await message.guild[`ml${when}`]({ type, msg });
        return await reply.succ(when + " message set.");
    }

    help = "Set the memberlog join or leave message and type";
    alias = "mlmsg";
    userPerms = ["MANAGE_GUILD"];
    args = [{
        type: "selection",
        items: ["join", "leave"],
        info: "For the `join` or `leave` message.",
        example: "join"
    }, {
        type: "selection",
        items: ["text", "embed", "image", "disable"],
        info: "The type of message to send. `text`, `embed`, `image`, or `disable` to turn off.",
        example: "embed"
    }, {
        type: "string",
        info: "The text sent in the message.",
        example: "Welcome {name} to HQ.",
        default: null
    }];
}

module.exports = MLMessageCommand;