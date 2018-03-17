const { Command } = require("../../Nitro");
const snekfetch = require("snekfetch");

const url = "http://api.adviceslip.com/advice";

class AdviceCommand extends Command {

    async run ({message, bot, reply, t}) {
        const r = await snekfetch.get(url);
        const { advice } = JSON.parse(r.body).slip;
        reply(`**:speech_balloon: ${advice}**`);
    }

    async error({reply}) {
        return await reply.warn("Advice machine :b:roke");
    }

    help = "Advice for the soul.";
    cooldown = 5;
}

module.exports = AdviceCommand;