"use strict";

//Node modules
const fs = require("fs");

//Util modules
const Logger = require("../util/Logger.js");

class FileDB {
    constructor(fileName) {
        this.logger=new Logger('FileDB');
        if (!fileName)
            throw 'fileName is not defined!';
        this.logger.log('FileDB started!');
        this.fileName = fileName;
        try {
            fs.statSync(fileName).isFile();
        }
        catch (err) {
            this.logger.log('Created new DB...');
            fs.writeFileSync(fileName, '{}');
        }
        this.reloadDB();
        this.skipCheck=false;
    }
    startWatch(){
        fs.watchFile(this.fileName,()=>{
            if(!this.skipCheck){
                this.logger.log('DB was changed on disk!');
                this.reloadDB();
            }else{
                this.skipCheck=false;
            }
        });
    }
    reloadDB(){
        this.db = JSON.parse(fs.readFileSync(this.fileName));
    }
    save() {
        this.skipCheck=true;
        fs.writeFileSync(this.fileName, JSON.stringify(this.db));
    }
    setGlobal(name) {
        global[name] = this.db;
    }
}

module.exports = FileDB;