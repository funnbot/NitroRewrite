const { Command } = require("../../Nitro");
const http = require("http");

class UrbanCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [input] = message.args;
        http.get("http://api.urbandictionary.com/v0/define?term="+input, res => {
            res.setEncoding("utf8");
            let body = "";
            res.on("data", data => {
                body += data;
            });
            res.on("end", () => {
                body = JSON.parse(body);
                var tags = body.tags.filter(function(item, pos, self) {
                    return self.indexOf(item) == pos;
                })
                if (body.list.length > 0) {
                    const embed = bot.embed
                        .setTitle(":book: "+input)
                        .setURL(body.list[0].permalink)
                        .addField("Definition",body.list[0].definition)
                        .addField("Example Usage",body.list[0].example)
                        .addField("Tags",tags.join(", "))
                        .nitroColor()
                        .setFooter("Powered by Urban Dictionary")
                    reply(embed);
                } else {
                    reply("I couldn't find that on Urban Dictionary :anguished:")
                }
            });
        });
    }

    help = "Search urban dictionary";
    arg = {
        type: "string",
        info: "Search string",
        example: "Yeet",
    }
}

module.exports = UrbanCommand;
