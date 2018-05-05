const { Command, Image } = require("../../Nitro");

class ShipCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [u, o] = message.args;
        const mainBuf = await Image.readUrl(u.displayAvatarURL({ size: 128 }));
        const otherBuf = await Image.readUrl(o.displayAvatarURL({ size: 128 }));
        const main = Image.sharp(mainBuf).resize(200, 200);
        const width = 200,
            height = 200;
        const grey = Math.round(0.50 * 255);
        const trans = Buffer.alloc(width * height, grey);
        const transImg = await main
            .joinChannel(trans, { raw: { width, height, channels: 1 } })
            .raw()
            .toBuffer();
        const merge = await Image.sharp(otherBuf)
            .resize(200, 200)
            .overlayWith(transImg, { raw: { width, height, channels: 4 } })
            .toBuffer();
        const name = o.username.slice(0, -Math.ceil(o.username.length / 2)) + u.username.slice(Math.ceil(u.username.length / 2));
        const cap = await Image.createCaption(name, 200, 50, "arial.ttf", 20 - name.length / 10);
        const res = await Image.sharp({ create: { width: 200, height: 250, channels: 3, background: "#ffffff" } }).png()
            .overlayWith(cap, {
                top: 0,
                left: 0
            }).toBuffer();
        const out = Image.sharp(res)
            .overlayWith(merge, {
                top: 50,
                left: 0,
            })

        return reply(await Image.out(out));
    }

    help = "Ship a user";
    botPerm = "ATTACH_FILES";
    args = [{
        type: "user",
        info: "The user to ship",
        example: "@user"
    }, {
        type: "user",
        info: "The other user to ship",
        example: "@user",
        default: true
    }]
    cooldown = 5;
}

module.exports = ShipCommand;