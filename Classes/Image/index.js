const gm = require("gm").subClass({ imageMagick: true });
//const Sharp = require("sharp"); // >n< NO TOUCHY >n< //
const nodecanvas = require("canvas");
const mfs = require("../../Functions/mfs.js");
const snekfetch = require("snekfetch");

const path = "./Classes/Image/images";
// Store images so dont need to read each time
let imageFiles;

class Image {
    /**
     * Read an image from images
     */
    static readFile(filename) {
        return new Promise((resolve, reject) => {
            fs.readFile(path + filename, (err, buffer) => {
                if (err) return reject(err);
                resolve(buffer);
            });
        });
    }

    /**
     * Read from a URL
     */
    static async readUrl(url) {
        try {
            var res = await snekfetch.get(url);
        } catch {
            return null;
        }
        if (!res.headers["content-type"].startsWith("image")) return null;
        return res.body;
    }

    static async loadFile(filename) {
        if (!imageFiles) imageFiles = await mfs.readDir(path);
        return imageFiles[filename];
    }

    static canvasImage(buf) {
        const img = new nodecanvas.Image();
        img.src = buf;
        return img;
    }
}


class Magick {
    constructor(...options) {
        this.image = gm(...options);
    }

    get gm() { return this.image; }

    /**
     * Conver to buffer and send
     *
     * @param {Function} send
     * @param {String} [format="PNG"]
     * @memberof Image
     */
    async send(send, text = "", format) {
        try {
            var buffer = await this._toBuffer(format);
            await send(text, { files: [buffer] });
        } catch (e) {
            logger.err(e);
            return e;
        }
    }


    /** @private */
    _toBuffer(format = "PNG") {
        return new Promise((resolve, reject) => {
            this.image.stream(format, (err, stdout, stderr) => {
                if (err) { return reject(err) }
                const chunks = []
                stdout.on("data", (chunk) => { chunks.push(chunk) })
                stdout.once("end", () => { resolve(Buffer.concat(chunks)) })
                stderr.once("data", (data) => { reject(String(data)) })
            })
        })
    }
}

class Canvas {
    constructor(width, height) {
        this.canvas = nodecanvas.createCanvas(width, height);
        this.ctx = this.canvas.getContext("2d");
    }

    async drawImage(file, px, py, w, h) {
        const img = new nodecanvas.Image();
        img.src = await Image.loadFile(file);
        this.ctx.drawImage(img, px, py, w, h);
    }

    async drawURL(url, px, py, w, h) {
        const img = new nodecanvas.Image();
        img.src = await Image.readUrl(url);
        this.ctx.drawImage(img, px, py, w, h);
    }

    toBuffer() {
        return this.canvas.toBuffer();
    }

    send() {
        return { files: [this.toBuffer()] };
    }
}

module.exports = { Magick, Canvas, Image }
