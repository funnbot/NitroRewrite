const gm = require("gm").subClass({imageMagick: true});
const sharp = require("sharp");
const canvas = require("canvas");
const mfs = require("../../Functions/mfs.js");
const snekfetch = require("snekfetch");

// Store images so dont need to read each time
let imageFiles;

class Image {
    static getStaticFile(name) {
        if (!imageFiles[name]) throw name + " isnt a thing";
        return imageFiles[name];
    }

    static async readUrl(url) {
        try {
            var res = await snekfetch.get(url);
        } catch {
            return null;
        }
        const type = res.headers["content-type"];
        if (!type || !type.contains("image")) return null;
        return res.body;
    }

    static sharp(...args) {
        return sharp(...args);
    }

    static canvas(width, height) {
        const canv = canvas.createCanvas(width, height);
        const ctx = canv.getContext("2d");
        return { canvas: canv, ctx };
    }

    static canvasImage(buf) {
        const img = new canvas.Image();
        img.src = buf;
        return img;
    }

    static createGM(...args) {
        return gm(...args);
    }

    static gm(...args) {
        return gm(...args);
    }

    static gmBuffer(img, format = "PNG") {
        return new Promise((resolve, reject) => {
            img.stream(format, (err, stdout, stderr) => {
                if (err) { return reject(err) }
                const chunks = []
                stdout.on("data", (chunk) => { chunks.push(chunk) })
                stdout.once("end", () => { resolve(Buffer.concat(chunks)) })
                stderr.once("data", (data) => { reject(String(data)) })
            })
        })
    }

    static buffer(img, format = "PNG") {
        return new Promise((resolve, reject) => {
            if (img.constructor.name === "Canvas") {
                img.toBuffer((err, buff) => {
                    if (err) return reject(err);
                    return resolve(buff);
                })
            } else if (img instanceof gm) {
                img.stream(format, (err, stdout, stderr) => {
                    if (err) { return reject(err) }
                    const chunks = []
                    stdout.on("data", (chunk) => { chunks.push(chunk) })
                    stdout.once("end", () => { resolve(Buffer.concat(chunks)) })
                    stderr.once("data", (data) => { reject(String(data)) })
                })
            } else if (img instanceof sharp) {
                img.toBuffer((err, data) => {
                    if (err) return reject(err);
                    return resolve(data);
                })
            } else reject("Invalid format " + img);
        })
    }

    static async searchChannel(channel) {
        const msgs = await channel.messages.fetch({ limit: 3 });
        for (let m of msgs.values()) {
            const urls = m.content.split(/\s+/g);
            for (let u of urls) {
                if (!u) continue;
                if (/^<.+>$/.test(u)) u = u.substring(1, -1);
                const buf = await Image.readUrl(u);
                if (buf) return buf;
            }
            if (m.attachments.size) {
                let url = m.attachments.first().url;
                const buf = await Image.readUrl(url);
                if (buf) return buf;
            }
        }
        return null;
    }

    static async overlayImages(base, imgs) {
        let current = Image.sharp(base);
        for (let i = 0; i < imgs.length; i++) {
            const { buffer, top, left} = imgs[i];
            current = Image.sharp(await current.overlayWith(buffer, {top, left}).toBuffer());
        }
        return await current.toBuffer();
    }

    /**
     * Create a wrapped text caption.
     * @param {String} text
     * @param {Number} w width
     * @param {Number} h height
     * @param {String} [font="helvetica.ttf"]
     * @param {Number} [size=15] font size
     * @param {String} [fill="black"] text color 
     * @param {String} [gravity="center"]
     * @param {String} [background="transparent"]
     * @returns {Promise<Buffer>}
     */
    static async createCaption(text, w, h, font, size, fill, gravity, background) {
        font = `${__dirname}/fonts/${font}`;
        size = size || 15;
        fill = fill || "black";
        gravity = gravity || "Center";
        background = background || "transparent";

        text = text.replace(/[^a-z0-9\s]/gi, '');

        const image = Image.createGM()
            .command("convert")
            .out(`-background`).out(background)
            .font(font, size)
            .out("-fill").out(fill)
            .out("-size").out(`${w}x${h}`)
            .out("-gravity").out(gravity)
            .out(`caption:${text}`)
        return Image.gmBuffer(image);
    }

    static send(buffer) {
        if (!(buffer instanceof Buffer)) return logger.err(buffer);
        if (buffer.byteLength > 8388608) return undefined;
        return { files: [{name: "nitro.png", attachment: buffer}] };
    }

    static async out(img, format) {
        const buf = await Image.buffer(img, format);
        return Image.send(buf);
    }

    static async loadFiles() {
        imageFiles = await mfs.readDir("./Classes/Image/images");
    }
}

module.exports = Image;