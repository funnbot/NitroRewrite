const { Command } = require("../../Nitro");

const emojis = { "a": "🇦", "b": "🇧", "c": "🇨", "d": "🇩", "e": "🇪", "f": "🇫", "g": "🇬", "h": "🇭", "i": "🇮", "j": "🇯", "k": "🇰", "l": "🇱", "m": "🇲", "n": "🇳", "o": "🇴", "p": "🇵", "q": "🇶", "r": "🇷", "s": "🇸", "t": "🇹", "u": "🇺", "v": "🇻", "w": "🇼", "x": "🇽", "y": "🇾", "z": "🇿", "0": "0⃣", "1": "1⃣", "2": "2⃣", "3": "3⃣", "4": "4⃣", "5": "5⃣", "6": "6⃣", "7": "7⃣", "8": "8⃣", "9": "9⃣", "<": "◀", ">": "▶", "!": "❗", "?": "❓", "^": "🔼", "+": "➕", "-": "➖", "÷": "➗", ".": "🔘", "$": "💲", "#": "#️⃣", "*": "*️⃣" };

class EmojifyCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [text] = message.args;
        const str = text.toLowerCase().split("");

        const emojied = str.map(ch => {
            if (/\s/g.test(ch)) {
                return "   ";
            } else if (emojis[ch]) {
                return ` ${emojis[ch]}`;
            } else return ` ${ch}`;
        })

        reply(emojied.join(""));
    }

    help = "Emojify a message";
    args = [{
        type: "string",
        info: "The message to emojify.",
        example: "1234"
    }]
}

module.exports = EmojifyCommand;