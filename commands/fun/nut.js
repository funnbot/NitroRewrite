const { Command, Image } = require("../../Nitro");

class NutCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [input] = message.args;
        //?nut When he hitting it from behind and resolves your promise
        const img = new Image.Canvas(640, 640);
        await img.drawImage("nutmeme", 0, 0, 640, 640);
        img.ctx.font = "42px Arial";
        var inputWords = input.split(" ");
        var inputLines = [];
        var currentInput = "";
        for (var i=0;i<inputWords.length;i++) {
            currentInput = currentInput + inputWords[i] + " ";
            if (currentInput.length > 20) {
                inputLines.push(currentInput);
                currentInput = "";
            }
        }
        inputLines.push(currentInput);
        img.ctx.fillText(inputLines.join("\n"), 25, 50);

        reply(img.send());
    }

    help = "The nut button meme";
    cooldown = 20;
    arg = {
        type: "string",
        info: "Text to put in the meme",
        example: "When papi hitting it from behind and resolves your promise"
    }
}

module.exports = NutCommand;
