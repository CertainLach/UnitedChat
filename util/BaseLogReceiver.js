"use strict";

class BaseLogReceiver {
    constructor(logger) {
        this.logger = logger;
    }
    log(time, provider, str) {
        throw "Not implemented!";
    }
}

module.exports = BaseLogReceiver;