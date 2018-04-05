// Load all the modules in a folder for easy destructering

const extensions = ["js", ""];
const dirname = __dirname;

const fs = require("fs");

const modules = fs.readdirSync(dirname);
for (let mod of modules) {
    if (mod === "index.js") continue;
    const fileData = mod.split(".");

    const ext = fileData.splice(-1, 1)[0];
    if (!extensions.includes(ext)) continue;

    const name = fileData.join("");
    exports[name] = require(`${dirname}/${mod}`);
}