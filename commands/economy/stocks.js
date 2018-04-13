const { Command } = require("../../Nitro");
const { STOCKS } = require("../../config.js")

class StocksCommand extends Command {
    async run({ message, bot, reply, t }) {
        const args = message.args;
        //console.log(args)
        if (args[0].split(" ")[0] == "") {
            const embed = bot.embed
            .setTitle(":chart_with_upwards_trend: NTSE :chart_with_upwards_trend:")
            .nitroColor()
            const userOwnedShares = await bot.stockMarket.createList(message.author);
            //console.log(userOwnedShares)
            for (const [key, value] of Object.entries(bot.stockMarket.stocks)) {
                var qtyHeld = userOwnedShares[key];
                if (qtyHeld == undefined) {
                    qtyHeld = 0;
                }
                var heldInfo = "*You do not own this stock*";
                if (qtyHeld > 0) {
                    heldInfo = "You own **" + qtyHeld + "** currently worth **" + message.guild.formatBal(value.price * qtyHeld) + "**"
                }
                embed.addField(key + " [" + value.key + "] @ **"+message.guild.formatBal(value.price)+"**",heldInfo);
            }
            return await reply(embed);

            //return reply(tickercode+" @ "+message.guild.formatBal(0));
        } else {
            var stockType = args[1].split(" ")[0];
            var amount = parseInt(args[2].split(" ")[0]);

            if (STOCKS[stockType] == undefined) {
                for (const [key, value] of Object.entries(STOCKS)) {
                    if (value.key == args[1].split(" ")[0].toUpperCase()) {
                        stockType = key;
                    }
                    if (key.toUpperCase() == args[1].split(" ")[0].toUpperCase()) {
                        stockType = key;
                    }
                }
            }

            if (STOCKS[stockType] == undefined) {
                return await reply("Invalid stock name or ticker code")
            }

            if (isNaN(amount)) {
                return await reply("Amount not a number")
            }

            if (args[0].split(" ")[0] == "sell") {
                var success = await bot.stockMarket.sell(message.author, stockType, amount)
                if (success != false) {
                    const embed = bot.embed
                        .setTitle(":chart_with_upwards_trend: NTSE :chart_with_upwards_trend:")
                        .nitroColor()
                        .addField("Sold " + success.key + " @ **" + message.guild.formatBal(success.val) + "**","**"+message.guild.formatBal(success.cost)+"** for "+success.qty+" stocks");
                    return await reply(embed);
                } else {return await reply("Insufficient Stock")}
            } else if (args[0].split(" ")[0] == "buy") {
                var success = await bot.stockMarket.buy(message.author, stockType, amount)
                if (success != false) {
                    const embed = bot.embed
                        .setTitle(":chart_with_upwards_trend: NTSE :chart_with_upwards_trend:")
                        .nitroColor()
                        .addField("Purchased " + success.key + " @ **" + message.guild.formatBal(success.val) + "**","**"+message.guild.formatBal(success.cost)+"** for "+success.qty+" stocks");
                    return await reply(embed);
                } else {return await reply("Insufficient Funds")}
            }
        }
    }

    help = "Gets the current stock prices";
    alias = ["stock"];
    wip = true;
    arg = {
        type: "string",
        info: "Buy, sell and view stocks",
        example: "FNN",
        default: true
    }
}

module.exports = StocksCommand;
