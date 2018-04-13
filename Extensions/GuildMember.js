const Discord = require("discord.js")
const extend = require("./extend.js");

class GuildMember extends Discord.GuildMember {

}

extend(GuildMember);