const { Command } = require("../../Nitro");

const emojis = { "a": "🇦", "b": "🇧", "c": "🇨", "d": "🇩", "e": "🇪", "f": "🇫", "g": "🇬", "h": "🇭", "i": "🇮", "j": "🇯", "k": "🇰", "l": "🇱", "m": "🇲", "n": "🇳", "o": "🇴", "p": "🇵", "q": "🇶", "r": "🇷", "s": "🇸", "t": "🇹", "u": "🇺", "v": "🇻", "w": "🇼", "x": "🇽", "y": "🇾", "z": "🇿", "0": "0️⃣", "1": "1️⃣", "2": "2️⃣", "3": "3️⃣", "4": "4️⃣", "5": "5️⃣", "6": "6️⃣", "7": "7️⃣:", "8": "8️⃣", "9": "9️⃣", "<": "◀", ">": "▶", "!": "❗", "?": "❓", "^": "🔼", "+": "➕", "-": "➖", "÷": "➗", ".": "🔘", "$": "💲", "#": "#️⃣", "*": "*️⃣" };

class EmojifyCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [text] = message.args;
        const str = text.toLowerCase().split("");

        const emojied = str.map(ch => {
            if (/\s/g.text(ch)) {
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