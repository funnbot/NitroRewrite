const { Command } = require("../../Nitro");

class UpvoteCommand extends Command {
    async run({ message, bot, reply, t }) {
        return await reply("**__Heres how to upvote Nitro.__**\n**Go to <https://discordbots.org/>, click the Login button, and sign in with your discord account.\nNow go to <https://discordbots.org/bot/nitro> and click the Upvote button and make it green. Congrats!**")
    }

    help = "Show your love for Nitro by upvoting it.";
}

module.exports = UpvoteCommand;
