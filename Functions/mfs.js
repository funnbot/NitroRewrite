const fs = require("fs");

const readdir = dir =>
    new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) return reject(err);
            resolve(files);
        })
    })

const readFile = file =>
    new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        })
    })

/**
 * Read every file in a folder with fs.readFile.
 * @param {String} folder - The folder to read.
 * @param {String|Array} limit - Limit extensions that are read.
 * @returns {Array}
 */
exports.readFiles = async function(folder, limit) {
    const files = await readdir(folder);
    let result = [];
    for (file of files) {
        let split = file.split(".");
        const ext = split.pop();
        if (Array.isArray(limit))
            if (!limit.includes(ext)) continue;
            else if (limit !== undefined)
            if (limit !== ex) continue;
        try {
            var read = await readFile(folder + "/" + file);
            result.push(read);
        } catch (e) {
            logger.err(`Error Reading: ${folder}/${file}`, e.stack);
        }
    }
    return result;
}

exports.readDir = async function(folder) {
    const files = await readdir(folder);
    let result = {};
    for (file of files) {
        let split = file.split(".");
        let name = split[0];
        result[name] = await readFile(`${folder}/${file}`);
    }
    return result;
}

/**
 * Read every file in a folder with fs.readFile but Sync.
 * @param {String} folder - The folder to read.
 * @returns {Array}
 */
exports.readFilesSync = function(folder) {
    return fs.readdirSync(folder).map(f => fs.readFileSync(`${folder}/${f}`));
}