"use strict";

//Node modules
const fs = require("fs");

class FileDB {
    constructor(fileName) {
        if (!fileName)
            throw 'fileName is not defined!';
        this.fileName = fileName;
        try {
            fs.statSync(fileName).isFile();
        }
        catch (err) {
            fs.writeFileSync(fileName, '{}');
        }
        this.db = JSON.parse(fs.readFileSync(fileName));
    }
    save() {
        fs.writeFileSync(this.fileName, JSON.stringify(this.db));
    }
    setGlobal(name) {
        global[name] = this.db;
    }
}

module.exports = FileDB;