const { Command, Image } = require("../../Nitro");

class TheSearchCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [input] = message.args;

        const img = new Image.Canvas(700, 612);
        await img.drawImage("thesearch", 0, 0, 700, 612);
        img.ctx.font = "18px Comic Sans";
        var inputWords = input.split(" ");
        var inputLines = [];
        var currentInput = "";
        for (var i=0;i<inputWords.length;i++) {
            currentInput = currentInput + inputWords[i] + " ";
            if (currentInput.length > 10) {
                inputLines.push(currentInput);
                currentInput = "";
            }
        }
        inputLines.push(currentInput);
        img.ctx.fillText(inputLines.join("\n"), 65, 350);

        reply(img.send());
    }

    help = "The search continues meme";
    cooldown = 20;
    arg = {
        type: "string",
        info: "A stupid idea",
        example: "Indexes should start at 1"
    }
}

module.exports = TheSearchCommand;
