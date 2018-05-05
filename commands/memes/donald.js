const { Command } = require("../../Nitro");
const pfp = "https://images-ext-1.discordapp.net/external/0dhj6pqQcWlVWCUOtIC4TTNKLWm9AHSTN7QjNOkeGD8/https/pbs.twimg.com/profile_images/874276197357596672/kUuht00m_bigger.jpg";
const twit = "https://images-ext-1.discordapp.net/external/bXJWV2Y_F3XSra_kEqIYXAAsI3m1meckfLhYuWzxIfI/https/abs.twimg.com/icons/apple-touch-icon-192x192.png";

class DonaldCommand extends Command {

    async run ({message, bot, reply, t}) {
        const [m] = message.args;
        const embed = bot.embed
            .setAuthor("Donald J. Trump (@realDonaldTrump)", pfp, "https://twitter.moc/realDonaldTrump")
            .setDescription(m)
            .setFooter("Twitter", twit)
            .addField("Retweets", Math.floor(Math.random() * 1e6), true)
            .addField("Likes", Math.floor(Math.random() * 1e6), true)
        reply(`https://twitter.moc/realDonaldTrump/status/${message.id}`, embed);
    }

    help = "Tweet like the Donald.";
    botPerm = "EMBED_LINKS"
    arg = {
        type: "string",
        info: "The message in the tweet",
        example: "My IQ is one of the highest.",
        min: 1,
        max: 2000
    }
}

module.exports = DonaldCommand;