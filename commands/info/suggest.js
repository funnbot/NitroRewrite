const { Command, TRELLO_KEY, TRELLO_TOKEN, TRELLO_LIST, SUGGEST_HOOK } = require("../../Nitro");
const Trello = require("node-trello");
const Discord = require("discord.js");
const trello = new Trello(TRELLO_KEY, TRELLO_TOKEN);
const hook = new Discord.WebhookClient("323966823890419712", SUGGEST_HOOK);

class SuggestCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [m] = message.args;
        const { tag, id } = message.author;
        hook.send(`**${tag} (${id}) -** ${m}`);

        const card = {
            name: m,
            pos: "top",
            due: null,
            idList: TRELLO_LIST,
            desc: "Suggester: " + tag
        }
            
        trello.post("/1/cards", card, err => err ? logger.err(err) : 0);

        reply.succ("Thank you for your suggestion!");
    }

    help = "Suggest a feature for Nitro.";
    arg = {
        type: "string",
        info: "The suggestion message.",
        example: "Make it better.",
        min: 5
    }
}

module.exports = SuggestCommand;