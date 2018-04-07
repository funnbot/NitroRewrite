const { Command } = require("../../Nitro");

//   >n< NO TOUCHY >n<   //
 /// ### IT MAY LOOK LIKE AN UNUSED DEPENDANCY BUT IT BREAKS IF IT'S NOT HERE SO DO NOT TOUCh
const { createCanvas, loadImage, Image } = require("canvas");
//   >n< NO TOUCHY >n<   //

const fs = require("fs");
const { Attachment } = require("discord.js");
const https = require("https");

class PunchCommand extends Command {
    //?punch @balde2876#5645
    async run({ message, bot, reply, t }) {
        var user = "NULL";
        if (message.mentions.users.first()) {
            user = message.mentions.users.first().username;
        } else {
            return await reply("You need to mention a user.");
        }

        var authorURL = message.author.avatarURL().replace("webp","png");
        var targetPerson = message.mentions.users.first()
        var targetURL = targetPerson.avatarURL().replace("webp","png");

        const canvas = createCanvas(626, 626);
        const ctx = canvas.getContext("2d");
        //'../../assets/death.png'
        var image = fs.readFileSync("assets/punch.png")
        let img = new Image
        img.src = image;
        ctx.drawImage(img, 0, 0, 626, 626);

        var authorImage = new Image;
        var targetImage = new Image;

        //console.log(authorURL);
        //console.log(targetURL);

        https.get(authorURL, res => {
            //res.setEncoding("utf8");
            var body = [];
            res.on("data", data => {
                body.push(data);
            });
            res.on("end", () => {
                authorImage.src = Buffer.concat(body);
                https.get(targetURL, res => {
                    //res.setEncoding("utf8");
                    var body = [];
                    res.on("data", data => {
                        body.push(data);
                    });
                    res.on("end", () => {
                        targetImage.src = Buffer.concat(body);
                        ctx.rotate(5*Math.PI/180);
                        ctx.drawImage(authorImage, 115, 30-10, 100, 100);
                        ctx.rotate(-5*Math.PI/180);
                        ctx.rotate(-30*Math.PI/180);
                        ctx.drawImage(targetImage, 400-125, 40+210, 100, 100);
                        ctx.rotate(30*Math.PI/180);
                        const buff = canvas.toBuffer();
                        reply("**" + message.author.username + "** *sucker punches*  **" + message.mentions.users.first().username + "**",{files: [{attachment: buff}]});
                    });
                })
            });
        })


        //return await reply("Done");
    }

    help = "Sucker punch a user";
    cooldown = 20;
    arg = {
        type: "string",
        info: "Username",
        example: "@Funnbot"
    }
}

module.exports = PunchCommand;
