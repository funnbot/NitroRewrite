const { Command } = require("../../Nitro");

class AdblockCommand extends Command {

    async run({ message, bot, reply, t }) {
        const adblock = await message.guild.adblock();

        await message.guild.adblock(!adblock);
        return await reply.succ((adblock ? "Disabling" : "Enabling") + " adblock.");
    }

    help = "Toggle blocking discord embedded invites.";
    userPerms = ["MANAGE_GUILD"];
}

module.exports = AdblockCommand;