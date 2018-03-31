const { Command } = require("../../Nitro");
let special = {
    "0": ":zero:",
    "1": ":one:",
    "2": ":two:",
    "3": ":three:",
    "4": ":four:",
    "5": ":five:",
    "6": ":six:",
    "7": ":seven:",
    "8": ":eight:",
    "9": ":nine:",
    "<": ":arrow_backward:",
    ">": ":arrow_forward:",
    "!": ":exclamation:",
    "?": ":question:",
    "^": ":arrow_up_small:",
    "+": ":heavy_plus_sign:",
    "-": ":heavy_minus_sign:",
    "÷": ":heavy_division_sign:",
    ".": ":radio_button:"
};

class EmojifyCommand extends Command {
    async run ({message, bot, reply, t}) {
        let emoji = message.suffix.toLowerCase().split("");

        let emojiFinal = function() {
            let done = "";
            return new Promise((resolve, reject) => {
                for (c = 0; c < emoji.length; c++) {
                    if (/\s/g.test(emoji[c])) {
                        done += "   ";
                    } else if (/[abcdefghijklmnopqrstuvwxyz]/g.test(emoji[c])) {
                        done += emoji[c].replace(emoji[c], " :regional_indicator_" + emoji[c] + ":");
                    } else if (Object.keys(special).indexOf(emoji[c]) > -1) {
                        done += emoji[c].replace(emoji[c], " " + special[emoji[c]]);
                    } else {
                        done += " " + emoji[c] + " ";
                    }
                }
                return resolve(done);
            })
        };
        emojiFinal().then(done => reply(done));
    }

    help = "Emojify a message";
    args = [{
        type: "string",
        info: "The message to emojify.",
        example: "1234"
    }]
}

module.exports = EmojifyCommand;