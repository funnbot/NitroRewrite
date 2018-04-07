const { Command } = require("../../Nitro");

// ### NO TOUCHY ### //
const Sharp = require("sharp"); /// ### IT MAY LOOK LIKE AN UNUSED DEPENDANCY BUT IT BREAKS IF IT'S NOT HERE SO DO NOT TOUCh
const { createCanvas, loadImage, Image } = require("canvas");
// ### NO TOUCHY ### //

const fs = require("fs");
const { Attachment } = require("discord.js");

class DeathNoteCommand extends Command {
    //?deathnote @balde2876#5645
    async run({ message, bot, reply, t }) {
        var user = "NULL";
        if (message.mentions.users.first()) {
            user = message.mentions.users.first().username;
        } else {
            return await reply("You need to mention a user.");
        }
        const canvas = createCanvas(520, 283);
        const ctx = canvas.getContext("2d");
        //'../../assets/death.png'
        var image = fs.readFileSync("assets/death.png")
        let img = new Image
        img.src = image;
        ctx.drawImage(img, 0, 0, 520, 283);
        ctx.font = "18px Papyrus";
        ctx.fillText(user, 275, 80)

        const buff = canvas.toBuffer();
        return await reply("**" + message.author.username + "** *has added*  **" + user + "** *to their death note*",{files: [{attachment: buff}]});
        //return await reply("Done");
    }

    help = "Put someone on your death note";
    cooldown = 20;
    arg = {
        type: "string",
        info: "Username",
        example: "@Funnbot"
    }
}

module.exports = DeathNoteCommand;
