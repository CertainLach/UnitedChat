"use strict";

//Util modules
const BaseRuntime = require("./util/BaseRuntime.js");

class BotRuntime extends BaseRuntime {
    constructor(logDir, loggerName, baseDir, dbDir) {
        super(logDir, loggerName, baseDir, dbDir);
    }
}

new BotRuntime('logs', 'GlaDOS', __dirname, 'data');