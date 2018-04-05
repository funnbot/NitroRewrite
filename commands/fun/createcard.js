const { Command } = require("../../Nitro");
const jimp = require('jimp');

class CreateCardCommand extends Command {
    async run({ message, bot, reply, t }) {
        if (!message.args[0]) return reply.warn("To create a card: " + prefix + "createcard This text is on the question card | this text is on the anwser card");
        let text = message.suffix.split("|");
        if (!text[1]) return reply.fail("Please include text for the second card, and the delimeter `|`");

        let createImage = function() {
            return new Promise((resolve, reject) => {
                jimp.read('./assets/cah.png', (err, image) => {
                    if (err) {
                        console.error(err);
                        return reject();
                    }
                    jimp.loadFont(jimp.FONT_SANS_64_WHITE).then(font => {
                        image.print(font, 70, 70, text[0], 500);
                        jimp.loadFont(jimp.FONT_SANS_64_BLACK).then(font2 => {
                            image.print(font2, 680, 70, text[1], 500);
                            image.getBuffer(jimp.AUTO, (err, buf) => {
                                if (err) {
                                    console.error(err);
                                    return reject();
                                }
                                return resolve(buf);
                            })
                        })
                    })
                })
            })
        };

        createImage().then(buf => message.channel.send({ files: [{ attachment: buf, name: 'cah.jpg' }] })).catch(e => {
            console.error(e);
            reply.fail('Something went wrong. Please try again later.')
        })

    }

    help = "Create a Custom Cards Against Humanity Question and Anwser Card.";
    botPerm = "ATTACH_FILES";
    cooldown = 5;
}

module.exports = CreateCardCommand;