const { Command } = require("../../Nitro");
const snekfetch = require("snekfetch");

const catAPI = "http://thecatapi.com/api/images/get.php/gif.php?type=gif"

class CatCommand extends Command {

    async run({ message, bot, reply, t }) {
        const r = await snekfetch.get(catAPI)
        if (r.body) await reply({ files: [r.body] })
    }

    async error({ message, bot, reply, t }, e) {
        logger.err(e);
        reply.warn("API Request Failed")
    }

    help = "Cats!";
}

module.exports = CatCommand;