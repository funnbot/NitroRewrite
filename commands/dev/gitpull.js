const { Command, FUNNBOT } = require("../../Nitro");
const {exec} = require("child_process");

class GitPullCommand extends Command {
    async run ({message, bot, reply, t}) {
        if (message.author.id !== FUNNBOT) return;
        exec("git pull", (err, pull) => {
            if (err) return logger.err(err);
            logger.debug(pull.toString());
            reply("Files updated.");
        })
    }

    help = "Update with the latest code";
    userPerm = "DEV";
}

module.exports = GitPullCommand;