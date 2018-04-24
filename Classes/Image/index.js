const gm = require("gm").subClass({ imageMagick: true });
//const Sharp = require("sharp"); // >n< NO TOUCHY >n< //
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
        var res = await snekfetch.get(url);
        if (!res.headers["content-type"].startsWith("image")) return null;
        return res.body;
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
        font = font.startsWith("/") ? `${__dirname}/fonts${font}` : `/Library/Fonts/${font}`;
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

    static send(buf) {
        return { files: [buf] };
    }

    static async loadFiles() {
        imageFiles = await mfs.readDir("./Classes/Image/images");
    }
}

module.exports = Image;