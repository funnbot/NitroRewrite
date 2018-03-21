const { Command } = require("../../Nitro");
const EventEmitter = require("events");

class BrainfuckCommand extends Command {

    async run({ message, bot, reply, t }) {
        if (message.channel.cache.exists("brainfuck"))
            return await reply.warn("Something is already being interpreted in this channel.");

        message.channel.cache.set("brainfuck");
        let bf = new Brainfuck(message);

        try {
            await bf.execute();
        } catch (e) {
            reply.fail(e);
        }

        bf = undefined;
        message.channel.cache.delete("brainfuck");
    }

    help = "Brainfuck interpreter.";
    cooldown = 20;
    arg = {
        type: "string",
        info: "Brainfuck code",
        example: "+++++[>+++++<-]"
    }
}

class Brainfuck {
    message;

    source;
    memory;

    output = "";

    cursor = 0;
    cell = 0;

    async execute() {
        console.time("bf");
        const [txt] = this.message.args;
        this.source = this.parseSource(txt);
        if (!this.source) throw "Invalid Source."

        await this.message.send("Evaluating code. Type `quit` to quit");

        this.awaitForceQuit();
        this.loopTimeout();

        this.memory = Array.from({ length: 255 }, () => 0);

        while (this.cursor < this.source.length) {
            const char = this.source[this.cursor];

            if (char === "[") {
                if (this.memory[this.cell] != 0) this.cursor++;
                else this.cursor += this.bracketRight() + 1;
            } else if (char === "]") {
                this.cursor = this.bracketLeft();
            } else if (char === ">") {
                this.cell++;
                if (this.cell > 255) this.cell = 0;
                this.cursor++;
            } else if (char === "<") {
                this.cell--;
                if (this.cell < 0) this.cell = 255;
                this.cursor++;
            } else if (char === "+") {
                this.memory[this.cell]++;
                if (this.memory[this.cell] > 255) this.memory[this.cell] = 0;
                this.cursor++;
            } else if (char === "-") {
                this.memory[this.cell]--;
                if (this.memory[this.cell] < 0) this.memory[this.cell] = 0;
                this.cursor++;
            } else if (char === ".") {
                this.output += String.fromCharCode(this.memory[this.cell]);
                this.cursor++;
            } else if (char === ",") {
                let inp = await this.awaitInput();
                this.memory[this.cell] = inp;
                this.cursor++;
            }

            await this.immediateDelay();
        }

        this.finish();
    }

    async awaitInput() {
        const filter = m => m.author.id === this.message.author.id,
            opts = { time: 10000, max: 1, maxMatches: 1 };
        await this.message.reply("Awaiting input...");
        const col = await this.message.channel.awaitMessages(filter, opts);

        // Default, ended on time
        if (col.size == 0) return 0;

        const txt = col.first().content;
        const char = txt.charCodeAt(0);
        if (!char) return 0;

        return char;
    }

    awaitForceQuit() {
        const filter = m => m.author.id === this.message.author.id,
            opts = { time: 120000 };
        this.forceQuitCol = this.message.channel.createMessageCollector(filter, opts);

        this.forceQuitCol.on("collect", m => {
            if (m.content === "quit") {
                this.cursor = this.source.length;
            }
        })
    }

    parseSource(text) {
        const source = text.replace(/[^\+\<\>\.\-\,\[\]]/g, '');
        if (text.length == 0) return null;
        if (source.replace(/\[/g, '').length !== source.replace(/\]/g, '').length)
            return null;
        return source.split('');
    }

    finish() {
        console.timeEnd("bf");
        this.message.channel.send("**Output:** " + this.output);

        this.cursor = this.source.length;
        clearTimeout(this.loopTimer);
        this.forceQuitCol.stop();
    }

    immediateDelay() {
        return new Promise(setImmediate);
    }

    loopTimer;
    loopTimeout() {
        this.loopTimer = setTimeout(() => {
            this.message.reply("Infinite Loop Detected");
            this.cursor = this.source.length;
        }, 120000);
    }

    bracketRight() {
        let counter = 0,
            l = this.source.length - this.cursor,
            i = 1;
        for (; i < l; i++) {
            const char = this.source[i + this.cursor];
            if (char === "[") counter++;
            else if (char === "]" && counter > 0) counter--;
            else if (char === "]") return i;
        }
        return 0;
    }

    bracketLeft() {
        let counter = 0,
            i = this.cursor;
        for (; i >= 1; i--) {
            let char = this.source[i];
            if (char === "]") counter++;
            else if (char === "[" && counter > 1) counter--;
            else if (char === "[") return i;
        }
        return 0;
    }

    constructor(message) {
        this.message = message;
    }
}

module.exports = BrainfuckCommand;