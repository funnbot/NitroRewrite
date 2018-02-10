 const { Command, Paginator } = require("../../Nitro");

 class TriviaTopCommand extends Command {

     async run({ message, bot, send, t }) {
         const pageNum = message.args[0] || 1;
         let usersPaged = new Paginator(
             bot.Database.user
             .map(u => u.trivia)
             .sort((a, b) => b - a), 20);
         usersPaged.loopPage(pageNum, page => {
             
         })
         let num = 1;
         let txt = [];
         for (let [id, wins] of users) {
             let user = {};
             try {
                 user = bot.users.get(id);
                 if (!user) user = await bot.users.fetch(id);
             } catch (e) {
                 user.tag = "User Left";
                 console.log(e);
             }
             let tag = Nitro.util.escapeMarkdown(user.tag);
             txt.push(`**${num}.** ${tag} (${wins})`);
             num++;
         }
         let embed = new bot.Embed();
         embed.description = txt.join("\n");
         embed.setTitle("`Trivia Leaderboard`")
             .setColor(embed.randomColor)
             .setFooter("");

         send({ embed });
     }

     options() {
         return {
             help: "The trivia leaderboard",
             usage: "{}triviatop 2",
             alias: ["trivialeaderboard"],
             args: [{
                 type: "number",
                 desc: "The trivia leaderboard page.",
                 optional: true,
                 min: 1
             }]
         }
     }
 }

 module.exports = TriviaTopCommand;