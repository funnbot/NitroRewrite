const { User } = require("discord.js");
const http = require("http");
const https = require("https");

module.exports = class NitroFetch {
    constructor() {
        this.response = "null";
    }

    async grab(url, encoding = "utf8") {

    }

    _readStream(res) {
        return new Promise((resolve, reject) => {
            
        })
    }

    async grab(url, encoding = "utf8") {
        if (url.startsWith("https")) {
            if (encoding == null) {
                return new Promise(function(resolve, reject) {
                    https.get(url, res => {
                        var body = [];
                        res.on("data", data => {
                            body.push(data);
                        });
                        res.on("end", () => {
                            resolve(Buffer.concat(body));
                        });
                    });
                });
            } else {
                return new Promise(function(resolve, reject) {
                    https.get(url, res => {
                        res.setEncoding(encoding);
                        var body = "";
                        res.on("data", data => {
                            body += data;
                        });
                        res.on("end", () => {
                            resolve(body);
                        });
                    });
                });
            }
        } else {
            if (encoding == null) {
                return new Promise(function(resolve, reject) {
                    http.get(url, res => {
                        var body = [];
                        res.on("data", data => {
                            body.push(data);
                        });
                        res.on("end", () => {
                            resolve(Buffer.concat(body));
                        });
                    });
                });
            } else {
                return new Promise(function(resolve, reject) {
                    http.get(url, res => {
                        res.setEncoding(encoding);
                        var body = "";
                        res.on("data", data => {
                            body += data;
                        });
                        res.on("end", () => {
                            resolve(body);
                        });
                    });
                });
            }
        }
        return "Error"
    }
}