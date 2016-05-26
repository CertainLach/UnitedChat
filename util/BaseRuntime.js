"use strict";

//Node modules
const fs = require("fs");

//Util modules
const Logger = require("../util/Logger.js");
const FileLogReceiver = require("../util/FileLogReceiver.js");
const FileDB = require("../util/FileDB.js");

/*global DB*/

class BaseRuntime {
    constructor(logDir, loggerName, baseDir, dbDir) {
        let self = this;
        if (BaseRuntime.created)
            throw 'BaseRuntime is already created!';
        BaseRuntime.created = true;
        this.eventEmitter = new(require('events')).EventEmitter();
        Logger.init(6);
        this.logger = new Logger(loggerName);
        Logger.attachLogReceiver(FileLogReceiver, logDir, baseDir);
        this.logger.log('Base runtime started');
        global.console.log = (...params) => {
            this.logger.log(...params);
        };
        global.console.error = (...params) => {
            this.logger.error(...params);
        };
        try {
            fs.mkdirSync(baseDir + '/' + dbDir);
        }
        catch (e) {}
        this.fileDB = new FileDB(baseDir + '/' + dbDir + '/db.json');
        this.fileDB.setGlobal('DB');
        this.fileDB.startWatch();
        setInterval(() => {
            this.fileDB.save();
        }, 10*60000);

        if (!DB.launchNum)
            DB.launchNum = 0;

        DB.launchNum++;
        this.logger.log('That is ' + DB.launchNum + ' launch.');

        process.on("SIGINT", function () {
            self.exitHandler('Ctrl+C pressed');
        });
        process.on("exit", function (code) {
            if(code!=0)
                self.exitHandler('Произошла неведомая хуйня, но вот её код: '+code);
        });
    }
    exitHandler(reason) {
        this.fileDB.save();
        this.logger.log('Process exiting: ' + reason);
        process.stdout.write('\n');
        process.exit();
    }
}

module.exports = BaseRuntime;