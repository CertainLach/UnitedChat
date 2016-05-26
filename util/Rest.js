"use strict";

//Node modules
const http = require("http");

class Rest {
    static get(url) {
        return new Promise((resolve, reject) => {
            http.get(url, res => {
                let data = '';
                res.on('data', d => {
                    data += d.toString();
                });
                res.on('end', () => {
                    try {
                        data = JSON.parse(data);
                        resolve(data);
                    }
                    catch (e) {
                        resolve(data);
                    }
                });
                res.on('error', err => {
                    reject(err);
                });
            }).on('error', err => {
                reject(err);
            });
        });
    }
}

module.exports = Rest;