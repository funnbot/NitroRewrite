const { Command, Image, util } = require("../../Nitro");

class TestCommand extends Command {
    async run({ message, bot, reply, t }) {
        let buf = await Image.searchChannel(message.channel);
        if (!buf) buf = await Image.readUrl(message.author.avatarURL());
        const img = Image.canvasImage(buf);

        const { canvas, ctx } = Image.canvas(img.width, img.height);
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imgData = ctx.getImageData(0, 0, img.width, img.height);
        let { data } = imgData;
        for (let i = 0; i < data.length; i += 4) {
            let [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];

            r = g;
            g = b;
            b = a;
            a = r;

            data[i] = r, data[i + 1] = g, data[i + 2] = b, data[i + 3] = a;
        }
        ctx.putImageData(imgData, 0, 0);
        const f = Image.send(await Image.buffer(canvas));
        reply(f);
    }

    help = "";
}

module.exports = TestCommand;