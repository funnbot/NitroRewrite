 const { Command, Paginator, util } = require("../../Nitro");

 class TriviaTopCommand extends Command {

     async run({ message, bot, reply, t }) {
         const pageNum = message.args[0];
         const userData = await message.guild.userData();
         const users = Object.entries(userData)
             .map(async u => {
                 const wins = u[1] ? u[1].trivia : 0;
                 try { var user = await bot.users.get(u[0]); } catch (e) { var user = null; }
                 const username = user ? user.username : null;
                 console.log(username);
                 return { username, wins };
             }).filter(u => u.user && u.wins)
             .sort((a, b) => b.wins = a.wins);
    
         const usersPaged = new Paginator(users, 20);
         let txt = [];
         usersPaged.loopPage(pageNum, (item, index) => {
             const username = util.escapeMarkdown(item.username);
             const wins = item.trivia;
             txt.push(`**${index+1}.** ${username} ${wins}`);
         })

         let embed = new bot.Embed();
         embed.description = txt.join("\n");
         embed.setTitle("`Trivia Leaderboard`")
             .setColor(embed.randomColor)
             .setFooter(`Page ${pageNum}/${usersPaged.pages.length}`);

         reply({ embed });
     }

     options() {
         return {
             help: "The trivia leaderboard",
             usage: "{}triviatop 2",
             alias: ["trivialeaderboard"],
             args: [{
                 type: "int",
                 info: "The trivia leaderboard page.",
                 default: 1,
                 min: 1
             }]
         }
     }
 }

 module.exports = TriviaTopCommand;