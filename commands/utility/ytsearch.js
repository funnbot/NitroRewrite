const { Command } = require("../../Nitro");
const { YTAPITOKEN } = require("../../auth");
const NitroFetch = require("../../Classes/NitroFetch");

class YTSearchCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [input] = message.args;
        //console.log(YTAPITOKEN)
        //return reply(YTAPITOKEN);
        const gAPIurl = 'https://www.googleapis.com/youtube/v3/search?maxResults=1&type=video&q=' + input + "&key=" + YTAPITOKEN + "&part=snippet";
        //console.log(gAPIurl)
        var fetcher = new NitroFetch();
        var response = await fetcher.grab(gAPIurl)
        //console.log(response)
        var body = JSON.parse(response)
        //var tags = body.items.filter(function(item, pos, self) {
            //return self.indexOf(item) == pos;
        //})
        if (body.items.length > 0) {
            const embed = bot.embed
                .setTitle(body.items[0].snippet.title)
                .setURL("https://www.youtube.com/watch?v="+body.items[0].id.videoId)
                .setDescription(body.items[0].snippet.description)
                .addField("By "+body.items[0].snippet.channelTitle,"Published "+body.items[0].snippet.publishedAt.split("T")[0])
                .setThumbnail(body.items[0].snippet.thumbnails.default.url)
                .setColor([255,0,0])
                .setFooter("Powered by YouTube")
            reply(embed);
        } else {
            //.addField("Tags",tags.join(", "))
            reply("I couldn't find that on Urban Dictionary :anguished:")
        }

    }

    help = "Search urban dictionary";
    arg = {
        type: "string",
        info: "Search string",
        example: "Yeet",
    }
}

module.exports = YTSearchCommand;
