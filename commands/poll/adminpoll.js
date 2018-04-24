const { Command, TIME } = require("../../Nitro");

class AdminPollCommand extends Command {

    async run({ message, bot, reply, t }) {
        if (message.guild.cache.exists("apoll")) return reply("**There is already an admin poll running.**");
        const [display, voting, time, opts] = message.args;

        if (!display.hasSendPerms) return reply(`**I lack permission to send messages in the channel ${display}.**`);
        if (!voting.hasSendPerms) return reply(`**I lack permission to send messages in the channel ${voting}.**`);

        let split = opts.split("|");
        if (!split[0]) return reply("**Split your options with the character `|`**");
        if (split.length <= 2) return reply("**You must have at least 2 options**");
        let quest = split[0];
        split = split.slice(1).map(t => t.trim());
        let options = split.map(t => ({ content: t, votes: 0 }));

        let poll = {
            author: message.author.id,
            total: 0,
            options,
            quest
        }

        message.guild.cache.set("apoll");
        message.author.cache.deleteAll("apoll");
        reply(`**Respond with \`endpoll\` in ${voting} to end the poll early.**`)
        display.send(`**__${quest}__**

${split.map((t, i) => `**${i+1}. ${t}**`).join("\n")}

You can vote with \`${message.prefix}vote <option number>\` in the voting channel ${voting}`);

        let collector = voting.createMessageCollector(m => m.author.bot !== true, {
            time: time.milliseconds()
        });
        collector.on("collect", msg => {
            if (msg.content === "endpoll") {
                if (msg.author.id === message.author.id ||
                    msg.channel.permissionsFor(msg.author).has("MANAGE_GUILD"))
                    collector.stop("endpoll");
            }
            if (!msg.content.startsWith(message.prefix + "vote")) return;
            if (msg.author.cache.exists("apoll")) 
                return msg.channel.send("**You have already voted**").then(m => m.delete(14000))
            let num = parseInt(msg.content.split(/\s+/g)[1]) || "invalid";
            if (num === "invalid" || num <= 0 || num > poll.options.length)
                return msg.channel.send("**Invalid option number**");
            msg.delete();
            poll.options[num - 1].votes++;
            poll.total++;
            msg.channel.send("**Vote Collected**").then(m => m.delete(14000));
            msg.author.cache.set("apoll");
        })

        collector.on("end", () => {
            message.guild.cache.delete("apoll");
            if (poll.total === 0) return display.send("**Poll Results:**\nNobody Voted");
            let top = poll.options.sort((a, b) => {
                return b.votes - a.votes;
            })
            let star = [];
            let under = top.slice(0);
            let topValue = top[0].votes;
            top.forEach(t => {
                if (t.votes === topValue) star.push(t), under = under.slice(1);
            })
            let txt = `**Poll Results:**
Total Votes: ${poll.total}

**__${poll.quest}__**

${star.map(t => `:star: **${t.content}:** \`${t.votes}\` :star:`).join("\n")}

${under.map(t => `**${t.content}: ** \`${t.votes}\``).join("\n")}`;
            display.send(txt);
        })
    }

    help = "Create a poll with seperate display and voting channels.";
    userPerm = "MANAGE_GUILD";
    alias = "apoll";
    args = [{
        type: "channel",
        info: "The display channel of the poll.",
        example: "#announcments"
    }, {
        type: "channel",
        info: "The voting channel for the poll.",
        example: "#spam"
    }, {
        type: "duration",
        info: "The length of the poll.",
        example: "3h30m",
        max: TIME.day,
        min: TIME.minute * 5
    }, {
        type: "string",
        info: "The question and options seperated by a `|`",
        example: "Who is the best? | Michael Jackson | Bob the builder | Tom"
    }]
}

module.exports = AdminPollCommand;