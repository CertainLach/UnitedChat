"use strict";
//Node modules
const fs = require("fs");

//Util modules
const Logger=require("../util/Logger.js");
const BaseLogReceiver=require("../util/BaseLogReceiver.js");

class FileLogReceiver extends BaseLogReceiver {
    constructor(logger, logDir, baseDir) {
        if (!logDir)
            logDir = 'logs';
        if (!baseDir)
            baseDir = __dirname;
        super(logger);
        this.logger=new Logger('FileLog');
        this.logger.log('File log receiver started!');
        this.date = new Date();
        let finLogDir=baseDir + '/' + logDir;
        try {
            fs.mkdirSync(finLogDir);
        }
        catch (e) {}
        let dateDir=finLogDir + '/' + Logger.fixLength(this.date.getFullYear().toString(),4,true,'0') + '.' + Logger.fixLength(this.date.getMonth().toString(),2,true,'0') + '.' + Logger.fixLength(this.date.getDay().toString(),2,true,'0') + '/';
        try {
            fs.mkdirSync(dateDir);
        }
        catch (e) {}
        this.logFile = dateDir + Logger.fixLength(this.date.getHours().toString(),2,true,'0') + ':' + Logger.fixLength(this.date.getMinutes().toString(),2,true,'0') + ':' + Logger.fixLength(this.date.getSeconds().toString(),2,true,'0') + '.log';
        this.log('Logger started at ' + this.date.toDateString());
    }
    log(time, provider, str) {
        fs.appendFile(this.logFile, `${str?`${time}: `:''}${str?` [${provider}]> `:''}${str?str:time}\n`, function (err) {
            if (err) throw err;
        });
    }
}

module.exports=FileLogReceiver;